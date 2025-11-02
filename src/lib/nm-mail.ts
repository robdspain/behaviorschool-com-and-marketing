import { createSupabaseAdminClient } from '@/lib/supabase-admin'

const BASE_URL = process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || ''

function absoluteUrl(path: string) {
  if (path.startsWith('http')) return path
  if (!BASE_URL) return path
  return `${BASE_URL.replace(/\/$/, '')}${path}`
}

function rewriteLinksForTracking(html: string, campaignId: number, subscriberId: string) {
  // naive rewrite: href="..." -> href="/r/click?cid=...&sid=...&url=..."
  return html.replace(/href=\"([^\"]+)\"/g, (_m, url) => {
    try {
      const wrapped = absoluteUrl(`/r/click?cid=${encodeURIComponent(String(campaignId))}&sid=${encodeURIComponent(subscriberId)}&url=${encodeURIComponent(url)}`)
      return `href="${wrapped}"`
    } catch {
      return `href="${url}"`
    }
  })
}

function injectOpenPixel(html: string, campaignId: number, subscriberId: string) {
  const pixel = `<img src="${absoluteUrl(`/r/open/${campaignId}/${subscriberId}.gif`)}" width="1" height="1" style="display:none" alt="" />`
  if (html.includes('</body>')) return html.replace('</body>', `${pixel}</body>`)
  return html + pixel
}

export async function renderCampaignHTML(opts: {
  campaign: { id: number; subject: string; body_html?: string | null; body_text?: string | null; template_id?: number | null }
  template?: { id: number; name: string; body_html: string; body_text?: string | null } | null
  subscriberId: string
}): Promise<{ html: string; text?: string }>
{
  const { campaign, template, subscriberId } = opts
  let html = campaign.body_html || ''
  let text = campaign.body_text || undefined

  if (template && template.body_html) {
    // very simple token replacement
    html = template.body_html.replace('{{content}}', html || '')
  }

  html = rewriteLinksForTracking(html, campaign.id, subscriberId)
  html = injectOpenPixel(html, campaign.id, subscriberId)

  return { html, text }
}

export async function sendEmailViaMailgun(opts: {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
}): Promise<{ ok: boolean; status: number; body?: any }>
{
  const domain = process.env.MAILGUN_DOMAIN
  const key = process.env.MAILGUN_API_KEY
  if (!domain || !key) {
    return { ok: false, status: 0, body: { error: 'mailgun_not_configured' } }
  }
  const from = opts.from || `Behavior School <hello@${domain}>`
  try {
    const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${key}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        ...(opts.text ? { text: opts.text } : {}),
      }),
    })
    let body: any
    try { body = await res.text() } catch {}
    return { ok: res.ok, status: res.status, body }
  } catch (e) {
    return { ok: false, status: 0, body: { error: 'network_error', details: String(e) } }
  }
}

export async function enqueueCampaignRecipients(campaignId: number, listIds: number[]) {
  const db = createSupabaseAdminClient()
  // Get subscribers for lists
  const { data: subs, error } = await db
    .from('nm_subscriber_lists')
    .select('subscriber_id')
    .in('list_id', listIds)
    .eq('status', 'subscribed')
  if (error) throw error
  if (!subs || subs.length === 0) return { inserted: 0 }

  const rows = subs.map(s => ({ campaign_id: campaignId, subscriber_id: s.subscriber_id, status: 'queued' }))
  const { error: qErr } = await db.from('nm_queue').insert(rows)
  if (qErr) throw qErr
  return { inserted: rows.length }
}

export async function processQueueBatch(limit = 100) {
  const db = createSupabaseAdminClient()
  // Fetch due queued items
  const nowIso = new Date().toISOString()
  const { data: q, error: qErr } = await db
    .from('nm_queue')
    .select('*')
    .eq('status', 'queued')
    .or(`scheduled_at.is.null,scheduled_at.lte.${nowIso}`)
    .order('id', { ascending: true })
    .limit(limit)
  if (qErr) throw qErr
  if (!q || q.length === 0) return { processed: 0 }

  for (const row of q) {
    try {
      // Load campaign and subscriber
      const [{ data: camp }, { data: sub }] = await Promise.all([
        db.from('nm_campaigns').select('*').eq('id', row.campaign_id).single(),
        db.from('nm_subscribers').select('*').eq('id', row.subscriber_id).single(),
      ])
      if (!camp || !sub) {
        await db.from('nm_queue').update({ status: 'failed', last_error: 'missing campaign or subscriber' }).eq('id', row.id)
        continue
      }
      // Load template if any
      let template: any = null
      if (camp.template_id) {
        const { data: t } = await db.from('nm_templates').select('*').eq('id', camp.template_id).single()
        template = t
      }
      const { html, text } = await renderCampaignHTML({ campaign: camp, template, subscriberId: sub.id })
      const fromEmail = process.env.MAIL_FROM_EMAIL || ''
      const res = await sendEmailViaMailgun({ to: sub.email, subject: camp.subject, html, text, from: fromEmail || undefined })
      if (!res.ok) {
        await db.from('nm_queue').update({ status: 'failed', attempts: (row.attempts || 0) + 1, last_error: String(res.body || res.status) }).eq('id', row.id)
        continue
      }
      await db.from('nm_queue').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', row.id)
    } catch (e) {
      await db.from('nm_queue').update({ status: 'failed', attempts: (row.attempts || 0) + 1, last_error: String(e) }).eq('id', row.id)
    }
  }
  return { processed: q.length }
}
