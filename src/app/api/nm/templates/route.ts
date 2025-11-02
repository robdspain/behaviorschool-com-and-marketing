import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

export async function GET() {
  const db = createSupabaseAdminClient()
  const { data, error } = await db.from('nm_templates').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { name, body_html, body_text } = body || {}
  if (!name || !body_html) return NextResponse.json({ error: 'name and body_html are required' }, { status: 400 })
  const db = createSupabaseAdminClient()
  const { data, error } = await db.from('nm_templates').insert({ name, body_html, body_text }).select('*').single()
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 })
  return NextResponse.json({ data })
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { id, ...updates } = body || {}
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  const db = createSupabaseAdminClient()
  const { data, error } = await db.from('nm_templates').update(updates).eq('id', id).select('*').single()
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = Number(searchParams.get('id'))
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  const db = createSupabaseAdminClient()
  const { error } = await db.from('nm_templates').delete().eq('id', id)
  if (error) return NextResponse.json({ error: String(error) }, { status: 500 })
  return NextResponse.json({ ok: true })
}

