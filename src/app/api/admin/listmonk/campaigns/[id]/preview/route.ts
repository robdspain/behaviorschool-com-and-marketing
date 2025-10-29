import { NextRequest, NextResponse } from 'next/server'
import { listmonkFetch, getListmonkConfig } from '@/lib/listmonk'
import { verifyAdminSession } from '@/lib/admin-auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await verifyAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!getListmonkConfig()) return NextResponse.json({ error: 'Listmonk not configured' }, { status: 200 })
  const id = params.id
  try {
    const res = await listmonkFetch(`/api/campaigns/${id}/preview`)
    const text = await res.text()
    // Return HTML as text to render in iframe srcdoc on client
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch preview', details: String(e) }, { status: 502 })
  }
}
