export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  try {
    const supabase = createSupabaseAdminClient();
    const { data: pres, error } = await supabase
      .from('presentations_ai_docs')
      .select('title, template, data, user_id, storage_path')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    if (!pres || !pres.storage_path) return NextResponse.json({ error: 'Not shareable' }, { status: 404 });
    
    const { data: file, error: dlError } = await getSupabase().storage.from('presentations').download(pres.storage_path);
    if (dlError || !file) return NextResponse.json({ error: 'Missing data' }, { status: 404 });
    
    const txt = await file.text();
    const json = JSON.parse(txt || '{}');
    
    if (!json.share_token || json.share_token !== token) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return NextResponse.json({ 
      title: pres.title, 
      template: pres.template || 'modern', 
      slides: json.slides || [], 
      templateTheme: json.templateTheme || null 
    });
  } catch (e) {
    console.error('Share error:', e);
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Share failed' }, { status: 500 });
  }
}