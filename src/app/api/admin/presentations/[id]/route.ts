import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createSupabaseAdminClient();
    const id = params.id;

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

