---
title: JWT Token 认证技术详解
date: 2026-04-17 10:00:00
tags:
  - Java
  - Spring Boot
  - JWT
  - 安全
categories:
  - 后端开发
---

## 概述

本文档详细介绍校园招聘管理平台中 JWT（JSON Web Token）认证机制的实现原理、核心组件和使用方式。

## JWT 认证流程

```
┌────────┐      ┌────────┐      ┌────────────┐
│ Client │ ──── │ Server │ ──── │   Database │
└────────┘      └────────┘      └────────────┘
     │               │                  │
     │  1.登录请求    │                  │
     │──────────────>│                  │
     │               │  2.验证用户      │
     │               │────────────────>│
     │               │  3.返回用户信息   │
     │               │<────────────────│
     │               │                  │
     │  4.生成Token  │                  │
     │<──────────────│                  │
     │  token+refresh │                 │
     │               │                  │
     │  5.请求资源    │                  │
     │──────────────>│                  │
     │  Authorization │                 │
     │  : Bearer xxx  │                  │
```

## 核心技术组件

### 1. JwtTokenProvider

`JwtTokenProvider` 是 JWT 令牌的核心提供者，负责令牌的生成、验证和解析。

```java
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret:ThisIsAVerySecureSecretKeyForJWTTokenGeneration2024}")
    private String jwtSecret;

    @Value("${jwt.expiration:3600000}")
    private long jwtExpiration;  // 默认1小时

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshExpiration;  // 默认7天

    // 生成JWT令牌
    public String generateToken(String username, String role, Long userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }
}
```

### 2. JwtAuthenticationFilter

`JwtAuthenticationFilter` 是 Spring Security 的过滤器，负责每个请求的 JWT 验证。

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String jwt = getJwtFromRequest(request);

        if (StringUtils.hasText(jwt)) {
            if (!jwtTokenProvider.validateToken(jwt)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            String username = jwtTokenProvider.getUsernameFromToken(jwt);
            String role = jwtTokenProvider.getRoleFromToken(jwt);

            SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(username, null,
                            Collections.singletonList(authority));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
```

## 令牌结构

### Access Token

存储的信息：
- `sub`: 用户名
- `userId`: 用户ID
- `role`: 角色（包含 ROLE_ 前缀）
- `iat`: 签发时间
- `exp`: 过期时间

### Refresh Token

与 Access Token 的区别：
- 有效期更长（7天 vs 1小时）
- 包含 `type: "refresh"` 声明
- 存储在数据库中，支持令牌失效和续期

## 安全特性

### 1. 签名验证

使用 HMAC-SHA256 算法签名，确保令牌不可伪造：

```java
private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
}
```

### 2. 多种异常处理

```java
public boolean validateToken(String token) {
    try {
        Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
        return true;
    } catch (SecurityException ex) {
        log.error("无效的JWT签名: {}", ex.getMessage());
    } catch (MalformedJwtException ex) {
        log.error("无效的JWT令牌: {}", ex.getMessage());
    } catch (ExpiredJwtException ex) {
        log.error("JWT令牌已过期: {}", ex.getMessage());
    } catch (UnsupportedJwtException ex) {
        log.error("不支持的JWT令牌: {}", ex.getMessage());
    } catch (IllegalArgumentException ex) {
        log.error("JWT令牌为空: {}", ex.getMessage());
    }
    return false;
}
```

### 3. 跳过验证的路径

```java
@Override
protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    // 刷新Token接口不需要JWT验证（Token在请求体中）
    if (path.contains("/auth/refresh")) {
        return true;
    }
    return false;
}
```

## 使用示例

### 登录流程

```java
public LoginResponse login(LoginRequest request) {
    // 1. 验证用户
    User user = findByUsername(request.getUsername())
            .orElseThrow(() -> new BusinessException(1011, "用户名或密码错误"));

    // 2. 验证密码
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new BusinessException(1011, "用户名或密码错误");
    }

    // 3. 生成 Access Token
    String token = jwtTokenProvider.generateToken(
            user.getUsername(),
            user.getRole().name(),
            user.getId()
    );

    // 4. 生成 Refresh Token
    String refreshToken = jwtTokenProvider.generateRefreshToken(
            user.getUsername(),
            user.getRole().name(),
            user.getId()
    );

    // 5. 保存 Refresh Token 到数据库
    user.setRefreshToken(refreshToken);
    user.setRefreshTokenExpireTime(LocalDateTime.now().plusDays(7));
    saveUser(user);

    return new LoginResponse(token, user.getId(), user.getUsername(),
            user.getRole().name(), refreshToken, refreshTokenExpireTimeMillis);
}
```

### Token 刷新流程

```java
public LoginResponse refreshToken(RefreshTokenRequest request) {
    String refreshToken = request.getRefreshToken();

    // 验证 Refresh Token
    if (!jwtTokenProvider.validateRefreshToken(refreshToken)) {
        throw new BusinessException(1020, "刷新令牌无效或已过期");
    }

    // 从数据库查找用户
    User user = findByRefreshToken(refreshToken)
            .orElseThrow(() -> new BusinessException(1020, "刷新令牌无效或已过期"));

    // 检查 Refresh Token 是否匹配
    if (!refreshToken.equals(user.getRefreshToken())) {
        throw new BusinessException(1020, "刷新令牌无效或已过期");
    }

    // 生成新的 Access Token
    String newToken = jwtTokenProvider.generateToken(
            user.getUsername(),
            user.getRole().name(),
            user.getId()
    );

    return new LoginResponse(newToken, user.getId(), user.getUsername(),
            user.getRole().name(), user.getRefreshToken(),
            user.getRefreshTokenExpireTime().atZone(ZoneId.systemDefault())
                    .toInstant().toEpochMilli());
}
```

### 前端请求示例

```typescript
// 请求头携带 Token
const response = await fetch('/api/jobs', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

## 配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `jwt.secret` | `ThisIsAVerySecureSecretKeyForJWTTokenGeneration2024` | 签名密钥 |
| `jwt.expiration` | `3600000` | Access Token 有效期（毫秒） |
| `jwt.refresh-expiration` | `604800000` | Refresh Token 有效期（毫秒） |

## 依赖版本

- `io.jsonwebtoken:jjwt-api:0.12.6`
- `jjwt-impl:0.12.6`
- `jjwt-jackson:0.12.6`

## 参考资料

- [JJWT 官方文档](https://github.com/jwt/jjwt)
- [RFC 7519 - JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)