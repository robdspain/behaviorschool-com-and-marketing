import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type CheckoutOption = 'full' | 'installments';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://behaviorschool.com';
const PRODUCT_NAME = 'School BCBA Transformation Program';
const PRODUCT_DESCRIPTION = 'August 2026 cohort, August 12 to September 16, 2026';
const FULL_PAYMENT_AMOUNT_CENTS = 199700;
const INSTALLMENT_AMOUNT_CENTS = 69700;

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
    throw new Error('Stripe secret key is not configured.');
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
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
      cohort: 'august_2026',
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
                    description: `${PRODUCT_DESCRIPTION}. Three monthly payments of $697.`,
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
            metadata: {
              ...commonMetadata,
              installment_total_payments: '3',
              installment_amount_cents: String(INSTALLMENT_AMOUNT_CENTS),
            },
            subscription_data: {
              metadata: {
                ...commonMetadata,
                installment_total_payments: '3',
                installment_amount_cents: String(INSTALLMENT_AMOUNT_CENTS),
              },
            },
          },
    );

    return NextResponse.json({
      success: true,
      checkout_url: session.url,
      session_id: session.id,
    });
  } catch (error) {
    console.error('Transformation checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session.' },
      { status: 500 },
    );
  }
}
