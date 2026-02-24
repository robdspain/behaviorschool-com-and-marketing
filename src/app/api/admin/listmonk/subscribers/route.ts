export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { upsertListmonkSubscriber, getListmonkConfig } from '@/lib/listmonk'
import { verifyAdminSession } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const admin = await verifyAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!getListmonkConfig()) {
    return NextResponse.json({ error: 'Listmonk not configured' }, { status: 200 })
  }
  let json: any
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { email, name = '', lists = [], attribs = {}, preconfirm = true } = json || {}
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const result = await upsertListmonkSubscriber({ email, name, lists, attribs, preconfirm })
  return NextResponse.json(result.body ?? { ok: result.ok }, { status: result.ok ? 200 : 502 })
}
