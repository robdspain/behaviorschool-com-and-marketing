import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/((?!_next|api/admin/indexing|api/health|assets|images|optimized|thumbnails|favicon.ico|robots.txt|sitemap.xml).*)'],
}

let cachedPaths: { ts: number; noindex: Set<string> } = { ts: 0, noindex: new Set() }

async function loadNoIndex(): Promise<Set<string>> {
  const now = Date.now()
  if (now - cachedPaths.ts < 60_000 && cachedPaths.noindex.size > 0) {
    return cachedPaths.noindex
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://behaviorschool.com'}/api/admin/indexing`, { cache: 'no-store' })
    const json = await res.json().catch(() => ({ items: [] }))
    const set = new Set<string>()
    for (const it of json.items || []) {
      if (it && typeof it.path === 'string' && it.index === false) set.add(it.path)
    }
    cachedPaths = { ts: now, noindex: set }
    return set
  } catch {
    return cachedPaths.noindex
  }
}

export async function middleware(req: NextRequest) {
  const urlPath = req.nextUrl.pathname
  const noidx = await loadNoIndex()
  // Exact path match; can be extended to prefix if needed
  if (noidx.has(urlPath)) {
    const res = NextResponse.next()
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return res
  }
  return NextResponse.next()
}

