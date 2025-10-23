import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { validateRegistrationEligibility } from '@/lib/ace/registration-validation';
import type { AceCredentialType, AceEventType } from '@/lib/ace/types';

/**
 * GET /api/admin/ace/registrations
 * Fetch all registrations or registrations for a specific event
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');

    let query = supabase
      .from('ace_registrations')
      .select(`
        *,
        user:ace_users(id, first_name, last_name, email, credential_type, credential_number),
        event:ace_events(id, title, event_type, start_date, total_ceus)
      `)
      .order('created_at', { ascending: false });

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching registrations:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in GET /api/admin/ace/registrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/ace/registrations
 * Create a new registration with CE/PD eligibility validation
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { event_id, user_id } = body;

    if (!event_id || !user_id) {
      return NextResponse.json(
        { error: 'event_id and user_id are required' },
        { status: 400 }
      );
    }

    // Fetch user credential type
    const { data: user, error: userError } = await supabase
      .from('ace_users')
      .select('credential_type, credential_verified')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch event type
    const { data: event, error: eventError } = await supabase
      .from('ace_events')
      .select('event_type, title, status')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Validate event is available for registration
    if (event.status !== 'approved' && event.status !== 'draft') {
      return NextResponse.json(
        { error: 'This event is not available for registration' },
        { status: 400 }
      );
    }

    // Validate credential type eligibility
    const credentialType = (user.credential_type || 'pending') as AceCredentialType;
    const eventType = (event.event_type || 'ce') as AceEventType;

    const eligibility = validateRegistrationEligibility(credentialType, eventType);

    if (!eligibility.eligible) {
      return NextResponse.json(
        { 
          error: eligibility.reason,
          requiresCredentialVerification: eligibility.requiresCredentialVerification 
        },
        { status: 403 }
      );
    }

    // Check if user credential is verified
    if (!user.credential_verified) {
      return NextResponse.json(
        { 
          error: 'Your credential must be verified before registering for events. Please contact support.',
          requiresCredentialVerification: true
        },
        { status: 403 }
      );
    }

    // Check for existing registration
    const { data: existingReg } = await supabase
      .from('ace_registrations')
      .select('id')
      .eq('event_id', event_id)
      .eq('user_id', user_id)
      .single();

    if (existingReg) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      );
    }

    // Generate confirmation code
    const confirmationCode = `REG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create registration
    const { data: registration, error: regError } = await supabase
      .from('ace_registrations')
      .insert({
        event_id,
        user_id,
        confirmation_code: confirmationCode,
        is_confirmed: true,
        fee_paid: true, // For mastermind, no payment required
        payment_amount: 0,
      })
      .select()
      .single();

    if (regError) {
      console.error('Error creating registration:', regError);
      return NextResponse.json(
        { error: regError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: registration }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/ace/registrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/ace/registrations
 * Cancel a registration
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get('id');

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    // Mark as cancelled instead of deleting
    const { error } = await supabase
      .from('ace_registrations')
      .update({
        is_cancelled: true,
        cancellation_date: new Date().toISOString(),
        cancellation_reason: 'Admin cancelled',
      })
      .eq('id', registrationId);

    if (error) {
      console.error('Error cancelling registration:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/ace/registrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

