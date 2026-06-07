---
title: CSS Grid 布局完全指南
date: 2025-03-05 16:45:00
tags:
  - CSS
  - 前端
  - 布局
categories:
  - 前端开发
---

CSS Grid 是 CSS 中最强大的布局系统之一。本文将详细介绍 CSS Grid 的使用方法。

## 基本概念

### 网格容器和网格项

```css
.container {
  display: grid;
}
```

### 定义网格轨道

```css
.container {
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px;
}
```

## 常用属性

### gap

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

### grid-template-areas

```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-rows: 60px 1fr 60px;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

### 网格项位置

```css
.item {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
```

## 响应式布局

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

## 总结

CSS Grid 为我们提供了一种简洁、高效的二维布局方式，可以轻松实现各种复杂的页面布局。
