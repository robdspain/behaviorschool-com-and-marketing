import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cid = Number(searchParams.get('cid'))
  const sid = searchParams.get('sid') || null
  const url = searchParams.get('url')
  if (!url) return NextResponse.redirect('https://behaviorschool.com', 302)

  try {
    const db = createSupabaseAdminClient()
    // upsert link and increment click
    const { data: linkRow } = await db
      .from('nm_links')
      .select('*')
      .eq('campaign_id', cid)
      .eq('url', url)
      .maybeSingle()
    if (linkRow) {
      await db.from('nm_links').update({ click_count: (linkRow.click_count || 0) + 1 }).eq('id', linkRow.id)
    } else {
      await db.from('nm_links').insert({ campaign_id: cid, url, click_count: 1 })
    }
    await db.from('nm_events').insert({ campaign_id: cid, subscriber_id: sid, type: 'click', url })
  } catch {}

  return NextResponse.redirect(url, 302)
}

