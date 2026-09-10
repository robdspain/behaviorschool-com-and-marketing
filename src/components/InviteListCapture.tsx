'use client';

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const fieldClass =
  'min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3f] focus:border-transparent';

export function InviteListCapture() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const params = new URLSearchParams(window.location.search);
    const payload = {
      fullName: String(data.get('fullName') || '').trim(),
      email: String(data.get('email') || '').trim(),
      currentRole: String(data.get('currentRole') || '').trim(),
      systemsProblem: String(data.get('systemsProblem') || '').trim(),
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
    setErrorMessage('');

    try {
      const res = await fetch('/api/transformation-program/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          typeof body?.error === 'string'
            ? body.error
            : 'Unable to join Priority Access right now.',
        );
      }
      setStatus('success');
      form.reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to join Priority Access right now. Please try again shortly.',
      );
    }
  }

  return (
    <section id="priority-access" className="scroll-mt-24 py-20 sm:py-28 bg-[#f7f3ee]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto rounded-2xl border border-[#1f4d3f]/15 bg-white p-7 shadow-sm md:p-12">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f] mb-3">
              Priority Access List
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-3">
              Get early access
            </h2>
            <p className="text-slate-600 text-base leading-relaxed max-w-xl mx-auto">
              When the next live school BCBA cohort opens, Priority Access hears first — an exclusive early window before a wider announcement.
            </p>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center" role="status" aria-live="polite">
              <CheckCircle className="w-12 h-12 text-[#1f4d3f]" aria-hidden="true" />
              <p className="text-slate-800 font-semibold text-lg">You&apos;re on Priority Access</p>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                You&apos;ll get an email when seats open — before a wider announcement. No Thursday session commitment is required to stay on the list.
              </p>
              <a
                href="#apply"
                className="text-sm text-[#1f4d3f] font-semibold underline underline-offset-2"
              >
                Prefer to apply now?
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="invite-fullName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full name
                </label>
                <input
                  id="invite-fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="invite-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  id="invite-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="invite-currentRole" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Current role / title
                </label>
                <input
                  id="invite-currentRole"
                  name="currentRole"
                  type="text"
                  required
                  autoComplete="organization-title"
                  placeholder="e.g. School BCBA, District BCBA"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="invite-systemsProblem" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Caseload or systems problem <span className="font-normal text-slate-500">(optional)</span>
                </label>
                <input
                  id="invite-systemsProblem"
                  name="systemsProblem"
                  type="text"
                  maxLength={500}
                  placeholder="One line is enough"
                  className={fieldClass}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full min-h-11 rounded-full bg-[#1f4d3f] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#123628] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f4d3f] disabled:opacity-60"
              >
                {status === 'loading' ? 'Submitting…' : 'Get early access'}
              </button>

              <p className="text-center text-sm text-slate-500 leading-relaxed">
                You&apos;ll get one email when seats open — first.
              </p>

              <p className="text-center text-sm text-slate-500 leading-relaxed">
                Prefer to apply now?{' '}
                <a href="#apply" className="text-[#1f4d3f] font-semibold underline underline-offset-2">
                  Go to the full application
                </a>
              </p>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-4 text-red-600 text-sm text-center" role="alert">
              {errorMessage || 'Something went wrong. Please try again or reach out through the contact page.'}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
