---
title: 快速开始
description: 5 分钟把模板跑起来：安装依赖、本地预览、构建静态文件。
order: 1
group: 开始
tags: [安装]
date: 2026-01-01
---

# 快速开始

## 环境要求

- Node.js **20 或更高版本**
- 一个包管理器：npm、pnpm 或 yarn 均可

## 安装与预览

```bash
# 1. 安装依赖
pnpm install

# 2. 生成侧边栏并启动开发服务器
pnpm dev
```

打开终端提示的地址（默认 `http://localhost:5173`），修改 `docs/` 下的 Markdown 会实时热更新。

::: tip 侧边栏是生成的
`pnpm dev` 和 `pnpm build` 会先运行 `scripts/gen-sidebar.mjs`，把 Frontmatter 里的 `title / order / group` 汇总成侧边栏。不要手改 `sidebar.generated.json`。
:::

## 构建与本地预览

```bash
pnpm build
pnpm preview
```

构建产物在 `docs/.vitepress/dist/`，可以直接部署到任意静态托管。

## 目录结构

```text
.
├─ docs/
│  ├─ .vitepress/
│  │  ├─ config.mts             # VitePress 与主题配置
│  │  ├─ site.config.ts         # 站点身份、页脚、功能开关
│  │  ├─ sections.json          # 分区（导航 + 侧边栏）定义
│  │  ├─ home.ts                # 首页文案
│  │  ├─ seo.ts                 # SEO / llms.txt / Markdown 副本
│  │  └─ theme/                 # 自定义主题与组件
│  ├─ guide/                    # 教程
│  ├─ reference/                # 参考
│  ├─ kb/                       # 知识库
│  └─ public/                   # 静态资源
├─ scripts/                     # 侧边栏、脚手架、部署脚本
└─ package.json
```

## 第一次定制

1. 改 `docs/.vitepress/site.config.ts`：站名、描述、作者、仓库地址。
2. 改 `docs/.vitepress/sections.json`：分区名与导航。
3. 改 `docs/.vitepress/home.ts`：首页标题、卖点与按钮。
4. 替换 `docs/public/logo.svg` 与 `docs/public/og.png`。
5. 删除示例内容，写你自己的第一篇文档。

下一步：[写内容](/guide/writing-content)。
