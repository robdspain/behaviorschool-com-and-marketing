'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';
  
  const [email, setEmail] = useState(emailFromUrl);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('You have been unsubscribed. You will no longer receive emails from us.');
      } else {
        const data = await res.json();
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[#1f4d3f] mb-2">Unsubscribed</h1>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-[#1f4d3f] mb-2 text-center">Unsubscribe</h1>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email to unsubscribe from our mailing list.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1f4d3f] focus:border-transparent"
            />
          </div>
          
          {status === 'error' && (
            <p className="text-red-600 text-sm">{message}</p>
          )}
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-[#1f4d3f] text-white py-2 px-4 rounded-md hover:bg-[#163a2f] transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
          </button>
        </form>
        
        <p className="text-xs text-gray-500 mt-6 text-center">
          Behavior School LLC<br />
          8 The Green #20473<br />
          Dover, DE 19901
        </p>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <UnsubscribeForm />
    </Suspense>
  );
}
