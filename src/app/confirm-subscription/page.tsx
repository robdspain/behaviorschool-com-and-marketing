'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const confirmSubscription = async () => {
      try {
        const response = await fetch('/api/confirm-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setEmail(data.email || '');
        } else if (data.error === 'expired') {
          setStatus('expired');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    confirmSubscription();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f4d3f] mx-auto"></div>
          <p className="mt-4 text-gray-600">Confirming your subscription...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[#1f4d3f] mb-2">You&apos;re Subscribed!</h1>
          <p className="text-gray-600 mb-6">
            {email ? `${email} has been` : 'Your email has been'} confirmed. You&apos;ll now receive updates from Behavior School.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#1f4d3f] text-white py-2 px-6 rounded-md hover:bg-[#163a2f] transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Link Expired</h1>
          <p className="text-gray-600 mb-6">
            This confirmation link has expired. Please sign up again to receive a new confirmation email.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#1f4d3f] text-white py-2 px-6 rounded-md hover:bg-[#163a2f] transition-colors"
          >
            Sign Up Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Invalid Link</h1>
        <p className="text-gray-600 mb-6">
          This confirmation link is invalid. Please try signing up again.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#1f4d3f] text-white py-2 px-6 rounded-md hover:bg-[#163a2f] transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmSubscriptionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f4d3f]"></div>
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  );
}
