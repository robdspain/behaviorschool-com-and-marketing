import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

// GET - Fetch all approved users
export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from('checkout_access')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching approved users:', error);
      return NextResponse.json(
        { message: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add new approved user
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient();
    const body = await request.json();
    const { email, firstName, lastName, notes, expiresInDays } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Calculate expiration date if provided
    let expiresAt = null;
    if (expiresInDays && parseInt(expiresInDays) > 0) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + parseInt(expiresInDays));
      expiresAt = expDate.toISOString();
    }

    const { data, error } = await supabase
      .from('checkout_access')
      .insert({
        email: email.toLowerCase(),
        first_name: firstName || null,
        last_name: lastName || null,
        notes: notes || null,
        expires_at: expiresAt,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding user:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to add user' },
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
