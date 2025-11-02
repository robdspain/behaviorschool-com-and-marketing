import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { renderCampaignHTML } from '@/lib/nm-mail'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const db = createSupabaseAdminClient()
  const { data: camp, error } = await db.from('nm_campaigns').select('*').eq('id', id).single()
  if (error || !camp) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  let template: any = null
  if (camp.template_id) {
    const { data: t } = await db.from('nm_templates').select('*').eq('id', camp.template_id).single()
    template = t
  }
  // For preview, use fake subscriber id
  const { html } = await renderCampaignHTML({ campaign: camp, template, subscriberId: 'preview-subscriber' })
  return NextResponse.json({ html })
}

