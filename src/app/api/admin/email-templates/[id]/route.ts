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

// GET - Fetch a single email template by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await getConvexClient().query(api.email.getTemplate, { id });

    if (!data) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({ template: toTemplateRow(data) });
  } catch (error) {
    console.error('Error fetching email template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update an email template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const data = await getConvexClient().mutation(api.email.updateTemplate, {
      id,
      name,
      description: description || undefined,
      subject,
      bodyText: body_text || undefined,
      bodyHtml: body_html || undefined,
      category,
      sendDelayMinutes: Number(send_delay_minutes || 0),
      isActive: Boolean(is_active),
    });

    return NextResponse.json({ template: toTemplateRow(data) });
  } catch (error) {
    console.error('Error updating email template:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Archive/Unarchive an email template
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { archived } = body;

    const data = await getConvexClient().mutation(api.email.setTemplateArchived, {
      id,
      archived: Boolean(archived),
      archivedBy: admin.email,
    });

    return NextResponse.json({ success: true, template: toTemplateRow(data) });
  } catch (error) {
    console.error('Error archiving email template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete an email template (kept for backward compatibility)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await getConvexClient().mutation(api.email.deleteTemplate, { id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting email template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
