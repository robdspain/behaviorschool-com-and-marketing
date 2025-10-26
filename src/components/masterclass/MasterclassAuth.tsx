'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Loader2, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface MasterclassAuthProps {
  onSuccess?: () => void;
}

export function MasterclassAuth({ onSuccess }: MasterclassAuthProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/masterclass/enroll`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error('Google sign in error:', err);
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/masterclass/enroll`,
        },
      });

      if (error) throw error;

      setMagicLinkSent(true);
    } catch (err) {
      console.error('Magic link error:', err);
      setError('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border-2 border-emerald-100"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-8 h-8 text-emerald-600" />
          </motion.div>

          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            Check Your Email
          </h3>

          <p className="text-slate-600 mb-6">
            We've sent a magic link to <span className="font-semibold">{email}</span>
          </p>

          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm text-slate-700">
            <p className="mb-2">Click the link in the email to:</p>
            <ul className="space-y-1 text-left">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Sign in instantly (no password needed)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Complete your masterclass enrollment</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Start learning immediately</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-slate-500 mb-4">
            Didn't receive it? Check your spam folder or{' '}
            <button
              onClick={() => {
                setMagicLinkSent(false);
                setEmail('');
              }}
              className="text-emerald-600 hover:text-emerald-700 font-medium underline"
            >
              try again
            </button>
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-8 border-2 border-emerald-100"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Get Started with Your Free Masterclass
        </h2>
        <p className="text-slate-600">
          Sign in to save your progress and earn your CEU certificate
        </p>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Sign In */}
      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full h-12 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 font-semibold mb-4 transition-all"
        size="lg"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
            Continue with Google
          </>
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-slate-500 font-medium">
            or sign in with email
          </span>
        </div>
      </div>

      {/* Magic Link Form */}
      <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Mail className="w-5 h-5 mr-2" />
              Send Magic Link
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Benefits */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Why create an account?
        </p>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span>Save your progress as you complete sections</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span>Receive your BACB-approved CEU certificate</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span>Access your certificate anytime from your dashboard</span>
          </li>
        </ul>
      </div>

      {/* Privacy */}
      <p className="mt-6 text-xs text-center text-slate-500">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </motion.div>
  );
}
