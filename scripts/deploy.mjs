#!/usr/bin/env node
/**
 * Build once, then deploy to one or both targets.
 *
 *   npm run deploy:cloudflare
 *   npm run deploy:edgeone
 *   npm run deploy            # both
 *
 * Secrets come from the environment or a local .env file (see .env.example).
 */
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(resolve(root, '.env'))
  } catch {
    // .env is optional
  }
}

const target = process.argv[2] || 'all'
const dryRun = process.argv.includes('--dry-run')

function run(command) {
  console.log(`\n$ ${command}`)
  if (dryRun) return
  execSync(command, { cwd: root, stdio: 'inherit' })
}

function need(name) {
  if (!process.env[name]) {
    console.error(`缺少环境变量 ${name}，请参考 .env.example`)
    process.exit(1)
  }
}

if (!['cloudflare', 'edgeone', 'all'].includes(target)) {
  console.error('用法: node scripts/deploy.mjs [cloudflare|edgeone|all] [--dry-run]')
  process.exit(1)
}

if (process.env.SKIP_BUILD !== '1') {
  run('npm run build')
} else if (!existsSync(resolve(root, 'docs/.vitepress/dist'))) {
  console.error('SKIP_BUILD=1 但没有 dist，请先构建')
  process.exit(1)
}

if (target === 'cloudflare' || target === 'all') {
  if (!process.env.CLOUDFLARE_API_TOKEN) {
    console.warn('\n跳过 Cloudflare：缺少 CLOUDFLARE_API_TOKEN')
    if (target === 'cloudflare') process.exit(1)
  } else {
    const project = process.env.CF_PAGES_PROJECT || 'folio-docs'
    run(
      `npx -y wrangler@3 pages deploy docs/.vitepress/dist --project-name ${project} --branch main --commit-dirty=true`
    )
  }
}

if (target === 'edgeone' || target === 'all') {
  if (!process.env.EDGEONE_API_TOKEN || !process.env.EDGEONE_PROJECT) {
    console.warn('\n跳过 EdgeOne：缺少 EDGEONE_API_TOKEN / EDGEONE_PROJECT')
    if (target === 'edgeone') process.exit(1)
  } else {
    run('node scripts/edgeone.mjs')
    const cli = process.env.EDGEONE_CLI || 'edgeone'
    if (!dryRun) {
      try {
        execSync(`command -v ${cli}`, { stdio: 'ignore' })
      } catch {
        console.error(`没有找到 ${cli} CLI。请先安装：npm i -g edgeone（或设置 EDGEONE_CLI 指向可执行文件）`)
        process.exit(1)
      }
    }
    run(
      `${cli} makers deploy .deploy/edgeone -n ${process.env.EDGEONE_PROJECT} -t ${process.env.EDGEONE_API_TOKEN}`
    )
  }
}

console.log('\n完成。')
