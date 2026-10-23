#!/usr/bin/env node
/**
 * Create a new Markdown page.
 *
 *   npm run new -- guide/my-page "我的页面"
 *   npm run new -- kb/troubleshooting
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sections = JSON.parse(readFileSync(join(root, 'docs/.vitepress/sections.json'), 'utf8')).sections
const args = process.argv.slice(2).filter((arg) => arg !== '--force')
const force = process.argv.includes('--force')
const target = args[0]

if (!target) {
  console.error('用法: npm run new -- <section>/<slug> [标题] [--force]')
  console.error('示例: npm run new -- guide/writing-content "写内容"')
  process.exit(1)
}

const [sectionDir, slug] = target.replace(/^\/+/, '').split('/')
const section = sections.find((item) => item.dir === sectionDir)
if (!section || !slug) {
  console.error(`未知分区 "${sectionDir}"。可选: ${sections.map((item) => item.dir).join(', ')}`)
  process.exit(1)
}

const file = join(root, 'docs', sectionDir, `${slug}.md`)
if (existsSync(file) && !force) {
  console.error(`已存在: ${file}（加 --force 覆盖）`)
  process.exit(1)
}

const title = args[1] || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
const content = `---
title: ${title}
description: 用一句话说明这篇文档解决什么问题。
order: 99
group: ${section.sidebar}
tags: []
---

# ${title}

在这里开始写正文。

## 下一步

- 补充示例
- 链接到相关章节
`
writeFileSync(file, content)
console.log(`created docs/${sectionDir}/${slug}.md`)
console.log('提示: 修改 order 控制排序，运行 npm run dev 预览。')
