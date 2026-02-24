export const dynamic = "force-dynamic";

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
        body: JSON.stringify({ model: model || 'gpt-image-1', prompt, size }),
      });
      if (!resp.ok) throw new Error(`OpenAI image error ${resp.status}: ${await resp.text()}`);
      const data = await resp.json();
      const urlOut1 = data?.data?.[0]?.url;
      let bytes: Buffer | null = null;
      if (!urlOut1) {
        const b64 = data?.data?.[0]?.b64_json;
        if (!b64) throw new Error('No image returned');
        bytes = Buffer.from(b64, 'base64');
      } else {
        const imgResp = await fetch(urlOut1);
        const arr = new Uint8Array(await imgResp.arrayBuffer());
        bytes = Buffer.from(arr);
      }
      const id = crypto.randomUUID();
      const path = `generated/${id}.png`;
      const { error: upErr } = await getSupabase().storage.from('presentations-images').upload(path, bytes, { contentType: 'image/png', upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = getSupabase().storage.from('presentations-images').getPublicUrl(path);
      const publicUrl1 = pub?.publicUrl;
      await getSupabase().from('presentations_ai_images').insert({ prompt, provider: 'openai', model: model || 'gpt-image-1', url: publicUrl1, storage_path: path });
      return NextResponse.json({ url: publicUrl1, path, provider: 'openai' });
    }

    if (provider === 'gemini') {
      if (!apiKey) return NextResponse.json({ error: 'apiKey is required for Gemini' }, { status: 400 });
      const allowFallback = Boolean(body?.allowFallback);
      let lastError: string | undefined;
      // Attempt Google Imagen 3.0 endpoint
      try {
        const imagenEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0:generateImage?key=${encodeURIComponent(apiKey)}`;
        const imResp = await fetch(imagenEndpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: { text: String(prompt).slice(0, 800) },
            size: size || '1024x1024'
          })
        });
        if (imResp.ok) {
          const imj = await imResp.json();
          // Try to locate base64 image data or URL
          const b64 = imj?.images?.[0]?.base64 || imj?.candidates?.[0]?.image?.base64 || imj?.candidates?.[0]?.content?.parts?.find((p: any)=> p.inlineData)?.inlineData?.data;
          let bytes3: Buffer | null = null;
          if (b64) {
            bytes3 = Buffer.from(b64, 'base64');
          } else if (imj?.images?.[0]?.url) {
            const r = await fetch(imj.images[0].url); const arr = new Uint8Array(await r.arrayBuffer()); bytes3 = Buffer.from(arr);
          } else {
            throw new Error('No image returned');
          }
          const id = crypto.randomUUID();
          const path = `generated/${id}.png`;
          const { error: upErr3 } = await getSupabase().storage.from('presentations-images').upload(path, bytes3, { contentType: 'image/png', upsert: false });
          if (upErr3) throw upErr3;
          const { data: pub3 } = getSupabase().storage.from('presentations-images').getPublicUrl(path);
          const url3 = pub3?.publicUrl;
          await getSupabase().from('presentations_ai_images').insert({ prompt, provider: 'gemini', model: 'imagen-3.0', url: url3, storage_path: path });
          return NextResponse.json({ url: url3, path, provider: 'gemini' });
        } else {
          lastError = await imResp.text();
        }
      } catch (e: any) {
        lastError = e?.message || String(e);
      }
      // If Gemini failed and fallback not allowed, return a clear error
      if (!allowFallback) {
        return NextResponse.json({ error: 'Gemini image generation failed', details: lastError }, { status: 502 });
      }
      // Optional fallback to OpenAI if enabled by caller
      const openaiKey = process.env.OPENAI_API_KEY || body.openaiKey;
      if (!openaiKey) {
        return NextResponse.json({ error: 'Gemini image generation failed and no OpenAI fallback key set.' }, { status: 502 });
      }
      const dalle = await fetch('https://api.openai.com/v1/images/generations', { method: 'POST', headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'gpt-image-1', prompt, size }) });
      if (!dalle.ok) throw new Error(`OpenAI image fallback error ${dalle.status}: ${await dalle.text()}`);
      const dj = await dalle.json();
      const urlOut = dj?.data?.[0]?.url;
      let bytes2: Buffer | null = null;
      if (urlOut) {
        const r = await fetch(urlOut); const arr = new Uint8Array(await r.arrayBuffer()); bytes2 = Buffer.from(arr);
      } else {
        const b64 = dj?.data?.[0]?.b64_json; if (!b64) return NextResponse.json({ error: 'No image generated' }, { status: 500 });
        bytes2 = Buffer.from(b64, 'base64');
      }
      const id = crypto.randomUUID();
      const path = `generated/${id}.png`;
      const { error: upErr2 } = await getSupabase().storage.from('presentations-images').upload(path, bytes2, { contentType: 'image/png', upsert: false });
      if (upErr2) throw upErr2;
      const { data: pub2 } = getSupabase().storage.from('presentations-images').getPublicUrl(path);
      const url2 = pub2?.publicUrl;
      await getSupabase().from('presentations_ai_images').insert({ prompt, provider: 'openai', model: 'gpt-image-1', url: url2, storage_path: path });
      return NextResponse.json({ url: url2, path, provider: 'openai' });
    }

    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
  } catch (error) {
    console.error('Image generate error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate image' }, { status: 500 });
  }
}
