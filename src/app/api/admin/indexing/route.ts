export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

// Simple page indexing settings API
// Table expected: page_index_settings (path text primary key, index boolean, updated_at timestamptz default now())

export async function GET() {
  try {
    const db = createSupabaseAdminClient()
    // Try selecting extended columns if present; gracefully fall back
    let items: Array<{ path: string; index?: boolean; in_sitemap?: boolean; deleted?: boolean }> = []
    try {
      const { data, error } = await db
        .from('page_index_settings')
        .select('path,index,in_sitemap,deleted')
      if (error) throw error
      items = data || []
    } catch (e) {
      const { data, error } = await db
        .from('page_index_settings')
        .select('path,index')
      if (error) throw error
      items = (data || []).map((it: any) => ({ path: it.path, index: it.index }))
    }
    return NextResponse.json({ items }, { status: 200 })
  } catch (e) {
    console.warn('Indexing GET error', e)
    return NextResponse.json({ items: [] }, { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { path?: string; index?: boolean; in_sitemap?: boolean; deleted?: boolean }
    if (!body.path || (typeof body.index !== 'boolean' && typeof body.in_sitemap !== 'boolean' && typeof body.deleted !== 'boolean')) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const db = createSupabaseAdminClient()
    const payloadBase: any = { path: body.path }
    if (typeof body.index === 'boolean') payloadBase.index = body.index
    if (typeof body.in_sitemap === 'boolean') payloadBase.in_sitemap = body.in_sitemap
    if (typeof body.deleted === 'boolean') payloadBase.deleted = body.deleted

    // Try extended upsert first
    try {
      const { data, error } = await db
        .from('page_index_settings')
        .upsert(payloadBase, { onConflict: 'path' })
        .select('path,index,in_sitemap,deleted')
      if (error) throw error
      return NextResponse.json({ item: data?.[0] }, { status: 200 })
    } catch (primaryErr) {
      // Fallback: only upsert index if extended columns not present
      if (typeof body.index === 'boolean') {
        const { data, error } = await db
          .from('page_index_settings')
          .upsert({ path: body.path, index: body.index }, { onConflict: 'path' })
          .select('path,index')
        if (error) throw error
        return NextResponse.json({ item: data?.[0], note: 'Partial update: in_sitemap/deleted not supported' }, { status: 200 })
      }
      console.error('Indexing POST error (extended columns likely missing)', primaryErr)
      return NextResponse.json({ error: 'Database does not support requested fields' }, { status: 400 })
    }
  } catch (e) {
    console.error('Indexing POST exception', e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
