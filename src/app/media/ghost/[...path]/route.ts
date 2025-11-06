import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

function getGhostBase(): string {
  const raw = process.env.NEXT_PUBLIC_GHOST_CONTENT_URL || 'https://ghost.behaviorschool.com/ghost/api/content'
  // Strip Ghost API suffix if present to get the site base (serves /content/images/...)
  return raw.replace(/\/?ghost\/api\/content\/?$/, '').replace(/\/$/, '')
}

export async function GET(_req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const base = getGhostBase()
    const restPath = (params.path || []).join('/')

    // Only proxy content images for safety
    const safePath = restPath.startsWith('content/images/') ? restPath : `content/images/${restPath.replace(/^\/?/, '')}`
    const targetUrl = `${base}/${safePath}`

    const upstream = await fetch(targetUrl, {
      cache: 'no-store',
      redirect: 'follow',
      headers: {
        Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
        'User-Agent': 'BehaviorSchoolImageProxy/1.0'
      }
    })
    if (!upstream.ok) {
      console.error('[media/ghost] upstream error', upstream.status, targetUrl)
      return new Response('Not found', { status: upstream.status, headers: { 'X-Upstream-Status': String(upstream.status) } })
    }

    // Copy headers but avoid hop-by-hop
    const headers = new Headers()
    const ct = upstream.headers.get('content-type') || 'application/octet-stream'
    headers.set('Content-Type', ct)
    headers.set('Cache-Control', 'public, max-age=604800, immutable')

    const buf = await upstream.arrayBuffer()
    return new Response(buf, { status: 200, headers })
  } catch (e) {
    console.error('[media/ghost] proxy error', e)
    return new Response('Proxy error', { status: 500 })
  }
}
