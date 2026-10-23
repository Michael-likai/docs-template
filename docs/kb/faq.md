---
title: 常见问题
description: 关于模板定位、内容迁移、多语言与维护成本的常见疑问。
order: 1
group: 使用
tags: [FAQ]
---

# 常见问题

## 这个模板适合什么规模的站点？

从几十篇到上千篇都可以。VitePress 构建是静态的，内容多了主要影响构建时间；侧边栏生成脚本只扫描一级目录，规模再大也很快。

## 和直接用 VitePress 默认主题有什么区别？

默认主题能直接用，但缺少这些“成品站”能力：

- 自动侧边栏（不用手写长 JSON）
- 首页、页脚、文档元信息、文末卡片
- `llms.txt`、逐页 Markdown、JSON-LD、AI 爬虫策略
- 双平台部署脚本与缓存 / 重定向配置

不需要时可以在 `site.config.ts` 里关掉对应功能。

## 可以从其他文档站迁移吗？

可以。常见路径：

1. 把 Markdown 按 `guide/`、`reference/`、`kb/` 重新归档。
2. 给每篇加 `title`、`description`、`order`、`group`。
3. 修正站内链接为根路径（`/guide/...`）。
4. 构建后检查 404 与图片路径。

Docusaurus、GitBook、语雀导出的 Markdown 通常只需要处理链接和图片目录。

## 支持多语言吗？

VitePress 原生支持 `locales`，但本模板默认单语言。需要双语时：

1. 在 `config.mts` 增加 `locales` 配置。
2. 内容拆到 `docs/zh/` 与 `docs/en/`。
3. 侧边栏生成脚本按 locale 目录各跑一遍。

模板没有预置双语，是为了避免绝大多数单语言站点背上额外复杂度。

## 需要数据库或后端吗？

不需要。全站是静态文件，搜索在浏览器本地完成。唯一可选的运行时是统计反代（EdgeOne Function），也可以完全去掉。

## 如何升级 VitePress？

```bash
pnpm up vitepress
pnpm build
```

主题继承默认主题，升级后优先检查 `docs/.vitepress/theme/` 里自定义插槽是否仍然存在。

## 可以商用吗？

模板代码使用 MIT 许可证，可商用、可修改、可闭源分发。你写的内容版权归你。
