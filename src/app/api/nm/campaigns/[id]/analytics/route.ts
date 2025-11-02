import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

type Daily = { date: string; opens: number; clicks: number }

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (!id) return NextResponse.json({ error: 'invalid id' }, { status: 400 })
  const db = createSupabaseAdminClient()

  // Pull recent events and top links
  const [ev, links] = await Promise.all([
    db.from('nm_events').select('type, created_at, url').eq('campaign_id', id).gte('created_at', new Date(Date.now() - 30*24*3600*1000).toISOString()).limit(10000),
    db.from('nm_links').select('url, click_count').eq('campaign_id', id).order('click_count', { ascending: false }).limit(20)
  ])
  if (ev.error) return NextResponse.json({ error: String(ev.error) }, { status: 500 })
  if (links.error) return NextResponse.json({ error: String(links.error) }, { status: 500 })

  const events = ev.data || []
  const totals = { opens: 0, clicks: 0 }
  const dailyMap = new Map<string, Daily>()
  for (const e of events as any[]) {
    const d = new Date(e.created_at)
    const key = d.toISOString().slice(0,10)
    if (!dailyMap.has(key)) dailyMap.set(key, { date: key, opens: 0, clicks: 0 })
    const day = dailyMap.get(key)!
    if (e.type === 'open') { totals.opens++; day.opens++ }
    if (e.type === 'click') { totals.clicks++; day.clicks++ }
  }
  const daily = Array.from(dailyMap.values()).sort((a,b) => a.date.localeCompare(b.date))

  const linkTop = (links.data || []).map(l => ({ url: l.url, clicks: l.click_count }))

  return NextResponse.json({
    ok: true,
    totals,
    daily,
    linkTop,
  })
}

