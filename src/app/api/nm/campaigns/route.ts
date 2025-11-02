import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export async function GET() {
  const db = createSupabaseAdminClient()
  const { data, error } = await db.from('nm_campaigns').select('*').order('created_at', { ascending: false }).limit(50)
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { name, subject, body_html, body_text, template_id, list_ids, schedule_at } = body || {}
  if (!name || !subject) return NextResponse.json({ error: 'name and subject are required' }, { status: 400 })
  const db = createSupabaseAdminClient()
  const { data: camp, error } = await db
    .from('nm_campaigns')
    .insert({ name, subject, body_html: body_html || null, body_text: body_text || null, template_id: template_id || null, status: schedule_at ? 'scheduled' : 'draft', scheduled_at: schedule_at || null })
    .select('*').single()
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 })

  // Link lists if provided
  if (Array.isArray(list_ids) && list_ids.length) {
    const rows = list_ids.map((lid: number) => ({ campaign_id: camp.id, list_id: lid }))
    const { error: jErr } = await db.from('nm_campaign_lists').insert(rows)
    if (jErr) return NextResponse.json({ error: String(jErr) }, { status: 500 })
  }
  return NextResponse.json({ data: camp })
}

