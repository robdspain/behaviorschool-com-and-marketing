'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';

export function NewsletterSignup() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { trackEmailSignup, trackFormSubmission } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const source = `behaviorschool-embedded:${pathname}`;
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, page: pathname }),
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok || response.status === 409) {
        const alreadySubscribed = response.status === 409 || result.isNew === false;
        setStatus('success');
        setMessage(
          alreadySubscribed
            ? "You are already subscribed. Watch your inbox for the next issue."
            : "Check your inbox to confirm. We'll send the latest issue as soon as you confirm."
        );
        trackFormSubmission('weekly_research_brief_embedded', true, { source, page: pathname });
        if (!alreadySubscribed) {
          trackEmailSignup('newsletter', undefined, {
            source,
            page: pathname,
            newsletter_name: 'the_weekly_research_brief',
          });
        }
        setEmail('');
      } else {
        // Do not claim a subscription succeeded when the CRM request failed.
        console.warn('Newsletter API returned error, storing locally');
        setStatus('error');
        setMessage('We could not start your subscription. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      trackFormSubmission('weekly_research_brief_embedded', false, {
        source: `behaviorschool-embedded:${pathname}`,
        page: pathname,
        error: 'request_failed',
      });
    }
  };

  return (
    <div id="newsletter" className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-2xl p-8 my-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-emerald-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-3">
          The Weekly Research Brief
        </h3>
        
        <p className="text-slate-700 mb-6">
          Open research, clear summaries, and practical next steps for school-based BCBAs, delivered every Tuesday.
        </p>

        {status === 'success' ? (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 px-6 py-4 rounded-lg">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === 'loading'}
              className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-red-600 text-sm mt-3">{message}</p>
        )}

        <p className="text-xs text-slate-600 mt-4">
          Unsubscribe anytime. We respect your privacy and never share your email.
        </p>
      </div>
    </div>
  );
}
