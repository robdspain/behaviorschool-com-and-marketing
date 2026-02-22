import { NextRequest, NextResponse } from 'next/server';
import {
  getAttendanceRecord,
  verifyAttendance,
} from '@/lib/ace/ace-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/attendance/[id]
 * Get a single attendance record by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const record = await getAttendanceRecord(id);

    if (!record) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Fetch attendance record error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ace/attendance/[id]
 * Update/verify an attendance record
 * Body: { verified: boolean, verifiedBy?: string }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { verified, verifiedBy } = body;

    if (typeof verified !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required field: verified (boolean)' },
        { status: 400 }
      );
    }

    // Check record exists
    const existing = await getAttendanceRecord(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    // Verify/unverify the attendance
    await verifyAttendance(id, verified, verifiedBy);

    // Fetch updated record
    const updated = await getAttendanceRecord(id);

    return NextResponse.json({
      success: true,
      message: verified ? 'Attendance verified' : 'Attendance verification removed',
      data: updated,
    });
  } catch (error) {
    console.error('Update attendance record error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
