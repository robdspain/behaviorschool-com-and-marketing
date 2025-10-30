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
      const tryModels = [normalize(model), 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];
      const bodyJson = {
        contents: [{ role: 'user', parts: [{ text: prompt }]}],
        generationConfig: { response_mime_type: 'image/png', temperature: 0.8 },
      } as any;

      let lastErrText = '';
      for (const mdl of tryModels) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(mdl)}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const resp = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bodyJson) });
        if (!resp.ok) { lastErrText = `${resp.status}: ${await resp.text()}`; continue; }
        const data = await resp.json();
        const inlineData = data?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData;
        const b64 = inlineData?.data;
        const mime = inlineData?.mimeType || 'image/png';
        if (!b64) { lastErrText = 'No image data'; continue; }
        const ext = mime.includes('png') ? 'png' : mime.includes('jpeg') || mime.includes('jpg') ? 'jpg' : 'png';
        const bytes = Buffer.from(b64, 'base64');
        const id = crypto.randomUUID();
        const path = `generated/${id}.${ext}`;
        const { error: upErr } = await supabase.storage.from('presentations-images').upload(path, bytes, { contentType: mime, upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from('presentations-images').getPublicUrl(path);
        const url = pub?.publicUrl;
        await supabase.from('presentations_ai_images').insert({ prompt, provider: 'gemini', model: mdl, url, storage_path: path });
        return NextResponse.json({ url, path, provider: 'gemini' });
      }
      return NextResponse.json({ error: `Gemini image error: ${lastErrText}` }, { status: 502 });
    }

    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
  } catch (error) {
    console.error('Image generate error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate image' }, { status: 500 });
  }
}
