import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '@/lib/convex';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

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

    const client = getConvexClient();

    // Get registration details
    const registration = await client.query(api.aceRegistrations.getById, {
      id: registration_id as Id<'aceRegistrations'>,
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    if (registration.feePaid) {
      return NextResponse.json(
        { error: 'Payment already completed' },
        { status: 400 }
      );
    }

    // Get event details
    const event = await client.query(api.aceEvents.getWithDetails, {
      id: event_id as Id<'aceEvents'>,
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const fee = event.fee || 0;

    if (fee === 0) {
      // Free event - just confirm registration
      await client.mutation(api.aceRegistrations.markPaymentComplete, {
        id: registration_id as Id<'aceRegistrations'>,
      });

      return NextResponse.json({
        success: true,
        message: 'Registration confirmed (free event)',
        redirect_url: `${SITE_URL}/events/${event_id}?registered=true&code=${registration.confirmationCode}`,
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
              description: `${event.totalCeus} CEUs - Continuing Education Event`,
              metadata: {
                event_id: event_id,
                registration_id: registration_id,
              },
            },
            unit_amount: Math.round(fee * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/events/${event_id}?registered=true&code=${registration.confirmationCode}&payment=success`,
      cancel_url: `${SITE_URL}/events/${event_id}?payment=cancelled`,
      metadata: {
        registration_id: registration_id,
        event_id: event_id,
        participant_id: participant_id,
        confirmation_code: registration.confirmationCode,
      },
    });

    // Session ID is stored in Stripe metadata (registration_id).
    // The webhook handler will call markPaymentComplete when payment succeeds.

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
