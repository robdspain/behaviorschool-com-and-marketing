import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { enqueueCampaignRecipients } from '@/lib/nm-mail'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const body = await req.json().catch(() => ({}))
  const { status, scheduled_at } = body || {}
  if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 })
  const db = createSupabaseAdminClient()

  // Update campaign status
  const { data: camp, error } = await db
    .from('nm_campaigns')
    .update({ status, ...(scheduled_at ? { scheduled_at } : {}) })
    .eq('id', id)
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 })

  if (status === 'running') {
    // Fetch campaign lists
    const { data: cls, error: cErr } = await db.from('nm_campaign_lists').select('list_id').eq('campaign_id', id)
    if (cErr) return NextResponse.json({ error: String(cErr) }, { status: 500 })
    const listIds = (cls || []).map(r => r.list_id)
    if (listIds.length === 0) return NextResponse.json({ error: 'No lists attached to campaign' }, { status: 400 })
    // avoid double enqueue
    const { count } = await db.from('nm_queue').select('id', { count: 'exact', head: true }).eq('campaign_id', id)
    if ((count || 0) > 0) return NextResponse.json({ ok: true, enqueued: 0, note: 'queue already exists' })
    const { inserted } = await enqueueCampaignRecipients(id, listIds)
    return NextResponse.json({ ok: true, enqueued: inserted })
  }

  return NextResponse.json({ ok: true, campaign: camp })
}
