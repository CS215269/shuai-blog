# 网址导航整合进博客站点 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把仓库根目录的独立静态站 `nav/` 整合进 hexo 博客，使其能通过 `/nav/` 访问、并从博客顶部菜单进入，同时把顶栏路径显示改成准确的面包屑。

**Architecture:** 导航页以静态资源形式平移到 `source/nav/`，用 front matter `layout: false` 让 Hexo 原样输出，页面保持单文件自包含、零主题耦合。面包屑当前段由主题 `nav` 配置驱动（取第一个 `url` 非 `/` 且 `page.path` 以其开头的菜单项），导航页与博客页各自渲染同一套 `~/blog/...` 路径风格。主题偏好统一走 localStorage key `theme`。

**Tech Stack:** Hexo 7.3.0 + Nunjucks 主题（latex-minimal）、原生 HTML/CSS/JS、Cloudflare Pages

**Spec:** `docs/superpowers/specs/2026-11-17-nav-integration-design.md`

---

## 前置知识

本项目**没有测试框架**（`package.json` 只有 `dev`/`build`/`clean`/`new` 四个 script，无 test script、无测试目录）。因此本计划的"测试"步骤采用两类可执行断言：

- **构建期断言** —— `npx hexo generate` 后用 `node -e` 检查产物文件的存在性与内容
- **浏览器断言** —— 用 Playwright MCP 打开 `http://localhost:4000/<path>`，用 `browser_evaluate` 读 DOM 取值比对

每个任务都是「先写断言 → 跑出失败 → 改代码 → 跑出通过 → 提交」的节奏。

**本地预览服务**：任务中需要浏览器验证时，先在仓库根目录起服务（后台运行）：

```bash
npx hexo server &
```

默认地址 `http://localhost:4000`。若 4000 端口被占用，hexo server 会自动换端口，以它打印的地址为准。

---

## 文件结构

实施完成后的文件布局：

```
source/
  nav/                        ← 新增：导航页（从仓库根 nav/ 平移）
    index.html                ← 完整 HTML 文档；front matter layout:false + 防 FOUC 脚本 + 面包屑品牌
    assets/
      style.css               ← 导航页样式（自带 CSS 变量，不加载博客 style.css）
      app.js                  ← 渲染/搜索/筛选/主题切换；localStorage key 改为 theme
    data/
      sites.js                ← 数据源：201 条网址 / 12 个分类
  about/index.html            （不动）
  projects/index.md           （不动）
  tags/index.md               （不动）

themes/latex-minimal/
  _config.yml                 ← 修改：nav 列表追加「导航」项
  layout/partial/header.njk   ← 修改：面包屑当前段计算 + 标题标记
  source/css/style.css        ← 修改：.site-title / .crumb-* 样式

NAV.md                        ← 新增（从 nav/README.md 迁移）：导航页维护说明
docs/superpowers/…            （已存在，不动）
nav/                          ← 删除
```

**职责边界**：导航页的 CSS/JS 与博客主题完全独立（导航页不加载博客的 `style.css`，因为两者都定义了 `html`/`body`/`.site-header` 等基础规则，同时加载会冲突）。代价是面包屑样式规则在两份 CSS 中各存一份。

---

## Task 1: 平移 nav 文件到 source/nav/

**Files:**
- Move: `nav/index.html` → `source/nav/index.html`
- Move: `nav/assets/style.css` → `source/nav/assets/style.css`
- Move: `nav/assets/app.js` → `source/nav/assets/app.js`
- Move: `nav/data/sites.js` → `source/nav/data/sites.js`
- Move: `nav/README.md` → `NAV.md`（仓库根）

- [ ] **Step 1: 建立目标目录并用 git mv 平移**

```bash
cd "C:/Users/c215/Documents/Visual Studio Code/MarkDown/personalWeb/hexo-blog"
mkdir -p source/nav/assets source/nav/data
git mv nav/index.html       source/nav/index.html
git mv nav/assets/style.css source/nav/assets/style.css
git mv nav/assets/app.js    source/nav/assets/app.js
git mv nav/data/sites.js    source/nav/data/sites.js
git mv nav/README.md        NAV.md
rmdir nav 2>/dev/null || true
```

`git mv` 搬空文件后 `nav/` 目录可能仍留在磁盘上（git 不跟踪空目录），故补一条 `rmdir`。
若 `mkdir` 前 `source/nav/` 已存在且非空，先检查内容再决定是否覆盖。

- [ ] **Step 2: 确认目录结构**

```bash
ls -R source/nav; test -d nav && echo "nav 仍存在" || echo "nav 已删除"
```

Expected: `source/nav/` 下有 `index.html`、`assets/style.css`、`assets/app.js`、`data/sites.js`；输出 `nav 已删除`。

- [ ] **Step 3: 更新 NAV.md 里的路径描述**

`NAV.md` 中有三处需要改。找到文件顶部的目录结构树：

```
nav/
├── index.html        页面骨架
├── assets/
│   ├── style.css     样式（沿用博客 latex-minimal 主题的配色与字体）
│   └── app.js        渲染 / 搜索 / 标签筛选 / 明暗主题
├── data/
│   └── sites.js      ★ 数据源：所有网址都在这里
└── README.md         本文件
```

替换为：

```
source/nav/
├── index.html        页面骨架
├── assets/
│   ├── style.css     样式（沿用博客 latex-minimal 主题的配色与字体）
│   └── app.js        渲染 / 搜索 / 标签筛选 / 明暗主题
└── data/
    └── sites.js      ★ 数据源：所有网址都在这里
```

再找到「怎么用」一节：

```
直接双击 `index.html` 就能打开（不需要服务器、不需要 npm、不需要构建）。
```

替换为：

```
访问 https://shuai-blog.pages.dev/nav/ 即可打开（随博客一起构建部署）。
本地预览时先在仓库根目录跑 `npx hexo server`，然后访问 http://localhost:4000/nav/。
```

最后找到「怎么加一条网址」一节里的一行：

```
只改 `data/sites.js`。在对应分类的 `items` 数组里加一行：
```

替换为：

```
只改 `source/nav/data/sites.js`。在对应分类的 `items` 数组里加一行：
```

- [ ] **Step 4: 验证 NAV.md 内容已更新**

```bash
node -e "const s=require('fs').readFileSync('NAV.md','utf8'); if(s.includes('只改 \`data/sites.js\`')) throw new Error('未更新'); if(!s.includes('source/nav/data/sites.js')) throw new Error('缺少新路径'); if(!s.includes('shuai-blog.pages.dev/nav/')) throw new Error('缺少访问地址'); console.log('NAV.md OK');"
```

Expected: `NAV.md OK`

- [ ] **Step 5: 提交**

```bash
git add -A source/nav NAV.md
git commit -m "refactor(导航):nav 目录平移进 source/,随博客一起构建部署"
```

注意：不要用 `git add -A`（无路径参数），仓库里还有若干与本任务无关的未跟踪文章会被一并提交。

---

## Task 2: 导航页接入 Hexo 构建（layout: false + 防 FOUC）

**Files:**
- Modify: `source/nav/index.html:1`（加 front matter）
- Modify: `source/nav/index.html:9`（head 里插 preload + 防 FOUC 脚本）

- [ ] **Step 1: 写构建期断言**

```bash
node -e "const fs=require('fs');const h=fs.readFileSync('public/nav/index.html','utf8');const n=(h.match(/<html/g)||[]).length;if(n!==1)throw new Error('出现 '+n+' 个 <html>，说明被套了主题布局');if(h.includes('layout: false'))throw new Error('front matter 未被剥离');if(!h.includes('assets/style.css'))throw new Error('样式引用丢失');if(!h.includes('data/sites.js'))throw new Error('数据引用丢失');if(!h.includes('localStorage.getItem'))throw new Error('缺防 FOUC 脚本');console.log('public/nav/index.html OK');"
```

判别点：产物里 `<html` 出现次数必须恰好为 1。原始输出只有导航页自己的 `<html>`；若被套上主题的 `page` 布局，导航页的整份 HTML 会被嵌进博客的 `<article class="article-body">` 里，`<html` 就会出现两次。

- [ ] **Step 2: 跑断言，确认失败**

```bash
npx hexo clean && npx hexo generate
node -e "const fs=require('fs');const h=fs.readFileSync('public/nav/index.html','utf8');const n=(h.match(/<html/g)||[]).length;if(n!==1)throw new Error('出现 '+n+' 个 <html>，说明被套了主题布局');if(h.includes('layout: false'))throw new Error('front matter 未被剥离');if(!h.includes('assets/style.css'))throw new Error('样式引用丢失');if(!h.includes('data/sites.js'))throw new Error('数据引用丢失');if(!h.includes('localStorage.getItem'))throw new Error('缺防 FOUC 脚本');console.log('public/nav/index.html OK');"
```

Expected: 抛错 `出现 2 个 <html>，说明被套了主题布局`——因为 `.html` 默认会套用主题 `page` 布局，产物里会包着博客的容器结构。

- [ ] **Step 3: 给 source/nav/index.html 加 front matter**

在文件第一行 `<!DOCTYPE html>` 之前插入：

```html
---
title: 网址导航
layout: false
---
```

完整文件头应变成：

```html
---
title: 网址导航
layout: false
---
<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>网址导航</title>
  <meta name="description" content="个人收藏夹整理而成的静态网址导航，数据与页面分离，可直接编辑 data/sites.js 维护。">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23c2855b'/%3E%3Ctext x='16' y='23' font-size='19' font-family='serif' text-anchor='middle' fill='%23fff'%3E%E2%86%92%3C/text%3E%3C/svg%3E">
  <link rel="stylesheet" href="assets/style.css">
</head>
```

`layout: false` 让 Hexo 的 page 生成器直接输出 `page.content`，不再套用主题的 `page` 布局（该生成器判断 `!layout || layout === 'false' || layout === 'off'`）。

- [ ] **Step 4: 跑断言，确认仍失败（还缺防 FOUC 脚本）**

```bash
npx hexo clean && npx hexo generate
node -e "const fs=require('fs');const h=fs.readFileSync('public/nav/index.html','utf8');const n=(h.match(/<html/g)||[]).length;if(n!==1)throw new Error('出现 '+n+' 个 <html>，说明被套了主题布局');if(h.includes('layout: false'))throw new Error('front matter 未被剥离');if(!h.includes('assets/style.css'))throw new Error('样式引用丢失');if(!h.includes('data/sites.js'))throw new Error('数据引用丢失');if(!h.includes('localStorage.getItem'))throw new Error('缺防 FOUC 脚本');console.log('public/nav/index.html OK');"
```

Expected: 抛错 `缺防 FOUC 脚本`——front matter 剥离已生效（不再报 `<html>` 数量错），但防 FOUC 脚本还没加。

- [ ] **Step 5: 插入防 FOUC 脚本**

把 `source/nav/index.html` 的 head 部分改为（`<link rel="stylesheet" href="assets/style.css">` 之前插入 preload 与脚本）：

```html
  <link rel="preload" href="assets/style.css" as="style">
  <script>
  (function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();
  </script>
  <link rel="stylesheet" href="assets/style.css">
```

这段与 `themes/latex-minimal/layout/partial/head.njk` 中的同一段一致：阻塞脚本在 CSS 生效前把 localStorage 里的主题偏好写回 `data-theme`，避免浅色用户看到深色闪一下。`preload` 让 CSS 与脚本并行下载。

- [ ] **Step 6: 跑断言，确认通过**

```bash
npx hexo clean && npx hexo generate
node -e "const fs=require('fs');const h=fs.readFileSync('public/nav/index.html','utf8');const n=(h.match(/<html/g)||[]).length;if(n!==1)throw new Error('出现 '+n+' 个 <html>，说明被套了主题布局');if(h.includes('layout: false'))throw new Error('front matter 未被剥离');if(!h.includes('assets/style.css'))throw new Error('样式引用丢失');if(!h.includes('data/sites.js'))throw new Error('数据引用丢失');if(!h.includes('localStorage.getItem'))throw new Error('缺防 FOUC 脚本');console.log('public/nav/index.html OK');"
ls public/nav/assets public/nav/data
```

Expected: `public/nav/index.html OK`，且 `public/nav/assets/{style.css,app.js}`、`public/nav/data/sites.js` 都在。

- [ ] **Step 7: 提交**

```bash
git add source/nav/index.html
git commit -m "feat(导航):导航页接入 Hexo 构建,加防 FOUC 脚本"
```

---

## Task 3: 主题 localStorage key 统一

**Files:**
- Modify: `source/nav/assets/app.js:243`（写入）
- Modify: `source/nav/assets/app.js:268`（读取）

- [ ] **Step 1: 写断言**

```bash
node -e "const s=require('fs').readFileSync('source/nav/assets/app.js','utf8'); const n=(s.match(/nav-theme/g)||[]).length; if(n) throw new Error('仍有 '+n+' 处 nav-theme'); if((s.match(/localStorage.setItem\(\"theme\"/g)||[]).length!==1) throw new Error('写入未改'); if((s.match(/localStorage.getItem\(\"theme\"/g)||[]).length!==1) throw new Error('读取未改'); console.log('localStorage key OK');"
```

Expected: 抛错 `仍有 2 处 nav-theme`。

- [ ] **Step 2: 改写入处（第 243 行）**

```javascript
    try { localStorage.setItem("theme", next); } catch (e) {}
```

- [ ] **Step 3: 改读取处（第 268 行）**

```javascript
    var saved = localStorage.getItem("theme");
```

两处 `nav-theme` 都改成 `theme`，与 `themes/latex-minimal/source/js/main.js` 使用的 key 一致。

- [ ] **Step 4: 跑断言，确认通过**

```bash
node -e "const s=require('fs').readFileSync('source/nav/assets/app.js','utf8'); const n=(s.match(/nav-theme/g)||[]).length; if(n) throw new Error('仍有 '+n+' 处 nav-theme'); if((s.match(/localStorage.setItem\(\"theme\"/g)||[]).length!==1) throw new Error('写入未改'); if((s.match(/localStorage.getItem\(\"theme\"/g)||[]).length!==1) throw new Error('读取未改'); console.log('localStorage key OK');"
```

Expected: `localStorage key OK`

- [ ] **Step 5: 提交**

```bash
git add source/nav/assets/app.js
git commit -m "fix(导航):主题 localStorage key 统一为 theme,与博客同步"
```

---

## Task 4: 博客主题顶栏加路径面包屑

**Files:**
- Modify: `themes/latex-minimal/layout/partial/header.njk:5`（加当前段计算 + 标题标记）
- Modify: `themes/latex-minimal/source/css/style.css:185-192`（`.site-title` / `.crumb-*` 样式）

- [ ] **Step 1: 写断言（浏览器）**

```javascript
// 在 http://localhost:4000/<path> 页面执行
() => {
  const base = document.querySelector('.crumb-base');
  const cur = document.querySelector('.crumb-current');
  return {
    base: base ? base.textContent : null,
    current: cur ? cur.textContent : null,
    baseColor: base ? getComputedStyle(base).color : null,
    curColor: cur ? getComputedStyle(cur).color : null
  };
}
```

- [ ] **Step 2: 跑断言，确认失败**

起服务并打开 `http://localhost:4000/about/`，执行上面的表达式。

Expected: `base: null`——主题还没改面包屑。

- [ ] **Step 3: 改 header.njk**

在文件开头的 `<a href="#main-content" class="skip-link">跳转到内容</a>` **之前**插入当前段计算：

```njk
{% set crumbSeg = '' %}
{% if page.path and theme.nav %}
  {% for item in theme.nav %}
    {% if item.url !== '/' and page.path.indexOf(item.url.replace('/', '')) === 0 %}
      {% set crumbSeg = item.url.replace('/', '').replace('/', '') %}
    {% endif %}
  {% endfor %}
{% endif %}
```

再把第 5 行原标题：

```njk
  <a href="{{ url_for('/') }}" class="site-title">{{ theme.header.title | default(config.title) }}</a>
```

替换为：

```njk
  <span class="site-title">
    <a href="{{ url_for('/') }}" class="crumb-base">{{ theme.header.title | default(config.title) }}</a>{% if crumbSeg %}<span class="crumb-sep">/</span><span class="crumb-current">{{ crumbSeg }}</span>{% endif %}
  </span>
```

该匹配规则与文件中已有的 `isActive` 高亮逻辑同源，保证「高亮的菜单项」与「面包屑当前段」始终一致。`item.url.replace('/', '')` 对 `/about/` 得 `about/`（只替换首个斜杠），再 replace 一次去掉尾部斜杠得 `about`。

- [ ] **Step 4: 改 style.css**

把 `themes/latex-minimal/source/css/style.css` 第 185-192 行：

```css
.site-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.01em;
}
.site-title:hover { color: var(--accent); }
```

替换为：

```css
.site-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  letter-spacing: -0.01em;
}
.crumb-base { color: var(--text-muted); }
.crumb-base:hover { color: var(--accent); }
.crumb-sep { color: var(--text-faint); padding: 0 .15em; }
.crumb-current { color: var(--accent); }
```

注意：`.site-title` 的颜色从 `var(--text)`（亮）改为 `var(--text-muted)`（弱化）。这是有意的视觉变更——前缀恒为弱化色，强调色 `var(--accent)` 只用于表示「当前位置」。原来 `.site-title:hover` 的行为由 `.crumb-base:hover` 承担。

- [ ] **Step 5: 跑断言，确认通过**

重新构建并逐页验证：

```bash
npx hexo clean && npx hexo generate
```

然后对以下每个 URL 执行 Step 1 的表达式，核对结果：

| URL | 期望 `base` | 期望 `current` |
|---|---|---|
| `http://localhost:4000/` | `~/blog` | `null` |
| `http://localhost:4000/about/` | `~/blog` | `about` |
| `http://localhost:4000/projects/` | `~/blog` | `projects` |
| `http://localhost:4000/tags/` | `~/blog` | `tags` |
| `http://localhost:4000/tags/CSS/` | `~/blog` | `tags` |
| `http://localhost:4000/2026/06/01/hello-world/` | `~/blog` | `null` |

同时核对颜色：`baseColor` 应为弱化色 `rgb(138, 133, 124)`（深色主题下 `--text-muted: #8a857c`），有当前段时 `curColor` 应为 `rgb(194, 133, 91)`（`--accent: #c2855b`）。

- [ ] **Step 6: 提交**

```bash
git add themes/latex-minimal/layout/partial/header.njk themes/latex-minimal/source/css/style.css
git commit -m "feat(主题):顶栏加路径面包屑,栏目页显示子目录"
```

---

## Task 5: 导航页品牌改为 ~/blog/nav 面包屑

**Files:**
- Modify: `source/nav/index.html:16-18`（brand 区）
- Modify: `source/nav/assets/style.css:95-96`（`.site-title` / `.crumb-*` 样式）

- [ ] **Step 1: 写断言（浏览器）**

```javascript
// 在 http://localhost:4000/nav/ 页面执行
() => {
  const base = document.querySelector('.crumb-base');
  const cur = document.querySelector('.crumb-current');
  const sep = document.querySelector('.crumb-sep');
  return {
    base: base ? base.textContent : null,
    baseHref: base ? base.getAttribute('href') : null,
    current: cur ? cur.textContent : null,
    sep: sep ? sep.textContent : null
  };
}
```

- [ ] **Step 2: 跑断言，确认失败**

```bash
npx hexo clean && npx hexo generate
```

打开 `http://localhost:4000/nav/`，执行上面的表达式。

Expected: `base: null`——导航页还是旧的 `~/nav`。

- [ ] **Step 3: 改 source/nav/index.html 的 brand 区**

把：

```html
      <div class="brand">
        <a class="site-title" href="./">~/nav</a>
        <p class="site-subtitle" id="subtitle">加载中…</p>
      </div>
```

替换为：

```html
      <div class="brand">
        <span class="site-title">
          <a href="/" class="crumb-base">~/blog</a><span class="crumb-sep">/</span><span class="crumb-current">nav</span>
        </span>
        <p class="site-subtitle" id="subtitle">加载中…</p>
      </div>
```

`~/blog` 指向站点根 `/`，即从导航页回博客的入口。导航页实际住在博客的 `/nav/` 下，所以路径写成 `~/blog/nav` 而非 `~/nav`。

- [ ] **Step 4: 改 source/nav/assets/style.css**

把第 95-96 行：

```css
.site-title { font-size: 1.2rem; font-weight: 600; color: var(--text); letter-spacing: -.01em; }
.site-title:hover { color: var(--accent); }
```

替换为：

```css
.site-title { font-size: 1.2rem; font-weight: 600; color: var(--text-muted); letter-spacing: -.01em; }
.crumb-base { color: var(--text-muted); }
.crumb-base:hover { color: var(--accent); }
.crumb-sep { color: var(--text-faint); padding: 0 .15em; }
.crumb-current { color: var(--accent); }
```

导航页不加载博客的 `style.css`（两份都定义了 `html`/`body`/`.site-header` 基础规则，同时加载会冲突），所以这份规则要在这里再写一遍。

- [ ] **Step 5: 跑断言，确认通过**

```bash
npx hexo clean && npx hexo generate
```

打开 `http://localhost:4000/nav/`，执行 Step 1 的表达式。

Expected: `base: "~/blog"`、`baseHref: "/"`、`current: "nav"`、`sep: "/"`

- [ ] **Step 6: 提交**

```bash
git add source/nav/index.html source/nav/assets/style.css
git commit -m "feat(导航):导航页品牌改为 ~/blog/nav 面包屑"
```

---

## Task 6: 顶部菜单新增「导航」入口

**Files:**
- Modify: `themes/latex-minimal/_config.yml:4-12`（nav 列表）

- [ ] **Step 1: 写断言（浏览器）**

```javascript
// 在任意博客页面执行
() => {
  const links = [...document.querySelectorAll('.nav-list .nav-link')].map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
  return links;
}
```

- [ ] **Step 2: 跑断言，确认失败**

打开 `http://localhost:4000/`，执行上面的表达式。

Expected: 数组里只有 `首页`/`关于`/`作品集`/`标签` 四项，没有「导航」。

- [ ] **Step 3: 改 _config.yml**

把 `themes/latex-minimal/_config.yml` 的 nav 列表：

```yaml
nav:
  - label: 首页
    url: /
  - label: 关于
    url: /about/
  - label: 作品集
    url: /projects/
  - label: 标签
    url: /tags/
```

改为：

```yaml
nav:
  - label: 首页
    url: /
  - label: 关于
    url: /about/
  - label: 作品集
    url: /projects/
  - label: 标签
    url: /tags/
  - label: 导航
    url: /nav/
```

- [ ] **Step 4: 跑断言，确认通过**

```bash
npx hexo clean && npx hexo generate
```

打开 `http://localhost:4000/`，执行 Step 1 的表达式。

Expected: 数组含 5 项，末项为 `{ text: "导航", href: "/nav/" }`

- [ ] **Step 5: 提交**

```bash
git add themes/latex-minimal/_config.yml
git commit -m "feat(主题):顶部菜单新增导航入口"
```

---

## Task 7: 端到端验证

**Files:**
- 无代码改动，仅验证。若发现问题，回到对应 Task 修复。

- [ ] **Step 1: 干净构建，确认产物齐全**

```bash
npx hexo clean && npx hexo generate
node -e "
const fs=require('fs');
const need=['public/nav/index.html','public/nav/assets/style.css','public/nav/assets/app.js','public/nav/data/sites.js'];
need.forEach(f=>{ if(!fs.existsSync(f)) throw new Error('缺文件: '+f); });
if(fs.existsSync('public/nav/README')) throw new Error('README 被发布了');
console.log('产物齐全');
"
```

Expected: `产物齐全`

- [ ] **Step 2: 确认 README 未被当作页面发布**

`NAV.md` 放在仓库根而非 `source/`，不应出现在产物里。全盘扫一遍：

```bash
node -e "const fs=require('fs');const hits=[];(function walk(d){fs.readdirSync(d,{withFileTypes:true}).forEach(e=>{const p=d+'/'+e.name;if(e.isDirectory())walk(p);else if(/readme/i.test(p))hits.push(p);});})('public');if(hits.length)throw new Error('README 被发布了: '+hits.join(', '));console.log('无 README 页面');"
```

Expected: `无 README 页面`

- [ ] **Step 3: 导航页功能走查**

起 `npx hexo server`，打开 `http://localhost:4000/nav/`，逐项确认：

1. 侧栏列出 12 个分类，「全部」计数为 201
2. 页面底部统计显示 `共 201 条网址 · 更新于 2026-11-16`
3. 顶部副标题显示 `个人收藏夹 · 201 条网址 / 12 个分类`
4. 搜索框输入 `git`，结果数减少，卡片随之过滤
5. 按 `/` 聚焦搜索框，按 `Esc` 清空
6. 点击左侧某个分类，内容区只剩该分类
7. 点击一个标签 chip，卡片按该标签过滤，且地址栏 hash 变为含 `tags=` 的形式
8. 刷新页面，筛选状态由 hash 还原

用 `browser_evaluate` 取值核对，例如：

```javascript
() => ({
  subtitle: document.getElementById('subtitle').textContent,
  total: document.getElementById('totalCount').textContent,
  updated: document.getElementById('updatedAt').textContent,
  catCount: document.querySelectorAll('.cat-list .cat-item').length,
  cards: document.querySelectorAll('.card').length
})
```

- [ ] **Step 4: 主题同步走查**

1. 在 `http://localhost:4000/` 点主题切换按钮切到浅色
2. 打开 `http://localhost:4000/nav/` → 应直接是浅色，**无深色闪一下**
3. 在导航页切回深色 → 回博客首页刷新，应为深色

验证浅色生效：

```javascript
() => ({
  theme: document.documentElement.getAttribute('data-theme'),
  bg: getComputedStyle(document.body).backgroundColor
})
```

Expected（浅色）: `theme: "light"`、`bg: "rgb(253, 252, 248)"`

- [ ] **Step 5: 面包屑逐页核对**

对 Task 4 Step 5 表格中的 6 个 URL 执行该表达式，确认 `base` / `current` 与表格一致。

- [ ] **Step 6: 移动端走查**

```javascript
// Playwright: browser_resize({width:375, height:667}) 后再取
() => ({
  catListDisplay: getComputedStyle(document.querySelector('.cat-list')).display,
  gridCols: getComputedStyle(document.querySelector('.card-grid')).gridTemplateColumns.split(' ').length
})
```

在 `http://localhost:4000/nav/` 上执行。

Expected: `catListDisplay: "flex"`（横向胶囊）、`gridCols: 1`（单列）

- [ ] **Step 7: 提交（仅当 Step 1-6 有代码改动需要提交时）**

```bash
git status --short
```

若工作区只显示本任务涉及的文件（`source/nav/`、`themes/latex-minimal/`），逐个路径添加后提交：

```bash
git add source/nav themes/latex-minimal
git commit -m "fix(导航):端到端验证发现的问题"
```

仓库里另有若干与本任务无关的未跟踪文章（`source/_posts/browser-sub-agent-*.md` 等），**不要**用无路径的 `git add -A`，否则会被一并提交。若 `git status --short` 里出现这些文件，说明暂存范围有误，改用上面的显式路径。

---

## 完成标准

- `npx hexo clean && npx hexo generate` 后 `public/nav/` 下四个文件齐全，`public/nav/README/` 不存在
- `https://shuai-blog.pages.dev/nav/` 可访问，搜索、分类、标签筛选、hash 同步全部正常
- 博客顶部菜单有「导航」项，指向 `/nav/`
- 面包屑：首页 `~/blog`、关于 `~/blog/about`、作品集 `~/blog/projects`、标签 `~/blog/tags`、导航 `~/blog/nav`、文章页 `~/blog`
- 博客与导航页共享同一主题偏好，切换后无深色闪烁
- 仓库根的 `nav/` 目录已删除，内容唯一副本在 `source/nav/`
- 维护文档在 `NAV.md`

## 不做

- 不改导航页的配色、字体、卡片、侧栏、搜索、标签筛选行为
- 不为文章页、归档页做更细的面包屑层级
- 不把 `source/nav/data/sites.js` 改成 JSON + fetch（保持 `window.SITES` 方式）
- 不引入测试框架（本项目无测试基建，验证靠构建断言 + 浏览器断言）
