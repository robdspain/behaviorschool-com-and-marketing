import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const { topic, template = 'modern', tone = 'professional', language = 'English', provider = 'google', model = '', slides } = await req.json();
    if (!topic || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json({ error: 'topic and slides are required' }, { status: 400 });
    }
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('presentations_ai')
      .insert({
        topic: String(topic).slice(0, 1000),
        slide_count: slides.length,
        template,
        tone,
        language,
        provider,
        model,
        export_format: 'pptx',
        storage_path: null,
        slides,
      })
      .select('id')
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, id: data?.id });
  } catch (e) {
    console.error('Create draft error:', e);
    return NextResponse.json({ error: 'Failed to create draft' }, { status: 500 });
  }
}

