import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('presentations_ai')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return NextResponse.json({ items: data || [] });
  } catch (error) {
    console.error('List presentations error:', error);
    return NextResponse.json({ error: 'Failed to list presentations' }, { status: 500 });
  }
}

