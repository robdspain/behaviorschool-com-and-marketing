'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';

export default function MasterclassEnrollPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bacbCertNumber: '',
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Not authenticated, redirect back to masterclass page
        router.push('/masterclass');
        return;
      }

      setUser(user);

      // Pre-fill name from user metadata if available
      if (user.user_metadata?.full_name) {
        setFormData(prev => ({
          ...prev,
          name: user.user_metadata.full_name,
        }));
      } else if (user.user_metadata?.name) {
        setFormData(prev => ({
          ...prev,
          name: user.user_metadata.name,
        }));
      }

      // Check if already enrolled
      const { data: enrollment } = await supabase
        .from('masterclass_enrollments')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (enrollment) {
        // Already enrolled, redirect to course
        router.push('/masterclass/course');
        return;
      }
    } catch (err) {
      console.error('Error checking user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError('Please enter your full name');
      setIsSubmitting(false);
      return;
    }

    if (!formData.bacbCertNumber.trim() || formData.bacbCertNumber.trim().length < 3) {
      setError('Please enter a valid BACB certification number');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/masterclass/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          bacbCertNumber: formData.bacbCertNumber.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enroll');
      }

      // Success! Redirect to course
      router.push('/masterclass/course');
    } catch (err: unknown) {
      console.error('Enrollment error:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete enrollment. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Complete Your Enrollment
          </h1>
          <p className="text-lg text-slate-600">
            Just a few more details to start your free masterclass
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 border-2 border-emerald-100"
        >
          {/* Signed in as */}
          <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <p className="text-sm font-medium text-slate-700 mb-1">
              Signed in as:
            </p>
            <p className="text-emerald-700 font-semibold">
              {user?.email}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Smith"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isSubmitting}
                className="h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
              <p className="text-sm text-slate-500">
                This will appear on your CEU certificate
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bacbCertNumber" className="text-slate-700 font-medium">
                BACB Certification Number *
              </Label>
              <Input
                id="bacbCertNumber"
                type="text"
                placeholder="1-12-12345"
                value={formData.bacbCertNumber}
                onChange={(e) => setFormData({ ...formData, bacbCertNumber: e.target.value })}
                disabled={isSubmitting}
                className="h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
              <p className="text-sm text-slate-500">
                Required for BACB CEU certificate issuance
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg"
              size="lg"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Complete Enrollment & Start Learning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              By enrolling, you confirm that you are a BACB certified behavior analyst and
              agree to our terms of service. Your certificate will be issued upon successful
              completion of all sections and quizzes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
