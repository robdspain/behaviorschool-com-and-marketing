export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export async function GET() {
  const db = createSupabaseAdminClient()
  const since = new Date(Date.now() - 30*24*3600*1000).toISOString()
  const { data, error } = await db
    .from('nm_events')
    .select('type, created_at')
    .gte('created_at', since)
    .limit(20000)
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 })

  const totals = { opens: 0, clicks: 0 }
  const dailyMap = new Map<string, { date: string; opens: number; clicks: number }>()
  for (const e of (data || [])) {
    const d = new Date(e.created_at as string)
    const key = d.toISOString().slice(0,10)
    if (!dailyMap.has(key)) dailyMap.set(key, { date: key, opens: 0, clicks: 0 })
    const day = dailyMap.get(key)!
    if (e.type === 'open') { totals.opens++; day.opens++ }
    if (e.type === 'click') { totals.clicks++; day.clicks++ }
  }
  const daily = Array.from(dailyMap.values()).sort((a,b) => a.date.localeCompare(b.date))

  return NextResponse.json({ ok: true, totals, daily })
}

