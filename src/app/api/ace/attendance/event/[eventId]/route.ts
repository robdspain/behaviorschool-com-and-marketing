import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import { getEventAttendanceRecords } from '@/lib/ace/ace-service';
import type { Id } from '@/lib/convex';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/attendance/event/[eventId]
 * Get all attendance records for an event with participant info and computed fields
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const client = getConvexClient();

    // Get the event details
    const event = await client.query(api.aceEvents.getWithDetails, {
      id: eventId as Id<"aceEvents">,
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Get all attendance records for this event (includes participant info from Convex query)
    const records = await getEventAttendanceRecords(eventId);

    // Get all registrations for this event to include registered but absent participants
    const registrations = await client.query(api.aceRegistrations.getByEvent, {
      eventId: eventId as Id<"aceEvents">,
    });

    // Calculate event duration in minutes
    const eventDurationMinutes = event.endDate && event.startDate
      ? Math.round((event.endDate - event.startDate) / (1000 * 60))
      : null;

    // Build enriched records
    const enrichedRecords = records.map((record: any) => {
      const participant = record.participant;
      const participantName = participant
        ? `${participant.firstName} ${participant.lastName}`
        : 'Unknown';
      const participantEmail = participant?.email || '';

      // Calculate duration in minutes
      let durationMinutes: number | null = null;
      if (record.signInTimestamp) {
        const checkOutTime = record.signOutTimestamp || Date.now();
        durationMinutes = Math.round(
          (checkOutTime - record.signInTimestamp) / (1000 * 60)
        );
      }

      // Calculate attendance percentage
      let attendancePercentage: number | null = null;
      if (durationMinutes !== null && eventDurationMinutes && eventDurationMinutes > 0) {
        attendancePercentage = Math.min(
          100,
          Math.round((durationMinutes / eventDurationMinutes) * 100)
        );
      }

      // Determine status
      let status: 'present' | 'absent' | 'partial' | 'checked_in' = 'absent';
      if (record.signInTimestamp && record.signOutTimestamp) {
        if (attendancePercentage !== null && attendancePercentage >= 80) {
          status = 'present';
        } else {
          status = 'partial';
        }
      } else if (record.signInTimestamp) {
        status = 'checked_in';
      }

      return {
        id: record._id,
        event_id: record.eventId,
        participant_id: record.participantId,
        participant_name: participantName,
        participant_email: participantEmail,
        check_in_time: record.signInTimestamp
          ? new Date(record.signInTimestamp).toISOString()
          : null,
        check_out_time: record.signOutTimestamp
          ? new Date(record.signOutTimestamp).toISOString()
          : null,
        duration_minutes: durationMinutes,
        attendance_percentage: attendancePercentage,
        status,
        verified: record.verified,
        verified_at: record.verifiedAt
          ? new Date(record.verifiedAt).toISOString()
          : null,
        verification_method: record.verificationMethod,
        verification_code_entered: record.verificationCodeEntered,
      };
    });

    // Build a set of participants who have attendance records
    const attendedParticipantIds = new Set(
      records.map((r: any) => String(r.participantId))
    );

    // Add registered participants who have no attendance record
    const absentRecords = await Promise.all(
      registrations
        .filter((reg: any) => !attendedParticipantIds.has(String(reg.participantId)))
        .map(async (reg: any) => {
          const participant = await client.query(api.aceUsers.getById, {
            id: reg.participantId,
          });
          return {
            id: null,
            event_id: eventId,
            participant_id: String(reg.participantId),
            participant_name: participant
              ? `${participant.firstName} ${participant.lastName}`
              : 'Unknown',
            participant_email: participant?.email || '',
            check_in_time: null,
            check_out_time: null,
            duration_minutes: null,
            attendance_percentage: null,
            status: 'absent' as const,
            verified: false,
            verified_at: null,
            verification_method: null,
            verification_code_entered: null,
          };
        })
    );

    const allRecords = [...enrichedRecords, ...absentRecords];

    // Summary statistics
    const totalRegistered = registrations.length;
    const checkedIn = enrichedRecords.filter(
      (r: any) => r.check_in_time !== null
    ).length;
    const checkedOut = enrichedRecords.filter(
      (r: any) => r.check_out_time !== null
    ).length;
    const verified = enrichedRecords.filter((r: any) => r.verified).length;
    const durations = enrichedRecords
      .filter((r: any) => r.duration_minutes !== null)
      .map((r: any) => r.duration_minutes as number);
    const averageDuration =
      durations.length > 0
        ? Math.round(durations.reduce((a: number, b: number) => a + b, 0) / durations.length)
        : 0;
    const meetsThreshold = enrichedRecords.filter(
      (r: any) => r.attendance_percentage !== null && r.attendance_percentage >= 80
    ).length;

    return NextResponse.json({
      success: true,
      data: {
        event: {
          id: event._id,
          title: event.title,
          start_date: new Date(event.startDate).toISOString(),
          end_date: event.endDate ? new Date(event.endDate).toISOString() : null,
          duration_minutes: eventDurationMinutes,
          verification_method: event.verificationMethod,
          status: event.status,
        },
        records: allRecords,
        summary: {
          total_registered: totalRegistered,
          checked_in: checkedIn,
          checked_out: checkedOut,
          verified,
          average_duration_minutes: averageDuration,
          meets_threshold: meetsThreshold,
          event_duration_minutes: eventDurationMinutes,
        },
      },
    });
  } catch (error) {
    console.error('Fetch event attendance error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
