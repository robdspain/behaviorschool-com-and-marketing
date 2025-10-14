import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

// GET - Fetch email logs for a specific recipient
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    const supabase = createSupabaseAdminClient();

    let query = supabase
      .from('email_logs')
      .select('*')
      .order('sent_at', { ascending: false });

    if (email) {
      query = query.eq('recipient_email', email);
    }

    const { data, error } = await query.limit(100);

    if (error) {
      console.error('Error fetching email logs:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ logs: data || [] });
  } catch (error) {
    console.error('Error in email logs API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
