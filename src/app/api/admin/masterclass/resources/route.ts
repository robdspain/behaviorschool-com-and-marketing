export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';
import type { MasterclassResource } from '@/lib/masterclass/admin-types';

// Module-level Supabase client moved to lazy getter to prevent build-time errors
function getSupabase() { return createClient(); }

// GET all resources
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await getSupabase()
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
    const { data: maxOrderData, error: maxOrderError } = await getSupabase()
      .from('masterclass_resources')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1);

    if (maxOrderError) {
      console.error('Error fetching max order_index:', maxOrderError);
      return NextResponse.json({ success: false, error: maxOrderError.message }, { status: 500 });
    }

    const nextOrderIndex = (maxOrderData && maxOrderData.length > 0) ? maxOrderData[0].order_index + 1 : 1;

    const { data, error } = await getSupabase()
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

// PUT to update order or fields for multiple resources
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Reorder payload: { idsInOrder: number[] }
    if (Array.isArray(body?.idsInOrder)) {
      const ids: number[] = body.idsInOrder;
      // Update order_index in a single transaction-like sequence
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const { error } = await getSupabase()
          .from('masterclass_resources')
          .update({ order_index: i + 1 })
          .eq('id', id);
        if (error) {
          console.error('Error updating order_index for resource', id, error);
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
      }
      return NextResponse.json({ success: true });
    }

    // Single resource update: { id, ...fields }
    if (typeof body?.id === 'number') {
      const { id, ...fields } = body as Partial<MasterclassResource> & { id: number };
      const { data, error } = await getSupabase()
        .from('masterclass_resources')
        .update(fields)
        .eq('id', id)
        .select();
      if (error) {
        console.error('Error updating resource:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, data: data?.[0] });
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (error: any) {
    console.error('Unexpected error updating resources:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE a resource by id (expects ?id=123)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    const { error } = await getSupabase()
      .from('masterclass_resources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting resource:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error deleting resource:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
