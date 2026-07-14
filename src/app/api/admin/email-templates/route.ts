export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { api, getConvexClient } from '@/lib/convex';

function toTemplateRow(template: any) {
  return {
    id: template._id,
    name: template.name,
    description: template.description ?? null,
    subject: template.subject,
    body_text: template.bodyText ?? null,
    body_html: template.bodyHtml ?? null,
    category: template.category,
    is_active: template.isActive,
    send_delay_minutes: template.sendDelayMinutes,
    archived: template.archived,
    archived_at: template.archivedAt ?? null,
    archived_by: template.archivedBy ?? null,
    created_at: template.createdAt,
    updated_at: template.updatedAt,
  };
}

// GET - Fetch all email templates
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const showArchived = searchParams.get('show_archived') === 'true';

    const client = getConvexClient();
    await client.mutation(api.email.ensureDefaultTemplates, {});
    const templates = await client.query(api.email.listTemplates, { showArchived });

    return NextResponse.json({ templates: (templates || []).map(toTemplateRow) });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new email template
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, subject, body_text, body_html, category, send_delay_minutes, is_active } = body;

    // Validation
    if (!name || !subject) {
      return NextResponse.json({ error: 'Name and subject are required' }, { status: 400 });
    }

    const client = getConvexClient();
    const id = await client.mutation(api.email.createTemplate, {
      name,
      description: description || undefined,
      subject,
      bodyText: body_text || undefined,
      bodyHtml: body_html || undefined,
      category: category || 'signup',
      sendDelayMinutes: Number(send_delay_minutes || 0),
      isActive: is_active !== undefined ? Boolean(is_active) : true
    });
    const template = await client.query(api.email.getTemplate, { id });

    return NextResponse.json({ template: toTemplateRow(template) }, { status: 201 });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
