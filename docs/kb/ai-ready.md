---
title: 让站点对 AI 友好
description: llms.txt、逐页 Markdown、JSON-LD、robots 与内容结构，让模型更容易检索和引用。
order: 2
group: 实践
tags: [AI, SEO]
date: 2026-01-01
---

# 让站点对 AI 友好

搜索引擎和 AI 助手读取内容的方式不同：前者依赖 HTML 与 sitemap，后者更偏好干净、结构化、可整篇引用的文本。这个模板同时照顾两者。

## 构建时自动生成

| 产物 | 地址 | 用途 |
| --- | --- | --- |
| `llms.txt` | `/llms.txt` | 站点索引：标题、描述、绝对链接 |
| `llms-full.txt` | `/llms-full.txt` | 全站正文合集，便于一次性读取 |
| 逐页 Markdown | `/<路径>.md` | 单篇干净正文，如 `/guide/getting-started.md` |
| `sitemap.xml` | `/sitemap.xml` | 搜索引擎发现页面 |
| `robots.txt` | `/robots.txt` | 爬虫策略与 sitemap 地址 |

页面 HTML 的 `<head>` 还会输出：

- `canonical`
- Open Graph / Twitter Card
- `application/ld+json`：`WebSite`、`Person`、`WebPage`、`TechArticle`、`BreadcrumbList`
- `<link rel="alternate" type="text/markdown">` 指向 Markdown 版本

## 验证一下

```bash
curl -s https://docs.example.com/llms.txt | head -30
curl -s https://docs.example.com/guide/getting-started.md | head -20
curl -s https://docs.example.com/ | grep 'application/ld+json'
```

Markdown 副本会去掉 Frontmatter，并把站内绝对路径改写成完整 URL，方便模型直接引用。

## 内容层面的建议

1. **每页一个明确主题**，标题写清楚“是什么 / 解决什么问题”。
2. **开头先给结论**：一段话说明这篇文档的适用范围。
3. **保留可独立引用的段落**：概念、步骤、限制条件都能脱离上下文阅读。
4. **别把关键信息只放在图片里**：模型读不到截图中的文字。
5. **给出稳定的锚点**：`##` 小标题会生成 URL 锚点，方便引用到具体小节。

## robots.txt

`site.config.ts` 的 `features.aiCrawlers` 打开时，`robots.txt` 会显式允许常见 AI 爬虫：

```text
User-agent: GPTBot
Allow: /
```

如果站点有付费内容或不想被训练，把这个开关设为 `false`，并在 `docs/public/robots.txt` 中自定义策略（构建时会覆盖同名文件，注意调整 `seo.ts`）。

## 与 Claude / ChatGPT 等工具配合

把下面这段放进系统提示或项目说明，模型就能按站点的 Markdown 约定工作：

```text
站点索引见 /llms.txt，全站正文见 /llms-full.txt。
单篇内容在页面 URL 后加 .md 即可获取原始 Markdown。
引用时请链接原文 URL。
```

## 不要过度优化

AI 索引只是锦上添花。先把内容写清楚、链接做对、页面能正常打开；结构化数据是在这之上的加成。
