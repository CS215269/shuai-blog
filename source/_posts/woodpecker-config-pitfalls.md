---
title: Woodpecker 配置项踩坑:变量名、OAuth、Webhook
date: 2026-03-04 23:00:00
tags:
  - CI/CD
  - Woodpecker
  - 配置
categories:
  - DevOps
---

网络问题解决之后，接下来是配置。Woodpecker 2.x 比 1.x 改了不少环境变量名，再加上 Gitea OAuth 和 webhook 的一些细节，我大概花了一天才把这些都理顺。

## 环境变量:Woodpecker 2.x 改名了

启动 Server 直接报错：

```
can't setup globals: could not setup service manager: forge not configured
```

一脸懵。网上搜了一圈，发现是 Woodpecker 2.x 改了一批环境变量名。1.x 的写法不能直接照搬：

| 1.x（旧） | 2.x（新） |
|-----------|-----------|
| `WOODPECKER_GITEA_SERVER` | `WOODPECKER_GITEA_URL` |
| `WOODPECKER_GITEA_CLIENT_ID` | `WOODPECKER_GITEA_CLIENT` |
| `WOODPECKER_GITEA_CLIENT_SECRET` | `WOODPECKER_GITEA_SECRET` |

另外还要显式加上 `WOODPECKER_GITEA=true`，不然它不知道你要对接的是 Gitea。

改完变量名，启动就过了。

## Agent 认证失败:变量对应关系别搞错

Server 起来了，UI 能打开，Agent 一直连不上：

```
rpc error: code = Unknown desc = agent could not auth:
individual agent not found by token: sql: no rows in result set
```

这个 "sql: no rows in result set" 看着像数据库问题，其实是认证对不上。

Agent 和 Server 之间靠 `WOODPECKER_AGENT_SECRET` 验证。两边都得设，而且**值必须一样**。我之前图省事只在 Server 端设了，Agent 端用了一个不同的变量名，自然过不去。

最终两边都指向同一个 secret：

```yaml
# Server
- WOODPECKER_AGENT_SECRET=${WOODPECKER_SECRET}

# Agent
- WOODPECKER_AGENT_SECRET=${WOODPECKER_SECRET}
```

还有个容易踩的点：**Agent 连 Server 的端口是 9000，不是 8000**。8000 是 Web UI 端口，gRPC 用的是 9000。我一开始写错成 8000，Agent 一直在尝试连 Web UI，自然失败。

```yaml
- WOODPECKER_SERVER=woodpecker-server:9000
```

## Docker API 版本不匹配

Docker 版本升上去之后，Agent 又报错了：

```
Error response from daemon: client version 1.43 is too old.
Minimum supported API version is 1.44, please upgrade your client to a newer version
```

Woodpecker Agent 镜像里自带的 docker client 版本比宿主机的 daemon 旧。解决方法是显式指定 API 版本：

```yaml
- DOCKER_API_VERSION=1.44
```

## 端口冲突

```
listen tcp :3000: bind: address already in use
```

Agent 默认的健康检查端口是 3000，跟 Gitea 撞了。改一下：

```yaml
- WOODPECKER_HEALTHCHECK_ADDR=:33000
```

随便挑个不冲突的端口就行，没人查这个端口。

## OAuth PKCE 报错

从 Gitea 跳转到 Woodpecker 登录的时候，页面报错：

```
invalid_request
PKCE is required for public clients
```

这个是因为 Gitea 里的 OAuth2 应用被配成了"公共客户端"。但 Woodpecker 是有 server secret 的，应该配成机密客户端才合理。

修法是去 Gitea 管理面板 → 集成（OAuth2 应用程序）→ 找到 Woodpecker 的应用 → 勾上"机密客户端"。

## Webhook 验证失败

OAuth 通了，但提交代码还是不触发流水线。Server 日志：

```
{"level":"error","error":"token is unverifiable: error while executing keyfunc:
sql: no rows in result set",
"caller":"/woodpecker/src/github.com/woodpecker-ci/woodpecker/server/api/hook.go:124",
"message":"failure to parse token from hook"}
```

我把 token 解出来看了下：

```json
{"type":"user","user-id":"1"}
```

是用户 token，不是 webhook 用的那种。这个 token 拿去访问 `/api/user` 是 200，但访问 webhook 端点就 400。

试了一圈都不行：

- 把 token 塞 URL 参数里 → 400
- 用 Authorization Bearer 头 → 400
- 试 HMAC 签名 → Gitea 还是发空签名

最后在 Woodpecker 文档角落里看到一个土办法：**把仓库取消激活再激活**。Woodpecker 会自动在 Gitea 创建一个新的、配置正确的 webhook。

具体步骤：

1. Woodpecker UI → 找到仓库 → 取消激活
2. 重新激活
3. Gitea 这边自动多出一个 webhook
4. 检查 URL——`localhost:8081` 要改成 `woodpecker-server:8000`（因为 webhook 是 Gitea 容器发出的，`localhost` 不对）

这一步做完，提交代码，流水线终于跑了。

## 数据库锁定

最后一个，流水线跑到一半莫名取消：

```
queue.Done: cannot ack workflow
error: sql: no rows in result set
```

Woodpecker Server 用 SQLite，这种情况通常是 Server 状态异常。直接重启就行：

```bash
docker compose restart woodpecker-server woodpecker-agent
```

偶尔出现，不算高频，但遇到了别慌，重启大法好。

## 整体感受

这些坑里，环境变量改名是最隐蔽的——搜不到具体错误信息的人估计要在"forge not configured"上耗上半天。Webhook token 的问题最难调，因为日志里只给"token unverifiable"，不告诉你 token 是哪儿来的。

教训：**Woodpecker 的文档一定要看 2.x 版的，不要照着 Drone 1.x 的老博客抄**。变量名已经改过一轮了。