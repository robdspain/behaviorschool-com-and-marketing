import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

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
    const { error: updateErr } = await supabase
      .from('presentations_ai')
      .update({
        slides: slides,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateErr) throw updateErr;

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

