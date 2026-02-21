import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

// Initialize Stripe lazily to avoid build errors
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
  });
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://behaviorschool.com';

/**
 * POST /api/ace/checkout
 * Create a Stripe checkout session for event registration
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registration_id, event_id, participant_id, email } = body;

    if (!registration_id || !event_id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get registration details
    const { data: registration, error: regError } = await supabase
      .from('ace_registrations')
      .select(`
        *,
        event:ace_events (
          id,
          title,
          total_ceus,
          fee,
          provider_id
        )
      `)
      .eq('id', registration_id)
      .single();

    if (regError || !registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    if (registration.fee_paid) {
      return NextResponse.json(
        { error: 'Payment already completed' },
        { status: 400 }
      );
    }

    const event = registration.event;
    const fee = event.fee || 0;

    if (fee === 0) {
      // Free event - just confirm registration
      await supabase
        .from('ace_registrations')
        .update({
          status: 'confirmed',
          fee_paid: true,
        })
        .eq('id', registration_id);

      return NextResponse.json({
        success: true,
        message: 'Registration confirmed (free event)',
        redirect_url: `${SITE_URL}/events/${event_id}?registered=true&code=${registration.confirmation_code}`,
      });
    }

    // Create Stripe checkout session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: event.title,
              description: `${event.total_ceus} CEUs - Continuing Education Event`,
              metadata: {
                event_id: event.id,
                registration_id: registration_id,
              },
            },
            unit_amount: Math.round(fee * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/events/${event_id}?registered=true&code=${registration.confirmation_code}&payment=success`,
      cancel_url: `${SITE_URL}/events/${event_id}?payment=cancelled`,
      metadata: {
        registration_id: registration_id,
        event_id: event_id,
        participant_id: participant_id,
        confirmation_code: registration.confirmation_code,
      },
    });

    // Store Stripe session ID on registration
    await supabase
      .from('ace_registrations')
      .update({
        stripe_session_id: session.id,
      })
      .eq('id', registration_id);

    return NextResponse.json({
      success: true,
      checkout_url: session.url,
      session_id: session.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
