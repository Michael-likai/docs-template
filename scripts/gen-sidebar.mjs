#!/usr/bin/env node
/**
 * Generate docs/.vitepress/sidebar.generated.json from Frontmatter.
 *
 * Every section directory listed in sections.json is scanned (one level deep).
 * Fields used: title, order, group.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docs = join(root, 'docs')
const configDir = join(docs, '.vitepress')
const sections = JSON.parse(readFileSync(join(configDir, 'sections.json'), 'utf8')).sections
const output = join(configDir, 'sidebar.generated.json')
const cleanUrls = process.env.CLEAN_URLS !== 'false'

function frontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source)
  if (!match) return {}
  const meta = {}
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line)
    if (!kv) continue
    let value = kv[2].trim().replace(/^['"]|['"]$/g, '')
    if (kv[1] === 'order') value = Number(value)
    meta[kv[1]] = value
  }
  return meta
}

function firstHeading(source) {
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
  return /^#\s+(.+)$/m.exec(body)?.[1].trim()
}

const sidebar = {}

for (const section of sections) {
  const dir = join(docs, section.dir)
  if (!existsSync(dir)) continue
  const groups = new Map()
  const files = readdirSync(dir).filter((file) => file.endsWith('.md') && file !== 'index.md')

  for (const file of files) {
    const source = readFileSync(join(dir, file), 'utf8')
    const meta = frontmatter(source)
    const title = meta.title || firstHeading(source) || file.replace(/\.md$/, '')
    const group = meta.group || section.sidebar
    const order = Number.isFinite(meta.order) ? meta.order : 999
    const slug = file.replace(/\.md$/, '')
    const link = `/${section.dir}/${slug}${cleanUrls ? '' : '.html'}`
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push({ text: title, link, order })
  }

  const items = [...groups.entries()]
    .map(([text, entries]) => ({
      text,
      entries: entries.sort((a, b) => a.order - b.order || a.text.localeCompare(b.text, 'zh-CN')),
      order: Math.min(...entries.map((entry) => entry.order))
    }))
    .sort((a, b) => a.order - b.order)

  const sectionSidebar = []
  if (existsSync(join(dir, 'index.md'))) {
    sectionSidebar.push({ text: '概览', link: `/${section.dir}/` })
  }
  for (const group of items) {
    sectionSidebar.push({
      text: group.text,
      collapsed: false,
      items: group.entries.map(({ text, link }) => ({ text, link }))
    })
  }

  if (sectionSidebar.length) sidebar[`/${section.dir}/`] = sectionSidebar
}

writeFileSync(output, JSON.stringify(sidebar, null, 2) + '\n')
const count = Object.values(sidebar).reduce((sum, groups) => sum + groups.reduce((n, g) => n + (g.items?.length || 0), 0), 0)
console.log(`sidebar: ${Object.keys(sidebar).length} sections, ${count} links`)
