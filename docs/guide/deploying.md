---
title: 部署上线
description: 把静态产物发布到 Cloudflare Pages 或 EdgeOne Makers，并完成上线检查。
order: 4
group: 进阶
tags: [部署]
---

# 部署上线

## 先构建

```bash
# 本地 .env 中设置 SITE_URL，保证 canonical / sitemap 用正式域名
echo 'SITE_URL=https://docs.example.com' >> .env
npm run build
```

产物在 `docs/.vitepress/dist/`。它是纯静态文件：HTML、JS、CSS、字体、图片，以及构建时生成的 `sitemap.xml`、`robots.txt`、`llms.txt`、逐页 `.md`。

::: tip 部署前检查
- `SITE_URL` 是正式域名（不要留 `example.com`）。
- `site.config.ts` 里的 `url` 已同步修改。
- `sitemap.xml` 中的地址正确。
:::

## Cloudflare Pages

```bash
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
export CF_PAGES_PROJECT=folio-docs
npm run deploy:cloudflare
```

脚本使用 `wrangler pages deploy`。首次需要先在 Cloudflare 创建项目，或在控制台连接 Git 仓库自动构建。

## EdgeOne Makers

```bash
npm i -g edgeone
export EDGEONE_API_TOKEN=...
export EDGEONE_PROJECT=folio-docs
npm run deploy:edgeone
```

脚本会先运行 `scripts/edgeone.mjs`，把 `dist/` 复制到 `.deploy/edgeone/`，并生成：

- `edgeone.json`：缓存头、安全头、`.md` / `.txt` 的 MIME、重定向。
- `edge-functions/s/[[default]].js`：可选的 Umami 反向代理。

然后调用 `edgeone makers deploy` 上传。

## 同时部署

```bash
npm run deploy
```

缺少某个平台的 token 时会跳过并提示；单平台命令缺少 token 则直接失败。

## 重定向

在根目录 `redirects.json` 中维护旧链接：

```json
[
  { "source": "/old-page", "destination": "/guide/getting-started", "statusCode": 301 }
]
```

`scripts/edgeone.mjs` 会把它们写进 `edgeone.json`。Cloudflare Pages 可以另外在 `docs/public/_redirects` 中维护同样规则。

## 自定义域名与 HTTPS

1. 在托管平台绑定域名。
2. 按平台提示配置 CNAME 或 A 记录。
3. 等待证书签发（通常几分钟）。
4. 把 `SITE_URL` 和 `site.config.ts` 的 `url` 改为最终域名并重新构建。


## Cloudflare Pages PR 预览

仓库内置 `[cf-preview.yml](https://github.com/Michael-likai/docs-template/blob/main/.github/workflows/cf-preview.yml)`：每个 Pull Request 会自动构建一份带 **noindex** 的预览站，并在 PR 里留言更新地址，合并前可以点开看效果。

### 一次性配置

在 GitHub 仓库 **Settings → Secrets and variables → Actions** 添加：

| 类型 | 名称 | 说明 |
| --- | --- | --- |
| Secret | `CLOUDFLARE_API_TOKEN` | Cloudflare API Token，权限至少包含 **Account → Cloudflare Pages → Edit** |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账号 ID（控制台右侧或 `wrangler whoami`） |
| Variable | `CF_PAGES_PROJECT`（可选） | Pages 项目名，默认 `docs-template` |

Token 在 <https://dash.cloudflare.com/profile/api-tokens> 创建，选择模板 **Cloudflare Pages** 即可，不需要 Zone 权限。

### 工作方式

1. 新建分支并提交修改。
2. 向 `main` 开 Pull Request。
3. Actions 运行 **Cloudflare Pages Preview**：`pnpm build`（`PREVIEW=1`，注入 `noindex`），然后 `wrangler pages deploy --branch pr-<编号>`。
4. PR 下方出现预览地址：`https://pr-<编号>.<项目子域>.pages.dev`（具体以 PR 评论为准），之后每次 push 自动覆盖更新。
5. 预览站 `robots.txt` 全部 Disallow，不会进入搜索引擎。

::: tip 首次运行
如果 Pages 项目不存在，工作流会尝试用 `wrangler pages project create` 创建；若 Token 没有创建权限，先在 Cloudflare 控制台手动建一个项目再运行。
:::

::: warning Fork 的 PR
来自 Fork 的 PR 拿不到仓库 Secrets，预览会被自动跳过（工作流仍然成功）；内部分支的 PR 不受影响。
:::

## 上线后检查

```bash
curl -I https://docs.example.com/
curl -s https://docs.example.com/robots.txt
curl -s https://docs.example.com/llms.txt | head
curl -s https://docs.example.com/guide/getting-started.md | head
```

- 提交 `sitemap.xml` 到 Google Search Console / Bing Webmaster Tools / 百度搜索资源平台。
- 检查 404 页、搜索、深色模式和移动端。
- 需要统计时配置 Umami（见 [配置参考](/reference/configuration#分析统计)）。

## 常见问题

**刷新子页面 404？**
静态托管需要把 `/guide/x` 映射到 `/guide/x.html`。Cloudflare Pages 与 EdgeOne Pages 默认支持；自建 Nginx 需要 `try_files $uri $uri.html $uri/ =404;`。

**资源 404？**
确认部署的是 `dist/` 内容而不是仓库根目录，且 `base` 没有被改动（默认 `/`）。

**样式没更新？**
`assets/*` 带一年 immutable 缓存，但 VitePress 每次构建会换文件名；如果仍看到旧样式，检查 CDN 是否缓存了 HTML。
