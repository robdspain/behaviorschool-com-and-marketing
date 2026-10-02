'use client';

import { useState } from 'react';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

export function HomepageEmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const { trackEmailSignup, trackFormSubmission } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'homepage:variant:outcome-specific-v1',
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok || response.status === 409) {
        const alreadySubscribed = response.status === 409 || result.status === 'already_subscribed' || result.status === 'subscribed';
        setAlreadySubscribed(alreadySubscribed);
        setStatus('success');
        setMessage(alreadySubscribed
          ? "You're already subscribed! Check your inbox." 
          : 'Check your inbox now and click Confirm subscription. If it is not there in five minutes, check spam and submit the same address again.');
        trackFormSubmission('homepage_email_capture', true, { source: 'homepage' });
        if (!alreadySubscribed) {
          trackEmailSignup('newsletter', undefined, {
            source: 'homepage',
            newsletter_name: 'the_weekly_research_brief',
          });
        }
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      trackFormSubmission('homepage_email_capture', false, { source: 'homepage', error: 'network' });
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[var(--bs-cream)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[var(--bs-paper)] rounded-[12px] border border-[var(--bs-hairline)] overflow-hidden">
          <div className="relative p-8 sm:p-12 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1f4d3f]/10 rounded-2xl mb-6">
              <Sparkles className="w-8 h-8 text-[#1f4d3f]" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--bs-ink)] mb-4">
              The Weekly Research Brief
            </h2>
            <p className="text-lg text-[#365548] mb-8 max-w-2xl mx-auto">
              Open research, clear summaries, and practical next steps for school BCBAs, delivered each week.
            </p>

            {status === 'success' ? (
              <div className="bg-[var(--bs-forest-wash)] border border-[#365548] rounded-xl px-6 py-4 max-w-md mx-auto">
                <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-[#1f4d3f] flex-shrink-0" />
                <p className="text-[#1f4d3f] font-medium">{message}</p>
                </div>
                {!alreadySubscribed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setMessage('');
                    }}
                    className="mt-3 text-sm font-semibold text-[#1f4d3f] underline underline-offset-4"
                  >
                    Request a fresh confirmation link
                  </button>
                ) : null}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#365548]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      disabled={status === 'loading'}
                      className="w-full pl-10 pr-4 h-[44px] border border-[#365548] rounded-lg focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f] disabled:opacity-50 text-base bg-white text-[var(--bs-ink)]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bs-btn-nav h-[44px] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send me the weekly brief'}
                  </button>
                </div>

                {status === 'error' && (
                  <p className="text-red-600 text-sm mt-3">{message}</p>
                )}

                <p className="text-sm text-[#365548] mt-4">
                  Free. One email each week. Confirm your email to join. Unsubscribe anytime.
                </p>
              </form>
            )}

            {/* Trust indicators */}
            <div className="mt-8 pt-8 border-t border-[var(--bs-hairline)]">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#365548]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#1f4d3f]" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#1f4d3f]" />
                  <span>No spam</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#1f4d3f]" />
                  <span>Unsubscribe anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
