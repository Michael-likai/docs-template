---
title: 定制站点
description: 改品牌、导航、首页、配色，以及增删分区与功能开关。
order: 3
group: 进阶
tags: [定制, 主题]
---

# 定制站点

## 站点身份

编辑 `docs/.vitepress/site.config.ts`：

```ts
export const siteConfig = {
  name: 'Folio',
  title: 'Folio · 文档站模板',
  description: '……',
  url: 'https://docs.example.com',
  author: { name: 'Your Name', url: 'https://github.com/your-name' },
  editLink: {
    pattern: 'https://github.com/your-org/your-repo/edit/main/docs/:path',
    text: '在 GitHub 上编辑此页'
  }
}
```

`name` 会出现在导航、页脚和 JSON-LD 里；`url` 用于 canonical、sitemap、OG 和 `llms.txt`，上线前务必改成真实域名（也可以用环境变量 `SITE_URL` 覆盖）。

## 导航与分区

`docs/.vitepress/sections.json` 同时驱动导航和侧边栏：

```json
{
  "sections": [
    { "dir": "guide", "label": "指南", "sidebar": "使用指南", "nav": true }
  ],
  "nav": [{ "text": "关于", "link": "/about" }]
}
```

- `dir`：`docs/` 下的目录名。
- `label`：顶部导航文案。
- `sidebar`：侧边栏与首页区块使用的标题。
- `nav`：是否出现在顶部导航。
- 顶层 `nav`：额外导航项。

新增分区只需三步：建目录、加一条配置、放一篇带 Frontmatter 的 `index.md`。

## 首页

首页文案在 `docs/.vitepress/home.ts`：

- `title`：`\n` 会拆成两行。
- `primary / secondary / notice`：三个入口。
- `modes`：三张内容形态卡片，建议与 `sections.json` 对应。
- `features`：能力清单，`icon` 可选 `layout / list / sparkles / search / rocket / code / book`。
- `steps`：从克隆到发布的步骤。

修改这些字段即可，不需要动 `Home.vue`。

## 配色与排版

在 `docs/.vitepress/theme/style.css` 顶部改四个品牌变量：

```css
:root {
  --vp-c-brand-1: #2563eb; /* 主色：链接、按钮、强调 */
  --vp-c-brand-2: #3b82f6; /* 渐变辅色 */
  --vp-c-brand-3: #60a5fa; /* 浅色点缀 */
  --vp-c-brand-soft: rgba(37, 99, 235, 0.13);
}
```

深色模式在 `.dark` 选择器里单独覆盖。字体、圆角、页脚和文档样式也在同一个文件里。

## 组件与插槽

主题在 `docs/.vitepress/theme/index.ts` 里扩展 VitePress 默认主题：

| 插槽 | 组件 | 作用 |
| --- | --- | --- |
| `nav-bar-title-before` | `Logo.vue` | 导航栏品牌标 |
| `doc-before` | `DocMeta.vue` | 阅读时长、更新时间、标签 |
| `doc-after` | `DocEndCard.vue` | 文末导航与复制 Markdown |
| `layout-top` | `ReadingProgress.vue` | 顶部阅读进度条 |
| `layout-bottom` | `SiteFooter.vue` | 自定义页脚 |

新增全局组件时，在 `enhanceApp` 里注册；只在一个页面用到时，直接在 Markdown 中写 `<Component />`。

## 功能开关

`site.config.ts` 的 `features` 控制构建产物：

```ts
features: {
  markdownCopies: true,  // 逐页 .md + 复制按钮
  llms: true,            // llms.txt / llms-full.txt
  aiCrawlers: true,      // robots.txt 中放开 AI 爬虫
  readingProgress: true  // 顶部进度条
}
```

关闭后重新构建即可，对应的文件不会再生成。

## 更换 Logo 与分享图

- `docs/public/logo.svg`：导航和 favicon 使用。
- `docs/public/og.png`：社交分享图，建议 1200×630。
- `docs/public/` 下所有文件会原样复制到站点根目录。

下一步：[部署上线](/guide/deploying)。
