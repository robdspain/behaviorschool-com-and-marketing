'use client';

import { useState } from 'react';

export function BlogNewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-[#1E3A34] rounded-lg p-8 my-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-[#FAF3E0] mb-2">
            You&apos;re in!
          </h3>
          <p className="text-[#FAF3E0]/80">
            Check your inbox every Tuesday for research articles and school BCBA resources.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1E3A34] rounded-lg p-8 my-8">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-[#FAF3E0] mb-2 text-center">
          Behavior School Newsletter
        </h3>
        <p className="text-[#FAF3E0]/80 mb-6 text-center">
          Every Tuesday: 3 research articles + school BCBA application. No fluff.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={status === 'loading'}
            className="flex-1 px-4 py-3 rounded bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E3B23C] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-[#E3B23C] text-[#1E3A34] font-semibold rounded hover:bg-[#E3B23C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {status === 'loading' ? 'Subscribing...' : 'Get the weekly newsletter'}
          </button>
        </form>

        {status === 'error' && (
          <p className="text-red-300 text-sm mt-3 text-center">
            Something went wrong. Please try again.
          </p>
        )}

        <p className="text-xs text-[#FAF3E0]/60 mt-4 text-center">
          Behavior School newsletter — unsubscribe anytime. We never share your email.
        </p>
      </div>
    </div>
  );
}
