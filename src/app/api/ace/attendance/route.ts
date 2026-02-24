import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import {
  markAttendance,
  getAttendanceByEventAndParticipant,
  getEventAttendanceRecords,
} from '@/lib/ace/ace-service';
import type { Id } from '@/lib/convex';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/attendance
 * Get attendance records filtered by event_id and/or participant_id
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');
    const participantId = searchParams.get('participant_id');

    // Get attendance for a specific event and participant
    if (eventId && participantId) {
      const record = await getAttendanceByEventAndParticipant(eventId, participantId);
      return NextResponse.json({
        success: true,
        data: record ? [record] : [],
      });
    }

    // Get all attendance records for an event
    if (eventId) {
      const records = await getEventAttendanceRecords(eventId);
      return NextResponse.json({ success: true, data: records });
    }

    // Get attendance records by participant
    if (participantId) {
      const client = getConvexClient();
      // Query by participant across all events
      const records = await client.query(api.aceAttendance.getByEvent, {
        eventId: participantId as Id<"aceEvents">,
      });
      return NextResponse.json({ success: true, data: records });
    }

    return NextResponse.json(
      { error: 'Please provide event_id or participant_id parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Fetch attendance error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ace/attendance
 * Record attendance (check-in, check-out, or verify code)
 * Body: { event_id, participant_id, action: "check_in" | "check_out" | "verify_code", verification_code?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_id, participant_id, action, verification_code } = body;

    // Validate required fields
    if (!event_id || !participant_id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: event_id, participant_id, action' },
        { status: 400 }
      );
    }

    // Validate action type
    if (!['check_in', 'check_out', 'verify_code'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "check_in", "check_out", or "verify_code"' },
        { status: 400 }
      );
    }

    // Verify code requires a verification_code
    if (action === 'verify_code' && !verification_code) {
      return NextResponse.json(
        { error: 'verification_code is required for verify_code action' },
        { status: 400 }
      );
    }

    const client = getConvexClient();

    // Verify the event exists
    const event = await client.query(api.aceEvents.getWithDetails, {
      id: event_id as Id<"aceEvents">,
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check that the participant exists
    const user = await client.query(api.aceUsers.getById, {
      id: participant_id as Id<"aceUsers">,
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    // For check-out, verify there is already a check-in
    if (action === 'check_out') {
      const existing = await getAttendanceByEventAndParticipant(event_id, participant_id);
      if (!existing) {
        return NextResponse.json(
          { error: 'No check-in record found. Please check in first.' },
          { status: 400 }
        );
      }
      if (existing.signOutTimestamp) {
        return NextResponse.json(
          { error: 'Already checked out' },
          { status: 400 }
        );
      }
    }

    // Mark attendance using the service
    await markAttendance(event_id, participant_id, {
      checkIn: action === 'check_in',
      checkOut: action === 'check_out',
      verificationCode: action === 'verify_code' ? verification_code : undefined,
    });

    // Get the updated record
    const updatedRecord = await getAttendanceByEventAndParticipant(event_id, participant_id);

    return NextResponse.json({
      success: true,
      message:
        action === 'check_in'
          ? 'Successfully checked in'
          : action === 'check_out'
            ? 'Successfully checked out'
            : 'Verification code recorded',
      data: updatedRecord,
    });
  } catch (error) {
    console.error('Attendance recording error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
