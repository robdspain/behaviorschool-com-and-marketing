'use client';

import { useState } from 'react';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

export function HomepageEmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { trackEmailSignup, trackFormSubmission } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      trackFormSubmission('homepage_email_capture', true, { source: 'homepage' });

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'homepage',
        }),
      });

      if (response.ok || response.status === 409) {
        setStatus('success');
        setMessage(response.status === 409 
          ? "You're already subscribed! Check your inbox." 
          : 'Success! Check your email to confirm.');
        trackEmailSignup('newsletter', email, { source: 'homepage' });
        setEmail('');
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
    <section className="py-16 sm:py-20 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-100">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(16, 185, 129) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="relative p-8 sm:p-12 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Free BCBA Practice Questions + Study Tips
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Join our newsletter and get weekly practice questions, study strategies, 
              and exclusive resources to help you pass the BCBA exam.
            </p>

            {status === 'success' ? (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl px-6 py-4 inline-flex items-center gap-3 max-w-md mx-auto">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <p className="text-emerald-800 font-medium">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
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
                      className="w-full pl-10 pr-4 py-4 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50 text-base"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Join Free'}
                  </button>
                </div>

                {status === 'error' && (
                  <p className="text-red-600 text-sm mt-3">{message}</p>
                )}

                <p className="text-xs text-slate-500 mt-4">
                  Join 500+ BCBAs getting weekly study tips. Unsubscribe anytime.
                </p>
              </form>
            )}

            {/* Trust indicators */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>No spam</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
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
