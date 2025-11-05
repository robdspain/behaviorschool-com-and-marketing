import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/((?!_next|api/admin/indexing|api/health|assets|images|optimized|thumbnails|favicon.ico|robots.txt|sitemap.xml).*)'],
}

let cachedPaths: { ts: number; noindex: Set<string>; deleted: Set<string> } = { ts: 0, noindex: new Set(), deleted: new Set() }

async function loadIndexFlags(): Promise<{ noindex: Set<string>; deleted: Set<string> }> {
  const now = Date.now()
  if (now - cachedPaths.ts < 60_000 && (cachedPaths.noindex.size > 0 || cachedPaths.deleted.size > 0)) {
    return { noindex: cachedPaths.noindex, deleted: cachedPaths.deleted }
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://behaviorschool.com'}/api/admin/indexing`, { cache: 'no-store' })
    const json = await res.json().catch(() => ({ items: [] }))
    const noindex = new Set<string>()
    const deleted = new Set<string>()
    for (const it of json.items || []) {
      if (it && typeof it.path === 'string') {
        if (it.index === false) noindex.add(it.path)
        if (it.deleted === true) deleted.add(it.path)
      }
    }
    cachedPaths = { ts: now, noindex, deleted }
    return { noindex, deleted }
  } catch {
    return { noindex: cachedPaths.noindex, deleted: cachedPaths.deleted }
  }
}

export async function middleware(req: NextRequest) {
  const urlPath = req.nextUrl.pathname
  const { noindex: noidx, deleted } = await loadIndexFlags()
  if (deleted.has(urlPath)) {
    const res = NextResponse.rewrite(new URL('/not-found', req.url))
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return res
  }
  // Exact path match; can be extended to prefix if needed
  if (noidx.has(urlPath)) {
    const res = NextResponse.next()
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return res
  }
  return NextResponse.next()
}
