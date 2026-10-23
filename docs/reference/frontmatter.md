---
title: Frontmatter
description: 每篇文档可用的 Frontmatter 字段、默认行为与示例。
order: 2
group: 规范
tags: [Frontmatter]
---

# Frontmatter

## 完整示例

```yaml
---
title: 快速开始
description: 5 分钟把模板跑起来。
order: 1
group: 开始
tags: [安装, 上手]
date: 2026-01-01
updated: 2026-02-01
readingTime: 6
---
```

## 字段说明

| 字段 | 类型 | 默认 | 作用 |
| --- | --- | --- | --- |
| `title` | string | 第一个 H1 | 浏览器标题、侧边栏、搜索、llms.txt |
| `description` | string | 站点描述 | SEO / OG / llms.txt 摘要 |
| `order` | number | `999` | 同组排序 |
| `group` | string | 分区 `sidebar` 名 | 侧边栏分组 |
| `tags` | string[] | `[]` | 文首标签 |
| `date` | string | 无 | JSON-LD `datePublished` |
| `updated` | string | git 提交时间 | JSON-LD `dateModified` |
| `readingTime` | number | 自动估算 | 覆盖阅读时长（分钟） |
| `layout` | string | `doc` | 首页用 `page`，404 用 `page` |
| `sidebar` | boolean | `true` | `false` 时隐藏侧边栏 |
| `outline` | false \| [number, number] | 站点配置 | 覆盖本页目录层级 |

::: tip title 与 H1
`title` 不填时用第一个 `#` 标题；但侧边栏在构建前生成，无法可靠解析 Markdown 结构，**建议每页都写 `title`**。
:::

## 约定

1. 每个文件只有一个 H1。
2. 正文标题从 `##` 开始，这样目录层级干净。
3. `description` 写“这篇文档解决什么问题”，不要复制正文第一句。
4. 日期用 `YYYY-MM-DD`，便于排序和结构化数据。
5. 标签控制在 3 个以内，避免文首过于拥挤。

## 生成结果

Frontmatter 会影响这些产物：

```text
docs/guide/getting-started.md
├─ 侧边栏：使用指南 / 开始 / 快速开始
├─ HTML <title>：快速开始 · Folio
├─ meta description / og:description
├─ JSON-LD：TechArticle + BreadcrumbList + dateModified
├─ 文首：阅读时长与标签
└─ llms.txt：标题 + 描述 + 绝对链接
```
