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
