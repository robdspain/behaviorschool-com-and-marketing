import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import { getOrCreateAceUser } from '@/lib/ace/ace-service';
import type { Id } from '@/lib/convex';

export const dynamic = 'force-dynamic';

/**
 * POST /api/ace/registrations/waitlist
 * Add a participant to the waitlist for an event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_id, firstName, lastName, email, bacbId, credentialType } = body;

    if (!event_id || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: event_id, firstName, lastName, email' },
        { status: 400 }
      );
    }

    const client = getConvexClient();

    // Get the event
    const event = await client.query(api.aceEvents.getWithDetails, {
      id: event_id as Id<'aceEvents'>,
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event is accepting registrations
    if (!['approved', 'in_progress'].includes(event.status)) {
      return NextResponse.json(
        { error: 'This event is not currently accepting registrations' },
        { status: 400 }
      );
    }

    // Get or create user
    const user = await getOrCreateAceUser(
      email,
      firstName,
      lastName,
      bacbId
    );

    // Check if already registered or on waitlist
    const existing = await client.query(api.aceRegistrations.getByEventAndParticipant, {
      eventId: event_id as Id<'aceEvents'>,
      participantId: user._id,
    });

    if (existing) {
      return NextResponse.json({
        success: false,
        error: existing.status === 'cancelled'
          ? 'Your previous registration was cancelled. Please contact support.'
          : 'You are already registered or on the waitlist for this event.',
        confirmation_code: existing.confirmationCode,
      }, { status: 400 });
    }

    // Generate a confirmation code for waitlist
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let confirmationCode = 'WL-';
    for (let i = 0; i < 6; i++) {
      confirmationCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Create waitlist registration with 'pending' status and isWaitlisted flag
    const now = Date.now();
    const registrationId = await client.mutation(api.aceRegistrations.register, {
      eventId: event_id as Id<'aceEvents'>,
      participantId: user._id,
      credentialType,
    });

    // If registration succeeded (shouldn't for full events, but handle the case)
    if (registrationId.success) {
      // Mark as waitlisted by updating status to pending
      await client.mutation(api.aceRegistrations.updateStatus, {
        id: registrationId.registrationId as Id<'aceRegistrations'>,
        status: 'pending',
      });

      return NextResponse.json({
        success: true,
        waitlisted: true,
        registration_id: registrationId.registrationId,
        confirmation_code: registrationId.confirmationCode,
        message: 'You have been added to the waitlist. We will notify you if a spot opens up.',
      });
    }

    return NextResponse.json({
      success: false,
      error: registrationId.error || 'Failed to join waitlist',
    }, { status: 400 });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ace/registrations/waitlist
 * Get waitlist for an event
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('event_id');

    if (!eventId) {
      return NextResponse.json(
        { error: 'event_id parameter is required' },
        { status: 400 }
      );
    }

    const client = getConvexClient();

    // Get all pending registrations for the event (waitlisted)
    const allRegistrations = await client.query(api.aceRegistrations.getByEvent, {
      eventId: eventId as Id<'aceEvents'>,
    });

    // Filter for pending/waitlisted ones
    // Note: getByEvent filters for confirmed, so we need to use getAll and filter
    const allRegs = await client.query(api.aceRegistrations.getAll, {});
    const waitlisted = allRegs.filter(
      (r: { eventId: string; status: string }) =>
        r.eventId === eventId && r.status === 'pending'
    );

    return NextResponse.json({
      success: true,
      waitlist: waitlisted,
      count: waitlisted.length,
    });
  } catch (error) {
    console.error('Get waitlist error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
