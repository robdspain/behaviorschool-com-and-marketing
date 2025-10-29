import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('presentations_ai_jobs')
    .select('*')
    .eq('id', params.id)
    .single();
  if (error || !data) return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

