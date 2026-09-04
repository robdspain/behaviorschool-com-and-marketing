import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { TRANSFORMATION_PROGRAM } from '@/lib/transformation-program';
import { api, getConvexClient } from '@/lib/convex';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type CheckoutOption = 'full' | 'installments';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://behaviorschool.com';
const PRODUCT_NAME = TRANSFORMATION_PROGRAM.name;
const FULL_PAYMENT_AMOUNT_CENTS = TRANSFORMATION_PROGRAM.pricing.payInFullCents;
const INSTALLMENT_AMOUNT_CENTS = TRANSFORMATION_PROGRAM.pricing.installmentCents;
const FULL_PRICE_ID = TRANSFORMATION_PROGRAM.pricing.stripePayInFullPriceId;
const INSTALLMENT_PRICE_ID = TRANSFORMATION_PROGRAM.pricing.stripeInstallmentPriceId;
const CHECKOUT_ERROR_MESSAGE = 'Unable to start checkout right now. Please contact Behavior School for help completing enrollment.';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !/^(sk|rk)_(test|live)_/.test(key) || key.includes('placeholder')) {
    throw new Error('Stripe secret key is not configured.');
  }

  return new Stripe(key, {
    apiVersion: '2026-02-25.clover',
  });
}

function normalizeOption(option: unknown): CheckoutOption | null {
  return option === 'full' || option === 'installments' ? option : null;
}

function normalizeEmail(email: unknown): string | undefined {
  if (typeof email !== 'string') {
    return undefined;
  }

  const normalized = email.trim().toLowerCase();
  return normalized.includes('@') ? normalized : undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const option = normalizeOption(body.option);

    if (!option) {
      return NextResponse.json({ error: 'Choose a valid checkout option.' }, { status: 400 });
    }

    if (option === 'full' && !FULL_PRICE_ID) {
      return NextResponse.json({ error: 'One-time Stripe Price ID is not configured.' }, { status: 500 });
    }

    if (option === 'installments' && !INSTALLMENT_PRICE_ID) {
      return NextResponse.json({ error: 'Installment Stripe Price ID is not configured.' }, { status: 500 });
    }

    const customerEmail = normalizeEmail(body.email);
    const stripe = getStripe();
    const successUrl = `${SITE_URL}/transformation-program/checkout?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${SITE_URL}/transformation-program/checkout?checkout=cancelled`;

    const commonMetadata = {
      product: PRODUCT_NAME,
      program: 'transformation_program',
      cohort: TRANSFORMATION_PROGRAM.cohort.id,
      checkout_option: option,
      stripe_price_id: option === 'full' ? FULL_PRICE_ID : INSTALLMENT_PRICE_ID,
    };

    const session = await stripe.checkout.sessions.create(
      option === 'full'
        ? {
            mode: 'payment',
            customer_email: customerEmail,
            line_items: [
              {
                price: FULL_PRICE_ID,
                quantity: 1,
              },
            ],
            success_url: successUrl,
            cancel_url: cancelUrl,
            name_collection: {
              individual: { enabled: true, optional: false },
            },
            metadata: commonMetadata,
            payment_intent_data: {
              metadata: commonMetadata,
            },
          }
        : {
            mode: 'subscription',
            customer_email: customerEmail,
            line_items: [
              {
                price: INSTALLMENT_PRICE_ID,
                quantity: 1,
              },
            ],
            success_url: successUrl,
            cancel_url: cancelUrl,
            name_collection: {
              individual: { enabled: true, optional: false },
            },
            metadata: {
              ...commonMetadata,
              installment_total_payments: String(TRANSFORMATION_PROGRAM.pricing.installmentCount),
              installment_amount_cents: String(INSTALLMENT_AMOUNT_CENTS),
            },
            subscription_data: {
              metadata: {
                ...commonMetadata,
                installment_total_payments: String(TRANSFORMATION_PROGRAM.pricing.installmentCount),
                installment_amount_cents: String(INSTALLMENT_AMOUNT_CENTS),
              },
            },
          },
    );

    await getConvexClient().mutation(api.analytics.createConversionEvent, {
      eventType: 'checkout_started',
      eventName: 'transformation_checkout_created',
      sourcePage: '/transformation-program/checkout',
      resourceName: PRODUCT_NAME,
      value: option === 'full' ? FULL_PAYMENT_AMOUNT_CENTS / 100 : INSTALLMENT_AMOUNT_CENTS / 100,
      additionalData: {
        cohort: TRANSFORMATION_PROGRAM.cohort.id,
        checkoutOption: option,
        stripeSessionId: session.id,
        stripePriceId: option === 'full' ? FULL_PRICE_ID : INSTALLMENT_PRICE_ID,
      },
    }).catch((analyticsError) => {
      console.error('Transformation checkout analytics error:', analyticsError);
    });

    return NextResponse.json({
      success: true,
      checkout_url: session.url,
      session_id: session.id,
    });
  } catch (error) {
    console.error('Transformation checkout error:', error);
    return NextResponse.json(
      { error: CHECKOUT_ERROR_MESSAGE },
      { status: 500 },
    );
  }
}
