import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')
    if (!url) return NextResponse.json({ ok: false, error: 'Missing url' }, { status: 400 })
    const res = await fetch(url, { cache: 'no-store', redirect: 'follow' })
    const ct = res.headers.get('content-type') || null
    return NextResponse.json({ ok: res.ok, status: res.status, contentType: ct, finalUrl: res.url })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}

