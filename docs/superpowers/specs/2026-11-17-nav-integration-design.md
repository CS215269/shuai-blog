# 网址导航整合进博客站点 —— 设计文档

日期：2026-11-17
状态：已确认，待实施

## 1. 目标

把仓库根目录的独立静态站 `nav/`（网址导航，201 条网址 / 12 个分类）整合进 hexo 博客站点，
使其能通过 `https://shuai-blog.pages.dev/nav/` 访问，并从博客顶部菜单进入。

**明确不做**：重新设计导航页。现有配色、字体、卡片、侧栏、搜索、标签筛选、URL hash 同步
全部原样保留，只解决"住进博客"这件事。

## 2. 关键决策

| 决策项 | 结论 | 理由 |
|---|---|---|
| 页面外壳 | 保留 nav 自己的紧凑 header（带搜索框） | 导航页是宽屏密集网格工具，博客的 720px 窄栏装不下；用户已确认不重做设计 |
| 访问路径 | `/nav/` | 语义清晰，与 `/{about,projects,tags}/` 并列 |
| 旧目录 `nav/` | 删除，内容平移进 `source/` | 仓库只保留一份，避免双份同步维护 |
| 集成机制 | `source/nav/` 平移 + front matter `layout: false` | 页面保持单文件自包含，零主题耦合，Hexo 构建流程不变 |
| 主题一致性 | 导航页 localStorage key 改为 `theme`，与博客 `main.js` 统一 | 用户在博客切浅色，导航页应同步；否则两个站点主题状态不一致 |
| 面包屑 | 栏目页显示子目录，文章页只显示 `~/blog`；前缀弱化色、当前段强调色 | 用户要求路径风格必须准确、符合文件系统直觉；`~/nav` 已是错误路径 |
| 返回路径 | 由面包屑基座 `~/blog` 承担，不另加「← 博客」链接 | 面包屑基座即返回入口，避免两套回退控件 |

## 3. 方案选型

三个候选机制：

- **方案 A（采用）**：`source/nav/` 整体平移，`index.html` 加 front matter `layout: false`。
  Hexo 的 page 生成器对 `layout` 为假值的页面直接输出 `page.content`，页面内容原样落盘。
- 方案 B：新增主题布局 `themes/latex-minimal/layout/nav.njk` 提供页面外壳，内容留在 `source/`。
  优势是 `data-theme` 默认值可跟随 `theme.dark_mode_default` 配置；代价是页面被拆到两处、
  多一个主题布局文件。当前 `dark_mode_default: true`，方案 A 硬编码 `dark` 等价。
- 方案 C：保留 `nav/` 在根目录，构建时复制。**否决** —— 需要改 Cloudflare Pages 构建命令，
  破坏"零构建"。

### 3.1 Hexo 处理机制（已核实）

- Hexo 内置 `plain` 渲染器注册了 `html` / `js` / `css` 扩展名，均原样输出内容。
- `processor/asset.js` 中：渲染输出扩展名非 `html`/`htm` 时，页面 `layout` 自动置为 `false`，
  因此 `source/` 下的 `.js` / `.css` 会被原样拷贝到 `public/`。
- `.html` 默认套用主题 `page` 布局，但 `generator/page.js` 判断
  `if (!layout || layout === 'false' || layout === 'off')` 时直接输出 `page.content`，
  故 front matter 显式写 `layout: false` 可达到同样效果。
- front matter 会从 `page.content` 中剥离（`source/about/index.html` 的生成结果已验证）。

### 3.2 路径

导航页内部全部使用相对路径（`assets/style.css`、`data/sites.js`、`assets/app.js`），
平移后无需任何路径改写。

### 3.3 面包屑取值规则（已实测）

当前段由主题 `nav` 配置驱动，而非硬编码路径表：取第一个 `url` 非 `/` 且
`page.path` 以该段开头的菜单项。

```
page.path                      → 当前段
index.html                     → （空）显示 ~/blog
about/index.html               → about
projects/index.html            → projects
tags/index.html                → tags
tags/CSS/index.html            → tags
2026/06/01/hello-world/…       → （空）显示 ~/blog
nav/index.html                 → nav
```

标签详情页归入 `tags` 栏目、归档页与文章页显示 `~/blog`，符合"栏目页显示子目录，
文章页不变"。规则随 `nav` 配置自动扩展，新增栏目无需改模板。

Nunjucks 已实测支持：`{% set %}` 在 for 循环内赋值可带出循环外；
`item.url.replace('/', '').replace('/', '')` 可从 `/about/` 得到 `about`。

## 4. 改动清单

### 4.1 文件移动（`git mv` 保留历史）

```
nav/index.html        → source/nav/index.html
nav/assets/style.css  → source/nav/assets/style.css
nav/assets/app.js     → source/nav/assets/app.js
nav/data/sites.js     → source/nav/data/sites.js
nav/README.md         → NAV.md（仓库根）
```

`nav/` 目录随之删除。

`nav/README.md` 移出 `source/` 的原因：`.md` 会被 hexo-renderer-marked 渲染成页面，
发布到 `/nav/README/` 公开路径。放仓库根则只进 git、不进站点。

### 4.2 `source/nav/index.html`

1. 文件顶部加 front matter：

   ```
   ---
   title: 网址导航
   layout: false
   ---
   ```

2. `<link rel="stylesheet" href="assets/style.css">` 之前插入防 FOUC 脚本，
   与 `themes/latex-minimal/layout/partial/head.njk` 中的同一段一致：

   ```html
   <script>
   (function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();
   </script>
   ```

3. `<html lang="zh-CN" data-theme="dark">` 保持不变（首次访问默认深色，与博客一致）。

4. 品牌区由 `~/nav` 改为面包屑 `~/blog/nav`。现有结构：

   ```html
   <div class="brand">
     <a class="site-title" href="./">~/nav</a>
     <p class="site-subtitle" id="subtitle">加载中…</p>
   </div>
   ```

   改为：

   ```html
   <div class="brand">
     <span class="site-title">
       <a href="/" class="crumb-base">~/blog</a><span class="crumb-sep">/</span><span class="crumb-current">nav</span>
     </span>
     <p class="site-subtitle" id="subtitle">加载中…</p>
   </div>
   ```

   `crumb-base` 指向站点根 `/`，即返回博客的入口。

### 4.3 `source/nav/assets/app.js`

localStorage key 从 `nav-theme` 改为 `theme`，共两处：

- 读取：`localStorage.getItem("nav-theme")` → `localStorage.getItem("theme")`
- 写入：`localStorage.setItem("nav-theme", next)` → `localStorage.setItem("theme", next)`

改后导航页与博客共享同一主题偏好：任一处切换，另一处刷新即生效。

### 4.4 博客主题面包屑

`themes/latex-minimal/layout/partial/header.njk`：

1. 在 `<nav>` 之前算出当前段：

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

   该判断与文件中已有的 `isActive` 高亮逻辑同源，保证"高亮的菜单项"与"面包屑当前段"一致。

2. 标题由

   ```html
   <a href="{{ url_for('/') }}" class="site-title">{{ theme.header.title | default(config.title) }}</a>
   ```

   改为

   ```njk
   <span class="site-title">
     <a href="{{ url_for('/') }}" class="crumb-base">{{ theme.header.title | default(config.title) }}</a>{% if crumbSeg %}<span class="crumb-sep">/</span><span class="crumb-current">{{ crumbSeg }}</span>{% endif %}
   </span>
   ```

`themes/latex-minimal/source/css/style.css` 中 `.site-title` 一组规则改为：

```css
.site-title { font-size: 1.15rem; font-weight: 600; color: var(--text-muted); text-decoration: none; letter-spacing: -0.01em; }
.crumb-base { color: var(--text-muted); }
.crumb-base:hover { color: var(--accent); }
.crumb-sep { color: var(--text-faint); padding: 0 .15em; }
.crumb-current { color: var(--accent); }
```

原 `.site-title:hover { color: var(--accent); }` 由 `.crumb-base:hover` 承担。

`source/nav/assets/style.css` 同步补一份等价规则（该页不加载博客的 style.css，
两份样式需各自维护，见第 7 节）。

### 4.5 `themes/latex-minimal/_config.yml`

nav 列表末尾追加：

```yaml
  - label: 导航
    url: /nav/
```

`header.njk` 的高亮判断为
`page.path.indexOf(item.url.replace('/', '')) === 0`，对 `/nav/` 求值得 `"nav/"`，
导航页自身路径为 `nav/index.html`，前缀匹配成立。其它页面不受影响。

### 4.6 `NAV.md`

从 `nav/README.md` 平移而来，内部路径描述需更新：

- 数据文件位置 `data/sites.js` → `source/nav/data/sites.js`
- "直接双击 `index.html` 就能打开" → 改为经博客访问 `https://shuai-blog.pages.dev/nav/`
- 目录结构树同步更新

## 5. 不在范围内

- 导航页的视觉设计、配色、字体、卡片样式
- 搜索、分类切换、标签筛选、URL hash 同步的现有行为
- 博客主题的 header / footer / 导航菜单结构
- 文章页、归档页、标签详情页的面包屑细分（按第 2 节粒度约定，文章页只显示 `~/blog`）
- 把 201 条网址的数据结构重新设计（`{t, u, g}` 格式保持）
- 副标题的数量统计已改为运行时计算（本次改动前的独立任务），不重复处理

## 6. 验证

1. `npx hexo clean && npx hexo generate`
   - `public/nav/index.html` 存在，且内容为完整 HTML 文档（front matter 已剥离）
   - `public/nav/assets/style.css`、`public/nav/assets/app.js`、`public/nav/data/sites.js` 均存在
   - `public/nav/README/` **不存在**（README 未被发布）
2. `npx hexo server` 浏览器走查 `/nav/`：
   - 页面正常渲染，侧栏 12 个分类、卡片网格、标签条齐全
   - 搜索框输入关键词能过滤，`/` 聚焦、`Esc` 清空
   - 点击分类切换、点击标签叠加筛选，地址栏 hash 同步
   - 底部统计显示 201 条 / 12 个分类
3. 主题切换跨页同步：
   - 博客首页切浅色 → 访问 `/nav/` 应直接是浅色，无深色闪烁
   - 导航页切浅色 → 回博客首页刷新，应为浅色
4. 顶部菜单「导航」项可跳转 `/nav/`
5. 面包屑逐页核对：
   - 首页 `~/blog`；关于 `~/blog/about`；作品集 `~/blog/projects`；标签 `~/blog/tags`；
     导航 `~/blog/nav`；文章页 `~/blog`；标签详情页 `~/blog/tags`
   - 前缀为弱化色、当前段为强调色
   - 导航页点击 `~/blog` 回到博客首页
6. 移动端 375px 宽度下走查：侧栏变横向胶囊、搜索框占满、卡片网格单列

## 7. 已知取舍

- 导航页的 `data-theme` 默认值硬编码为 `dark`，不跟随主题配置的 `dark_mode_default`。
  当前配置为 `true`，行为一致；若日后改动该配置，需同步修改 `source/nav/index.html` 一行。
- 导航页不显示博客顶部菜单，因此博客菜单里没有"当前在导航页"的高亮态——
  这是保留独立 header 的必然结果。
- 面包屑样式规则在 `themes/latex-minimal/source/css/style.css` 与
  `source/nav/assets/style.css` 中各存一份。导航页不加载博客的 style.css（两份都定义了
  `html`/`body`/`.site-header` 等基础规则，同时加载会冲突），故只能重复。
