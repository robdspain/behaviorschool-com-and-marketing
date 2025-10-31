import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.nextUrl.searchParams.get('token') || '';
    const supabase = createSupabaseAdminClient();
    const { data: row, error } = await supabase.from('presentations_ai').select('storage_path, topic, template').eq('id', params.id).single();
    if (error) throw error;
    if (!row?.storage_path) return NextResponse.json({ error: 'Not shareable' }, { status: 404 });
    const dl = await supabase.storage.from('presentations').download(row.storage_path);
    const file = dl.data; if (!file) return NextResponse.json({ error: 'Missing data' }, { status: 404 });
    const txt = await file.text();
    const json = JSON.parse(txt || '{}');
    if (!json.share_token || json.share_token !== token) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ title: row.topic, template: row.template || 'modern', slides: json.slides || [], templateTheme: json.templateTheme || null });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Share failed' }, { status: 500 });
  }
}

