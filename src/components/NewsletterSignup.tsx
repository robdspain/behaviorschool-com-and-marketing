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
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { trackButtonClick, trackEmailSignup, trackFormSubmission } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const source = `behaviorschool-embedded:${pathname}:variant:outcome-specific-v1`;
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, page: pathname }),
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok || response.status === 409) {
        const alreadySubscribed = response.status === 409 || result.status === 'already_subscribed' || result.status === 'subscribed';
        setSubmittedEmail(email);
        setStatus('success');
        setMessage(
          alreadySubscribed
            ? "You are already subscribed. Watch your inbox for the next issue."
            : "Check your inbox now and click Confirm subscription. If it is not there in five minutes, check spam or request a fresh link below."
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
    <div id="newsletter" className="my-12 rounded-lg border border-[#d9cdb8] bg-[#f4efe5] p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-[#fbfaf6]">
          <Mail className="h-8 w-8 text-[#1f4d3f]" />
        </div>
        
        <h3 className="text-2xl font-bold text-[#171f1d] mb-3">
          The Weekly Research Brief
        </h3>
        
        <p className="text-[#365548] mb-6">
          Open research, clear summaries, and practical next steps for school BCBAs, delivered each week.
        </p>

        {status === 'success' ? (
          <div className="rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] px-6 py-4 text-[#171f1d]">
            <p>{message}</p>
            {submittedEmail && !message.startsWith('You are already subscribed') ? (
              <button
                type="button"
                onClick={() => {
                  setEmail(submittedEmail);
                  setStatus('idle');
                  setMessage('');
                  trackButtonClick('newsletter_confirmation_retry', 'weekly_research_brief_embedded', { source: `behaviorschool-embedded:${pathname}` });
                }}
                className="mt-3 text-sm font-semibold underline underline-offset-4"
              >
                Request a fresh confirmation link
              </button>
            ) : null}
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
              className="min-h-12 flex-1 rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] px-4 py-3 text-base text-[#171f1d] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="min-h-12 whitespace-nowrap rounded-lg bg-[#1f4d3f] px-6 py-3 font-semibold text-[#fbfaf6] transition-colors hover:bg-[#123628] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : 'Send me the weekly brief'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-red-600 text-sm mt-3">{message}</p>
        )}

        <p className="mt-4 text-sm text-[#365548]">
          Free. One email each week. Confirm your email to join. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
