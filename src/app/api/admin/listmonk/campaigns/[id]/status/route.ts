import { NextRequest, NextResponse } from 'next/server'
import { listmonkFetch, getListmonkConfig } from '@/lib/listmonk'
import { verifyAdminSession } from '@/lib/admin-auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!getListmonkConfig()) return NextResponse.json({ error: 'Listmonk not configured' }, { status: 200 })
  const { id } = await params
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  try {
    const res = await listmonkFetch(`/api/campaigns/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const json = await res.json()
    return NextResponse.json(json, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to change status', details: String(e) }, { status: 502 })
  }
}
