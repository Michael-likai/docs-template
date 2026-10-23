import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve, sep } from 'node:path'
import type { HeadConfig, TransformHeadContext } from 'vitepress'
import sectionsData from './sections.json'
import type { SiteConfig } from './site.config'

type Frontmatter = {
  title?: string
  description?: string
  date?: string
  updated?: string
  group?: string
  order?: number
}

interface BuildOptions {
  site: SiteConfig
  siteUrl: string
  cleanUrls: boolean
}

const SECTION_MAP = new Map(sectionsData.sections.map((s) => [s.dir, s]))
const GIT_DATE_CACHE = new Map<string, string | undefined>()

/** Last git commit date for a page, used as JSON-LD dateModified. */
function gitDate(srcDir: string, rel: string): string | undefined {
  if (GIT_DATE_CACHE.has(rel)) return GIT_DATE_CACHE.get(rel)
  let date: string | undefined
  try {
    date = execFileSync('git', ['log', '-1', '--format=%cI', '--', rel], {
      cwd: srcDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim() || undefined
  } catch {
    date = undefined
  }
  GIT_DATE_CACHE.set(rel, date)
  return date
}

export function pagePath(relativePath: string, cleanUrls = true): string {
  const path = '/' + relativePath.replace(/\.md$/, '')
  const routed = path.replace(/(^|\/)index$/, '$1')
  if (!cleanUrls && !routed.endsWith('/')) return `${routed}.html`
  return routed
}

function readFrontmatter(source: string): Frontmatter {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source)
  if (!match) return {}
  const meta: Record<string, unknown> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line)
    if (!kv) continue
    let value: unknown = kv[2].trim()
    if (typeof value === 'string') {
      value = value.replace(/^['"]|['"]$/g, '')
      if (kv[1] === 'order') value = Number(value)
    }
    meta[kv[1]] = value
  }
  return meta as Frontmatter
}

function firstHeading(source: string): string | undefined {
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
  const heading = /^#\s+(.+)$/m.exec(body)
  return heading?.[1].trim()
}

function cleanMarkdown(source: string, siteUrl: string): string {
  return source
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
    .replace(/\]\((\/[^)\s]+)\)/g, (_, url: string) => `](${siteUrl}${url})`)
    .replace(/(src|href)="(\/[^"]*)"/g, (_, attr: string, url: string) => `${attr}="${siteUrl}${url}"`)
    .trim()
}

function breadcrumbs(rel: string, title: string, site: SiteConfig, siteUrl: string, cleanUrls: boolean) {
  const [dir] = rel.split('/')
  const section = SECTION_MAP.get(dir)
  const crumbs = [{ name: site.name, item: siteUrl + '/' }]
  if (section) crumbs.push({ name: section.sidebar, item: `${siteUrl}/${section.dir}/` })
  crumbs.push({ name: title, item: `${siteUrl}${pagePath(rel, cleanUrls)}` })
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item
    }))
  }
}

export function buildHead(ctx: TransformHeadContext, { site, siteUrl, cleanUrls }: BuildOptions): HeadConfig[] {
  const { pageData } = ctx
  const rel = pageData.relativePath || 'index.md'
  const isHome = rel === 'index.md'
  const isNotFound = Boolean(pageData.isNotFound) || rel === '404.md'
  const path = pagePath(rel, cleanUrls)
  const url = siteUrl + path
  const title = isHome ? site.title : `${pageData.title || site.name} | ${site.name}`
  const description = pageData.description || site.description
  const image = siteUrl + site.ogImage
  if (isNotFound) return [['meta', { name: 'robots', content: 'noindex' }]]

  const head: HeadConfig[] = [
    ['link', { rel: 'canonical', href: url }],
    ['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }],
    ['meta', { property: 'og:site_name', content: site.name }],
    ['meta', { property: 'og:locale', content: site.lang.replace('-', '_') }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: image }]
  ]

  if (site.features.markdownCopies) {
    head.push(['link', { rel: 'alternate', type: 'text/markdown', href: `${siteUrl}/${rel}` }])
  }

  const meta = readFrontmatter(readFileSync(resolve(ctx.siteConfig.srcDir, rel), 'utf8'))
  const modified =
    meta.updated ||
    (typeof pageData.lastUpdated === 'number' ? new Date(pageData.lastUpdated).toISOString() : undefined) ||
    gitDate(ctx.siteConfig.srcDir, rel) ||
    meta.date
  const author = {
    '@type': 'Person',
    '@id': `${siteUrl}/#author`,
    name: site.author.name,
    ...(site.author.url ? { url: site.author.url } : {}),
    ...(site.author.github ? { sameAs: site.author.github } : {})
  }
  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: site.name,
    description: site.description,
    inLanguage: site.lang,
    publisher: { '@id': `${siteUrl}/#author` }
  }
  const webpage = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: site.lang,
    isPartOf: { '@id': `${siteUrl}/#website` },
    ...(meta.date ? { datePublished: meta.date } : {}),
    ...(modified ? { dateModified: modified } : {})
  }
  const graph: Record<string, unknown>[] = [website, author, webpage]

  if (isHome) {
    graph.push({
      '@type': 'WebSite',
      '@id': `${siteUrl}/#site`,
      url: `${siteUrl}/`,
      name: site.title,
      description: site.description
    })
  } else if (rel === 'about.md') {
    graph.push({ ...webpage, '@type': 'ProfilePage', mainEntity: { '@id': `${siteUrl}/#author` } })
  } else if (rel.startsWith('guide/') || rel.startsWith('reference/') || rel.startsWith('kb/')) {
    const articleType = rel.startsWith('kb/') ? 'Article' : 'TechArticle'
    graph.push({
      '@type': articleType,
      '@id': `${url}#article`,
      headline: pageData.title,
      description,
      url,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      image,
      author: { '@id': `${siteUrl}/#author` },
      publisher: { '@id': `${siteUrl}/#author` },
      inLanguage: site.lang,
      ...(meta.date ? { datePublished: meta.date } : {}),
      ...(modified ? { dateModified: modified } : {})
    })
    graph.push(breadcrumbs(rel, String(pageData.title || ''), site, siteUrl, cleanUrls))
  }

  head.push(['script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })])
  return head
}

export function buildEnd(vpSite: { pages: string[]; srcDir: string; outDir: string }, { site, siteUrl, cleanUrls }: BuildOptions) {
  const pages = vpSite.pages.filter((page) => page !== '404.md' && page.endsWith('.md'))
  const entries = makeEntries(vpSite.srcDir, pages, cleanUrls)

  if (site.features.markdownCopies) {
    for (const entry of entries) {
      const target = join(vpSite.outDir, entry.rel)
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, cleanMarkdown(entry.source, siteUrl) + '\n')
    }
  }

  if (site.features.llms) {
    writeLlms(vpSite.outDir, entries, site, siteUrl, cleanUrls)
  }

  writeRobots(vpSite.outDir, site, siteUrl)
}

interface Entry {
  rel: string
  path: string
  title: string
  description: string
  order: number
  source: string
}

function makeEntries(docsRoot: string, pages: string[], cleanUrls: boolean): Entry[] {
  return pages.map((rel) => {
    const source = readFileSync(resolve(docsRoot, rel), 'utf8')
    const meta = readFrontmatter(source)
    return {
      rel,
      path: pagePath(rel, cleanUrls),
      title: meta.title || firstHeading(source) || rel.replace(/\.md$/, ''),
      description: meta.description || '',
      order: Number.isFinite(meta.order) ? Number(meta.order) : 999,
      source
    }
  })
}

function scanPages(docsRoot: string): string[] {
  const pages: string[] = []
  const walk = (dir: string, prefix: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'public' || entry.name === 'node_modules') continue
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.isDirectory()) walk(join(dir, entry.name), rel)
      else if (entry.name.endsWith('.md')) pages.push(rel)
    }
  }
  walk(docsRoot, '')
  return pages
}

function renderLlms(entries: Entry[], site: SiteConfig, siteUrl: string, cleanUrls: boolean) {
  const docEntries = entries.filter((item) => item.rel !== 'index.md' && item.rel !== '404.md')
  const lines: string[] = [
    `# ${site.title}`,
    '',
    `> ${site.description}`,
    '',
    `- 站点：${siteUrl}/`,
    ...(site.author.url ? [`- 作者：${site.author.name}（${site.author.url}）`] : []),
    cleanUrls
      ? '- 每篇文章的 Markdown 版本：在网址后加 `.md`，例如 `/guide/getting-started.md`。'
      : '- 每篇文章的 Markdown 版本：把网址里的 `.html` 换成 `.md`，例如 `/guide/getting-started.md`。',
    '- 全站正文合集：/llms-full.txt',
    ''
  ]

  const grouped = new Set<string>()
  for (const section of sectionsData.sections) {
    const items = docEntries
      .filter((entry) => entry.rel.startsWith(`${section.dir}/`))
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'zh-CN'))
    if (!items.length) continue
    grouped.add(section.dir)
    lines.push(`## ${section.sidebar}`, '')
    for (const item of items) {
      lines.push(`- [${item.title}](${siteUrl}${item.path})${item.description ? `: ${item.description}` : ''}`)
    }
    lines.push('')
  }

  const rest = docEntries
    .filter((entry) => !grouped.has(entry.rel.split('/')[0]))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'zh-CN'))
  if (rest.length) {
    lines.push('## 其他', '')
    for (const item of rest) {
      lines.push(`- [${item.title}](${siteUrl}${item.path})${item.description ? `: ${item.description}` : ''}`)
    }
    lines.push('')
  }

  const full: string[] = [`# ${site.title}`, '', `> ${site.description}`, '', '全站正文合集。引用时请链接对应原文网址。', '']
  for (const entry of docEntries) {
    full.push('---', '', `URL: ${siteUrl}${entry.path}`, '', cleanMarkdown(entry.source, siteUrl), '')
  }

  return { index: lines.join('\n'), full: full.join('\n') }
}

function writeLlms(
  outDir: string,
  entries: Entry[],
  site: SiteConfig,
  siteUrl: string,
  cleanUrls: boolean
) {
  const { index, full } = renderLlms(entries, site, siteUrl, cleanUrls)
  writeFileSync(join(outDir, 'llms.txt'), index)
  writeFileSync(join(outDir, 'llms-full.txt'), full)
}

function writeRobots(outDir: string, site: SiteConfig, siteUrl: string) {
  const aiBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'Bytespider']
  const lines = ['User-agent: *', 'Allow: /', 'Disallow: /assets/', 'Disallow: /s/', '']
  if (site.features.aiCrawlers) {
    for (const bot of aiBots) lines.push(`User-agent: ${bot}`, 'Allow: /', '')
  }
  lines.push(`Sitemap: ${siteUrl}/sitemap.xml`, '')
  writeFileSync(join(outDir, 'robots.txt'), lines.join('\n'))
}

/**
 * Vite dev server middleware: serve the cleaned Markdown copy of a page at
 * `/path/page.md`, matching the production build output.
 */
export function markdownDevPlugin(options: { docsRoot: string; site: SiteConfig; siteUrl: string; cleanUrls: boolean }) {
  const root = resolve(options.docsRoot)
  return {
    name: 'folio-markdown-copies',
    configureServer(server: { middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void } }) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url || '').split('?')[0]
        if (pathname === '/llms.txt' || pathname === '/llms-full.txt') {
          const { index, full } = renderLlms(makeEntries(root, scanPages(root), options.cleanUrls), options.site, options.siteUrl, options.cleanUrls)
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(pathname === '/llms.txt' ? index : full)
          return
        }
        if (!pathname.endsWith('.md')) return next()
        const file = resolve(root, decodeURIComponent(pathname.replace(/^\//, '')))
        if (!file.startsWith(root + sep) || !existsSync(file)) return next()
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
        res.end(cleanMarkdown(readFileSync(file, 'utf8'), options.siteUrl) + '\n')
      })
    }
  }
}
