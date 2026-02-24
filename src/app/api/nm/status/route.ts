export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const db = createSupabaseAdminClient()
    // Probe minimal health: count subscribers/lists/campaigns if tables exist
    const [subs, lists, camps] = await Promise.all([
      db.from('nm_subscribers').select('id', { count: 'exact', head: true }),
      db.from('nm_lists').select('id', { count: 'exact', head: true }),
      db.from('nm_campaigns').select('id', { count: 'exact', head: true }),
    ])
    return NextResponse.json({
      ok: true,
      configured: true,
      status: {
        subscribers: subs.count ?? 0,
        lists: lists.count ?? 0,
        campaigns: camps.count ?? 0,
      }
    })
  } catch (e) {
    return NextResponse.json({ ok: false, configured: false, error: 'Database unavailable', details: String(e) }, { status: 500 })
  }
}

