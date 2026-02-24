export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function GET() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('presentations_ai_docs')
    .select('id,title,template,created_at,updated_at')
    .order('updated_at', { ascending: false })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data || [] });
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseAdminClient();
  const body = await req.json();
  const { id, title, template, data } = body || {};
  if (!title || !data) return NextResponse.json({ error: 'title and data are required' }, { status: 400 });
  if (id) {
    const { error } = await supabase
      .from('presentations_ai_docs')
      .update({ title, template: template || 'modern', data, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id });
  } else {
    const { data: ins, error } = await supabase
      .from('presentations_ai_docs')
      .insert({ title, template: template || 'modern', data })
      .select('id')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id: ins?.id });
  }
}

