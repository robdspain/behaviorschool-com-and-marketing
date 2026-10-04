'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';

export function BlogNewsletterSignup({ submitTone = "gold" }: { submitTone?: "gold" | "paper" } = {}) {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const { trackEmailSignup, trackFormSubmission } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const source = `behaviorschool-blog:${pathname}:variant:outcome-specific-v1`;
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
      <div id="newsletter" className="bs-on-dark scroll-mt-24 my-8 rounded-[12px] bg-[#1E3A34] p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-[#FAF3E0] mb-2">
            {alreadySubscribed ? 'You are already subscribed.' : 'One more step'}
          </h3>
          <p className="text-base text-[#f4efe5]">
            {alreadySubscribed
              ? 'Watch your inbox for the next Weekly Research Brief.'
              : 'Check your inbox now and click Confirm subscription. If it is not there in five minutes, check spam and submit the same address again.'}
          </p>
          {!alreadySubscribed ? (
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-3 inline-flex min-h-11 items-center text-base font-semibold text-[#fbfaf6] underline underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#fbfaf6]"
            >
              Request a fresh confirmation link
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div id="newsletter" className="bs-on-dark scroll-mt-24 my-8 rounded-[12px] bg-[#1E3A34] p-8">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-[#FAF3E0] mb-2 text-center">
          The Weekly Research Brief
        </h3>
        <p className="mb-6 text-center text-base text-[#f4efe5]">
          Each week: open research, clear summaries, and one practical next step for school BCBAs.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={status === 'loading'}
            className="min-h-11 flex-1 rounded-[8px] bg-white px-4 py-3 text-base text-[#171f1d] placeholder:text-[#365548] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#fbfaf6] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-[8px] px-6 py-3 font-semibold text-[#171f1d] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#fbfaf6] disabled:cursor-not-allowed disabled:opacity-50 ${submitTone === "paper" ? "bg-[#fbfaf6]" : "bg-[#e4b63d]"}`}
          >
            {status === 'loading' ? 'Sending...' : 'Send me the weekly brief'}
          </button>
        </form>

        {status === 'error' && (
          <p className="mt-3 text-center text-base text-[#fbfaf6]">
            Something went wrong. Please try again.
          </p>
        )}

        <p className="mt-4 text-center text-base text-[#f4efe5]">
          Free. One email each week. Confirm your email to join. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
