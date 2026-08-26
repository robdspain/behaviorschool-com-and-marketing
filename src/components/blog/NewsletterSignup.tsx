'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';

export function BlogNewsletterSignup() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const { trackEmailSignup, trackFormSubmission } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const source = `behaviorschool-blog:${pathname}`;
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, page: pathname }),
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok || response.status === 409) {
        const alreadySubscribed = response.status === 409 || result.status === 'already_subscribed' || result.status === 'subscribed';
        setAlreadySubscribed(alreadySubscribed);
        setStatus('success');
        trackFormSubmission('weekly_research_brief_blog', true, { source, page: pathname });
        if (!alreadySubscribed) {
          trackEmailSignup('newsletter', undefined, {
            source,
            page: pathname,
            newsletter_name: 'the_weekly_research_brief',
          });
        }
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
      trackFormSubmission('weekly_research_brief_blog', false, {
        source: `behaviorschool-blog:${pathname}`,
        page: pathname,
        error: 'request_failed',
      });
    }
  };

  if (status === 'success') {
    return (
      <div id="newsletter" className="scroll-mt-24 bg-[#1E3A34] rounded-lg p-8 my-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-[#FAF3E0] mb-2">
            {alreadySubscribed ? 'You are already subscribed.' : 'One more step'}
          </h3>
          <p className="text-[#FAF3E0]/80">
            {alreadySubscribed
              ? 'Watch your inbox for the next Weekly Research Brief.'
              : 'Check your inbox now and click Confirm subscription. If it is not there in five minutes, check spam and submit the same address again.'}
          </p>
          {!alreadySubscribed ? (
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-3 text-sm font-semibold text-[#E3B23C] underline underline-offset-4"
            >
              Request a fresh confirmation link
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div id="newsletter" className="scroll-mt-24 bg-[#1E3A34] rounded-lg p-8 my-8">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-[#FAF3E0] mb-2 text-center">
          The Weekly Research Brief
        </h3>
        <p className="text-[#FAF3E0]/80 mb-6 text-center">
          Every Tuesday: open research, clear summaries, and one practical next step for school-based BCBAs.
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
            {status === 'loading' ? 'Sending...' : "Send me Tuesday's brief"}
          </button>
        </form>

        {status === 'error' && (
          <p className="text-red-300 text-sm mt-3 text-center">
            Something went wrong. Please try again.
          </p>
        )}

        <p className="text-xs text-[#FAF3E0]/60 mt-4 text-center">
          The Weekly Research Brief. Unsubscribe anytime. We never share your email.
        </p>
      </div>
    </div>
  );
}
