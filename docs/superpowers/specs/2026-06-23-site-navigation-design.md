# 网站导航与多页面设计

**日期**: 2026-06-23
**主题**: LaTeX Minimal (Hexo 自定义)
**状态**: 设计稿(待审阅)

## 1. 背景与目标

当前 `latex-minimal` 主题的 `header.njk` 只渲染 logo (`~/blog`) 与主题切换按钮,没有任何导航入口。用户希望在保持现有 LaTeX 极简风格的前提下,为以下 4 个顶层页面提供统一导航:

- 首页 `/`(已有)
- 关于 `/about/`(新建独立页,把原首页"关于我"区块拆分并扩充)
- 作品集 `/projects/`(新建,展示个人项目)
- 标签 `/tags/`(新建聚合页,点击进入各 tag 列表)

归档页 `/archives/` 不进顶导,但保留可访问(已存在 `archive.njk`),后续若需露出可放在 footer 或作为「更多」下拉项。本次不实现该入口。

## 2. 设计方案

### 2.1 导航形式:顶部水平导航 + A1 下划线活动指示

桌面端:`logo —— 居中导航项 —— 主题切换` 的三段 grid 布局。
移动端 (≤768px):导航折叠为汉堡按钮,点击展开全屏浮层。

活动项通过 `aria-current="page"` + 底部 1px accent 色下划线标示(纯 CSS,无 JS)。

### 2.2 视觉细节

| 属性 | 值 |
|---|---|
| 字体 | `var(--font-serif)`(与正文统一) |
| 字号 | `1rem`(用户确认) |
| 默认色 | `var(--text-muted)` |
| Hover 色 | `var(--text)` |
| 活动色 + 下划线 | `var(--accent)` + `border-bottom: 1px solid` |
| 字距 | `letter-spacing: 0.02em` |
| 过渡 | `color 180ms ease, border-color 180ms ease` |
| 布局 | `grid-template-columns: auto 1fr auto` |
| 中间列对齐 | `justify-content: center` |

### 2.3 移动端(≤768px)

- 汉堡按钮用三条线 SVG,出现在主题切换旁
- 展开后**全屏浮层**,背景 `var(--bg)` 95% 不透明,链接纵向居中,字号 `1.5rem`
- 高度用 `100dvh`(动态视口,避免键盘弹起错位)
- 实现:有 JS 时用 `.is-open` class + `max-height` 过渡;禁用 JS 时降级为 `<details>/<summary>`,天然可开关
- 无障碍:按钮 `aria-expanded`、`aria-controls`;面板 `id="navPanel"`;`Esc` 关闭并把焦点送回按钮

### 2.4 配色变量复用

不引入新 CSS 变量,完全复用现有深/亮主题变量:

- `--bg`、`--text`、`--text-muted`、`--accent`、`--accent-dim`、`--border`
- 主题切换时 nav 与汉堡浮层颜色自动同步

## 3. 配置与数据驱动

### 3.1 主题 `_config.yml` 新增字段

```yaml
# 顶部导航
nav:
  - label: 首页
    url: /
  - label: 关于
    url: /about/
  - label: 作品集
    url: /projects/
  - label: 标签
    url: /tags/

# 作品集卡片(实际值由用户填,以下为结构示例)
projects:
  - name: 校园招聘管理平台
    desc: 独立开发的校内招聘信息聚合与投递管理 Web 应用
    tags: [Vue3, Node.js, MySQL]
    repo: <填写 GitHub 仓库地址>
    demo: <填写演示地址,可省略>
  - name: Gitea + Woodpecker CI/CD
    desc: 私有化部署的代码托管与持续集成流水线
    tags: [Gitea, Woodpecker, Docker]
    repo: <填写 GitHub 仓库地址>
  - name: 个人博客(本站)
    desc: 基于 Hexo 自定义 LaTeX 极简主题
    tags: [Hexo, Nunjucks, CSS]
    repo: <填写 GitHub 仓库地址>
```

**数据驱动原则**:导航与项目列表都集中在主题 `_config.yml`,新增/修改入口只改 yaml,不动模板。

### 3.2 卡片渲染规则(`projects.njk`)

| 字段 | 必填 | 渲染行为 |
|---|---|---|
| `name` | 是 | 卡片标题 |
| `desc` | 是 | 描述段落 |
| `tags` | 否 | 渲染为 chip,无则不显示该区域 |
| `repo` | 否 | GitHub 图标按钮,无则不显示 |
| `demo` | 否 | 演示链接图标按钮,无则不显示 |

无封面图,纯文字卡片,贴合 LaTeX 风。

## 4. 文件改动清单

| 文件 | 类型 | 内容 |
|---|---|---|
| `themes/latex-minimal/_config.yml` | 改 | 加 `nav` + `projects` 数组 |
| `themes/latex-minimal/layout/partial/header.njk` | 改 | 渲染 nav + 汉堡按钮 |
| `themes/latex-minimal/layout/projects.njk` | 新建 | 作品集卡片网格 |
| `themes/latex-minimal/source/css/style.css` | 改 | 末尾新增 `/* ---- Navigation ---- */` 区段 |
| `themes/latex-minimal/source/js/main.js` | 改 | 汉堡展开/收起 + `Esc` 监听 |
| `source/about/index.md` | 新建 | 关于页正文(用户后续填) |
| `source/projects/index.md` | 新建 | 5 行 front-matter + 空正文 |
| `source/tags/index.md` | 新建 | `type: tags` 触发 tag.njk 模板 |

站点根 `_config.yml` 不动。

## 5. 组件边界

| 组件 | 输入 | 输出 | 职责 |
|---|---|---|---|
| `header.njk` | `theme.nav` + 当前 URL | 顶部条 HTML | 渲染 logo / nav / 主题切换 / 汉堡按钮 |
| `projects.njk` | `theme.projects` | 卡片网格 HTML | 渲染作品集卡片 |
| `style.css .nav-*` | — | 样式 | 桌面水平排 / 移动汉堡 / 活动下划线 |
| `main.js` 汉堡模块 | 汉堡点击事件 | CSS 类切换 | 控制折叠状态 + 焦点管理 |

每个文件改一件事,nav 数据只来自 `theme.nav`,避免在 NJK 里硬编码链接。

## 6. 错误处理与边界

| 场景 | 处理 |
|---|---|
| `theme.nav` 未配置 / 为空 | 不渲染 `<nav>`,降级为只显示 logo + 主题切换 |
| `theme.projects` 为空 | `/projects/` 显示"暂无项目" + 返回首页链接 |
| 当前页不在 nav 列表(如分页) | 无活动项高亮,nav 仍正常显示 |
| `/about/` 源文件缺失 | Hexo 构建期 404(标准处理,前端不兜) |
| 移动端键盘弹起导致高度异常 | 使用 `100dvh` 而非 `100vh` |
| 主题切换时汉堡面板颜色 | 继承 CSS 变量自动同步,无需额外逻辑 |
| JS 禁用 | `<details>/<summary>` 降级,汉堡仍可开关 |
| 极窄屏 (<360px) | 允许 nav 链接换行,字号不缩 |

## 7. 无障碍承诺

- nav 语义: `<nav aria-label="主导航">`
- 活动项: `aria-current="page"`
- 汉堡按钮: `aria-expanded="false/true"` + `aria-controls="navPanel"`
- 面板: `id="navPanel"` 与按钮对应
- 焦点管理: 打开时焦点到第一项,关闭时回到按钮,`Esc` 关闭
- 颜色对比: `--text-muted` on `--bg` 已通过 WCAG AA(深色模式 ≈ 5.4:1)

## 8. 验收清单

- [ ] 桌面端 4 项水平排列,活动项下划线 + accent 色
- [ ] 鼠标 hover 平滑变色(180ms)
- [ ] 移动端 ≤768px 自动折叠为汉堡按钮
- [ ] 汉堡点击展开全屏浮层,字号 1.5rem,纵向居中
- [ ] `Esc` 关闭汉堡,焦点回到按钮
- [ ] 禁用 JS 时仍能开关汉堡
- [ ] `/about/` 渲染正常,样式与现有 page 一致
- [ ] `/projects/` 卡片网格,无项目时显示占位文字
- [ ] `/tags/` 显示所有标签,点击进入对应 tag 列表
- [ ] 暗/亮主题切换正常,nav 与汉堡颜色同步
- [ ] Chrome / Firefox / Edge / Safari 最新版视觉一致
- [ ] Lighthouse 无障碍评分 ≥ 95

## 9. 显式不做(YAGNI)

- 搜索框 / 全站搜索
- 多语言切换
- nav 项图标(保持纯文字)
- 作品集封面图
- 项目二级详情页(`/projects/<slug>/`)
- 标签云(用现有 `tag.njk` 简单列表)
- 自动化测试(Vitest/Jest 等);验收靠手测 + Lighthouse

## 10. 风险提示

- Hexo 缓存: `hexo clean` 可能影响现有 `page.njk`;若遇样式异常先清缓存
- Nunjucks 转义: `{{ nav.label }}` 默认 HTML 转义,安全
- Cloudflare Pages 构建: 推送前确认 `_config.yml` 不破坏现有主题结构

## 11. 实施顺序(写 plan 时展开)

1. 主题 `_config.yml` 加 `nav` 和 `projects`(数据先于视图)
2. `header.njk` 改造 + CSS nav 样式(先桌面,验证再移动)
3. 移动端汉堡 + JS
4. 新增 `projects.njk` + `source/projects/index.md`
5. 新增 `source/about/index.md`(占位即可)
6. 新增 `source/tags/index.md`
7. 本地 `hexo s` 手测验收清单全部项
8. `hexo d` 部署到 shuai-blog.pages.dev