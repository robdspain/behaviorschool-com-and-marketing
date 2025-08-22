"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase-client";
import { isAuthorizedAdmin, getUnauthorizedMessage } from "@/lib/admin-config";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if Supabase is configured
    const supabase = createSupabaseClient();
    setSupabaseConfigured(!!supabase);
    
    if (!supabase) {
      setError('Supabase authentication is not configured. Please check environment variables.');
      return;
    }

    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userEmail = session.user.email;
        
        if (isAuthorizedAdmin(userEmail)) {
          router.push('/admin');
        } else {
          // Sign out unauthorized user and show error
          await supabase.auth.signOut();
          setError(getUnauthorizedMessage(userEmail || undefined));
        }
      }
    };

    checkAuth();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");

      const supabase = createSupabaseClient();
      if (!supabase) {
        setError('Supabase client is not configured');
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Admin Access
            </h1>
            <p className="text-slate-600">
              Sign in to access the Behavior School admin panel
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </motion.div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading || !supabaseConfigured}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="text-slate-700 font-medium">
              {loading ? "Signing in..." : !supabaseConfigured ? "Authentication Not Available" : "Continue with Google"}
            </span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Only authorized administrators can access this panel.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Back to Behavior School
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
