import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch all email templates
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
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
