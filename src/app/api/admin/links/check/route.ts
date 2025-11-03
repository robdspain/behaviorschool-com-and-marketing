import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

function sanitizeUrl(u: string): string | null {
  try {
    const url = new URL(u)
    if (!/^https?:$/.test(url.protocol)) return null
    return url.toString()
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const urlParam = searchParams.get('url')
  const method = (searchParams.get('method') || 'HEAD').toUpperCase()
  const url = urlParam ? sanitizeUrl(urlParam) : null
  if (!url) return new Response(JSON.stringify({ ok: false, error: 'invalid_url' }), { status: 400 })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  try {
    const res = await fetch(url, { method: method === 'GET' ? 'GET' : 'HEAD', redirect: 'follow', signal: controller.signal })
    clearTimeout(timeout)
    return new Response(JSON.stringify({ ok: res.ok, status: res.status }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    clearTimeout(timeout)
    return new Response(JSON.stringify({ ok: false, error: 'fetch_error' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }
}

