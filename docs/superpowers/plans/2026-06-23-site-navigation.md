# 网站导航与多页面实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 LaTeX 极简主题添加顶部水平导航 + 关于/作品集/标签 3 个新页面,移动端折叠为全屏浮层汉堡菜单。

**Architecture:** 导航数据与作品集数据集中在主题 `_config.yml`,通过 NJK 模板渲染到 `header.njk` 与新 `projects.njk`。活动页用 `aria-current="page"` + accent 色下划线标示(纯 CSS)。移动端用 JS 控制汉堡开关,辅以 `<details>` 降级。视觉验证全程使用 Playwright 截图。

**Tech Stack:** Hexo 7.x、Nunjucks 模板、原生 CSS(Grid + `:has()` 备选)、原生 JS(无依赖)、Playwright MCP(视觉验证)

---

## 文件结构

| 文件 | 状态 | 职责 |
|---|---|---|
| `themes/latex-minimal/_config.yml` | 改 | 集中维护 `nav` 数组 + `projects` 数组 |
| `themes/latex-minimal/layout/partial/header.njk` | 改 | 渲染 logo + nav + 汉堡按钮 + 主题切换 |
| `themes/latex-minimal/layout/projects.njk` | 新建 | 渲染作品集卡片网格(从 `theme.projects` 读) |
| `themes/latex-minimal/source/css/style.css` | 改 | 末尾追加 `/* ---- Navigation ---- */` 区段 |
| `themes/latex-minimal/source/js/main.js` | 改 | 末尾追加汉堡开关模块 |
| `source/about/index.md` | 新建 | 关于页(占位内容,用户后续填) |
| `source/projects/index.md` | 新建 | 触发 `projects.njk` 模板 |
| `source/tags/index.md` | 新建 | `type: tags` 触发 tag.njk 聚合 |

**职责边界**:每个文件只做一件事;nav 数据只从 `theme.nav` 读,projects 数据只从 `theme.projects` 读,不互相耦合。

---

## Task 1: 在主题 _config.yml 中定义 nav 与 projects 数据

**Files:**
- Modify: `themes/latex-minimal/_config.yml`

- [ ] **Step 1: 在文件最顶部(已有 `header:` 之前)插入 nav 配置块**

打开 `themes/latex-minimal/_config.yml`,在 `# Site header` 注释**之前**插入:

```yaml
# Top navigation (rendered in header.njk)
nav:
  - label: 首页
    url: /
  - label: 关于
    url: /about/
  - label: 作品集
    url: /projects/
  - label: 标签
    url: /tags/

# Site header
header:
```

- [ ] **Step 2: 在文件最末尾追加 projects 数组**

打开同文件,在末尾追加:

```yaml

# Projects (rendered in projects.njk)
projects:
  - name: 校园招聘管理平台
    desc: 独立开发的校内招聘信息聚合与投递管理 Web 应用
    tags: [Vue3, Node.js, MySQL]
    repo: <填写 GitHub 仓库地址>
  - name: Gitea + Woodpecker CI/CD
    desc: 私有化部署的代码托管与持续集成流水线
    tags: [Gitea, Woodpecker, Docker]
    repo: <填写 GitHub 仓库地址>
  - name: 个人博客(本站)
    desc: 基于 Hexo 自定义 LaTeX 极简主题
    tags: [Hexo, Nunjucks, CSS]
    repo: <填写 GitHub 仓库地址>
```

- [ ] **Step 3: 验证 YAML 语法合法**

Run:
```bash
cd "C:/Users/c215/Documents/Visual Studio Code/MarkDown/personalWeb/hexo-blog"
npx hexo clean
```
Expected: 退出码 0,无 YAML 解析报错。

- [ ] **Step 4: 提交**

Run:
```bash
git add themes/latex-minimal/_config.yml
git commit -m "feat(theme): add nav and projects config blocks"
```

---

## Task 2: 改造 header.njk,渲染桌面 nav + 汉堡按钮

**Files:**
- Modify: `themes/latex-minimal/layout/partial/header.njk`

- [ ] **Step 1: 完整重写 header.njk**

将 `themes/latex-minimal/layout/partial/header.njk` 全部内容替换为:

```njk
<a href="#main-content" class="skip-link">跳转到内容</a>

<header class="site-header">
  <div class="header-inner">
    <a href="{{ url_for('/') }}" class="site-title">{{ theme.header.title | default(config.title) }}</a>

    {% if theme.nav and theme.nav.length > 0 %}
    <nav class="nav" aria-label="主导航">
      <ul class="nav-list" id="navList">
        {% for item in theme.nav %}
        {% set isActive = (item.url === '/' and is_home()) or (item.url !== '/' and page.path and page.path.indexOf(item.url.replace('/', '')) === 0) %}
        <li class="nav-item">
          <a href="{{ url_for(item.url) }}"
             class="nav-link{% if isActive %} is-active{% endif %}"
             {% if isActive %}aria-current="page"{% endif %}>{{ item.label }}</a>
        </li>
        {% endfor %}
      </ul>
    </nav>
    {% endif %}

    <div class="header-actions">
      <button class="nav-toggle" id="navToggle"
              aria-expanded="false"
              aria-controls="navPanel"
              aria-label="打开导航菜单">
        <svg class="nav-toggle-icon nav-toggle-icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="4" y1="7" x2="20" y2="7"/>
          <line x1="4" y1="12" x2="20" y2="12"/>
          <line x1="4" y1="17" x2="20" y2="17"/>
        </svg>
        <svg class="nav-toggle-icon nav-toggle-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="6" y1="6" x2="18" y2="18"/>
          <line x1="18" y1="6" x2="6" y2="18"/>
        </svg>
      </button>
      <button class="theme-toggle" id="themeToggle" aria-label="切换明暗主题" title="切换主题 (Ctrl+Shift+T)">&#9789;</button>
    </div>
  </div>

  {% if theme.nav and theme.nav.length > 0 %}
  <div class="nav-panel" id="navPanel" hidden>
    <ul class="nav-panel-list">
      {% for item in theme.nav %}
      <li class="nav-panel-item">
        <a href="{{ url_for(item.url) }}"
           class="nav-panel-link{% if (item.url === '/' and is_home()) or (item.url !== '/' and page.path and page.path.indexOf(item.url.replace('/', '')) === 0) %} is-active{% endif %}">{{ item.label }}</a>
      </li>
      {% endfor %}
    </ul>
  </div>
  {% endif %}
</header>
```

- [ ] **Step 2: 验证构建成功**

Run:
```bash
cd "C:/Users/c215/Documents/Visual Studio Code/MarkDown/personalWeb/hexo-blog"
npx hexo generate
```
Expected: `INFO Generated: ...` 多行,无 Nunjucks 错误。如果报 `isActive` 相关错误,检查 `is_home()` 调用需在 generate 阶段(不是仅 server 阶段),如仍失败改用 `page.path` 简单判断。

- [ ] **Step 3: 启动本地 server,在浏览器查看首页头部**

启动后台 server:
```bash
cd "C:/Users/c215/Documents/Visual Studio Code/MarkDown/personalWeb/hexo-blog"
npx hexo server --port 4000
```
然后用 Playwright MCP:
- `browser_navigate` → `http://localhost:4000/`
- `browser_snapshot` 检查 `.nav` 元素出现,包含 4 个 `.nav-link`(首页/关于/作品集/标签)
- `browser_take_screenshot` 保存为 `screenshots/02-header-desktop.png`

Expected: 截图能看到顶部水平排的 4 个导航项,"首页" 因 `aria-current="page"` 文字色与其他 3 项不同。

- [ ] **Step 4: 提交**

```bash
git add themes/latex-minimal/layout/partial/header.njk
git commit -m "feat(theme): render top nav and hamburger button in header"
```

---

## Task 3: 添加桌面端 nav CSS 样式

**Files:**
- Modify: `themes/latex-minimal/source/css/style.css`(在文件末尾追加)

- [ ] **Step 1: 在 style.css 末尾追加 `/* ---- Navigation ---- */` 区段**

打开 `themes/latex-minimal/source/css/style.css`,跳到文件末尾,粘贴:

```css
/* ---- Navigation ---- */
.nav {
  flex: 1;
  display: flex;
  justify-content: center;
}
.nav-list {
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav-item { margin: 0; }
.nav-link {
  font-family: var(--font-serif);
  font-size: 1rem;
  letter-spacing: 0.02em;
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.25rem 0;
  border-bottom: 1px solid transparent;
  transition: color 180ms ease, border-color 180ms ease;
}
.nav-link:hover { color: var(--text); }
.nav-link.is-active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

/* Hamburger button (mobile + desktop placeholder) */
.nav-toggle {
  display: none;
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: color var(--transition), border-color var(--transition);
}
.nav-toggle:hover { color: var(--accent); border-color: var(--accent); }
.nav-toggle-icon { width: 18px; height: 18px; }
.nav-toggle-icon-close { display: none; }
.nav-toggle[aria-expanded="true"] .nav-toggle-icon-open { display: none; }
.nav-toggle[aria-expanded="true"] .nav-toggle-icon-close { display: block; }

/* Panel (hidden by default, mobile will override) */
.nav-panel { display: none; }
.nav-panel-list { list-style: none; margin: 0; padding: 0; }

/* ---- Mobile Navigation ---- */
@media (max-width: 768px) {
  .nav { display: none; }
  .nav-toggle { display: flex; }
  .nav-panel {
    display: block;
    position: fixed;
    inset: 0;
    background: var(--bg);
    opacity: 0;
    visibility: hidden;
    transition: opacity 200ms ease, visibility 200ms ease;
    z-index: 200;
  }
  .nav-panel:not([hidden]) {
    opacity: 1;
    visibility: visible;
  }
  .nav-panel[hidden] { display: none; }
  .nav-panel-list {
    height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  }
  .nav-panel-link {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    color: var(--text-muted);
    text-decoration: none;
    padding: 0.5rem 1rem;
    transition: color 180ms ease;
  }
  .nav-panel-link:hover,
  .nav-panel-link.is-active {
    color: var(--accent);
  }
}
```

- [ ] **Step 2: 硬刷新浏览器,验证桌面 nav 视觉**

Playwright MCP 操作:
- `browser_navigate` → `http://localhost:4000/`(已是当前页则先 `browser_press_key` F5 或新 navigate)
- `browser_take_screenshot` 保存为 `screenshots/03-nav-desktop.png`
- 检查截图:4 项水平居中,"首页" 下划线 + 米橙色,其他 3 项为灰色 muted

- [ ] **Step 3: 验证活动指示在非首页时也工作**

- `browser_navigate` → `http://localhost:4000/about/`
- `browser_snapshot` 检查"关于" 链接含 `aria-current="page"` 且 `class="nav-link is-active"`
- `browser_take_screenshot` 保存为 `screenshots/03-nav-about-active.png`

Expected: 此时"首页" 不再有下划线,转给"关于"。

- [ ] **Step 4: 提交**

```bash
git add themes/latex-minimal/source/css/style.css
git commit -m "feat(theme): desktop nav styles with active underline"
```

---

## Task 4: 实现汉堡开关的 JS(展开/收起 + Esc + 焦点)

**Files:**
- Modify: `themes/latex-minimal/source/js/main.js`(在 `})();` 之前追加)

- [ ] **Step 1: 在 main.js 末尾 `})();` 之前插入汉堡模块**

打开 `themes/latex-minimal/source/js/main.js`,在最后一个 `})();` **之前**插入:

```javascript
  // ---- Mobile Nav Toggle ----
  var navToggle = document.getElementById('navToggle');
  var navPanel = document.getElementById('navPanel');

  function openNav() {
    if (!navToggle || !navPanel) return;
    navPanel.hidden = false;
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', '关闭导航菜单');
    var firstLink = navPanel.querySelector('.nav-panel-link');
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    if (!navToggle || !navPanel) return;
    navPanel.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', '打开导航菜单');
    navToggle.focus();
  }

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeNav(); else openNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
      }
    });
  }
```

- [ ] **Step 2: 桌面视口下不应看到汉堡(只有主题切换可见)**

Resize 到桌面 1280×800:
- `browser_resize` → 1280, 800
- `browser_navigate` → `http://localhost:4000/`
- `browser_take_screenshot` 保存为 `screenshots/04-desktop-no-hamburger.png`
- 用 `browser_snapshot` 或 `browser_evaluate` 检查 `.nav` 可见、`.nav-toggle` 不可见(检查 `display: none`)

```javascript
() => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  return {
    navVisible: nav && getComputedStyle(nav).display !== 'none',
    toggleVisible: toggle && getComputedStyle(toggle).display !== 'none'
  };
}
```
Expected: `{navVisible: true, toggleVisible: false}`

- [ ] **Step 3: 提交**

```bash
git add themes/latex-minimal/source/js/main.js
git commit -m "feat(theme): mobile hamburger toggle with esc and focus mgmt"
```

---

## Task 5: 验证移动端汉堡(展开/收起/键盘)

**Files:**(本任务无代码改动,仅视觉验证)

- [ ] **Step 1: 切到移动视口,验证折叠态**

```javascript
browser_resize → 375, 667  // iPhone SE 尺寸
browser_navigate → http://localhost:4000/
browser_take_screenshot → screenshots/05-mobile-collapsed.png
```
Expected: 截图显示 logo + 主题切换 + 汉堡按钮(三条线),无水平 nav 列表。

- [ ] **Step 2: 点击汉堡,验证展开态**

```javascript
browser_click(element="汉堡按钮", target="#navToggle")
browser_take_screenshot → screenshots/05-mobile-expanded.png
```
Expected: 全屏浮层覆盖,链接纵向居中(首页/关于/作品集/标签),"首页" 为 accent 色。

- [ ] **Step 3: 验证 Esc 关闭 + 焦点回按钮**

```javascript
browser_press_key → Escape
browser_take_screenshot → screenshots/05-mobile-after-esc.png
browser_evaluate → () => ({
  panelHidden: document.getElementById('navPanel').hidden,
  toggleExpanded: document.getElementById('navToggle').getAttribute('aria-expanded'),
  activeElementId: document.activeElement.id
})
```
Expected: `{panelHidden: true, toggleExpanded: "false", activeElementId: "navToggle"}`

- [ ] **Step 4: 提交(无代码改动时跳过)**

若 Step 1-3 全通过,无需 commit;若发现 Task 4 漏了某逻辑,回到 Task 4 修补后重新跑 Step 1-3。

---

## Task 6: 新建 projects.njk 模板

**Files:**
- Create: `themes/latex-minimal/layout/projects.njk`

- [ ] **Step 1: 创建文件**

新建 `themes/latex-minimal/layout/projects.njk`,内容:

```njk
{% extends "base.njk" %}

{% block content %}
<section class="container" style="padding-top: 3rem; padding-bottom: 3rem;">
  <h1 class="hero-name" style="text-align: center; margin-bottom: 2rem;">作品集</h1>

  {% if theme.projects and theme.projects.length > 0 %}
  <ul class="project-list">
    {% for project in theme.projects %}
    <li class="project-card">
      <h2 class="project-name">{{ project.name }}</h2>
      <p class="project-desc">{{ project.desc }}</p>
      {% if project.tags and project.tags.length > 0 %}
      <div class="project-tags">
        {% for tag in project.tags %}<span class="project-tag">{{ tag }}</span>{% endfor %}
      </div>
      {% endif %}
      <div class="project-links">
        {% if project.repo %}<a href="{{ project.repo }}" class="project-link" target="_blank" rel="noopener">GitHub</a>{% endif %}
        {% if project.demo %}<a href="{{ project.demo }}" class="project-link" target="_blank" rel="noopener">Demo</a>{% endif %}
      </div>
    </li>
    {% endfor %}
  </ul>
  {% else %}
  <p style="text-align: center; color: var(--text-muted);">暂无项目</p>
  <div style="text-align: center; margin-top: 2rem;">
    <a href="{{ url_for('/') }}" class="article-action-link">&larr; 回到首页</a>
  </div>
  {% endif %}
</section>
{% endblock %}
```

- [ ] **Step 2: 在 style.css 末尾追加项目卡片样式**

追加到 `themes/latex-minimal/source/css/style.css` 末尾:

```css
/* ---- Projects ---- */
.project-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 640px) {
  .project-list { grid-template-columns: repeat(2, 1fr); }
}
.project-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  transition: border-color var(--transition);
}
.project-card:hover { border-color: var(--accent); }
.project-name {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0 0 0.5rem;
  color: var(--text);
}
.project-desc {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 1rem;
}
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
}
.project-tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  background: var(--bg-code);
  color: var(--text-muted);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius);
}
.project-links { display: flex; gap: 1rem; }
.project-link {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--accent);
  text-decoration: none;
}
.project-link:hover { text-decoration: underline; }
```

- [ ] **Step 3: 提交**

```bash
git add themes/latex-minimal/layout/projects.njk themes/latex-minimal/source/css/style.css
git commit -m "feat(theme): projects page template and card styles"
```

---

## Task 7: 新建 source 下的 3 个页面 markdown

**Files:**
- Create: `source/about/index.md`
- Create: `source/projects/index.md`
- Create: `source/tags/index.md`

- [ ] **Step 1: 创建 source/about/index.md**

新建文件,内容:

```markdown
---
title: 关于我
date: 2026-06-23
---

## 教育背景

合肥师范学院 · 软件工程(本科)· 2026 届

## 技术栈

- 前端:Vue 3、TypeScript、CSS Grid / Flexbox
- 后端:Node.js、Express
- 工具链:Hexo、Git、Docker
- AI 工具:Claude、GitHub Copilot

## 项目经历

- 校园招聘管理平台(独立开发)
- Gitea + Woodpecker CI/CD 流水线(运维)
- 本站(Hexo 自定义主题)

## 联系我

见首页底部的"链接"区。
```

- [ ] **Step 2: 创建 source/projects/index.md**

新建文件,内容:

```markdown
---
title: 作品集
date: 2026-06-23
layout: projects
---
```

- [ ] **Step 3: 创建 source/tags/index.md**

新建文件,内容:

```markdown
---
title: 所有标签
date: 2026-06-23
type: tags
---
```

- [ ] **Step 4: 构建并视觉验证 3 个新页面**

```bash
cd "C:/Users/c215/Documents/Visual Studio Code/MarkDown/personalWeb/hexo-blog"
npx hexo clean && npx hexo generate
```
Expected: `INFO Generated: .../about/index.html`、`.../projects/index.html`、`.../tags/index.html` 都出现,无报错。

如果 server 还在跑,刷新浏览器即可;否则重启 `npx hexo server --port 4000`。

然后用 Playwright 依次访问 3 个 URL,各拍 1 张截图:
- `http://localhost:4000/about/` → `screenshots/07-about.png`
- `http://localhost:4000/projects/` → `screenshots/07-projects.png`
- `http://localhost:4000/tags/` → `screenshots/07-tags.png`

Expected:
- about 页:正常 page.njk 样式(因为 source/about/index.md 没有 `layout:` 字段,会落到 `page.njk`)
- projects 页:看到 3 张卡片网格,每张含名称/描述/tags/GitHub 按钮(因为示例数据 demo 字段空,所以不显示 Demo)
- tags 页:所有 18 个标签显示为链接

- [ ] **Step 5: 提交**

```bash
git add source/about/index.md source/projects/index.md source/tags/index.md
git commit -m "feat(content): add about, projects, and tags pages"
```

---

## Task 8: 端到端验收(spec §8 清单逐项打勾)

**Files:**(无代码改动,仅最终验证;若发现缺陷,回对应 Task 修补)

- [ ] **Step 1: 桌面端 4 项水平 + 活动下划线 + accent 色**

```javascript
browser_resize → 1280, 800
browser_navigate → http://localhost:4000/
browser_take_screenshot → screenshots/08-final-home-desktop.png
```
目视检查:
- [ ] 4 项水平排列
- [ ] "首页" 文字为米橙色
- [ ] "首页" 底部有 1px 下划线

- [ ] **Step 2: hover 平滑变色**

```javascript
browser_hover(element="关于链接", target=".nav-link:not(.is-active)")
```
目视:文字色从 muted 过渡到 text(180ms)。`browser_take_screenshot → 08-hover-about.png`

- [ ] **Step 3: 移动端汉堡折叠态 + 全屏浮层**

```javascript
browser_resize → 375, 667
browser_navigate → http://localhost:4000/
browser_take_screenshot → 08-mobile-collapsed.png
browser_click("#navToggle")
browser_take_screenshot → 08-mobile-expanded.png
```
目视:
- [ ] 折叠态只有 logo + 主题切换 + 汉堡
- [ ] 展开态全屏覆盖,链接纵向居中,字号 1.5rem

- [ ] **Step 4: Esc 关闭 + 焦点回到按钮**

```javascript
browser_press_key → Escape
browser_evaluate → () => document.activeElement.id
```
Expected: `"navToggle"`

- [ ] **Step 5: 暗/亮主题切换后 nav 颜色同步**

```javascript
browser_resize → 1280, 800
browser_click("#themeToggle")
browser_take_screenshot → 08-light-theme.png
browser_click("#themeToggle")  // 切回暗色
```
目视:nav 与汉堡面板颜色随主题切换正常

- [ ] **Step 6: 三个新页面 + 验收**

按 Task 7 截图复查:
- [ ] `/about/` 正常渲染
- [ ] `/projects/` 3 张卡片,无项目时显示占位文字(可在 _config.yml 暂时注释 projects 数组验证一次,验证完恢复)
- [ ] `/tags/` 所有标签可点

- [ ] **Step 7: Lighthouse 无障碍评分 ≥ 95**

```bash
npx lighthouse http://localhost:4000/ --only-categories=accessibility --chrome-flags="--headless" --output=json --output-path=screenshots/lighthouse.json
node -e "console.log(JSON.parse(require('fs').readFileSync('screenshots/lighthouse.json')).categories.accessibility.score)"
```
Expected: `>= 0.95`

若低于 0.95,用 `npx lighthouse ... --view` 看具体缺失项,常见缺失是 color-contrast,可在 style.css 调对应选择器。

- [ ] **Step 8: 最终 commit(若有修复)**

如 Step 1-7 发现问题并修复,运行:
```bash
git add -A
git commit -m "fix(theme): address e2e verification findings"
```

---

## 自审记录

**1. Spec 覆盖**:
- §1 背景目标 → Task 1(数据) + Task 2(header 渲染)
- §2.1 顶部水平 + A1 下划线 → Task 3(CSS)
- §2.2 视觉细节 → Task 3(CSS 全覆盖,含 font-size 1rem、accent 下划线、字距 0.02em、180ms 过渡)
- §2.3 移动端汉堡 + 全屏浮层 + a11y → Task 2(HTML aria-*)+ Task 4(JS)+ Task 5(验证)
- §2.4 配色变量复用 → Task 3(只用 var(--*))
- §3.1 nav 配置 → Task 1
- §3.2 projects 配置 + 卡片渲染规则 → Task 1 + Task 6
- §3.3 about 页 → Task 7
- §3.4 tags 页 → Task 7
- §3.5 移动端汉堡(JS + a11y)→ Task 4 + Task 5
- §4 文件清单 → 8 个 Task 全覆盖
- §5 组件边界 → 每个 Task 一文件,职责清晰
- §6 错误处理(Task 1 配置空 / Task 6 projects 空均有保护)→ 已含
- §7 a11y → Task 2/4 已埋点,Task 8 Step 7 验证
- §8 验收清单 → Task 8 全部勾选
- §9 YAGNI → 显式未做作品集二级页、搜索、多语言,符合 spec
- §10 风险 → Task 2 Step 2 `hexo generate` 验证 Nunjucks,Task 7 Step 4 验证 `hexo clean && generate`
- §11 实施顺序 → 数据→header→CSS→JS→projects→3 pages→e2e,与本 plan Task 1→8 一致

**2. Placeholder 扫描**:无"TBD/TODO/类似 Task N",每步代码完整。

**3. Type/命名一致性**:
- `navToggle` / `navPanel` 在 Task 2 HTML、Task 4 JS、Task 5 验证里同 ID
- `nav-link` / `nav-link.is-active` 在 Task 2 NJK、Task 3 CSS、Task 2 Step 3 验证同 class
- `aria-current="page"` 在 Task 2 NJK 与 §8 验收同关键词
- `.nav-panel-link.is-active` 移动端样式与桌面 `.nav-link.is-active` 视觉对齐