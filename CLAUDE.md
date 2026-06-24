# 项目说明

hexo 博客,主题 `latex-minimal`,部署 Cloudflare Pages
(https://shuai-blog.pages.dev)。站点与主题配置分别在 `_config.yml` 和
`themes/latex-minimal/_config.yml`,目录结构与 hexo 标准一致。

## 提交信息风格

Conventional Commits 格式,scope 与描述用中文,英文仅用于不可避免的技术名词:

- ✓ `feat(主题):使用SVG + ICO fallback 添加 favicon`
- ✗ `feat(theme): add Σ favicon with SVG + ICO fallback`

## 主题设计原则(已确定,改动前请尊重)

- 视觉风格:LaTeX/学术,衬线字体,克制装饰
- 避免引入:图标库、动画、渐变、阴影、拟物
- accent 色:暖橙 `#c2855b`(深色) / `#a0522d`(浅色)
- 默认深色模式(`dark_mode_default: true`)

## 开发与部署

- `npx hexo server` 本地预览,文件改动自动重载
- `git push` 触发 Cloudflare Pages 自动部署,无需本地 `hexo g`
- `public/` 是构建产物,不要手动编辑
