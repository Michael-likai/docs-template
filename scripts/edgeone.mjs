#!/usr/bin/env node
/**
 * Prepare the VitePress dist folder for EdgeOne Makers:
 * - copy dist to .deploy/edgeone
 * - generate edgeone.json (redirects, cache headers, MIME types)
 * - optionally generate an Edge Function that proxies Umami under /s
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'docs/.vitepress/dist')
const out = join(root, '.deploy/edgeone')

if (!existsSync(dist)) {
  console.error('没有找到 dist，请先运行 npm run build')
  process.exit(1)
}

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
cpSync(dist, out, { recursive: true })

const redirects = existsSync(join(root, 'redirects.json'))
  ? JSON.parse(readFileSync(join(root, 'redirects.json'), 'utf8'))
  : []

const headers = [
  {
    source: '/assets/*',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
  },
  {
    source: '/*',
    headers: [
      { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' }
    ]
  },
  {
    source: '/*.md',
    headers: [{ key: 'Content-Type', value: 'text/markdown; charset=utf-8' }]
  },
  {
    source: '/llms.txt',
    headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }]
  },
  {
    source: '/llms-full.txt',
    headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }]
  },
  {
    source: '/sitemap.xml',
    headers: [{ key: 'Content-Type', value: 'application/xml; charset=utf-8' }]
  },
  {
    source: '/*.mp4',
    headers: [{ key: 'Accept-Ranges', value: 'bytes' }]
  }
]

writeFileSync(
  join(out, 'edgeone.json'),
  JSON.stringify(
    {
      redirects: redirects.map((item) => ({
        source: item.source,
        destination: item.destination,
        statusCode: item.statusCode || 301
      })),
      headers
    },
    null,
    2
  ) + '\n'
)

const proxyUmami = Boolean(process.env.UMAMI_WEBSITE_ID)
if (proxyUmami) {
  const scriptUrl = process.env.UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js'
  const sendUrl = process.env.UMAMI_SEND_URL || 'https://gateway.umami.is/api/send'
  const fnDir = join(out, 'edge-functions/s')
  mkdirSync(fnDir, { recursive: true })
  writeFileSync(
    join(fnDir, '[[default]].js'),
    `const SCRIPT = ${JSON.stringify(scriptUrl)}
const SEND = ${JSON.stringify(sendUrl)}

async function script() {
  const upstream = await fetch(SCRIPT)
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}

async function send(request) {
  if (request.method !== 'POST') return new Response(null, { status: 405 })
  const headers = new Headers({
    'Content-Type': 'application/json',
    'User-Agent': request.headers.get('User-Agent') || ''
  })
  const ip = request.headers.get('EO-Connecting-IP') || (request.headers.get('X-Forwarded-For') || '').split(',')[0].trim()
  if (ip) {
    headers.set('X-Forwarded-For', ip)
    headers.set('X-Real-IP', ip)
  }
  const language = request.headers.get('Accept-Language')
  if (language) headers.set('Accept-Language', language)
  const upstream = await fetch(SEND, { method: 'POST', headers, body: await request.text() })
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
      'Cache-Control': 'no-store'
    }
  })
}

export async function onRequest(context) {
  const path = new URL(context.request.url).pathname
  if (path === '/s/a.js') return script()
  if (path === '/s/api/send') return send(context.request)
  return new Response('Not Found', { status: 404 })
}
`
  )
}

console.log(`EdgeOne output: ${out}`)
console.log(`redirects: ${redirects.length}, Umami proxy: ${proxyUmami ? 'on' : 'off'}`)
