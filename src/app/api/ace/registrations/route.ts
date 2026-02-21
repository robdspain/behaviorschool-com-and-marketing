import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { registerForEvent, getOrCreateAceUser } from '@/lib/ace/ace-service';

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

    // Get supabase client
    const supabase = await createClient();

    // Get the event to check eligibility
    const { data: event, error: eventError } = await supabase
      .from('ace_events')
      .select('*')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
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
    if (event.max_participants && (event.current_participants || 0) >= event.max_participants) {
      return NextResponse.json(
        { error: 'This event is full' },
        { status: 400 }
      );
    }

    // Check credential eligibility
    const isPdEvent = event.event_type === 'pd';
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

    // Get or create the user
    const user = await getOrCreateAceUser(email, firstName, lastName, bacbId);

    // Check for existing registration
    const { data: existingReg } = await supabase
      .from('ace_registrations')
      .select('id, confirmation_code')
      .eq('event_id', event_id)
      .eq('participant_id', user.id)
      .single();

    if (existingReg) {
      return NextResponse.json(
        { 
          error: 'You are already registered for this event',
          confirmation_code: existingReg.confirmation_code
        },
        { status: 400 }
      );
    }

    // Generate confirmation code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let confirmationCode = '';
    for (let i = 0; i < 8; i++) {
      confirmationCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Determine if event is free
    const isFree = !event.fee || event.fee === 0;

    // Create registration
    const { data: registration, error: regError } = await supabase
      .from('ace_registrations')
      .insert({
        event_id: event_id,
        participant_id: user.id,
        confirmation_code: confirmationCode,
        status: isFree ? 'confirmed' : 'pending_payment',
        fee_amount: event.fee || 0,
        fee_paid: isFree,
        credential_type: credentialType,
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
      .eq('id', event_id);

    // TODO: Send confirmation email via Listmonk/Resend

    return NextResponse.json({
      success: true,
      registration_id: registration.id,
      confirmation_code: confirmationCode,
      event_title: event.title,
      event_date: event.start_date,
      requires_payment: !isFree,
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
  const supabase = await createClient();

  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const confirmationCode = searchParams.get('code');
  const eventId = searchParams.get('event_id');

  try {
    let query = supabase
      .from('ace_registrations')
      .select(`
        *,
        event:ace_events (
          id,
          title,
          start_date,
          end_date,
          total_ceus,
          event_type,
          modality,
          ce_category
        ),
        participant:ace_users (
          id,
          first_name,
          last_name,
          email,
          bacb_id
        )
      `);

    if (email) {
      // First find the user by email
      const { data: user } = await supabase
        .from('ace_users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (user) {
        query = query.eq('participant_id', user.id);
      } else {
        return NextResponse.json({ registrations: [] });
      }
    }

    if (confirmationCode) {
      query = query.eq('confirmation_code', confirmationCode);
    }

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data: registrations, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch registrations error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch registrations' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, registrations });
  } catch (error) {
    console.error('Fetch registrations error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
