export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { api, getConvexClient } from '@/lib/convex';

function toLogRow(log: any) {
  return {
    id: log._id,
    template_id: log.templateId ?? null,
    template_name: log.templateName ?? null,
    recipient_email: log.recipientEmail,
    recipient_name: log.recipientName ?? null,
    subject: log.subject,
    status: log.status,
    sent_at: log.sentAt ?? log.createdAt,
    sent_by: log.sentBy ?? null,
    mailgun_id: log.mailgunId ?? null,
    error_message: log.errorMessage ?? null,
    metadata: log.metadata ?? null,
    created_at: log.createdAt,
    updated_at: log.updatedAt,
  };
}

// GET - Fetch email logs for a specific recipient
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    const data = await getConvexClient().query(api.email.listEmailLogs, {
      email: email || undefined,
      limit: 100,
    });

    return NextResponse.json({ logs: (data || []).map(toLogRow) });
  } catch (error) {
    console.error('Error in email logs API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
