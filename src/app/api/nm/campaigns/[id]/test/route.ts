import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { renderCampaignHTML, sendEmailViaMailgun } from '@/lib/nm-mail'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}))
  const emails: string[] = (body?.emails || body?.subscribers || '').split(',').map((s: string) => s.trim()).filter(Boolean)
  if (!emails.length) return NextResponse.json({ error: 'emails required' }, { status: 400 })
  const db = createSupabaseAdminClient()
  const { data: camp, error } = await db.from('nm_campaigns').select('*').eq('id', id).single()
  if (error || !camp) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  let template: any = null
  if (camp.template_id) {
    const { data: t } = await db.from('nm_templates').select('*').eq('id', camp.template_id).single()
    template = t
  }
  const results: any[] = []
  for (const to of emails) {
    const { html, text } = await renderCampaignHTML({ campaign: camp, template, subscriberId: 'test-subscriber' })
    const res = await sendEmailViaMailgun({ to, subject: `[TEST] ${camp.subject}`, html, text })
    results.push({ to, ok: res.ok, status: res.status })
  }
  return NextResponse.json({ ok: true, results })
}

