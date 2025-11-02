import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

// 1x1 GIF
const GIF = Buffer.from(
  'R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64'
)

export async function GET(_: Request, { params }: { params: { cid: string; sid: string } }) {
  try {
    const cid = Number(params.cid)
    const sid = params.sid
    const db = createSupabaseAdminClient()
    await db.from('nm_events').insert({ campaign_id: cid, subscriber_id: sid, type: 'open' })
  } catch {}
  return new NextResponse(GIF, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, must-revalidate',
    }
  })
}

