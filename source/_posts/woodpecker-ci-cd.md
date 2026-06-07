---
title: Woodpecker CI 持续集成部署实战
date: 2026-04-17 10:00:00
tags:
  - CI/CD
  - Woodpecker
  - Docker
  - DevOps
categories:
  - DevOps
---

## 概述

本文档详细介绍校园招聘管理平台从 Drone CI 迁移到 Woodpecker CI 的实战经验，包括部署配置、常见问题排查和流水线优化。

## 迁移背景

原 Drone CI 存在 Gitea webhook 签名验证问题（Gitea 发送空签名头导致 Drone 拒绝请求），决定迁移到 Woodpecker CI。

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      Docker Network                          │
│                                                             │
│  ┌─────────┐     ┌─────────────────┐     ┌──────────────┐  │
│  │  Gitea  │────>│ Woodpecker UI   │<────│ Woodpecker   │  │
│  │  :3000  │     │    :8081        │     │   Agent      │  │
│  └─────────┘     └─────────────────┘     │   :9000      │  │
│                                           └──────┬───────┘  │
│                                                  │          │
│                          ┌────────────────────────┘          │
│                          │                                  │
│                    ┌─────▼─────┐                             │
│                    │ Pipeline  │                             │
│                    │ Container │                             │
│                    └───────────┘                             │
└─────────────────────────────────────────────────────────────┘
```

## Docker Compose 配置

### 最终配置

```yaml
services:
  gitea:
    image: gitea/gitea:latest
    ports:
      - "3000:3000"
      - "222:22"
    networks:
      - ci-cd-net

  woodpecker-server:
    image: woodpeckerci/woodpecker-server:latest
    environment:
      - WOODPECKER_GITEA=true
      - WOODPECKER_GITEA_URL=http://gitea:3000
      - WOODPECKER_GITEA_CLIENT=${WOODPECKER_GITEA_CLIENT_ID}
      - WOODPECKER_GITEA_SECRET=${WOODPECKER_GITEA_CLIENT_SECRET}
      - WOODPECKER_SECRET=${WOODPECKER_SECRET}
      - WOODPECKER_AGENT_SECRET=${WOODPECKER_SECRET}
      - WOODPECKER_GRPC_SECRET=${WOODPECKER_SECRET}
      - WOODPECKER_HOST=http://localhost:${WOODPECKER_SERVER_HOST_PORT}
      - WOODPECKER_ADMIN=shuai
      - WOODPECKER_LOG_LEVEL=debug
      - WOODPECKER_DATABASE_DRIVER=sqlite3
      - WOODPECKER_DATABASE_DATASOURCE=/data/woodpecker.sqlite
    ports:
      - "${WOODPECKER_SERVER_HOST_PORT}:8000"
      - "9000:9000"
    networks:
      - ci-cd-net

  woodpecker-agent:
    image: woodpeckerci/woodpecker-agent:latest
    environment:
      - WOODPECKER_SERVER=woodpecker-server:9000
      - WOODPECKER_AGENT_SECRET=${WOODPECKER_SECRET}
      - WOODPECKER_MAX_WORKFLOWS=2
      - DOCKER_API_VERSION=1.44
      - WOODPECKER_HEALTHCHECK_ADDR=:33000
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - ci-cd-net

networks:
  ci-cd-net:
    driver: bridge
```

### .env 文件

```
WOODPECKER_SECRET=b6196558cafe00193dedd078f919633c9ae40acb9c6b25bdbfe73f57f698cfc7
WOODPECKER_SERVER_HOST_PORT=8081
WOODPECKER_GITEA_CLIENT_ID=692b1d04-db11-4e90-94be-daaf81812d0a
WOODPECKER_GITEA_CLIENT_SECRET=gto_b4u26orke653oe3z6gc7jquibevyzhpj5hbf3hl4ce4j77rrhh6a
```

## 流水线配置

`.woodpecker.yml` 定义了完整的 CI/CD 流水线：

```yaml
steps:

  # 前端 Lint 检查
  - name: frontend-lint
    image: node:18
    commands:
      - cd f && npm install -g pnpm
      - pnpm config set store-dir /root/.pnpm-store
      - pnpm install
      - npx eslint src --ext .ts,.vue

  # 后端 Checkstyle 检查
  - name: backend-checkstyle
    image: maven:3.9.9-eclipse-temurin-17
    commands:
      - cd b && mvn checkstyle:check

  # 后端单元测试
  - name: backend-test
    image: maven:3.9.9-eclipse-temurin-17
    commands:
      - cd b && mvn clean test

  # 后端镜像构建和推送
  - name: backend-build
    image: docker:cli
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    commands:
      - docker login -u $${DOCKER_USERNAME} -p $${DOCKER_PASSWORD} $${DOCKER_REGISTRY}
      - cd b && docker build -t b:build .
      - docker tag b:build $${DOCKER_REGISTRY}/shuai-repo/b:${CI_COMMIT_SHA:0:8}
      - docker push $${DOCKER_REGISTRY}/shuai-repo/b:latest

  # 前端构建
  - name: frontend
    image: node:18
    commands:
      - cd f && pnpm test:run

  - name: frontend-build
    image: docker:cli
    commands:
      - docker login -u $${DOCKER_USERNAME} -p $${DOCKER_PASSWORD} $${DOCKER_REGISTRY}
      - cd f && docker build -t f:build .
      - docker tag f:build $${DOCKER_REGISTRY}/shuai-repo/f:${CI_COMMIT_SHA:0:8}
      - docker push $${DOCKER_REGISTRY}/shuai-repo/f:latest

  # 构建成功通知
  - name: notify-success
    image: alpine
    commands:
      - apk add curl
      - curl -X POST 'https://oapi.dingtalk.com/robot/send?access_token=xxx' \
          -H 'Content-Type: application/json' \
          -d '{"msgtype": "text", "text": {"content": "流水线构建成功!"}}'
    when:
      - event: push
        status: success

  # 备份到 WebDAV
  - name: backup-webdav
    image: alpine
    commands:
      - apk add tar curl
      - tar --exclude='target' --exclude='node_modules' --exclude='.git' \
          --exclude='build' --exclude='dist' -czf backup.tar.gz .
      - curl -u "$${WEBDAV_USER}:$${WEBDAV_PASSWORD}" -T backup.tar.gz \
          "https://dav.jianguoyun.com/dav/graduation-project/"
```

## 常见问题排查

### 问题1: 服务启动失败 - forge not configured

**错误日志**:
```
can't setup globals: could not setup service manager: forge not configured
```

**原因**: Woodpecker 2.x 使用不同的环境变量名。

**解决方案**: 更新环境变量名称：
- `WOODPECKER_GITEA_SERVER` → `WOODPECKER_GITEA_URL`
- `WOODPECKER_GITEA_CLIENT_ID` → `WOODPECKER_GITEA_CLIENT`
- `WOODPECKER_GITEA_CLIENT_SECRET` → `WOODPECKER_GITEA_SECRET`
- 添加 `WOODPECKER_GITEA=true`

### 问题2: Gitea 容器内无法访问 localhost

**现象**: Gitea 容器内部无法访问 localhost:8081（指向自己而不是宿主机）。

**解决方案**: 修改 webhook URL，使用 Docker 网络中的服务名：
```bash
docker exec gitea sed -i "s/DOMAIN = localhost/DOMAIN = gitea/g" /data/gitea/conf/app.ini
docker exec gitea sed -i "s|ROOT_URL = http://localhost:3000|ROOT_URL = http://gitea:3000|g" /data/gitea/conf/app.ini
docker restart gitea
```

### 问题3: Agent 无法认证

**错误日志**:
```
rpc error: code = Unknown desc = agent could not auth: individual agent not found by token
```

**解决方案**:
- Server: `WOODPECKER_AGENT_SECRET=${WOODPECKER_SECRET}`
- Agent: `WOODPECKER_AGENT_SECRET=${WOODPECKER_SECRET}`
- Agent: `WOODPECKER_SERVER=woodpecker-server:9000`（注意是 9000 端口）

### 问题4: Docker API 版本不匹配

**错误日志**:
```
Error response from daemon: client version 1.43 is too old. Minimum supported API version is 1.44
```

**解决方案**: 在 Agent 环境变量中添加：
```yaml
- DOCKER_API_VERSION=1.44
```

### 问题5: 流水线容器无法解析 gitea 主机名

**错误日志**:
```
Could not resolve host: gitea
```

**解决方案**: 在 docker-compose.yml 中添加网络配置：
```yaml
environment:
  - WOODPECKER_NETWORK=ci-cd_ci-cd-net
```

### 问题6: OAuth 客户端配置错误

**错误信息**:
```
invalid_request
PKCE is required for public clients
```

**解决方案**: 在 Gitea 管理 OAuth2 应用程序中，勾选"机密客户端"。

## 关键端口

| 服务 | 内部端口 | 映射端口 |
|------|----------|----------|
| Gitea HTTP | 3000 | 3000 |
| Gitea SSH | 22 | 222 |
| Woodpecker HTTP | 8000 | 8081 |
| Woodpecker gRPC | 9000 | 9000 |
| Agent Health | 33000 | (内部) |

## 验证步骤

1. 检查服务状态：
```bash
docker ps
```

2. 检查 Agent 连接：
```bash
docker logs woodpecker-agent
```

3. 在 Gitea 中测试 webhook：
- 访问仓库设置 → Webhooks
- 点击测试推送

4. 在 Woodpecker UI 中查看构建：
- 访问 http://localhost:8081
- 查看仓库的流水线

## 参考资料

- [Woodpecker CI 官方文档](https://woodpecker-ci.org/)
- [Woodpecker GitHub](https://github.com/woodpecker-ci/woodpecker)