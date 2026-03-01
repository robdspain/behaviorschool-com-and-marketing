'use client';

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

// ─── COHORT FLAG ───────────────────────────────────────────────────────────────
// Set this to `true` when a cohort is open for enrollment.
// When false → shows the Waitlist Form.
// When true  → shows the Application Form.
const isCohortOpen = false;
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
    <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 md:p-12 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
          Get Notified About Future Cohorts
        </h2>
        <p className="text-slate-600 text-base">
          No spots are currently available. Drop your email and we&rsquo;ll reach out when the next cohort opens.
        </p>
      </div>

      {status === 'success' ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
          <p className="text-slate-800 font-semibold text-lg">You&rsquo;re on the list!</p>
          <p className="text-slate-500 text-sm">We&rsquo;ll notify you when the next cohort opens.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            name="email"
            required
            placeholder="Email Address"
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-xl bg-[#1f4d3f] hover:bg-emerald-900 text-white font-bold px-6 py-3 text-sm transition disabled:opacity-60 whitespace-nowrap"
          >
            {status === 'loading' ? 'Submitting…' : 'Notify Me'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="mt-3 text-red-600 text-sm text-center">Something went wrong. Please try again or email rob@behaviorschool.com.</p>
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
    const payload = {
      fullName: String(data.get('fullName') || '').trim(),
      email: String(data.get('email') || '').trim(),
      bcbaCertNumber: String(data.get('bcbaCertNumber') || '').trim(),
      currentRole: String(data.get('currentRole') || '').trim(),
      whyJoin: String(data.get('whyJoin') || '').trim(),
    };
    setStatus('loading');
    try {
      const res = await fetch('/.netlify/functions/submitApplication', {
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
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

  return (
    <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 md:p-12 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
          Apply for the Next Cohort
        </h2>
        <p className="text-slate-600 text-base">
          Fill out the form below and we&rsquo;ll be in touch within 2 business days.
        </p>
      </div>

      {status === 'success' ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
          <p className="text-slate-800 font-semibold text-lg">Application received!</p>
          <p className="text-slate-500 text-sm">We&rsquo;ll review your application and be in touch shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <input id="fullName" name="fullName" type="text" required placeholder="Jane Smith" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input id="email" name="email" type="email" required placeholder="jane@example.com" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="bcbaCertNumber" className="block text-sm font-semibold text-slate-700 mb-1">
              BCBA Certification # <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input id="bcbaCertNumber" name="bcbaCertNumber" type="text" placeholder="1-12-34567" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="currentRole" className="block text-sm font-semibold text-slate-700 mb-1">Current Role / Title</label>
            <input id="currentRole" name="currentRole" type="text" required placeholder="School-Based BCBA, District Behavior Specialist…" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="whyJoin" className="block text-sm font-semibold text-slate-700 mb-1">
              Why do you want to join the Transformation Program?
            </label>
            <textarea
              id="whyJoin"
              name="whyJoin"
              required
              rows={5}
              placeholder="Tell us about your current challenges and what you hope to get out of the program…"
              className={`${fieldClass} resize-y`}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-xl bg-[#1f4d3f] hover:bg-emerald-900 text-white font-bold px-6 py-4 text-base transition disabled:opacity-60"
          >
            {status === 'loading' ? 'Submitting…' : 'Submit Application'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="mt-3 text-red-600 text-sm text-center">Something went wrong. Please try again or email rob@behaviorschool.com.</p>
      )}
    </div>
  );
}

export function ProgramApplication() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {isCohortOpen ? <ApplicationForm /> : <WaitlistForm />}
      </div>
    </section>
  );
}
