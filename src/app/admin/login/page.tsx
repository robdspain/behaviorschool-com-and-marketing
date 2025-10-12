'use client';

import { createClient } from '@/lib/supabase-client';
import { useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { AlertCircle } from 'lucide-react';
import { Suspense } from 'react';

function LoginContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  const handleGoogleLogin = async () => {
    try {
      const origin = window.location.origin;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?next=/admin`,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });

      if (error) {
        console.error('OAuth error:', error);
        alert(`Authentication failed: ${error.message}`);
      }
    } catch (err) {
      console.error('OAuth exception:', err);
      alert('An unexpected error occurred during authentication');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Login</h1>
            <p className="text-slate-600">Sign in to access the admin dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-900 mb-1">Authentication Error</p>
                <p className="text-sm text-red-800 mb-2">
                  {error === 'unauthorized' && 'You need to sign in to access this page.'}
                  {error === 'missing_code' && 'OAuth code was missing from the callback.'}
                  {(error.includes('code verifier') || error.includes('invalid request')) && (
                    <>
                      Auth configuration issue detected. Try clearing your browser cache or{' '}
                      <a href="/admin/clear-auth" className="font-semibold underline hover:text-red-700">
                        click here to reset
                      </a>
                      .
                    </>
                  )}
                  {error !== 'unauthorized' && error !== 'missing_code' && !error.includes('code verifier') && !error.includes('invalid request') && decodeURIComponent(error)}
                </p>
              </div>
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-xl transition-all duration-200 text-slate-700 font-semibold text-lg shadow-sm hover:shadow-md"
          >
            <FcGoogle className="h-6 w-6" />
            <span>Continue with Google</span>
          </button>

          {/* Info Text */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              <strong>Admin access only.</strong> You must be authorized to access the admin dashboard.
            </p>
          </div>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600 font-mono">
              <p><strong>Debug Info:</strong></p>
              <p>Origin: {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
              <p>Redirect: {typeof window !== 'undefined' ? `${window.location.origin}/auth/callback?next=/admin` : 'N/A'}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <a 
            href="https://behaviorschool.com"
            className="text-sm text-slate-600 hover:text-slate-900 underline transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
