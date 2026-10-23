import { defineConfig, type HeadConfig } from 'vitepress'
import { resolve } from 'node:path'
import { siteConfig } from './site.config'
import sectionsData from './sections.json'
import sidebar from './sidebar.generated.json'
import { buildHead, buildEnd, markdownDevPlugin } from './seo'

const SITE_URL = (process.env.SITE_URL || siteConfig.url).replace(/\/+$/, '')
const BASE = process.env.BASE_PATH || '/'
const CLEAN_URLS = process.env.CLEAN_URLS !== 'false'
const PREVIEW = process.env.PREVIEW === '1'
const docsRoot = resolve(__dirname, '..')

/** Convert a clean site path to its `.html` form when cleanUrls is disabled. */
function pageLink(link: string) {
  if (CLEAN_URLS || link.endsWith('/') || /\.[a-z0-9]+$/i.test(link) || /^https?:/.test(link)) return link
  return `${link}.html`
}

const verification: HeadConfig[] = [
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? [['meta', { name: 'google-site-verification', content: process.env.GOOGLE_SITE_VERIFICATION }] as HeadConfig]
    : []),
  ...(process.env.BAIDU_SITE_VERIFICATION
    ? [['meta', { name: 'baidu-site-verification', content: process.env.BAIDU_SITE_VERIFICATION }] as HeadConfig]
    : []),
  ...(process.env.BING_SITE_VERIFICATION
    ? [['meta', { name: 'msvalidate.01', content: process.env.BING_SITE_VERIFICATION }] as HeadConfig]
    : [])
]

const head: HeadConfig[] = [
  ...verification,
  ['meta', { name: 'author', content: siteConfig.author.name }],
  ['meta', { name: 'theme-color', content: '#2563eb' }],
  ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ['link', { rel: 'apple-touch-icon', href: '/logo.svg' }]
]

const umamiHost = process.env.UMAMI_HOST_URL || '/s'
if (process.env.UMAMI_WEBSITE_ID) {
  head.push([
    'script',
    {
      defer: '',
      src: umamiHost.startsWith('http') ? `${umamiHost}/script.js` : `${umamiHost}/a.js`,
      'data-website-id': process.env.UMAMI_WEBSITE_ID,
      'data-host-url': umamiHost
    }
  ])
}

const nav = [
  ...sectionsData.sections
    .filter((section) => section.nav)
    .map((section) => ({
      text: section.label,
      link: `/${section.dir}/`,
      activeMatch: `^/${section.dir}/`
    })),
  ...sectionsData.nav.map((item) => ({ ...item, link: pageLink(item.link) }))
]

export default defineConfig({
  lang: siteConfig.lang,
  base: BASE,
  title: siteConfig.name,
  titleTemplate: `:title · ${siteConfig.name}`,
  description: siteConfig.description,
  appearance: true,
  cleanUrls: CLEAN_URLS,
  lastUpdated: true,
  head,
  markdown: {
    image: {
      lazyLoading: true
    }
  },
  sitemap: {
    hostname: SITE_URL,
    transformItems: (items) =>
      items
        .filter((item) => !/(^|\/)404(\.html)?$/.test(item.url))
        .map((item) => {
          const pathname = item.url || '/'
          const absolute = `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
          return {
            ...item,
            url: absolute,
            changefreq: 'weekly',
            priority: pathname === '' || pathname === '/' ? 1.0 : 0.8
          }
        })
  },
  transformHead: (ctx) => buildHead(ctx, { site: siteConfig, siteUrl: SITE_URL, cleanUrls: CLEAN_URLS, preview: PREVIEW }),
  buildEnd: (vpSite) => buildEnd(vpSite, { site: siteConfig, siteUrl: SITE_URL, cleanUrls: CLEAN_URLS, preview: PREVIEW }),
  vite: {
    define: {
      __CLEAN_URLS__: JSON.stringify(CLEAN_URLS)
    },
    plugins: [markdownDevPlugin({ docsRoot, site: siteConfig, siteUrl: SITE_URL, cleanUrls: CLEAN_URLS })]
  },
  themeConfig: {
    nav,
    sidebar,
    socialLinks: siteConfig.socialLinks,
    ...(siteConfig.editLink ? { editLink: siteConfig.editLink } : {}),
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清除搜索',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    outline: { label: '本页', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: {
      text: '最后更新',
      formatOptions: { dateStyle: 'medium', forceLocale: true }
    },
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '浅色模式',
    darkModeSwitchTitle: '深色模式',
    externalLinkIcon: true
  }
})
