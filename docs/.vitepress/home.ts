/**
 * Home page copy. Edit this file to change the landing page without touching
 * the Vue component.
 */
export interface HomeMode {
  tag: string
  title: string
  desc: string
  link: string
  cta: string
}

export interface HomeFeature {
  icon: string
  title: string
  desc: string
}

export const home = {
  eyebrow: 'VitePress · 内容优先',
  title: '一个模板，\n三种文档形态',
  lead: '教程、产品文档、AI 知识库共用一套构建管线：Markdown 写作、自动侧边栏、结构化数据，以及为 AI 准备的 llms.txt 与 Markdown 副本。',
  primary: { text: '5 分钟开始', link: '/guide/getting-started' },
  secondary: { text: '查看配置', link: '/reference/configuration' },
  notice: { text: '已内置 llms.txt、Markdown 副本和 JSON-LD', link: '/kb/ai-ready' },
  modes: [
    {
      tag: '01 · 教程',
      title: '线性学习路径',
      desc: '按章节推进，带阅读时长、上一篇 / 下一篇和章节徽标，适合新手教程与课程。',
      link: '/guide/',
      cta: '浏览指南'
    },
    {
      tag: '02 · 产品文档',
      title: '结构化参考',
      desc: '分组侧边栏、配置表、代码块与可复制示例，适合 API、SDK 和产品手册。',
      link: '/reference/',
      cta: '查看参考'
    },
    {
      tag: '03 · AI 知识库',
      title: '可被检索与引用',
      desc: 'llms.txt、每页 Markdown、JSON-LD 与 AI 爬虫白名单，让模型更容易读懂你的内容。',
      link: '/kb/',
      cta: '打开知识库'
    }
  ] satisfies HomeMode[],
  features: [
    {
      icon: 'layout',
      title: '配置驱动',
      desc: '站点名称、导航、页脚与 SEO 集中在 site.config.ts，改一处全站生效。'
    },
    {
      icon: 'list',
      title: '自动侧边栏',
      desc: '扫描 Frontmatter 里的 title / order / group，构建前生成分组侧边栏。'
    },
    {
      icon: 'sparkles',
      title: 'AI 就绪',
      desc: '构建时生成 llms.txt、llms-full.txt 与逐页 .md，并输出 JSON-LD。'
    },
    {
      icon: 'search',
      title: '本地搜索',
      desc: '内置 MiniSearch 全文搜索，无需任何外部服务。'
    },
    {
      icon: 'rocket',
      title: '一键部署',
      desc: '同一份静态产物发布到 Cloudflare Pages 或 EdgeOne Makers。'
    },
    {
      icon: 'code',
      title: 'TypeScript + Vue',
      desc: '主题基于 VitePress 默认主题扩展，组件与配置都有类型提示。'
    }
  ] satisfies HomeFeature[],
  steps: [
    { k: '安装', v: 'pnpm install（或 npm install）' },
    { k: '写作', v: '在 docs/ 下新建 Markdown，按需补 Frontmatter' },
    { k: '预览', v: 'pnpm dev，本地实时热更新' },
    { k: '发布', v: 'pnpm build 后交给任意静态托管' }
  ]
}
