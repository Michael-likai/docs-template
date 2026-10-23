import type { DefaultTheme } from 'vitepress'

/**
 * Site identity. This file is safe to import from Vue components:
 * keep secrets and `process.env` out of it (see `config.mts` for env).
 */
export interface SiteConfig {
  name: string
  title: string
  description: string
  url: string
  lang: string
  ogImage: string
  author: {
    name: string
    url?: string
    github?: string
    x?: string
  }
  editLink: DefaultTheme.EditLink | null
  socialLinks: DefaultTheme.SocialLink[]
  footer: {
    message: string
    links: { text: string; link: string }[]
  }
  features: {
    /** Emit a copy of every page as Markdown and expose a "copy Markdown" action. */
    markdownCopies: boolean
    /** Generate /llms.txt and /llms-full.txt for AI assistants. */
    llms: boolean
    /** Explicitly allow known AI crawlers in robots.txt. */
    aiCrawlers: boolean
    /** Reading-progress bar at the top of the page. */
    readingProgress: boolean
  }
}

export const siteConfig: SiteConfig = {
  name: 'Folio',
  title: 'Folio · 文档站模板',
  description:
    '一个内容优先的 VitePress 模板：同一套代码可做教程站、产品文档站或 AI 知识库。内置自动侧边栏、结构化数据、llms.txt 与 Markdown 副本。',
  url: 'https://docs.example.com',
  lang: 'zh-CN',
  ogImage: '/og.png',
  author: {
    name: 'Your Name',
    url: 'https://github.com/your-name',
    github: 'https://github.com/your-name'
  },
  editLink: {
    pattern: 'https://github.com/your-org/your-repo/edit/main/docs/:path',
    text: '在 GitHub 上编辑此页'
  },
  socialLinks: [{ icon: 'github', link: 'https://github.com/your-name/your-repo' }],
  footer: {
    message: '内容优先，其余交给模板。',
    links: [
      { text: '指南', link: '/guide/' },
      { text: '参考', link: '/reference/' },
      { text: '知识库', link: '/kb/' },
      { text: '关于', link: '/about' }
    ]
  },
  features: {
    markdownCopies: true,
    llms: true,
    aiCrawlers: true,
    readingProgress: true
  }
}
