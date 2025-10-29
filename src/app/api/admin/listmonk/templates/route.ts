import { NextRequest, NextResponse } from 'next/server'
import { listmonkFetch, getListmonkConfig } from '@/lib/listmonk'
import { verifyAdminSession } from '@/lib/admin-auth'

export async function GET() {
  const admin = await verifyAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!getListmonkConfig()) return NextResponse.json({ error: 'Listmonk not configured' }, { status: 200 })
  try {
    const res = await listmonkFetch('/api/templates')
    const json = await res.json()
    return NextResponse.json(json, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch templates', details: String(e) }, { status: 502 })
  }
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!getListmonkConfig()) return NextResponse.json({ error: 'Listmonk not configured' }, { status: 200 })
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  try {
    const res = await listmonkFetch('/api/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const json = await res.json()
    return NextResponse.json(json, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create template', details: String(e) }, { status: 502 })
  }
}
