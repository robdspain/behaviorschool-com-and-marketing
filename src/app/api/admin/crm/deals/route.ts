export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

// GET - Fetch all deals
export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from('crm_deals')
      .select('*')
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching deals:', error);
      return NextResponse.json(
        { message: 'Failed to fetch deals' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new deal
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient();
    const body = await request.json();

    const {
      title,
      contactId,
      value,
      stage = 'qualification',
      probability = 50,
      expectedCloseDate
    } = body;

    if (!title || !contactId || !value) {
      return NextResponse.json(
        { message: 'Title, contact, and value are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('crm_deals')
      .insert({
        title,
        contact_id: contactId,
        value: parseFloat(value),
        stage,
        probability: parseInt(probability),
        expected_close_date: expectedCloseDate || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating deal:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to create deal' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
