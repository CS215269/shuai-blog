---
title: Git 使用指南
date: 2025-01-15 14:30:00
tags:
  - Git
  - 版本控制
categories:
  - 工具使用
---

Git 是目前最流行的版本控制系统之一。本文将介绍 Git 的基本使用方法。

## 初始化仓库

```bash
git init
```

## 基本操作

### 添加文件

```bash
git add .
git add filename
```

### 提交更改

```bash
git commit -m "提交信息"
```

### 查看状态

```bash
git status
```

### 查看提交历史

```bash
git log
```

## 分支管理

### 创建分支

```bash
git branch branch-name
```

### 切换分支

```bash
git checkout branch-name
```

### 合并分支

```bash
git merge branch-name
```

## 远程操作

### 添加远程仓库

```bash
git remote add origin https://github.com/user/repo.git
```

### 推送代码

```bash
git push -u origin master
```

### 拉取代码

```bash
git pull origin master
```

## 总结

Git 是一个强大的版本控制工具，掌握基本操作可以让我们的开发工作更加高效。
