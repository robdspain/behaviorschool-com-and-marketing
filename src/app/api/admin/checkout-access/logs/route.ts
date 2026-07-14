export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { recordRequestAuditEvent } from '@/lib/audit-log';
import { api, getConvexClient } from '@/lib/convex';

function toLogRow(log: any) {
  return {
    id: log._id,
    access_type: log.accessType,
    identifier: log.identifier,
    success: log.success,
    ip_address: log.ipAddress ?? null,
    user_agent: log.userAgent ?? null,
    error_message: log.errorMessage ?? null,
    created_at: log.createdAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logs = await getConvexClient().query(api.checkoutAccess.listLogs, { limit: 50 });

    await recordRequestAuditEvent(request, {
      category: 'student_data',
      actionType: 'read',
      resource: 'checkout_access_logs',
      status: 'success',
      actorUserId: admin.id,
      actorEmail: admin.email,
      metadata: { rowCount: logs?.length ?? 0, source: 'convex' },
    });

    return NextResponse.json({ logs: (logs || []).map(toLogRow) });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage, details: String(error) },
      { status: 500 }
    );
  }
}
