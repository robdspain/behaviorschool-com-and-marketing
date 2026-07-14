'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';

const COHORT_LABEL = 'August 2026 cohort';
const COHORT_DATES = 'August 12 to September 16, 2026';
const FULL_PAYMENT = '$1,997';
const PAYMENT_PLAN = '3 monthly payments of $697';
const PAYMENT_PLAN_TOTAL = '$2,091 total';

type CheckoutOption = 'full' | 'installments';

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
};

export function TransformationCheckoutClient() {
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutStatus, setCheckoutStatus] = useState<'success' | 'cancelled' | null>(null);
  const [loadingOption, setLoadingOption] = useState<CheckoutOption | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('checkout');
    if (status === 'success' || status === 'cancelled') {
      setCheckoutStatus(status);
    }
  }, []);

  const startCheckout = async (option: CheckoutOption) => {
    setLoadingOption(option);
    setCheckoutError('');

    try {
      const response = await fetch('/api/transformation-program/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          option,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.checkout_url) {
        throw new Error(data.error || 'Unable to start checkout.');
      }

      window.location.href = data.checkout_url;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Unable to start checkout.');
      setLoadingOption(null);
    }
  };

  if (checkoutStatus === 'success') {
    return (
      <main className="min-h-screen bg-[#f9f7f2] px-4 py-16 sm:px-6">
        <motion.div className="mx-auto max-w-xl text-center" initial="initial" animate="animate" variants={fadeInUp}>
          <div className="rounded-2xl border border-[#1f4d3f]/10 bg-white p-8 shadow-xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#1f4d3f]/10">
              <CheckCircle2 className="h-8 w-8 text-[#1f4d3f]" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-[#123628]">Payment received</h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Stripe confirmed your checkout. Watch your email for program access and onboarding details.
            </p>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9f7f2] px-4 py-12 sm:px-6">
      <motion.div
        className="mx-auto max-w-5xl"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f]">Private enrollment checkout</p>
          <h1 className="mt-3 text-3xl font-bold text-[#123628] sm:text-4xl">School BCBA Transformation Program</h1>
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm text-slate-700">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1f4d3f]/15 bg-white px-4 py-2">
              <CalendarDays className="h-4 w-4 text-[#1f4d3f]" aria-hidden="true" />
              {COHORT_LABEL}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1f4d3f]/15 bg-white px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-[#1f4d3f]" aria-hidden="true" />
              {COHORT_DATES}
            </span>
          </div>
        </header>

        {checkoutError && (
          <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
            {checkoutError}
          </div>
        )}

        {checkoutStatus === 'cancelled' && (
          <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800">
            Checkout was cancelled. Choose a payment option below when you are ready.
          </div>
        )}

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="flex h-full flex-col rounded-2xl border border-[#1f4d3f]/15 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#123628]">Pay in full</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">One Stripe checkout payment for the full program package.</p>
              </div>
              <CreditCard className="h-6 w-6 flex-none text-[#1f4d3f]" aria-hidden="true" />
            </div>
            <p className="mt-8 text-4xl font-bold text-[#123628]">{FULL_PAYMENT}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#1f4d3f]" aria-hidden="true" />
                Includes the 6-week live cohort and program materials.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#1f4d3f]" aria-hidden="true" />
                Card, Link, and other eligible Stripe payment methods are handled by Stripe.
              </li>
            </ul>
            <button
              type="button"
              onClick={() => startCheckout('full')}
              disabled={loadingOption !== null}
              className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1f4d3f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#123628] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingOption === 'full' ? 'Opening Stripe...' : 'Pay in full'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </article>

          <article className="flex h-full flex-col rounded-2xl border-2 border-[#e4b63d] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#123628]">Payment plan</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Three monthly Stripe payments for the same program package.</p>
              </div>
              <ShieldCheck className="h-6 w-6 flex-none text-[#1f4d3f]" aria-hidden="true" />
            </div>
            <p className="mt-8 text-4xl font-bold text-[#123628]">$697</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{PAYMENT_PLAN}</p>
            <p className="mt-1 text-xs text-slate-500">{PAYMENT_PLAN_TOTAL}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#1f4d3f]" aria-hidden="true" />
                The first payment is collected at checkout.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#1f4d3f]" aria-hidden="true" />
                The plan is set to cancel after the third monthly payment.
              </li>
            </ul>
            <button
              type="button"
              onClick={() => startCheckout('installments')}
              disabled={loadingOption !== null}
              className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e4b63d] px-6 py-3 text-sm font-semibold text-[#123628] transition hover:bg-[#d4a637] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingOption === 'installments' ? 'Opening Stripe...' : 'Use payment plan'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </article>
        </section>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-slate-500">
          Stripe processes payment details. Behavior School does not store card numbers on this site.
        </p>
      </motion.div>
    </main>
  );
}
