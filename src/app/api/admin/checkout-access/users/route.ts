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
      .from('checkout_access')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      await recordRequestAuditEvent(request, {
        category: 'student_data',
        actionType: 'read',
        resource: 'checkout_access',
        status: 'failure',
        actorUserId: admin.id,
        actorEmail: admin.email,
        metadata: { error: error.message },
      });
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users', details: error.message, code: error.code },
        { status: 500 }
      );
    }

    await recordRequestAuditEvent(request, {
      category: 'student_data',
      actionType: 'read',
      resource: 'checkout_access',
      status: 'success',
      actorUserId: admin.id,
      actorEmail: admin.email,
      metadata: { rowCount: data?.length ?? 0 },
    });

    return NextResponse.json({ users: data || [] });
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

    const supabase = createSupabaseAdminClient();
    const body = await request.json();
    const { email, first_name, last_name, notes, expires_at } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('checkout_access')
      .insert({
        email: email.toLowerCase(),
        first_name,
        last_name,
        notes,
        expires_at: expires_at || null,
        is_active: true,
        approved_by: 'Admin',
      })
      .select()
      .single();

    if (error) {
      await recordRequestAuditEvent(request, {
        category: 'admin_action',
        actionType: 'create',
        resource: 'checkout_access',
        status: 'failure',
        actorUserId: admin.id,
        actorEmail: admin.email,
        metadata: { email: email?.toLowerCase(), error: error.message },
      });
      console.error('Error adding user:', error);
      return NextResponse.json(
        { error: 'Failed to add user. Email may already exist.' },
        { status: 500 }
      );
    }

    await recordRequestAuditEvent(request, {
      category: 'admin_action',
      actionType: 'create',
      resource: 'checkout_access',
      resourceId: String(data.id),
      status: 'success',
      actorUserId: admin.id,
      actorEmail: admin.email,
      metadata: { email: data.email },
    });

    return NextResponse.json({ success: true, user: data });
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

    const supabase = createSupabaseAdminClient();
    const body = await request.json();
    const { id, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('checkout_access')
      .update({ is_active })
      .eq('id', id);

    if (error) {
      await recordRequestAuditEvent(request, {
        category: 'admin_action',
        actionType: 'update',
        resource: 'checkout_access',
        resourceId: String(id),
        status: 'failure',
        actorUserId: admin.id,
        actorEmail: admin.email,
        metadata: { is_active, error: error.message },
      });
      console.error('Error updating user:', error);
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    await recordRequestAuditEvent(request, {
      category: 'admin_action',
      actionType: 'update',
      resource: 'checkout_access',
      resourceId: String(id),
      status: 'success',
      actorUserId: admin.id,
      actorEmail: admin.email,
      metadata: { is_active },
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

    const supabase = createSupabaseAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('checkout_access')
      .delete()
      .eq('id', id);

    if (error) {
      await recordRequestAuditEvent(request, {
        category: 'admin_action',
        actionType: 'delete',
        resource: 'checkout_access',
        resourceId: String(id),
        status: 'failure',
        actorUserId: admin.id,
        actorEmail: admin.email,
        metadata: { error: error.message },
      });
      console.error('Error deleting user:', error);
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }

    await recordRequestAuditEvent(request, {
      category: 'admin_action',
      actionType: 'delete',
      resource: 'checkout_access',
      resourceId: String(id),
      status: 'success',
      actorUserId: admin.id,
      actorEmail: admin.email,
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
