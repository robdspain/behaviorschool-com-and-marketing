import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

// GET - Fetch current password
export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from('checkout_settings')
      .select('setting_value')
      .eq('setting_key', 'checkout_password')
      .single();

    if (error) {
      console.error('Error fetching password:', error);
      return NextResponse.json(
        { message: 'Failed to fetch password' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { password: data?.setting_value || '' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Update password
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient();
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { message: 'Password is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('checkout_settings')
      .update({ setting_value: password })
      .eq('setting_key', 'checkout_password');

    if (error) {
      console.error('Error updating password:', error);
      return NextResponse.json(
        { message: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
