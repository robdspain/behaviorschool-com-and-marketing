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
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    const supabase = createSupabaseAdminClient();
    await ensureImagesBucket();
    const id = crypto.randomUUID();
    const ext = (file.name?.split('.').pop() || 'png').toLowerCase();
    const path = `uploads/${id}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);
    const contentType = file.type || (ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'png' ? 'image/png' : 'application/octet-stream');
    const { error: upErr } = await getSupabase().storage.from('presentations-images').upload(path, bytes, { contentType, upsert: false });
    if (upErr) throw upErr;
    const { data: pub } = getSupabase().storage.from('presentations-images').getPublicUrl(path);
    const url = pub?.publicUrl;
    // Best effort insert into log table if exists
    try { await getSupabase().from('presentations_ai_images').insert({ prompt: 'upload', provider: 'upload', model: 'upload', url, storage_path: path }); } catch {}
    return NextResponse.json({ url, path, provider: 'upload' });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Upload failed';
    console.error('Image upload error:', e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

