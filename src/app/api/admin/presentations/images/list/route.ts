import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '60', 10), 200);
    const { data, error } = await supabase
      .from('presentations_ai_images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return NextResponse.json({ images: data || [] });
  } catch (error) {
    console.error('Images list error:', error);
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 });
  }
}

