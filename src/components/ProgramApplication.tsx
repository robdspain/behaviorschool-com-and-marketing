'use client';

import React, { useState } from 'react';
import { CheckCircle, ChevronDown } from 'lucide-react';
import { TRANSFORMATION_PROGRAM } from '@/lib/transformation-program';
import {
  CASH_FIELD_PROMPTS,
  PAYMENT_PATH_OPTIONS,
  ROLE_CATEGORY_OPTIONS,
  URGENCY_WINDOW_OPTIONS,
} from '@/lib/transformation-cash-fields';

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
    <div className="mx-auto max-w-2xl rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] p-7 shadow-sm md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-[#171f1d] mb-3">
          Join the waitlist for the next cohort
        </h2>
        <p className="text-[#365548] text-base">
          The current cohort is full or closed. Leave your email and we will notify you when the next cohort opens.
        </p>
      </div>

      {status === 'success' ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <CheckCircle className="w-12 h-12 text-[#1f4d3f]" />
          <p className="text-[#171f1d] font-semibold text-lg">You are on the waitlist</p>
          <p className="text-[#365548] text-base">We will notify you when the next cohort opens.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="min-h-12 flex-1 rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] px-4 py-3 text-[#171f1d] text-base focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="min-h-12 rounded-lg bg-[#e4b63d] px-6 py-3 text-base font-bold text-[#171f1d] transition-colors hover:bg-[#d9a92f] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f] disabled:opacity-60 whitespace-nowrap"
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
      employer: String(data.get('employer') || '').trim(),
      roleCategory: String(data.get('roleCategory') || '').trim(),
      bcbaCertNumber: String(data.get('bcbaCertNumber') || '').trim(),
      currentRole: String(data.get('currentRole') || '').trim(),
      thursdayCapacity: String(data.get('thursdayCapacity') || '').trim(),
      payer: String(data.get('payer') || '').trim(),
      urgencyWindow: String(data.get('urgencyWindow') || '').trim(),
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
    'min-h-12 w-full rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] px-4 py-3 text-base text-[#171f1d] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]';
  const selectClass =
    'block h-12 min-h-12 w-full appearance-none rounded-[8px] border border-[#365548] bg-[#fbfaf6] px-4 pr-10 text-base text-[#171f1d] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]';

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] p-7 shadow-sm md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-[#171f1d] mb-3">
          Apply for the {TRANSFORMATION_PROGRAM.name}
        </h2>
        <p className="text-[#365548] text-base">
          {TRANSFORMATION_PROGRAM.cohort.label}. Apply by {TRANSFORMATION_PROGRAM.cohort.applicationsCloseLabel}.
        </p>
        <p className="text-[#365548] text-base mt-3">
          Apply first. After review, we schedule a fit call. Acceptance requires that call; we may decline applicants who are not ready or not a fit.
        </p>
      </div>

      {status === 'success' ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <CheckCircle className="w-12 h-12 text-[#1f4d3f]" />
          <p className="text-[#171f1d] font-semibold text-lg">Application received</p>
          <p className="text-[#365548] text-base max-w-md">
            We will review your application and respond within two business days. If you are already in review and ready to schedule, book your fit call below.
          </p>
          <a
            href={TRANSFORMATION_PROGRAM.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-base font-semibold text-[#1f4d3f] underline underline-offset-4"
          >
            Already applied? Book a fit call
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-base font-semibold text-[#171f1d] mb-1">Full Name</label>
            <input id="fullName" name="fullName" type="text" required autoComplete="name" className={fieldClass} />
          </div>
          <label className="flex min-h-11 items-center gap-3 rounded-lg border border-[#d9cdb8] bg-[#f4efe5] p-4 text-base leading-6 text-[#365548]">
            <input
              name="marketingConsent"
              type="checkbox"
              className="size-6 shrink-0 rounded border-[#d9cdb8] text-[#1f4d3f] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]"
            />
            <span>
              Send me occasional program updates and school BCBA resources. I can unsubscribe at any time.
            </span>
          </label>
          <div>
            <label htmlFor="email" className="block text-base font-semibold text-[#171f1d] mb-1">Email Address</label>
            <input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="employer" className="block text-base font-semibold text-[#171f1d] mb-1">
              {CASH_FIELD_PROMPTS.employer}
            </label>
            <input id="employer" name="employer" type="text" required autoComplete="organization" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="roleCategory" className="block text-base font-semibold text-[#171f1d] mb-1">
              {CASH_FIELD_PROMPTS.role}
            </label>
            <div className="relative">
            <select id="roleCategory" name="roleCategory" required className={selectClass}>
              <option value="">Select one</option>
              {ROLE_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#365548]" />
            </div>
          </div>
          <div>
            <label htmlFor="currentRole" className="block text-base font-semibold text-[#171f1d] mb-1">
              Current Role / Title <span className="text-[#365548] font-normal">(optional)</span>
            </label>
            <input id="currentRole" name="currentRole" type="text" autoComplete="organization-title" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="bcbaCertNumber" className="block text-base font-semibold text-[#171f1d] mb-1">
              BCBA Certification # <span className="text-[#365548] font-normal">(optional)</span>
            </label>
            <input id="bcbaCertNumber" name="bcbaCertNumber" type="text" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="thursdayCapacity" className="block text-base font-semibold text-[#171f1d] mb-1">
              Can you attend Thursday sessions from 6 to 8 PM Pacific Time?
            </label>
            <div className="relative">
            <select id="thursdayCapacity" name="thursdayCapacity" required className={selectClass}>
              <option value="">Select one</option>
              <option value="yes_all_sessions">Yes, I can attend all six sessions</option>
              <option value="yes_most_sessions">Yes, I can attend most and will make up any I miss</option>
              <option value="unsure">Not sure yet, my schedule may conflict</option>
              <option value="no">No, I cannot attend Thursdays from 6 to 8 PM Pacific Time</option>
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#365548]" />
            </div>
          </div>
          <div>
            <label htmlFor="payer" className="block text-base font-semibold text-[#171f1d] mb-1">
              {CASH_FIELD_PROMPTS.payment}
            </label>
            <div className="relative">
            <select id="payer" name="payer" required className={selectClass}>
              <option value="">Select one</option>
              {PAYMENT_PATH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#365548]" />
            </div>
          </div>
          <div>
            <label htmlFor="urgencyWindow" className="block text-base font-semibold text-[#171f1d] mb-1">
              {CASH_FIELD_PROMPTS.urgency}
            </label>
            <div className="relative">
            <select id="urgencyWindow" name="urgencyWindow" required className={selectClass}>
              <option value="">Select one</option>
              {URGENCY_WINDOW_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#365548]" />
            </div>
          </div>
          <div>
            <label htmlFor="systemToRebuild" className="block text-base font-semibold text-[#171f1d] mb-1">
              What specific system would you rebuild during the cohort?
            </label>
            <textarea
              id="systemToRebuild"
              name="systemToRebuild"
              required
              rows={3}
              placeholder="Example: referral triage, functional behavior assessment narrative quality, staff fidelity checks, caseload review cadence"
              className={`${fieldClass} resize-y`}
            />
          </div>
          <div>
            <label htmlFor="whyJoin" className="block text-base font-semibold text-[#171f1d] mb-1">
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
            className="min-h-12 w-full rounded-lg bg-[#e4b63d] px-6 py-4 text-base font-bold text-[#171f1d] transition-colors hover:bg-[#d9a92f] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f] disabled:opacity-60"
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
    <section id="apply" className="scroll-mt-24 bg-[#fbfaf6] py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {isCohortOpen ? <ApplicationForm /> : <WaitlistForm />}
      </div>
    </section>
  );
}
