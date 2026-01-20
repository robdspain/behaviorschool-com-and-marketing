import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('presentations_ai_docs')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 });
  const title = `${data.title} (Copy)`;
  const { data: ins, error: e2 } = await supabase
    .from('presentations_ai_docs')
    .insert({ title, template: data.template, data: data.data })
    .select('id')
    .single();
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: ins?.id });
}

