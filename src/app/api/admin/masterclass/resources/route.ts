import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { section_id, name, url } = await request.json();

  if (!section_id || !name || !url) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('masterclass_resources')
    .insert([{ section_id, name, url }])
    .select();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: data[0] });
}

export async function GET(request: NextRequest) {
    const section_id = request.nextUrl.searchParams.get('section_id');

    if (!section_id) {
        return NextResponse.json({ success: false, error: 'section_id is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('masterclass_resources')
        .select('*')
        .eq('section_id', section_id);

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
}
