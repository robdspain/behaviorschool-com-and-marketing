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
      .from('checkout_settings')
      .select('setting_value')
      .eq('setting_key', 'checkout_password')
      .single();

    if (error) {
      await recordRequestAuditEvent(request, {
        category: 'student_data',
        actionType: 'read',
        resource: 'checkout_settings.checkout_password',
        status: 'failure',
        actorUserId: admin.id,
        actorEmail: admin.email,
        metadata: { error: error.message },
      });
      console.error('Error fetching password:', error);
      return NextResponse.json(
        { error: 'Failed to fetch password' },
        { status: 500 }
      );
    }

    await recordRequestAuditEvent(request, {
      category: 'student_data',
      actionType: 'read',
      resource: 'checkout_settings.checkout_password',
      status: 'success',
      actorUserId: admin.id,
      actorEmail: admin.email,
    });

    return NextResponse.json({ password: data?.setting_value || 'SchoolBCBA2025' });
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
    const { password } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('checkout_settings')
      .update({ setting_value: password })
      .eq('setting_key', 'checkout_password');

    if (error) {
      await recordRequestAuditEvent(request, {
        category: 'auth',
        actionType: 'password_change',
        resource: 'checkout_settings.checkout_password',
        status: 'failure',
        actorUserId: admin.id,
        actorEmail: admin.email,
        metadata: { error: error.message },
      });
      console.error('Error updating password:', error);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    await recordRequestAuditEvent(request, {
      category: 'auth',
      actionType: 'password_change',
      resource: 'checkout_settings.checkout_password',
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
