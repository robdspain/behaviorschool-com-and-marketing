import type { NextRequest } from 'next/server'
import sharp from 'sharp'

export const dynamic = 'force-dynamic'

function getGhostBase(): string {
  const raw = process.env.NEXT_PUBLIC_GHOST_CONTENT_URL || 'https://ghost.behaviorschool.com/ghost/api/content'
  // Strip Ghost API suffix if present to get the site base (serves /content/images/...)
  return raw.replace(/\/?ghost\/api\/content\/?$/, '').replace(/\/$/, '')
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const base = getGhostBase()
    const restPath = (path || []).join('/')

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
    headers.set('Cache-Control', 'public, max-age=604800, immutable')

    // If SVG or unsupported, pass through without processing
    const isProcessable = /image\/(png|jpeg|jpg|webp)/i.test(ct)
    const sourceBuf = Buffer.from(await upstream.arrayBuffer())

    // Parse optional transform params; only process if explicitly requested
    const url = new URL(req.url)
    const wParam = url.searchParams.get('w')
    const qParam = url.searchParams.get('q')
    const fParam = url.searchParams.get('f') // webp|avif|jpeg
    const maxWidth = Math.max(1, Math.min(4096, Number(wParam) || 1600))
    const quality = Math.max(40, Math.min(90, Number(qParam) || 75))
    const targetFormat = (fParam === 'avif' || fParam === 'jpeg' || fParam === 'webp') ? fParam : 'webp'

    const hasTransforms = Boolean(wParam || qParam || fParam)

    if (!isProcessable || !hasTransforms) {
      headers.set('Content-Type', ct)
      return new Response(sourceBuf as unknown as BodyInit, { status: 200, headers })
    }

    try {
      const img = sharp(sourceBuf, { limitInputPixels: 268435456 /* 16k x 16k */ }).rotate()
      const meta = await img.metadata()
      const width = meta.width || maxWidth
      const finalWidth = Math.min(width, maxWidth)

      let pipeline = img.resize({ width: finalWidth, withoutEnlargement: true })
      if (targetFormat === 'avif') {
        pipeline = pipeline.avif({ quality, effort: 4 })
        headers.set('Content-Type', 'image/avif')
      } else if (targetFormat === 'jpeg') {
        pipeline = pipeline.jpeg({ quality, mozjpeg: true })
        headers.set('Content-Type', 'image/jpeg')
      } else {
        pipeline = pipeline.webp({ quality })
        headers.set('Content-Type', 'image/webp')
      }
      const out = await pipeline.toBuffer()
      return new Response(out as unknown as BodyInit, { status: 200, headers })
    } catch (err) {
      // Fallback to original bytes if processing fails
      console.error('[media/ghost] sharp processing failed, falling back', err)
      headers.set('Content-Type', ct)
      return new Response(sourceBuf as unknown as BodyInit, { status: 200, headers })
    }
  } catch (e) {
    console.error('[media/ghost] proxy error', e)
    return new Response('Proxy error', { status: 500 })
  }
}