import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { isAuthorizedAdmin } from '@/lib/admin-config';

async function getAuthorizedEmailFromRequest(request: NextRequest): Promise<string | null> {
  const supabase = await createClient();
  // Try cookie-based session first
  const { data: { user } } = await supabase.auth.getUser();
  let email = user?.email?.toLowerCase() || null;
  if (email) return email;

  // Fallback: Authorization: Bearer <token>
  const token = (request.headers.get('authorization') || '').replace('Bearer ', '').trim();
  if (token) {
    const { data: { user: tokenUser } } = await supabase.auth.getUser(token);
    email = tokenUser?.email?.toLowerCase() || null;
  }
  return email;
}

export async function GET(request: NextRequest) {
  try {
    const email = await getAuthorizedEmailFromRequest(request);
    if (!email || !isAuthorizedAdmin(email)) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from('email_templates').select('*');

    if (error) {
      console.error('Error fetching email templates:', error);
      return NextResponse.json({ message: 'Failed to fetch email templates' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/email-templates:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const email = await getAuthorizedEmailFromRequest(request);
    if (!email || !isAuthorizedAdmin(email)) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const supabase = createSupabaseAdminClient();
    const body = await request.json();
    const { name, subject, body_html, body_text, description } = body;

    if (!name || !subject) {
      return NextResponse.json({ message: 'Name and subject are required' }, { status: 400 });
    }

    const { data, error } = await supabase.from('email_templates').insert({
      name,
      subject,
      body_html,
      body_text,
      description,
    }).select().single();

    if (error) {
      console.error('Error creating email template:', error);
      return NextResponse.json({ message: 'Failed to create email template' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/email-templates:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
