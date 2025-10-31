import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

async function readSlidesFromStorage(path?: string) {
  if (!path) return null;
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.storage.from('presentations').download(path);
  if (!data) return null;
  const text = await data.text();
  try { const json = JSON.parse(text); return json.slides || null; } catch { return null; }
}

async function writeSlidesToStorage(path: string, slides: any) {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.storage.from('presentations').download(path);
  let base: any = {};
  if (data) {
    try { base = JSON.parse(await data.text()); } catch { base = {}; }
  }
  base.slides = slides;
  const bytes = Buffer.from(JSON.stringify(base, null, 2), 'utf8');
  // Upsert by removing then uploading or using upsert: true if allowed
  // Supabase storage supports upsert option; here we use upsert true if available
  // @ts-ignore
  const { error: upErr } = await supabase.storage.from('presentations').upload(path, bytes, { contentType: 'application/json', upsert: true });
  if (upErr) throw upErr;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createSupabaseAdminClient();
    const { id } = await params;

    // Fetch presentation data including slides
    const { data: presentation, error } = await supabase
      .from('presentations_ai')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!presentation) {
      return NextResponse.json({ error: 'Presentation not found' }, { status: 404 });
    }

    // Attempt to augment with slides from storage if not present
    if (!('slides' in presentation) || presentation.slides == null) {
      const fromStorage = await readSlidesFromStorage(presentation.storage_path);
      if (fromStorage) (presentation as any).slides = fromStorage;
    }

    return NextResponse.json(presentation);
  } catch (error) {
    console.error('Get presentation error:', error);
    return NextResponse.json({ error: 'Failed to fetch presentation' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createSupabaseAdminClient();
    const { id } = await params;
    const body = await req.json();
    const { slides } = body;

    if (!slides || !Array.isArray(slides)) {
      return NextResponse.json({ error: 'Invalid slides data' }, { status: 400 });
    }

    // Update the slides in the database
    // Try DB update first; if column doesn't exist, fallback to storage
    const { data: row } = await supabase.from('presentations_ai').select('storage_path').eq('id', id).single();
    let dbErr: any = null;
    try {
      const { error: updateErr } = await supabase
        .from('presentations_ai')
        .update({
          // @ts-ignore might not exist
          slides: slides,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (updateErr) dbErr = updateErr;
    } catch (e) {
      dbErr = e;
    }
    if (dbErr && row?.storage_path) {
      await writeSlidesToStorage(row.storage_path, slides);
    } else if (dbErr) {
      throw dbErr;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Update presentation error:', error);
    return NextResponse.json({ error: 'Failed to update presentation' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createSupabaseAdminClient();
    const { id } = await params;

    // Fetch record to know storage path
    const { data: rec, error: selErr } = await supabase
      .from('presentations_ai')
      .select('storage_path')
      .eq('id', id)
      .single();
    if (selErr) throw selErr;

    // Delete file from storage
    if (rec?.storage_path) {
      await supabase.storage.from('presentations').remove([rec.storage_path]);
    }

    // Delete row
    const { error: delErr } = await supabase
      .from('presentations_ai')
      .delete()
      .eq('id', id);
    if (delErr) throw delErr;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete presentation error:', error);
    return NextResponse.json({ error: 'Failed to delete presentation' }, { status: 500 });
  }
}
