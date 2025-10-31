import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { topic, template = 'modern', tone = 'professional', language = 'English', provider = 'google', model = '', slides } = await req.json();
    if (!topic || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json({ error: 'topic and slides are required' }, { status: 400 });
    }
    const supabase = createSupabaseAdminClient();

    // Ensure storage bucket exists
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const has = (buckets || []).some((b) => b.name === 'presentations');
      if (!has) {
        await supabase.storage.createBucket('presentations', { public: false });
      }
    } catch (e) {
      // proceed; if creation fails later upload will surface error
    }
    const id = crypto.randomUUID();
    const storagePath = `drafts/${id}.json`;
    // Upload a lightweight draft record so storage_path is non-null
    const bytes = Buffer.from(JSON.stringify({ topic, template, tone, language, provider, model, slides }, null, 2), 'utf8');
    const { error: upErr } = await supabase.storage.from('presentations').upload(storagePath, bytes, { contentType: 'application/json', upsert: false });
    if (upErr) throw upErr;

    const { data, error } = await supabase
      .from('presentations_ai')
      .insert({
        id,
        topic: String(topic).slice(0, 1000),
        slide_count: slides.length,
        template,
        tone,
        language,
        provider,
        model,
        export_format: 'pptx',
        storage_path: storagePath,
      })
      .select('id')
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, id: data?.id });
  } catch (e) {
    const anyErr: any = e;
    const msg = anyErr?.message || (typeof anyErr === 'string' ? anyErr : JSON.stringify(anyErr));
    console.error('Create draft error:', msg);
    return NextResponse.json({ error: msg || 'Failed to create draft' }, { status: 500 });
  }
}
