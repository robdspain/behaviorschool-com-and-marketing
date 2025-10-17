import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

// GET - Fetch all email templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showArchived = searchParams.get('show_archived') === 'true';

    const supabase = createSupabaseAdminClient();
    let query = supabase
      .from('email_templates')
      .select('*');

    // Filter by archived status
    if (!showArchived) {
      query = query.eq('archived', false);
    }

    const { data, error } = await query
      .order('category', { ascending: true })
      .order('send_delay_minutes', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ templates: data });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new email template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, subject, body_text, body_html, category, send_delay_minutes, is_active } = body;

    // Validation
    if (!name || !subject) {
      return NextResponse.json({ error: 'Name and subject are required' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('email_templates')
      .insert({
        name,
        description,
        subject,
        body_text,
        body_html,
        category: category || 'signup',
        send_delay_minutes: send_delay_minutes || 0,
        is_active: is_active !== undefined ? is_active : true
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ template: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
