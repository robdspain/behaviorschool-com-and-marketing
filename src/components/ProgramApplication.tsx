'use client';

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { TRANSFORMATION_PROGRAM } from '@/lib/transformation-program';

// ─── COHORT FLAG ───────────────────────────────────────────────────────────────
// Set this to `true` when a cohort is open for enrollment.
// When false → shows the Waitlist Form (true post-full / closed state).
// When true  → shows the Application Form.
const isCohortOpen = true;
// ──────────────────────────────────────────────────────────────────────────────

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

function WaitlistForm() {
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get('email') || '').trim();
    setStatus('loading');
    try {
      const res = await fetch('/.netlify/functions/addToWaitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 p-7 shadow-sm md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
          Join the waitlist for the next cohort
        </h2>
        <p className="text-slate-600 text-base">
          The current cohort is full or closed. Leave your email and we will notify you when the next cohort opens.
        </p>
      </div>

      {status === 'success' ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
          <p className="text-slate-800 font-semibold text-lg">You&rsquo;re on the waitlist</p>
          <p className="text-slate-500 text-sm">We&rsquo;ll notify you when the next cohort opens.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3f] focus:border-transparent"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="min-h-11 rounded-xl bg-[#1f4d3f] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#123628] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f4d3f] disabled:opacity-60 whitespace-nowrap"
          >
            {status === 'loading' ? 'Submitting…' : 'Notify Me'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="mt-3 text-red-600 text-sm text-center">
          Something went wrong. Please try again or reach out through the contact page.
        </p>
      )}
    </div>
  );
}

function ApplicationForm() {
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const params = new URLSearchParams(window.location.search);
    const payload = {
      fullName: String(data.get('fullName') || '').trim(),
      email: String(data.get('email') || '').trim(),
      bcbaCertNumber: String(data.get('bcbaCertNumber') || '').trim(),
      currentRole: String(data.get('currentRole') || '').trim(),
      thursdayCapacity: String(data.get('thursdayCapacity') || '').trim(),
      payer: String(data.get('payer') || '').trim(),
      systemToRebuild: String(data.get('systemToRebuild') || '').trim(),
      whyJoin: String(data.get('whyJoin') || '').trim(),
      marketingConsent: data.get('marketingConsent') === 'on',
      attribution: {
        source: params.get('utm_source') || undefined,
        medium: params.get('utm_medium') || undefined,
        campaign: params.get('utm_campaign') || undefined,
        term: params.get('utm_term') || undefined,
        content: params.get('utm_content') || undefined,
        landingPage: window.location.pathname,
      },
    };
    setStatus('loading');
    try {
      const res = await fetch('/api/transformation-program/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  const fieldClass =
    'min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3f] focus:border-transparent';

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 p-7 shadow-sm md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
          Apply for a seat
        </h2>
        <p className="text-slate-600 text-base">
          {TRANSFORMATION_PROGRAM.cohort.label} · {TRANSFORMATION_PROGRAM.cohort.seatCap} seats · Applications close when seats fill or by {TRANSFORMATION_PROGRAM.cohort.applicationsCloseLabel}, whichever comes first.
        </p>
        <p className="text-slate-500 text-sm mt-3">
          Apply first. After review, we schedule a fit call. Acceptance requires that call; we may decline applicants who are not ready or not a fit.
        </p>
      </div>

      {status === 'success' ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
          <p className="text-slate-800 font-semibold text-lg">Application received</p>
          <p className="text-slate-500 text-sm max-w-md">
            We&rsquo;ll review your application and respond within two business days. If you are already in review and ready to schedule, book your fit call below.
          </p>
          <a
            href={TRANSFORMATION_PROGRAM.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#1f4d3f]/40 bg-white px-6 py-3 text-sm font-bold text-[#1f4d3f] transition-colors hover:bg-[#1f4d3f]/5"
          >
            Book a Fit Call
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <input id="fullName" name="fullName" type="text" required autoComplete="name" className={fieldClass} />
          </div>
          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
            <input
              name="marketingConsent"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1f4d3f] focus:ring-[#1f4d3f]"
            />
            <span>
              Send me occasional program updates and school BCBA resources. I can unsubscribe at any time.
            </span>
          </label>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="bcbaCertNumber" className="block text-sm font-semibold text-slate-700 mb-1">
              BCBA Certification # <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input id="bcbaCertNumber" name="bcbaCertNumber" type="text" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="currentRole" className="block text-sm font-semibold text-slate-700 mb-1">Current Role / Title</label>
            <input id="currentRole" name="currentRole" type="text" required autoComplete="organization-title" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="thursdayCapacity" className="block text-sm font-semibold text-slate-700 mb-1">
              Can you attend Thursday sessions, 6–8 PM PT?
            </label>
            <select id="thursdayCapacity" name="thursdayCapacity" required className={fieldClass}>
              <option value="">Select one</option>
              <option value="yes_all_sessions">Yes — I can attend all six live sessions</option>
              <option value="yes_most_sessions">Yes — I can attend most sessions and will make up any miss</option>
              <option value="unsure">Unsure — schedule may conflict</option>
              <option value="no">No — I cannot commit to Thursday 6–8 PM PT</option>
            </select>
          </div>
          <div>
            <label htmlFor="payer" className="block text-sm font-semibold text-slate-700 mb-1">
              Who will pay tuition?
            </label>
            <select id="payer" name="payer" required className={fieldClass}>
              <option value="">Select one</option>
              <option value="self">Self-pay</option>
              <option value="district_po">District purchase order / invoice</option>
              <option value="unsure">Not sure yet</option>
            </select>
          </div>
          <div>
            <label htmlFor="systemToRebuild" className="block text-sm font-semibold text-slate-700 mb-1">
              What specific system would you rebuild during the cohort?
            </label>
            <textarea
              id="systemToRebuild"
              name="systemToRebuild"
              required
              rows={3}
              placeholder="Example: referral triage, FBA narrative quality, staff fidelity checks, caseload review cadence"
              className={`${fieldClass} resize-y`}
            />
          </div>
          <div>
            <label htmlFor="whyJoin" className="block text-sm font-semibold text-slate-700 mb-1">
              Why do you want to join, and what caseload or systems problem are you bringing?
            </label>
            <textarea
              id="whyJoin"
              name="whyJoin"
              required
              rows={5}
              className={`${fieldClass} resize-y`}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="min-h-12 w-full rounded-xl bg-[#1f4d3f] px-6 py-4 text-base font-bold text-white transition-colors hover:bg-[#123628] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f4d3f] disabled:opacity-60"
          >
            {status === 'loading' ? 'Submitting…' : 'Submit Application'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="mt-3 text-red-600 text-sm text-center">
          Something went wrong. Please try again or reach out through the contact page.
        </p>
      )}
    </div>
  );
}

export function ProgramApplication() {
  return (
    <section id="apply" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {isCohortOpen ? <ApplicationForm /> : <WaitlistForm />}
      </div>
    </section>
  );
}
