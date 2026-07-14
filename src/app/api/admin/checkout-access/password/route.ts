export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { recordRequestAuditEvent } from '@/lib/audit-log';
import { api, getConvexClient } from '@/lib/convex';

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const password = await getConvexClient().query(api.checkoutAccess.getPassword, {});

    await recordRequestAuditEvent(request, {
      category: 'student_data',
      actionType: 'read',
      resource: 'checkout_settings.checkout_password',
      status: 'success',
      actorUserId: admin.id,
      actorEmail: admin.email,
      metadata: { source: 'convex' },
    });

    return NextResponse.json({ password });
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
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { password } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await getConvexClient().mutation(api.checkoutAccess.setPassword, { password });

    await recordRequestAuditEvent(request, {
      category: 'auth',
      actionType: 'password_change',
      resource: 'checkout_settings.checkout_password',
      status: 'success',
      actorUserId: admin.id,
      actorEmail: admin.email,
      metadata: { source: 'convex' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
