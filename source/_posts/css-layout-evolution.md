---
title: CSS 布局的演变——从 Table 到 Grid
date: 2026-05-20
tags:
  - CSS
  - 前端
  - 布局
  - Web标准
---

CSS 布局的发展历程，几乎就是一部 Web 前端工程化的简史。从最初用表格拼凑页面，到今天用 Grid 实现任意二维布局，这条路走了二十多年。

## 石器时代：Table 布局

在 CSS 还不成熟的年代，开发者用 `<table>` 标签来搭建页面结构。表头、侧栏、主内容区——每个区域都是表格的一个单元格。这种方式虽然能工作，但混淆了**结构**和**表现**的边界。

想象一下：为了做一个三栏布局，你需要嵌套三层表格。代码不可读，也不利于屏幕阅读器。但这就是 2000 年代初期的 Web 现实。

## 浮动的黄金年代

随着 CSS 2.1 的普及，`float` 属性成为布局的主力。从 2005 年到 2015 年这十年间，几乎所有的多栏布局都是用浮动实现的。

> Float 的本意是让文字环绕图片，但它却被用来做页面布局长达十年之久。这大概是 CSS 历史上最大的"误用"。

### 清除浮动

浮动布局最大的痛点是"清除浮动"。当一个容器内的所有子元素都浮动后，容器高度会塌陷为零。clearfix 于是诞生：

```css
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
```

### Holy Grail 布局

"圣杯布局"特指一种三栏布局：两侧固定宽度，中间自适应。在 float 时代，这需要精密的负边距计算和嵌套容器。

## Flexbox 时代

2015 年前后，Flexbox 开始获得主流浏览器的一致支持。垂直居中不再需要绝对定位 hack，等宽分栏不再需要计算百分比。Flexbox 擅长**一维布局**。

```css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

## Grid：原生二维布局

CSS Grid 给了我们真正的**二维布局**能力，同时控制行和列。

```css
.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 1.5rem;
}
```

这段代码实现的就是这个博客文章页的布局——左侧目录、右侧内容。

## 响应式设计

从 Table 到 Grid，每个新技术都让响应式设计更自然。Grid 的 `minmax()`、`auto-fill`、`auto-fit` 等函数，让布局可以**自适应**容器大小。

好的布局应该在 320px 和 2560px 屏幕上都良好可读。

## 总结

每个阶段的技术都在解决上一代的痛点，同时引入新的复杂性。今天的 Grid 和 Flexbox 不是终点——CSS 布局仍在演化。工具在进步，但好的设计原则——关注内容、尊重用户、拥抱变化——是永恒的。
