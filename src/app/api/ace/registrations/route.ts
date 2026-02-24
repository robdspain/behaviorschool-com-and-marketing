import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import { registerForEvent, getOrCreateAceUser } from '@/lib/ace/ace-service';
import type { Id } from '@/lib/convex';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_id, firstName, lastName, email, bacbId, credentialType } = body;

    // Validate required fields
    if (!event_id || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: event_id, firstName, lastName, email' },
        { status: 400 }
      );
    }

    const client = getConvexClient();

    // Get the event to check eligibility
    const event = await client.query(api.aceEvents.getWithDetails, {
      id: event_id as Id<"aceEvents">,
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event is still accepting registrations
    if (!['approved', 'in_progress'].includes(event.status)) {
      return NextResponse.json(
        { error: 'This event is not currently accepting registrations' },
        { status: 400 }
      );
    }

    // Check if event is full
    if (event.maxParticipants && (event.currentParticipants || 0) >= event.maxParticipants) {
      return NextResponse.json(
        { error: 'This event is full' },
        { status: 400 }
      );
    }

    // Check credential eligibility
    const isPdEvent = event.eventType === 'pd';
    if (isPdEvent && credentialType !== 'rbt') {
      return NextResponse.json(
        { error: 'This PD event is for RBTs only. BCBAs and BCaBAs should register for CE events.' },
        { status: 400 }
      );
    }
    if (!isPdEvent && credentialType === 'rbt') {
      return NextResponse.json(
        { error: 'This CE event is for BCBAs and BCaBAs only. RBTs should register for PD events.' },
        { status: 400 }
      );
    }

    // Register using the service
    const result = await registerForEvent(event_id, {
      email,
      firstName,
      lastName,
      bacbId,
      credentialType,
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error,
          confirmation_code: result.confirmation_code
        },
        { status: 400 }
      );
    }

    // TODO: Send confirmation email via Listmonk/Resend

    return NextResponse.json({
      success: true,
      registration_id: result.registration_id,
      confirmation_code: result.confirmation_code,
      event_title: event.title,
      event_date: event.startDate,
      requires_payment: result.requires_payment,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const client = getConvexClient();

  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const confirmationCode = searchParams.get('code');
  const eventId = searchParams.get('event_id');

  try {
    // Get registrations based on filters
    if (confirmationCode) {
      const registration = await client.query(api.aceRegistrations.getByConfirmationCode, {
        confirmationCode,
      });
      return NextResponse.json({ 
        success: true, 
        registrations: registration ? [registration] : [] 
      });
    }

    if (email) {
      // First find the user by email
      const user = await client.query(api.aceUsers.getByEmail, {
        email: email.toLowerCase(),
      });

      if (!user) {
        return NextResponse.json({ success: true, registrations: [] });
      }

      const registrations = await client.query(api.aceRegistrations.getByParticipant, {
        participantId: user._id,
      });

      // Filter by eventId if provided
      const filtered = eventId 
        ? registrations.filter((r: any) => r.eventId === eventId)
        : registrations;

      return NextResponse.json({ success: true, registrations: filtered });
    }

    if (eventId) {
      const registrations = await client.query(api.aceRegistrations.getByEvent, {
        eventId: eventId as Id<"aceEvents">,
      });
      return NextResponse.json({ success: true, registrations });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Please provide email, code, or event_id parameter' 
    }, { status: 400 });
  } catch (error) {
    console.error('Fetch registrations error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
