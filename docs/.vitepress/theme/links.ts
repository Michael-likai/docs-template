import { withBase } from 'vitepress'

declare const __CLEAN_URLS__: boolean

/**
 * Build an internal href that respects VitePress `base` and `cleanUrls`.
 * Custom components cannot rely on the markdown link rewriter, so they use
 * this helper instead of `withBase` for page links.
 */
export function withPage(link: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(link) || link.startsWith('mailto:') || link.startsWith('#')) return link
  const match = /^([^?#]*)(.*)$/.exec(link)
  const path = match?.[1] ?? link
  const tail = match?.[2] ?? ''
  const suffix = !__CLEAN_URLS__ && !path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path) ? '.html' : ''
  return withBase(path + suffix + tail)
}
