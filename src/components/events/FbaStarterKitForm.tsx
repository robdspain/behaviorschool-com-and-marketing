'use client';

import { FormEvent, useState } from 'react';
import { FBA_KIT_DOWNLOAD_PATH, FBA_KIT_ROLES } from '@/lib/fba-starter-kit';

export function FbaStarterKitForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');
    const form = new FormData(event.currentTarget);
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
      setMessage(data.error || 'We could not send the starter kit. Please try again.');
      return;
    }
    setStatus('success');
    setMessage(data.message || 'Your starter kit is ready.');
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6" role="status">
        <h3 className="text-xl font-bold text-emerald-950">Your School FA starter kit is ready</h3>
        <p className="mt-2 text-emerald-900">{message}</p>
        <a className="mt-4 inline-flex rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900" href={FBA_KIT_DOWNLOAD_PATH}>
          Download the School FA starter kit
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="fba-kit-name" className="block text-sm font-semibold text-slate-900">Name</label>
        <input id="fba-kit-name" name="name" required maxLength={120} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label htmlFor="fba-kit-email" className="block text-sm font-semibold text-slate-900">Email</label>
        <input id="fba-kit-email" name="email" type="email" required maxLength={254} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label htmlFor="fba-kit-role" className="block text-sm font-semibold text-slate-900">Role</label>
        <select id="fba-kit-role" name="role" required defaultValue="" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
          <option value="" disabled>Select your role</option>
          {FBA_KIT_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>
      <label className="flex items-start gap-3 text-sm text-slate-700">
        <input name="consent" type="checkbox" value="true" required className="mt-1" />
        <span>Email me the School FA starter kit. I understand Behavior School will store my name, email, and role.</span>
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px" />
      {status === 'error' && <p className="text-sm text-red-700" role="alert">{message}</p>}
      <button type="submit" disabled={status === 'submitting'} className="rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900 disabled:opacity-60">
        {status === 'submitting' ? 'Sending...' : 'Email me the starter kit'}
      </button>
    </form>
  );
}
