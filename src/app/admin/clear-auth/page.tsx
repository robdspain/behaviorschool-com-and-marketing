'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { RefreshCw, CheckCircle } from 'lucide-react';

export default function ClearAuthPage() {
  const [status, setStatus] = useState<'clearing' | 'cleared' | 'error'>('clearing');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const clearAuth = async () => {
      try {
        // Clear all auth-related items from localStorage
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.includes('supabase') || 
          key.includes('auth') || 
          key.includes('sb-') ||
          key.includes('pkce')
        );
        
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Sign out from Supabase
        await supabase.auth.signOut();

        setStatus('cleared');

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      } catch (error) {
        console.error('Error clearing auth:', error);
        setStatus('error');
      }
    };

    clearAuth();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full p-8">
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 text-center">
          {status === 'clearing' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Clearing Authentication
              </h1>
              <p className="text-slate-600">
                Removing cached auth data...
              </p>
            </>
          )}

          {status === 'cleared' && (
            <>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Auth Cleared Successfully
              </h2>
              <p className="text-slate-600">
                Redirecting to login...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Error Clearing Auth
              </h2>
              <p className="text-slate-600 mb-4">
                Please clear your browser cache manually
              </p>
              <a
                href="/admin/login"
                className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Go to Login
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

