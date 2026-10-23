---
title: 写内容
description: 目录约定、Frontmatter 字段、自动侧边栏与 Markdown 能力。
order: 2
group: 开始
tags: [写作, Markdown]
---

# 写内容

## 放在哪里

内容放在 `docs/<分区>/` 下，分区由 `docs/.vitepress/sections.json` 定义。默认有三个：

| 分区 | 用途 | 侧边栏 |
| --- | --- | --- |
| `guide/` | 教程、上手路径 | 使用指南 |
| `reference/` | 配置、API、规范 | 参考手册 |
| `kb/` | FAQ、排查、专题文章 | 知识库 |

新增一个页面：

```bash
npm run new -- guide/my-new-page "我的新页面"
```

脚本会在 `docs/guide/` 下创建带 Frontmatter 的 Markdown 文件。

## Frontmatter

```yaml
---
title: 写内容
description: 用一句话说明这篇文档解决什么问题，会用于搜索摘要与 llms.txt。
order: 2
group: 开始
tags: [写作, Markdown]
date: 2026-01-01
---
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 建议 | 页面标题；缺省时取第一个 `#` 标题 |
| `description` | 建议 | SEO 描述、OG 摘要、`llms.txt` 摘要 |
| `order` | 否 | 同组内排序，数字越小越靠前 |
| `group` | 否 | 侧边栏分组名；缺省用分区默认名 |
| `tags` | 否 | 显示在正文顶部的小标签 |
| `date` | 否 | 发布日期，写入 JSON-LD |
| `updated` | 否 | 手动指定更新日期；缺省用 git 最后提交时间 |

::: warning 一个页面只写一个 H1
第一个 `#` 作为标题回退；正文从 `##` 开始。这样侧边栏、搜索结果和目录层级都更干净。
:::

## 自动侧边栏

构建前会扫描每个分区的一级 `.md` 文件，按 `group` 分组、按 `order` 排序：

```text
docs/guide/
├─ index.md              -> 概览
├─ getting-started.md    -> 开始 / 快速开始
├─ writing-content.md    -> 开始 / 写内容
└─ customizing.md        -> 进阶 / 定制站点
```

改完 Frontmatter 后重新运行 `npm run dev` 或 `npm run build` 即可，不需要手写侧边栏。

## Markdown 能力

VitePress 内置 GitHub 风格 Markdown、代码高亮、目录锚点与自定义容器：

::: tip 提示
用 `tip / warning / danger / details` 让重点更醒目。
:::

```ts{2}
export function greet(name: string) {
  return `Hello, ${name}`
}
```

| 能力 | 写法 |
| --- | --- |
| 内部链接 | `[快速开始](/guide/getting-started)` |
| 静态图片 | `![说明](/logo.svg)`，文件放 `docs/public/` |
| 代码高亮 | 三个反引号 + 语言，`{2}` 高亮指定行 |
| 折叠块 | `::: details 标题` … `:::` |

## 写作建议

1. **先写 description**：它是搜索摘要和 AI 索引的主要来源。
2. **一节只讲一件事**：小标题用动词开头，便于生成目录和锚点。
3. **示例可复制**：命令、配置、代码块保持完整可运行。
4. **相对路径用根路径**：站内部链接统一从 `/` 开始，避免层级变化后失效。

下一步：[定制站点](/guide/customizing)。
