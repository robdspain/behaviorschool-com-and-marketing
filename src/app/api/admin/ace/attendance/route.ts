export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { logDataAccess, extractRequestMeta } from '@/lib/audit-logger';

// GET /api/admin/ace/attendance?event_id=xxx - Get attendance for an event
export async function GET(request: NextRequest) {
  const requestMeta = extractRequestMeta(request);
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing required parameter: event_id' },
        { status: 400 }
      );
    }

    // Get attendance records with participant details
    const { data, error } = await supabase
      .from('ace_attendance_records')
      .select(`
        *,
        participant:participant_id (
          id,
          first_name,
          last_name,
          email,
          bacb_id
        )
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (error) {
      logDataAccess({ action: 'READ', resourceType: 'ace_attendance_records', success: false, httpStatus: 500, errorMessage: error.message, reasonForAccess: 'admin_attendance_list', ...requestMeta });
      throw error;
    }

    // L1: Log attendance data read (FERPA-sensitive: reveals who attended what)
    logDataAccess({ action: 'READ', resourceType: 'ace_attendance_records', success: true, httpStatus: 200, reasonForAccess: 'admin_attendance_list', ...requestMeta });

    return NextResponse.json({ data: data || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}

// POST /api/admin/ace/attendance - Mark attendance
export async function POST(request: NextRequest) {
  const requestMeta = extractRequestMeta(request);
  try {
    const supabase = await createClient();

    const body = await request.json();

    // Validate required fields
    if (!body.event_id || !body.participant_id) {
      return NextResponse.json(
        { error: 'Missing required fields: event_id, participant_id' },
        { status: 400 }
      );
    }

    // Upsert attendance record
    const attendanceData = {
      event_id: body.event_id,
      participant_id: body.participant_id,
      verified: body.verified ?? false,
      verification_method: 'attendance_log',
      verified_at: body.verified ? new Date().toISOString() : null,
      sign_in_timestamp: body.sign_in_timestamp || null,
      sign_out_timestamp: body.sign_out_timestamp || null,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      user_agent: request.headers.get('user-agent'),
    };

    const { data, error } = await supabase
      .from('ace_attendance_records')
      .upsert(attendanceData, {
        onConflict: 'event_id,participant_id',
      })
      .select()
      .single();

    if (error) {
      logDataAccess({ action: 'CREATE', resourceType: 'ace_attendance_records', studentId: body.participant_id, success: false, httpStatus: 500, errorMessage: error.message, ...requestMeta });
      throw error;
    }

    // L1: Log attendance mark (FERPA L1 - student data write)
    logDataAccess({
      action: 'CREATE',
      resourceType: 'ace_attendance_records',
      resourceId: data?.id,
      studentId: body.participant_id,
      changesAfter: { event_id: body.event_id, verified: body.verified ?? false },
      success: true,
      httpStatus: 200,
      reasonForAccess: 'admin_mark_attendance',
      ...requestMeta,
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/ace/attendance?id=xxx - Remove attendance record
export async function DELETE(request: NextRequest) {
  const requestMeta = extractRequestMeta(request);
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('ace_attendance_records')
      .delete()
      .eq('id', id);

    if (error) {
      logDataAccess({ action: 'DELETE', resourceType: 'ace_attendance_records', resourceId: id, success: false, httpStatus: 500, errorMessage: error.message, ...requestMeta });
      throw error;
    }

    // L1: Log attendance record deletion
    logDataAccess({ action: 'DELETE', resourceType: 'ace_attendance_records', resourceId: id, success: true, httpStatus: 200, reasonForAccess: 'admin_delete_attendance', ...requestMeta });

    return NextResponse.json(
      { message: 'Attendance record deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting attendance:', error);
    return NextResponse.json(
      { error: 'Failed to delete attendance record' },
      { status: 500 }
    );
  }
}
