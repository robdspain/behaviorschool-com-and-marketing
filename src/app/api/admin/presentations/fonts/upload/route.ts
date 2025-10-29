import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, withSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
    const buf = Buffer.from(await file.arrayBuffer());
    const ext = (file.name.split('.').pop() || 'ttf').toLowerCase();
    const id = crypto.randomUUID();
    const path = `fonts/${id}.${ext}`;
    const supabase = createSupabaseAdminClient();
    await withSupabaseAdmin(async (client)=>{
      if (!client) return;
      const { data: buckets } = await client.storage.listBuckets();
      if (!(buckets || []).some(b=> b.name==='presentations-fonts')) {
        await client.storage.createBucket('presentations-fonts', { public: true });
      }
      return undefined as any;
    });
    const { error } = await supabase.storage.from('presentations-fonts').upload(path, buf, { contentType: file.type || 'font/ttf' });
    if (error) throw error;
    const { data } = supabase.storage.from('presentations-fonts').getPublicUrl(path);
    return NextResponse.json({ url: data?.publicUrl, path });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

