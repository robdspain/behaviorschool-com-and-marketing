'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function EmailPreferencesContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  
  const [email, setEmail] = useState(emailParam);
  const [preferences, setPreferences] = useState({
    marketing: true,
    product: true,
    blog: true,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/email-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, preferences }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Preferences Updated</h1>
          <p className="text-gray-600">Your email preferences have been saved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Preferences</h1>
        <p className="text-gray-600 mb-6">Choose what emails you&apos;d like to receive from Behavior School.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <div>
                <span className="font-medium text-gray-900">Marketing & Promotions</span>
                <p className="text-sm text-gray-500">Course announcements, special offers, and program updates</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.product}
                onChange={(e) => setPreferences({ ...preferences, product: e.target.checked })}
                className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <div>
                <span className="font-medium text-gray-900">Product Updates</span>
                <p className="text-sm text-gray-500">New features, tool releases, and platform improvements</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.blog}
                onChange={(e) => setPreferences({ ...preferences, blog: e.target.checked })}
                className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <div>
                <span className="font-medium text-gray-900">Blog & Resources</span>
                <p className="text-sm text-gray-500">New articles, free resources, and evidence-based strategies</p>
              </div>
            </label>
          </div>

          {status === 'error' && (
            <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !email}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Saving...' : 'Save Preferences'}
          </button>

          <div className="text-center pt-4 border-t border-gray-200">
            <a
              href={`/unsubscribe${email ? `?email=${encodeURIComponent(email)}` : ''}`}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Unsubscribe from all emails
            </a>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Behavior School LLC
        </p>
      </div>
    </div>
  );
}

export default function EmailPreferencesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    }>
      <EmailPreferencesContent />
    </Suspense>
  );
}
