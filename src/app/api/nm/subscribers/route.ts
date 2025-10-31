import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { isAuthorizedAdmin } from '@/lib/admin-config'

export async function GET() {
  try {
    const db = createSupabaseAdminClient()
    const { data, error } = await db.from('nm_subscribers').select('*').order('created_at', { ascending: false }).limit(200)
    if (error) throw error
    return NextResponse.json({ data })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch subscribers', details: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // admin guard (server-side; UI should also be protected)
    const admin = await isAuthorizedAdmin()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const { email, name, attributes, listIds } = body || {}
    if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 })

    const db = createSupabaseAdminClient()
    const { data: sub, error } = await db.from('nm_subscribers').insert({ email, name, attributes: attributes || {} }).select('*').single()
    if (error) throw error

    if (Array.isArray(listIds) && listIds.length) {
      const rows = listIds.map((lid: number) => ({ subscriber_id: sub.id, list_id: lid, status: 'subscribed' }))
      const { error: jErr } = await db.from('nm_subscriber_lists').insert(rows)
      if (jErr) throw jErr
    }

    return NextResponse.json({ ok: true, subscriber: sub })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create subscriber', details: String(e) }, { status: 500 })
  }
}

