export const DEFAULT_GSC_SITE_URLS = [
  'https://behaviorstudytools.com/',
  'https://study.behaviorschool.com/',
] as const

type SearchConsoleEnv = {
  BST_GSC_SITE_URL?: string
  BST_GSC_SITE_URLS?: string
}

function normalizeSearchConsoleProperty(value: string) {
  const property = value.trim().slice(0, 500)
  if (!property) return ''
  if (property.startsWith('sc-domain:')) return property

  try {
    const url = new URL(property)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return ''
    url.hash = ''
    url.search = ''
    return url.toString()
  } catch {
    return ''
  }
}

export function resolveSearchConsoleSiteUrls(env?: SearchConsoleEnv) {
  const source = env || {
    BST_GSC_SITE_URL: process.env.BST_GSC_SITE_URL,
    BST_GSC_SITE_URLS: process.env.BST_GSC_SITE_URLS,
  }
  const configured = (source.BST_GSC_SITE_URLS || '').split(',')
  const legacy = source.BST_GSC_SITE_URL ? [source.BST_GSC_SITE_URL] : []

  return [...new Set([
    ...legacy,
    ...configured,
    ...DEFAULT_GSC_SITE_URLS,
  ].map(normalizeSearchConsoleProperty).filter(Boolean))]
}
