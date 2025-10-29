import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';
import type { MasterclassResource } from '@/lib/masterclass/admin-types';

const supabase = createClient();

// GET all resources
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('masterclass_resources')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching resources:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Unexpected error fetching resources:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST a new resource
export async function POST(request: NextRequest) {
  try {
    const newResource: Omit<MasterclassResource, 'id' | 'created_at' | 'updated_at'> = await request.json();

    // Determine the next order_index
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('masterclass_resources')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1);

    if (maxOrderError) {
      console.error('Error fetching max order_index:', maxOrderError);
      return NextResponse.json({ success: false, error: maxOrderError.message }, { status: 500 });
    }

    const nextOrderIndex = (maxOrderData && maxOrderData.length > 0) ? maxOrderData[0].order_index + 1 : 1;

    const { data, error } = await supabase
      .from('masterclass_resources')
      .insert({ ...newResource, order_index: nextOrderIndex })
      .select();

    if (error) {
      console.error('Error creating resource:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error: any) {
    console.error('Unexpected error creating resource:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
