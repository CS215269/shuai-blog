---
title: Woodpecker 在 Docker 网络里挖的那些坑
date: 2026-03-04 22:15:00
tags:
  - CI/CD
  - Woodpecker
  - Docker
  - DNS
categories:
  - DevOps
---

迁移到 Woodpecker 之后以为能松口气了，结果 Docker 网络这一层又给我上了一课。整理一下三个最让人血压升高的网络问题。

## 坑 1：Agent 连不上 Server，报 RPC 超时

Woodpecker 起来了，Server 也起来了，UI 能打开，但 Agent 一直 `Restarting`。看一下 Agent 日志：

```
rpc error: code = DeadlineExceeded desc = context deadline exceeded
```

任务队列里堆了 4 个等待的流水线，愣是没人接。

第一反应是端口问题。从 Gitea 容器测一下 `nc -zv woodpecker-server 9000`，通的。9000 端口确实在监听。

那为啥连不上？

我手动跑了一下 Agent 容器，分别用两种地址试：

```bash
# 失败
WOODPECKER_SERVER=woodpecker-server:9000

# 成功
WOODPECKER_SERVER=172.18.0.3:9000
```

改成 IP 直接就过了。**根因是 DNS 解析——Agent 容器解析不到 `woodpecker-server` 这个服务名**。

docker-compose 里明明把 server 和 agent 都加进了同一个 `ci-cd-net` 网络，按理说 Docker 的内嵌 DNS 应该自动给它们做名字解析。但实际上没生效。

最后就用 IP 顶上去了。`docker network inspect ci-cd_ci-cd-net` 能查到 Server 容器的 IPv4 地址，写死在 `.env` 里。缺点就是 Server 重启之后 IP 可能变，所以我加了个 `network-connect` 启动顺序保证它先起。但说实话这是个 workaround，不是正经解法。

## 坑 2：Gitea 容器里的 `localhost` 不等于宿主机

第二个坑更隐蔽。流水线跑起来之后，clone 阶段挂了：

```
fatal: unable to access 'http://localhost:3000/shuai/school-recruit-b.git/':
Failed to connect to localhost port 3000 after 0 ms: Couldn't connect to server
```

直觉上 `localhost:3000` 是 Gitea，没毛病。但这是在 Agent 容器或者流水线容器里跑的——`localhost` 指向它自己，不是宿主机。

Gitea 那边默认配置的 `DOMAIN = localhost`，生成的 clone URL 自然就是 `http://localhost:3000/...`。本机浏览器访问没问题，Docker 容器里访问就抓瞎。

修法是改 Gitea 的 `app.ini`：

```bash
docker exec gitea sed -i "s/DOMAIN = localhost/DOMAIN = gitea/g" /data/gitea/conf/app.ini
docker exec gitea sed -i "s|ROOT_URL = http://localhost:3000|ROOT_URL = http://gitea:3000|g" /data/gitea/conf/app.ini
docker restart gitea
```

把 `localhost` 换成 Docker 网络里的服务名 `gitea`。这样从容器内部访问就对了。

**经验**：在 docker-compose 里跑多个服务，凡是 URL/域名相关的配置，一律用服务名而不是 `localhost`。

## 坑 3：流水线容器解析不到 `gitea`

改完上面那个，以为万事大吉了，结果又翻车。流水线换个报错信息：

```
fatal: unable to access 'http://gitea:3000/shuai/school-recruit-b.git/':
Could not resolve host: gitea
exit status 128
```

这次 `localhost` 没了，改成了 `gitea`，照样连不上。

排查下来发现这个坑特别迷惑——**Agent 容器本身能解析 `gitea`，但 Agent 启动的流水线容器不行**。

Woodpecker Agent 是 Docker-in-Docker 模式，每个流水线步骤跑在独立的容器里。这些容器默认使用 bridge 网络，没加入 `ci-cd-net`，自然也就解析不到 `gitea` 这个名字。

修法是在 Server 和 Agent 的环境变量里指定网络：

```yaml
environment:
  - WOODPECKER_NETWORK=ci-cd_ci-cd-net
```

（注意是 `<compose-project>_<network-name>` 的格式，不是裸的网络名）

然后 `force-recreate` 让配置生效：

```bash
docker compose up -d --force-recreate woodpecker-server woodpecker-agent
```

这样流水线容器就会被加进 `ci-cd-net`，DNS 解析就通了。

## 小结

三个坑的本质其实是一个：**Docker 网络里的"看起来是 localhost"和"看起来是 hostname"都得当成一个网络问题来看**。

- 容器之间通信 → 用服务名，别用 `localhost`
- 服务名解析不到 → 检查网络是不是同一个
- 流水线容器独立网络 → 显式指定 `WOODPECKER_NETWORK`

下次再有朋友在 CI/CD 上折腾，我估计第一件事就是把这段发给他。