'use client';

import { FormEvent, useState } from 'react';
import {
  FBA_KIT_DELIVERY_BUTTON,
  FBA_KIT_DELIVERY_CONSENT,
  FBA_KIT_DELIVERY_SUCCESS,
  FBA_KIT_DOWNLOAD_PATH,
  FBA_KIT_FETCH_ERROR,
  FBA_KIT_GATED,
  FBA_KIT_GATED_BUTTON,
  FBA_KIT_GATED_CONSENT,
  FBA_KIT_GATED_SUCCESS,
  FBA_KIT_ROLES,
  fbaKitSuccessShowsDownload,
} from '@/lib/fba-starter-kit';

export function FbaStarterKitForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const showsDownload = fbaKitSuccessShowsDownload();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/fba-starter-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...Object.fromEntries(form.entries()),
          consent: form.get('consent') === 'true',
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus('error');
        setMessage(typeof data.error === 'string' && data.error
          ? data.error
          : 'We could not save your request. Please try again.');
        return;
      }
      setStatus('success');
      setMessage(typeof data.message === 'string' && data.message
        ? data.message
        : (FBA_KIT_GATED ? FBA_KIT_GATED_SUCCESS : FBA_KIT_DELIVERY_SUCCESS));
    } catch {
      setStatus('error');
      setMessage(FBA_KIT_FETCH_ERROR);
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-[#d9cdb8] bg-[#fbfaf6] p-6" role="status">
        <h3 className="text-xl font-bold text-[#171f1d]">
          {showsDownload ? 'Your School FA starter kit is ready' : "We'll notify you when the kit is ready"}
        </h3>
        <p className="mt-2 text-[#365548]">{message}</p>
        {showsDownload && (
          <a className="mt-4 inline-flex min-h-12 items-center rounded-lg bg-[#1f4d3f] px-5 py-3 font-semibold text-white hover:bg-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]" href={FBA_KIT_DOWNLOAD_PATH}>
            Download the School FA starter kit
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="fba-kit-name" className="block text-sm font-semibold text-[#171f1d]">Name</label>
        <input id="fba-kit-name" name="name" required maxLength={120} autoComplete="name" className="mt-1 min-h-12 w-full rounded-lg border border-[#365548] bg-white px-3 py-2 text-[#171f1d] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]" />
      </div>
      <div>
        <label htmlFor="fba-kit-email" className="block text-sm font-semibold text-[#171f1d]">Email</label>
        <input id="fba-kit-email" name="email" type="email" required maxLength={254} autoComplete="email" className="mt-1 min-h-12 w-full rounded-lg border border-[#365548] bg-white px-3 py-2 text-[#171f1d] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]" />
      </div>
      <div>
        <label htmlFor="fba-kit-role" className="block text-sm font-semibold text-[#171f1d]">Role</label>
        <div className="relative mt-1">
          <select id="fba-kit-role" name="role" required defaultValue="" className="min-h-12 w-full appearance-none rounded-lg border border-[#365548] bg-[#fbfaf6] px-3 py-2 pr-10 text-[#171f1d] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]">
            <option value="" disabled>Select your role</option>
            {FBA_KIT_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#171f1d]">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
      <label className="flex min-h-11 items-center gap-3 py-2 text-sm text-[#365548]">
        <input name="consent" type="checkbox" value="true" required className="h-6 w-6 shrink-0 accent-[#1f4d3f] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]" />
        <span>{FBA_KIT_GATED ? FBA_KIT_GATED_CONSENT : FBA_KIT_DELIVERY_CONSENT}</span>
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px" />
      {status === 'error' && <p className="text-sm text-red-700" role="alert">{message}</p>}
      <button type="submit" disabled={status === 'submitting'} className="inline-flex min-h-12 items-center rounded-lg bg-[#1f4d3f] px-5 py-3 font-semibold text-white hover:bg-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f] disabled:opacity-60">
        {status === 'submitting' ? 'Sending...' : (FBA_KIT_GATED ? FBA_KIT_GATED_BUTTON : FBA_KIT_DELIVERY_BUTTON)}
      </button>
    </form>
  );
}
