'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ShieldCheck } from 'lucide-react';

const errorMessages: Record<string, string> = {
  google_not_configured: 'Google sign-in is not configured yet. Add GOOGLE_CLIENT_ID/SECRET or AUTH_GOOGLE_ID/SECRET.',
  allowlist_missing: 'No admin Google allowlist is configured. Add ADMIN_GOOGLE_ALLOWED_EMAILS.',
  invalid_state: 'That Google sign-in session expired. Try again.',
  missing_code: 'Google did not return a sign-in code. Try again.',
  unauthorized_google_account: 'That Google account is not allowed to access this admin area.',
  google_login_failed: 'Google sign-in failed. Try again.',
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionDiagnostic, setSessionDiagnostic] = useState('not-checked');
  const redirect = searchParams?.get('redirect') || searchParams?.get('returnTo') || '/admin';
  const errorCode = searchParams?.get('error') || '';
  const error = errorMessages[errorCode] || (errorCode ? 'Google sign-in could not be completed.' : '');
  const googleHref = `/api/admin/auth/google?returnTo=${encodeURIComponent(redirect)}`;

  useEffect(() => {
    document.title = 'Admin Login | Behavior School';

    let cancelled = false;
    fetch('/api/admin/auth', {
      cache: 'no-store',
      credentials: 'same-origin',
    })
      .then((response) => response.json())
      .then((result) => {
        console.error('[admin-auth-diagnostic] login session check', result.sessionDiagnostic);
        const diagnostic = result.sessionDiagnostic || {};
        setSessionDiagnostic([
          `cookie:${diagnostic.cookiePresent === true}`,
          `candidates:${diagnostic.candidateCount || 0}`,
          `signed:${diagnostic.signedTokenPresent === true}`,
          `authenticated:${result.authenticated === true}`,
        ].join(','));
        if (!cancelled && result.authenticated === true) {
          router.replace(redirect);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [redirect, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f1e4] px-4">
      <span className="sr-only" data-testid="admin-session-diagnostic">
        {sessionDiagnostic}
      </span>
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-emerald-950/10 bg-white p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in with an approved Google account to manage Behavior School.
            </p>
          </div>

          {error && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <a
            href={googleHref}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-900 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-sm font-black text-blue-600">
              G
            </span>
            Continue with Google
          </a>

          <p className="mt-5 text-center text-xs font-semibold leading-5 text-slate-500">
            Password login is disabled. Access is limited to approved admin Google accounts.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LoginForm />
    </Suspense>
  );
}
