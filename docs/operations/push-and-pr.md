# Push 与 PR 流程

本仓库部署在 Cloudflare Pages,源代码托管在 GitHub (`CS215269/shuai-blog`)。`master` 分支的每次 push 都会触发自动部署到 https://shuai-blog.pages.dev/。

## 日常开发流

```bash
cd "C:/Users/c215/Documents/Visual Studio Code/MarkDown/personalWeb/hexo-blog"

# 1. 从最新 master 拉新功能分支
git checkout master
git pull origin master
git checkout -b feat/<short-name>

# 2. 开发 + 提交
git add <files>
git commit -m "feat: <description>"

# 3. 推送分支(会触发 Cloudflare Pages 预览部署)
git push -u origin feat/<short-name>

# 4. 在 GitHub 网页创建 PR
#    https://github.com/CS215269/shuai-blog/compare/master...feat/<short-name>
#    点击 "Create Pull Request" → 填写标题与描述 → 创建

# 5. 在 PR 上查看 Cloudflare Pages 自动生成的预览 URL,实测

# 6. 实测通过后 Squash merge 到 master → 自动部署到正式站
```

## 推送失败排查

### SSL 连接错误 (`SSL_ERROR_SYSCALL`)

环境无法访问 `github.com`(可能是代理/防火墙/沙箱限制)。绕过方案:

**方法 A:换 SSH**(推荐,长期方案)

```bash
# 生成 SSH 密钥(若已有可跳过)
ssh-keygen -t ed25519 -C "your-email@example.com"

# 把公钥 (~/.ssh/id_ed25519.pub) 添加到 GitHub: Settings → SSH and GPG keys

# 改 remote URL 为 SSH
git remote set-url origin git@github.com:CS215269/shuai-blog.git

# 测试
ssh -T git@github.com

# 再推送
git push -u origin feat/<short-name>
```

**方法 B:配置 GitHub PAT**(HTTPS 凭据)

```bash
# 1. GitHub → Settings → Developer settings → Personal access tokens → 生成 token (勾选 repo 权限)

# 2. 让 git 记住凭据
git config --global credential.helper store

# 3. 推送时用户名填 GitHub 用户名,密码填 token
git push -u origin feat/<short-name>
```

**方法 C:在外部终端运行**

Claude Code 沙箱可能限制出站网络,但本地 PowerShell / Windows Terminal 通常不受限。直接在外部终端执行 `git push`。

### 没有 `gh` CLI

如需在命令行创建 PR,装 GitHub CLI:

```bash
winget install GitHub.cli
gh auth login
gh pr create --title "..." --body "..."
```

或者直接走网页流程 — 推送后 GitHub 通常会自动提示 "Compare & pull request" 按钮。

## 推送与 PR 之后

| 步骤 | 触发 | 结果 |
|---|---|---|
| Push 分支 | Cloudflare Pages | 自动生成预览 URL(在 PR 评论里) |
| 创建 PR | GitHub | 可在 PR 上 review + 讨论 |
| Merge PR | GitHub | Cloudflare Pages 自动部署到正式站 |

## 约定

- **分支命名**: `feat/<name>` / `fix/<name>` / `chore/<name>` / `docs/<name>`
- **提交信息前缀**: `feat:` `fix:` `refactor:` `style:` `docs:` `chore:`(与项目现有约定一致)
- **commit message 语言**: 中文描述 + 英文前缀(沿用本项目既有风格,见 `git log --oneline`)
- **PR 标题**: 简短中文,1 行
- **PR 描述**: 列变更要点 + 测试计划(勾选清单)