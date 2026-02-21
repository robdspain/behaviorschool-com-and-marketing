import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize lazily to avoid build errors
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
  });
}

// Create admin Supabase client for webhook
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  const stripe = getStripe();

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const registrationId = session.metadata?.registration_id;

        if (registrationId) {
          // Update registration to confirmed
          await supabase
            .from('ace_registrations')
            .update({
              status: 'confirmed',
              fee_paid: true,
              payment_date: new Date().toISOString(),
              stripe_payment_intent_id: session.payment_intent as string,
            })
            .eq('id', registrationId);

          console.log(`Registration ${registrationId} payment confirmed`);

          // TODO: Send confirmation email
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const registrationId = session.metadata?.registration_id;

        if (registrationId) {
          // Update registration status
          await supabase
            .from('ace_registrations')
            .update({
              status: 'payment_expired',
            })
            .eq('id', registrationId);

          // Decrement participant count
          const eventId = session.metadata?.event_id;
          if (eventId) {
            const { data: event } = await supabase
              .from('ace_events')
              .select('current_participants')
              .eq('id', eventId)
              .single();

            if (event && event.current_participants > 0) {
              await supabase
                .from('ace_events')
                .update({
                  current_participants: event.current_participants - 1,
                })
                .eq('id', eventId);
            }
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed: ${paymentIntent.id}`);
        // Could send notification email here
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Route segment config for disabling body parsing
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
