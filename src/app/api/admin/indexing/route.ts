import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

// Simple page indexing settings API
// Table expected: page_index_settings (path text primary key, index boolean, updated_at timestamptz default now())

export async function GET() {
  try {
    const db = createSupabaseAdminClient()
    const { data, error } = await db
      .from('page_index_settings')
      .select('path,index')

    if (error) {
      console.warn('Indexing GET: table missing or query error', error)
      return NextResponse.json({ items: [] }, { status: 200 })
    }

    return NextResponse.json({ items: data || [] }, { status: 200 })
  } catch (e) {
    console.warn('Indexing GET error', e)
    return NextResponse.json({ items: [] }, { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { path?: string; index?: boolean }
    if (!body.path || typeof body.index !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const db = createSupabaseAdminClient()
    const { data, error } = await db
      .from('page_index_settings')
      .upsert({ path: body.path, index: body.index }, { onConflict: 'path' })
      .select('path,index')

    if (error) {
      console.error('Indexing POST error', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    return NextResponse.json({ item: data?.[0] }, { status: 200 })
  } catch (e) {
    console.error('Indexing POST exception', e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

