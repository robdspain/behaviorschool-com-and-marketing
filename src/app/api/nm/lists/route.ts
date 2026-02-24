export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export async function GET() {
  const db = createSupabaseAdminClient()
  const { data, error } = await db.from('nm_lists').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { name, visibility = 'public', optin = 'single', description } = body || {}
  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })
  const db = createSupabaseAdminClient()
  const { data, error } = await db.from('nm_lists').insert({ name, visibility, optin, description }).select('*').single()
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { id, ...updates } = body || {}
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  const db = createSupabaseAdminClient()
  const { data, error } = await db.from('nm_lists').update(updates).eq('id', id).select('*').single()
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = Number(searchParams.get('id'))
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  const db = createSupabaseAdminClient()
  const { error } = await db.from('nm_lists').delete().eq('id', id)
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 })
  return NextResponse.json({ ok: true })
}

