'use client';

import { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

export function ComparisonEmailCapture({ source }: { source: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      if (response.ok || response.status === 409) {
        setStatus('success');
        setMessage(response.status === 409 ? "You're already subscribed!" : 'Success! Check your email.');
        setEmail('');
      } else {
        throw new Error('Failed');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 sm:p-10 border border-emerald-100">
      <div className="text-center max-w-lg mx-auto">
        <h3 className="text-2xl font-bold text-slate-900 mb-3">
          Try BehaviorSchool Free
        </h3>
        <p className="text-slate-600 mb-6">
          Get free BCBA practice questions, IEP goal templates, and weekly study tips delivered to your inbox.
        </p>
        {status === 'success' ? (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl px-6 py-4 inline-flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-emerald-800 font-medium">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  disabled={status === 'loading'}
                  className="w-full pl-10 pr-4 py-3.5 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50 text-base"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 whitespace-nowrap shadow-lg hover:shadow-xl"
              >
                {status === 'loading' ? 'Joining...' : 'Get Free Access'}
              </button>
            </div>
            {status === 'error' && <p className="text-red-600 text-sm mt-2">{message}</p>}
            <p className="text-xs text-slate-500 mt-3">No spam. Unsubscribe anytime.</p>
          </form>
        )}
      </div>
    </div>
  );
}
