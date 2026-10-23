---
title: 站点配置
description: site.config.ts、sections.json、环境变量与重定向的完整字段说明。
order: 1
group: 配置
tags: [配置]
---

# 站点配置

## `site.config.ts`

文件：`docs/.vitepress/site.config.ts`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 站点短名，用于导航、页脚、JSON-LD |
| `title` | `string` | 完整站点标题，用于首页与 OG |
| `description` | `string` | 默认描述，页面没有 Frontmatter 描述时使用 |
| `url` | `string` | 站点根地址，用于 canonical / sitemap / llms.txt |
| `lang` | `string` | 语言，如 `zh-CN`、`en` |
| `ogImage` | `string` | 分享图路径，建议 `/og.png` |
| `author` | `object` | `name`、`url`、`github`、`x`，写入结构化数据 |
| `editLink` | `object \| null` | `pattern` 中的 `:path` 会替换成文档相对路径 |
| `socialLinks` | `array` | VitePress 社交链接，支持 `github`、`x`、`discord` 等 |
| `footer` | `object` | `message` 与页脚链接 |
| `features` | `object` | 见下方功能开关 |

### 功能开关

| 开关 | 默认 | 关闭后的效果 |
| --- | --- | --- |
| `markdownCopies` | `true` | 不再生成逐页 `.md`，文末不显示复制按钮 |
| `llms` | `true` | 不再生成 `llms.txt` / `llms-full.txt` |
| `aiCrawlers` | `true` | `robots.txt` 不再显式放开 AI 爬虫 |
| `readingProgress` | `true` | 顶部不显示阅读进度条 |

## `sections.json`

文件：`docs/.vitepress/sections.json`

```json
{
  "sections": [
    {
      "dir": "guide",
      "label": "指南",
      "sidebar": "使用指南",
      "nav": true,
      "description": "分区说明"
    }
  ],
  "nav": [{ "text": "关于", "link": "/about" }]
}
```

| 字段 | 说明 |
| --- | --- |
| `dir` | `docs/` 下的目录名，同时作为侧边栏 key `/<dir>/` |
| `label` | 顶部导航文案 |
| `sidebar` | 侧边栏、首页、`llms.txt` 使用的分区标题 |
| `nav` | 是否出现在顶部导航 |
| `description` | 预留的分区描述 |
| 顶层 `nav` | 额外导航项，结构同 VitePress `themeConfig.nav` |

`scripts/gen-sidebar.mjs` 只扫描每个分区的一级 `.md`，按 Frontmatter 分组排序。嵌套目录需要自行扩展该脚本。

## 环境变量

复制 `.env.example` 为 `.env`，脚本会自动加载。

| 变量 | 用途 |
| --- | --- |
| `SITE_URL` | 覆盖 `site.config.url`，构建与部署时使用 |
| `UMAMI_WEBSITE_ID` | 启用 Umami 统计 |
| `UMAMI_HOST_URL` | 统计脚本地址，默认 `/s`（同源反代） |
| `UMAMI_SCRIPT_URL` / `UMAMI_SEND_URL` | 自定义 Umami 上游，供 EdgeOne 反代 |
| `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Pages 部署 |
| `CF_PAGES_PROJECT` | Cloudflare Pages 项目名 |
| `EDGEONE_API_TOKEN` / `EDGEONE_PROJECT` | EdgeOne Makers 部署 |
| `EDGEONE_CLI` | 自定义 edgeone 可执行文件 |
| `GOOGLE_SITE_VERIFICATION` 等 | 搜索引擎验证 meta |
| `SKIP_BUILD=1` | 部署时跳过构建 |

### 分析统计

```bash
UMAMI_WEBSITE_ID=xxxxxxxx
UMAMI_HOST_URL=/s
```

`config.mts` 会注入 Umami 脚本；`scripts/edgeone.mjs` 会生成同源反代函数，把 `/s/a.js` 与 `/s/api/send` 转发到 Umami Cloud，避免广告拦截器。其他托管平台可自行用 Worker / Function 转发，或直接把 `UMAMI_HOST_URL` 指向 `https://cloud.umami.is`。

## 首页数据

文件：`docs/.vitepress/home.ts`

| 字段 | 说明 |
| --- | --- |
| `eyebrow` | 顶部小标签 |
| `title` | 主标题，`\n` 拆行 |
| `lead` | 副标题 |
| `primary` / `secondary` / `notice` | 三个入口，含 `text` 与 `link` |
| `modes` | 三张内容形态卡片（`tag`、`title`、`desc`、`link`、`cta`） |
| `features` | 能力清单（`icon`、`title`、`desc`） |
| `steps` | 上手步骤（`k`、`v`） |

## 重定向

文件：`redirects.json`（根目录）

```json
[
  { "source": "/old", "destination": "/guide/getting-started", "statusCode": 301 }
]
```

只被 `scripts/edgeone.mjs` 使用。Cloudflare Pages 可在 `docs/public/_redirects` 中维护。

## 其他配置

`config.mts` 还控制：

- `cleanUrls: true`：无 `.html` 后缀的 URL。
- `lastUpdated: true`：用 git 提交时间生成“最后更新”。
- 本地搜索、目录层级、上一页 / 下一页文案。
- `transformHead`：canonical、OG、Twitter、JSON-LD。
- `buildEnd`：生成 `llms.txt`、Markdown 副本和 `robots.txt`。

需要更细的主题控制时，直接改 `docs/.vitepress/theme/`。
