import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

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
        { error: 'Failed to fetch password' },
        { status: 500 }
      );
    }

    return NextResponse.json({ password: data?.setting_value || 'SchoolBCBA2025' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient();
    const { password } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
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
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
