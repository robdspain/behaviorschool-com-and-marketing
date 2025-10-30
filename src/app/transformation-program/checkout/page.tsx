
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Lock } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function CheckoutPage() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setError('');

    try {
      const response = await fetch('/api/verify-checkout-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, email }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Access denied. Please check your credentials.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div
          className="max-w-md w-full"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 text-center mb-4">
              Checkout Access
            </h1>
            <p className="text-slate-600 text-center mb-6">
              Please enter the password provided during your onboarding call to proceed to checkout.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address (if pre-approved)
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">OR</span>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Access Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter password from onboarding call"
                />
              </div>
              <button
                type="submit"
                disabled={isChecking || (!email && !password)}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-700 hover:to-emerald-600 focus:ring-4 focus:ring-emerald-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChecking ? 'Verifying...' : 'Access Checkout'}
              </button>
            </form>

            <p className="text-xs text-slate-500 text-center mt-6">
              Don&apos;t have the password? Please complete your onboarding call first or contact support.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div
        className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <CheckCircle className="w-24 h-24 mx-auto text-emerald-500 mb-8" />
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Congratulations & Welcome!
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-12">
          You&apos;ve made a fantastic decision to join the School BCBA Transformation System. We are thrilled to have you on board and can&apos;t wait to see you achieve amazing results.
        </p>
        <Button
          asChild
          size="lg"
          className="rounded-2xl px-8 sm:px-10 h-14 sm:h-16 text-lg sm:text-xl font-semibold bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          <Link href="https://buy.stripe.com/bJe00i82o6Ss72seBw6Vq00">
            Proceed to Checkout
            <ArrowRight className="ml-3 h-6 w-6" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
