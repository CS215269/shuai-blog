---
title: 一个 Gitea Webhook 签名 Bug 把我逼到了 Woodpecker CI
date: 2026-03-04 21:30:00
tags:
  - CI/CD
  - Gitea
  - Drone
  - Woodpecker
categories:
  - DevOps
---

## 起因

毕业设计要搭一套 CI/CD。Git 服务选了 Gitea（轻量、自托管），CI 部分当时图省事直接用了 Drone——毕竟 Drone 跟 Gitea 同源，集成应该没问题吧。

事实是，问题很快就来了。

服务都起来之后，我在 Gitea 给仓库配了 webhook，指向 Drone Server。提交代码，Gitea 这边显示"推送成功 HTTP 200"，但 Drone 这边一点动静没有。手动 `curl` 打了一下 webhook 接口，返回了一行：

```json
{"message":"Invalid webhook signature"}
```

## 第一步：确认服务都是正常的

```bash
docker ps
```

```
drone-agent    Up 8 minutes   3000/tcp
drone-server   Up 8 minutes   443/tcp, 0.0.0.0:8081->80/tcp
gitea          Up 8 minutes   0.0.0.0:3000->3000/tcp
```

容器都健康。Drone 数据库里查了一下，仓库激活状态是 `1`，没问题。再看 Gitea 这边，webhook 列表里还活着多个 webhook，ID=3 的那个 secret 是 `my-secret-123`。

历史构建记录翻了一下，发现最近几次构建都是 `custom` 事件触发的，不是 `push`。这就有意思了——webhook 推的 `push` 事件根本就没被处理。

## 实际抓到的请求头

直接查 Gitea 的 `hook_task` 表，把最近一次 webhook 调用的响应拿出来：

```json
{"status":400,"body":"{\"message\":\"Invalid webhook signature\"}\n"}
```

也就是说 Gitea 这一端确实把请求发出去了，Drone 也确实拒绝了。这就排除了"webhook 没触发"的可能。

继续挖——把 Gitea 实际发出的请求头 dump 出来：

```json
{
  "X-Gitea-Signature": "",
  "X-Hub-Signature": "sha1=",
  "X-Hub-Signature-256": "sha256="
}
```

看到没？三个签名头都是空的。即使我在 Gitea UI 里把 secret 填得满满的，发出去的请求还是这种"半残"状态。

## 折腾的开始

我心想是不是哪里配置错了，于是把可能的方案挨个试了一遍：

| 方案 | 结果 |
|------|------|
| 移除 webhook secret | ❌ Gitea 照样发空签名 |
| 升级 Gitea 到 1.25.4 | ❌ 没用 |
| 升级 Drone 到 drone/drone:2 | ❌ 镜像其实没变（hash 一样） |
| 设置 `DRONE_WEBHOOK_SECRET` | ❌ Drone 拿空签名去校验，结果还是不对 |
| 自己写个 webhook-relay 中继服务 | ❌ 算出来的签名跟 Drone 期望的对不上 |

那个中继服务是最离谱的一段。我用 Python 写了 HMAC-SHA256 签名，OpenSSL 算了一遍对得上，curl 模拟带上签名发出去，Drone 还是"Invalid"。

这就离谱了，签名值是对的它还拒。后来想想，Drone 大概是在做某种兼容性检查，看到签名格式不对就直接拒了，不管你算得对不对。

## 根因

社区 issue 翻了一圈，这个问题其实就是 Gitea 的一个老 bug——1.x 系列不管怎么配，都可能在某些情况下把空签名头塞进去。Drone 的校验又比较严格，看到空头就直接 400 了。

到这里我意识到，这个 bug 不是我配错的问题，是工具链之间的协议分歧。继续在 Drone + Gitea 上耗下去意义不大。

## 决定换 Woodpecker

Drone 的活跃 fork 有几个，Woodpecker CI 是其中最像样的一个。它本来就是从 Drone 1.x 时代 fork 出来的，配置文件几乎一样，但保留了 Gitea OAuth 集成和活跃的维护。

决定迁移。

具体的迁移过程、网络/配置上踩的坑，单独写几篇记录。这一篇就到这里——一句话总结：**Gitea + Drone 的签名 bug 修不了，至少在可预见的时间里修不了**。如果你也在这个组合上折腾，劝你早点换。

下一篇文章会讲迁移之后 Woodpecker 又给我埋了哪些坑。