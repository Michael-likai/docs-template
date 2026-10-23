---
title: 关于
description: 关于 Folio 模板、技术选型、目录结构与许可证。
order: 1
tags: [关于]
---

# 关于

Folio 是一个**内容优先**的文档站模板，用来快速搭建教程站、产品文档站或 AI 知识库。

## 设计取向

- **内容在 Markdown 里**：不引入 CMS、数据库或私有格式，迁移和版本管理都简单。
- **配置集中**：站点身份、导航、首页、功能开关各自只有一个入口。
- **构建期完成重活**：侧边栏、SEO、`llms.txt`、Markdown 副本都在构建时生成，运行时没有额外服务。
- **可拆可换**：主题继承 VitePress 默认主题，不需要时逐项关闭即可。

## 技术栈

| 层 | 选择 |
| --- | --- |
| 框架 | VitePress 1.x（Vue 3 + Vite） |
| 内容 | Markdown + Frontmatter |
| 搜索 | VitePress 本地搜索（MiniSearch） |
| 样式 | 原生 CSS 变量 + 自定义主题 |
| 部署 | 任意静态托管；内置 Cloudflare Pages / EdgeOne Makers 脚本 |

## 目录

```text
docs/
├─ .vitepress/      # 配置、主题、SEO 管线
├─ guide/           # 教程
├─ reference/       # 参考
├─ kb/              # 知识库
└─ public/          # 静态资源
scripts/            # 侧边栏、脚手架、部署
```

## 许可证

模板代码以 [MIT](https://opensource.org/licenses/MIT) 许可证发布。你可以用于个人或商业项目、修改后闭源分发；保留版权声明即可。

内容（`docs/` 下的示例文章）仅用于演示，替换成你自己的内容即可。

## 反馈

- 模板仓库：`https://github.com/your-org/your-repo`
- 问题与建议：在仓库开 issue

把上面的占位地址换成你的真实仓库即可。
