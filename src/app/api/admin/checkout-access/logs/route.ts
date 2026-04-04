export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { recordRequestAuditEvent } from '@/lib/audit-log';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from('checkout_access_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      await recordRequestAuditEvent(request, {
        category: 'student_data',
        actionType: 'read',
        resource: 'checkout_access_logs',
        status: 'failure',
        actorUserId: admin.id,
        actorEmail: admin.email,
        metadata: { error: error.message },
      });
      console.error('Error fetching logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch logs', details: error.message, code: error.code },
        { status: 500 }
      );
    }

    await recordRequestAuditEvent(request, {
      category: 'student_data',
      actionType: 'read',
      resource: 'checkout_access_logs',
      status: 'success',
      actorUserId: admin.id,
      actorEmail: admin.email,
      metadata: { rowCount: data?.length ?? 0 },
    });

    return NextResponse.json({ logs: data || [] });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage, details: String(error) },
      { status: 500 }
    );
  }
}
