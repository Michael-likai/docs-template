---
title: 故障排查
description: 构建失败、侧边栏不更新、部署 404、样式与搜索问题的排查路径。
order: 3
group: 实践
tags: [排错]
---

# 故障排查

## 侧边栏没有更新

**现象**：新增或改名页面后，侧边栏还是旧的。

**处理**：

```bash
npm run gen:sidebar
npm run dev
```

直接运行 `npx vitepress dev docs` 不会触发生成脚本。检查 Frontmatter 是否正确闭合（`---` 成对出现），以及文件是否在 `sections.json` 声明的目录下。

## 构建失败

先看完整错误，再按类型处理：

| 错误 | 常见原因 |
| --- | --- |
| `Could not resolve ...` | 站内链接指向不存在的页面；VitePress 会检查死链 |
| `sidebar.generated.json` not found | 没有先运行 `npm run gen:sidebar` |
| `Transform failed` | `config.mts` 或 `seo.ts` 语法错误 |
| `Cannot find module` | 依赖未安装；重新执行 `pnpm install` |

死链是构建失败最常见的原因。VitePress 默认开启死链检查，这能在上线前拦住大部分链接问题。

## 部署后子页面 404

`cleanUrls: true` 会把链接生成为 `/guide/x`，托管平台需要把它映射到 `/guide/x.html`。

- **Cloudflare Pages / EdgeOne Pages**：默认支持。
- **Nginx**：`try_files $uri $uri.html $uri/ =404;`
- **对象存储（OSS / COS）**：开启静态网站托管，并配置“默认首页”和“404 页面”；部分平台需要把 `index.html` 作为默认文档。

## 样式或字体没有生效

1. 确认部署目录是 `docs/.vitepress/dist`。
2. 强制刷新，排除 HTML 缓存。
3. 检查浏览器控制台是否有 404 的 `/assets/*` 请求。
4. 如果改了 `base`，所有绝对路径都要跟着改，模板默认不配置 `base`。

## 搜索不到内容

本地搜索在构建时生成索引。开发模式下新页面需要等热更新完成；构建后如果仍搜不到，检查：

- 页面是否被 `srcExclude` 排除。
- 是否在 Frontmatter 中设置了 `search: false`（模板未使用该字段）。
- 构建日志里是否有页面被跳过。

## 统计脚本被拦截

如果使用 `/s` 同源反代，确认：

1. `UMAMI_WEBSITE_ID` 已设置。
2. EdgeOne 部署目录中存在 `edge-functions/s/[[default]].js`。
3. 网络面板里 `/s/a.js` 返回 200。

其他平台需要自行配置反代，或把 `UMAMI_HOST_URL` 指向 Umami 官方地址。

## Markdown 副本 404

逐页 `.md` 是构建产物，只在 `npm run build` 后存在。开发模式下由 Vite 中间件提供，但直接打开 `http://localhost:5173/guide/x.md` 需要先运行 `npm run dev`（而不是只跑 `vitepress dev`）。

## 仍然卡住

打开浏览器控制台和构建终端，把第一条报错贴到 issue 里。绝大多数问题都能从第一条错误定位。
