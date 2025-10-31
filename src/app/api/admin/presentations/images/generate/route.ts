import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, withSupabaseAdmin } from '@/lib/supabase-admin';

async function ensureImagesBucket() {
  await withSupabaseAdmin(async (client) => {
    if (!client) return;
    const { data: buckets } = await client.storage.listBuckets();
    const has = (buckets || []).some((b) => b.name === 'presentations-images');
    if (!has) {
      await client.storage.createBucket('presentations-images', { public: true });
    }
    return undefined as any;
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, provider = 'openai', apiKey, size = '1024x1024', model } = body || {};

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    await ensureImagesBucket();

    if (provider === 'openai') {
      if (!apiKey) return NextResponse.json({ error: 'apiKey is required for OpenAI' }, { status: 400 });
      const resp = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: model || 'gpt-image-1', prompt, size, response_format: 'b64_json' }),
      });
      if (!resp.ok) throw new Error(`OpenAI image error ${resp.status}: ${await resp.text()}`);
      const data = await resp.json();
      const b64 = data?.data?.[0]?.b64_json;
      if (!b64) throw new Error('No image returned');
      const bytes = Buffer.from(b64, 'base64');
      const id = crypto.randomUUID();
      const path = `generated/${id}.png`;
      const { error: upErr } = await supabase.storage.from('presentations-images').upload(path, bytes, { contentType: 'image/png', upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('presentations-images').getPublicUrl(path);
      const url = pub?.publicUrl;
      await supabase.from('presentations_ai_images').insert({ prompt, provider: 'openai', model: model || 'gpt-image-1', url, storage_path: path });
      return NextResponse.json({ url, path, provider: 'openai' });
    }

    if (provider === 'gemini') {
      if (!apiKey) return NextResponse.json({ error: 'apiKey is required for Gemini' }, { status: 400 });
      const normalize = (name?: string) => {
        const n = (name || '').trim();
        if (!n) return 'gemini-2.5-flash';
        if (n === 'gemini-2.5') return 'gemini-2.5-flash';
        if (n === 'gemini-2.5-pro-latest') return 'gemini-2.5-pro';
        if (n === 'gemini-2.5-flash-latest') return 'gemini-2.5-flash';
        if (n === 'gemini-1.5-pro') return 'gemini-1.5-pro-latest';
        if (n === 'gemini-1.5-flash') return 'gemini-1.5-flash-latest';
        if (n === 'gemini-pro') return 'gemini-1.5-flash-latest';
        return n;
      };
      // Gemini text models do not return images via generateContent in current API.
      // Fallback to OpenAI image generation when Gemini is selected.
      const openaiKey = process.env.OPENAI_API_KEY || body.openaiKey;
      if (!openaiKey) {
        return NextResponse.json({ error: 'Gemini image generation is not supported via this API. Set OPENAI_API_KEY to fallback to OpenAI.' }, { status: 400 });
      }
      const dalle = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST', headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-image-1', prompt, size, response_format: 'b64_json' })
      });
      if (!dalle.ok) throw new Error(`OpenAI image fallback error ${dalle.status}: ${await dalle.text()}`);
      const dj = await dalle.json();
      const b64 = dj?.data?.[0]?.b64_json;
      if (!b64) return NextResponse.json({ error: 'No image generated' }, { status: 500 });
      const bytes = Buffer.from(b64, 'base64');
      const id = crypto.randomUUID();
      const path = `generated/${id}.png`;
      const { error: upErr2 } = await supabase.storage.from('presentations-images').upload(path, bytes, { contentType: 'image/png', upsert: false });
      if (upErr2) throw upErr2;
      const { data: pub2 } = supabase.storage.from('presentations-images').getPublicUrl(path);
      const url2 = pub2?.publicUrl;
      await supabase.from('presentations_ai_images').insert({ prompt, provider: 'openai', model: 'gpt-image-1', url: url2, storage_path: path });
      return NextResponse.json({ url: url2, path, provider: 'openai' });
    }

    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
  } catch (error) {
    console.error('Image generate error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate image' }, { status: 500 });
  }
}
