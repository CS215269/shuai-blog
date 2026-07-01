---
title: 一些零碎的小问题随手记
date: 2026-03-05 09:15:00
tags:
  - Java
  - Spring Boot
  - Hibernate
  - CI/CD
categories:
  - 随笔
---

写 CI/CD 顺手记一下碰到的小问题。不成系列，凑一起发。

## Hibernate 找不到方言

CI 跑后端构建的时候抛了这么个错：

```
Caused by: org.hibernate.service.spi.ServiceException: Unable to create requested service
[org.hibernate.engine.jdbc.env.spi.JdbcEnvironment] due to: Unable to determine Dialect
without JDBC metadata (please set 'jakarta.persistence.jdbc.url' for common cases or
'hibernate.dialect' when a custom Dialect implementation must be provided)
```

原因是我把 MySQL 换成了另一个数据库实例，但 Hibernate 不知道用的是哪个方言。

两个地方一起改：

数据库 URL 里加 `createDatabaseIfNotExist`（数据库不存在时自动建）：

```
jdbc:mysql://.../xxx?createDatabaseIfNotExist=true
```

`application.yml` 里显式指定方言：

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
```

注意 `ddl-auto: update` 只是开发期用着方便，正式环境还是老老实实写迁移脚本。

## 流水线里的可执行文件没权限

写测试流水线，想搞个简单的本地可执行脚本：

```yaml
commands:
  - echo "构建步骤"
  - echo "binary-data-123" > executable
  - ./executable
```

报：

```
+ ./executable
Permission denied
```

`echo >` 创建的文件默认没有执行位。加上 `chmod`：

```yaml
commands:
  - echo "binary-data-123" > executable
  - chmod +x executable
  - ./executable
```

然后又来一个错：

```
./executable: 1: binary-data-123: not found
```

——shell 真的把这个文件当脚本执行了，而文件内容是一行字符串 "binary-data-123"，shell 把它当命令去找，找不到。

如果只是测流水线能不能跑通，别搞这种花活，写个简单的命令就行：

```yaml
commands:
  - echo "测试成功"
  - go version
```

我那个需求其实是想验证"执行二进制"这个步骤能不能跑通，后来发现直接 `go version` 已经能验证环境了，没必要造一个假二进制。

---

几个小问题，没什么深的技术含量，记下来主要是怕下次再踩。