---
title: 脚本命令
description: 开发、构建、生成侧边栏、创建页面、部署与构建产物的说明。
order: 3
group: 规范
tags: [脚本]
---

# 脚本命令

## npm scripts

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 生成侧边栏并启动开发服务器 |
| `npm run build` | 生成侧边栏并构建静态站点 |
| `npm run preview` | 本地预览构建产物 |
| `npm run gen:sidebar` | 只生成 `sidebar.generated.json` |
| `npm run new -- <section>/<slug> [标题]` | 创建新页面 |
| `npm run deploy:cloudflare` | 构建并部署到 Cloudflare Pages |
| `npm run deploy:edgeone` | 构建并部署到 EdgeOne Makers |
| `npm run deploy` | 构建并依次尝试两个平台 |
| `npm run clean` | 删除 dist、缓存与 `.deploy` |

`npm run deploy*` 支持 `-- --dry-run` 只打印命令；设置 `SKIP_BUILD=1` 可跳过构建。

## 构建产物

```text
docs/.vitepress/dist/
├─ index.html
├─ guide/
│  ├─ getting-started.html
│  └─ getting-started.md      # 给 AI / 复制按钮
├─ assets/                    # 带 hash 的 JS / CSS / 字体
├─ sitemap.xml                # VitePress 生成
├─ robots.txt                 # seo.ts 生成
├─ llms.txt                   # 站点索引
├─ llms-full.txt              # 全站正文合集
└─ og.png / logo.svg
```

## 内部实现

| 文件 | 职责 |
| --- | --- |
| `scripts/gen-sidebar.mjs` | 扫描 Frontmatter，生成侧边栏 JSON |
| `scripts/new.mjs` | 按分区模板创建 Markdown |
| `scripts/edgeone.mjs` | 生成 `edgeone.json` 与统计反代函数 |
| `scripts/deploy.mjs` | 统一部署入口，读取 `.env` |
| `docs/.vitepress/seo.ts` | Head 标签、JSON-LD、llms.txt、Markdown 副本 |
| `docs/.vitepress/config.mts` | 组装 VitePress 配置与主题 |

## 直接调用 VitePress

模板没有包装 VitePress 的运行时，任何 VitePress CLI 参数仍然可用：

```bash
npx vitepress dev docs --port 4000
npx vitepress build docs --outDir .vitepress/dist-test
```

注意：直接调用时不会自动生成侧边栏，请先运行 `npm run gen:sidebar`。
