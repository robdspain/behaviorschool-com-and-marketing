import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  try {
    const body = await request.json();
    const { eventId, firstName, lastName, email, bacbId, credential } = body;

    // Validate required fields
    if (!eventId || !firstName || !lastName || !email || !bacbId || !credential) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the event to check eligibility
    const { data: event, error: eventError } = await supabase
      .from('ace_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event is still accepting registrations
    if (event.status !== 'approved') {
      return NextResponse.json(
        { error: 'This event is not currently accepting registrations' },
        { status: 400 }
      );
    }

    // Check if event is full
    if (event.max_participants && (event.current_participants || 0) >= event.max_participants) {
      return NextResponse.json(
        { error: 'This event is full' },
        { status: 400 }
      );
    }

    // Check credential eligibility
    const isPdEvent = event.event_type === 'pd';
    if (isPdEvent && credential !== 'rbt') {
      return NextResponse.json(
        { error: 'This PD event is for RBTs only. BCBAs and BCaBAs should register for CE events.' },
        { status: 400 }
      );
    }
    if (!isPdEvent && credential === 'rbt') {
      return NextResponse.json(
        { error: 'This CE event is for BCBAs and BCaBAs only. RBTs should register for PD events.' },
        { status: 400 }
      );
    }

    // Check for existing registration
    const { data: existingReg, error: existingError } = await supabase
      .from('ace_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('email', email.toLowerCase())
      .single();

    if (existingReg) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      );
    }

    // Generate confirmation code
    const confirmationCode = `ACE-${Date.now()}-${nanoid(6).toUpperCase()}`;

    // Create registration
    const { data: registration, error: regError } = await supabase
      .from('ace_registrations')
      .insert({
        event_id: eventId,
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
        bacb_id: bacbId,
        credential,
        confirmation_code: confirmationCode,
        status: 'confirmed',
        registration_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (regError) {
      console.error('Registration error:', regError);
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      );
    }

    // Update participant count
    await supabase
      .from('ace_events')
      .update({ current_participants: (event.current_participants || 0) + 1 })
      .eq('id', eventId);

    // TODO: Send confirmation email via Listmonk/Resend

    return NextResponse.json({
      success: true,
      registration: {
        id: registration.id,
        confirmationCode,
        eventTitle: event.title,
        eventDate: event.start_date,
      },
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
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const confirmationCode = searchParams.get('code');

  if (!email && !confirmationCode) {
    return NextResponse.json(
      { error: 'Email or confirmation code required' },
      { status: 400 }
    );
  }

  try {
    let query = supabase
      .from('ace_registrations')
      .select(`
        *,
        event:event_id (
          id,
          title,
          start_date,
          end_date,
          total_ceus,
          event_type,
          modality
        )
      `);

    if (email) {
      query = query.eq('email', email.toLowerCase());
    }
    if (confirmationCode) {
      query = query.eq('confirmation_code', confirmationCode);
    }

    const { data: registrations, error } = await query;

    if (error) {
      console.error('Fetch registrations error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch registrations' },
        { status: 500 }
      );
    }

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Fetch registrations error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
