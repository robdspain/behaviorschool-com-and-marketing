export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { recordRequestAuditEvent } from '@/lib/audit-log';
import { api, getConvexClient } from '@/lib/convex';

function toUserRow(user: any) {
  return {
    id: user._id,
    email: user.email,
    first_name: user.firstName ?? null,
    last_name: user.lastName ?? null,
    approved_by: user.approvedBy ?? null,
    notes: user.notes ?? null,
    is_active: user.isActive,
    expires_at: user.expiresAt ?? null,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await getConvexClient().query(api.checkoutAccess.listUsers, {});

    await recordRequestAuditEvent(request, {
      category: 'student_data',
      actionType: 'read',
      resource: 'checkout_access',
      status: 'success',
      actorUserId: admin.id,
      actorEmail: admin.email,
      metadata: { rowCount: users?.length ?? 0, source: 'convex' },
    });

    return NextResponse.json({ users: (users || []).map(toUserRow) });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage, details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, first_name, last_name, notes, expires_at } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const client = getConvexClient();
    const id = await client.mutation(api.checkoutAccess.addUser, {
      email,
      firstName: first_name || undefined,
      lastName: last_name || undefined,
      notes: notes || undefined,
      expiresAt: expires_at || undefined,
      approvedBy: admin.email || 'Admin',
    });
    const users = await client.query(api.checkoutAccess.listUsers, {});
    const user = users.find((row: any) => row._id === id);

    await recordRequestAuditEvent(request, {
      category: 'admin_action',
      actionType: 'create',
      resource: 'checkout_access',
      resourceId: String(id),
      status: 'success',
      actorUserId: admin.id,
      actorEmail: admin.email,
      metadata: { email: String(email).toLowerCase(), source: 'convex' },
    });

    return NextResponse.json({ success: true, user: toUserRow(user) });
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

    const body = await request.json();
    const { id, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await getConvexClient().mutation(api.checkoutAccess.updateUserStatus, {
      id,
      isActive: Boolean(is_active),
    });

    await recordRequestAuditEvent(request, {
      category: 'admin_action',
      actionType: 'update',
      resource: 'checkout_access',
      resourceId: String(id),
      status: 'success',
      actorUserId: admin.id,
      actorEmail: admin.email,
      metadata: { is_active, source: 'convex' },
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

export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await getConvexClient().mutation(api.checkoutAccess.deleteUser, { id });

    await recordRequestAuditEvent(request, {
      category: 'admin_action',
      actionType: 'delete',
      resource: 'checkout_access',
      resourceId: String(id),
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
