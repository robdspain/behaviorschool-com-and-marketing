import { NextResponse } from 'next/server'
import { listmonkFetch, getListmonkConfig } from '@/lib/listmonk'
import { verifyAdminSession } from '@/lib/admin-auth'

export async function GET() {
  const admin = await verifyAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const cfg = getListmonkConfig()
  if (!cfg) {
    return NextResponse.json({ error: 'Listmonk not configured' }, { status: 200 })
  }
  try {
    const res = await listmonkFetch('/api/lists?per_page=100')
    const json = await res.json()
    return NextResponse.json(json, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch lists', details: String(e) }, { status: 502 })
  }
}
