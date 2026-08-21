import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { TRANSFORMATION_PROGRAM } from '@/lib/transformation-program';
import { api, getConvexClient } from '@/lib/convex';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type CheckoutOption = 'full' | 'installments';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://behaviorschool.com';
const PRODUCT_NAME = TRANSFORMATION_PROGRAM.name;
const PRODUCT_DESCRIPTION = `${TRANSFORMATION_PROGRAM.cohort.label}, ${TRANSFORMATION_PROGRAM.cohort.dateRange}`;
const FULL_PAYMENT_AMOUNT_CENTS = TRANSFORMATION_PROGRAM.pricing.payInFullCents;
const INSTALLMENT_AMOUNT_CENTS = TRANSFORMATION_PROGRAM.pricing.installmentCents;
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

    const customerEmail = normalizeEmail(body.email);
    const stripe = getStripe();
    const successUrl = `${SITE_URL}/transformation-program/checkout?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${SITE_URL}/transformation-program/checkout?checkout=cancelled`;

    const commonMetadata = {
      product: PRODUCT_NAME,
      program: 'transformation_program',
      cohort: TRANSFORMATION_PROGRAM.cohort.id,
      checkout_option: option,
    };

    const session = await stripe.checkout.sessions.create(
      option === 'full'
        ? {
            mode: 'payment',
            customer_email: customerEmail,
            line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: PRODUCT_NAME,
                    description: PRODUCT_DESCRIPTION,
                  },
                  unit_amount: FULL_PAYMENT_AMOUNT_CENTS,
                },
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
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: `${PRODUCT_NAME} Payment Plan`,
                    description: `${PRODUCT_DESCRIPTION}. ${TRANSFORMATION_PROGRAM.pricing.installmentCount} monthly payments of ${TRANSFORMATION_PROGRAM.pricing.installment}.`,
                  },
                  unit_amount: INSTALLMENT_AMOUNT_CENTS,
                  recurring: {
                    interval: 'month',
                    interval_count: 1,
                  },
                },
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
