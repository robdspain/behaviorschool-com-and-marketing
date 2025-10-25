'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { ArrowRight, Award, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { EnrollmentFormData } from '@/lib/masterclass/types';

interface RegistrationFormProps {
  onSuccess: (enrollmentId: string, email: string) => void;
  onExistingUser?: (email: string) => void;
}

export function RegistrationForm({ onSuccess, onExistingUser }: RegistrationFormProps) {
  const [formData, setFormData] = useState<EnrollmentFormData>({
    email: '',
    name: '',
    bacbCertNumber: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Please enter your full name';
    }

    // Email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // BACB cert number validation (flexible format)
    if (!formData.bacbCertNumber.trim()) {
      errors.bacbCertNumber = 'BACB certification number is required';
    } else if (formData.bacbCertNumber.trim().length < 3) {
      errors.bacbCertNumber = 'Please enter a valid BACB certification number';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/masterclass/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 && onExistingUser) {
          // User already enrolled, redirect to course
          onExistingUser(formData.email);
          return;
        }
        throw new Error(data.error || 'Failed to enroll');
      }

      // Success! Call the onSuccess callback
      onSuccess(data.data.enrollmentId, formData.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof EnrollmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-slate-200 p-6 sm:p-8 md:p-10 lg:p-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-4"
          >
            <Award className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">1.0 BACB CEU Credits</span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Start Your Free Masterclass
          </h2>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Complete this 1-hour course to earn your CEU certificate. All fields are required to issue your certificate.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <p className="text-sm">{error}</p>
            </Alert>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`h-12 text-base ${fieldErrors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
              disabled={isSubmitting}
              required
            />
            {fieldErrors.name && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.name}</p>
            )}
            <p className="text-xs text-slate-500">
              This name will appear on your CEU certificate
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`h-12 text-base ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              disabled={isSubmitting}
              required
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
            )}
            <p className="text-xs text-slate-500">
              We&apos;ll email your certificate here
            </p>
          </div>

          {/* BACB Certification Number */}
          <div className="space-y-2">
            <Label htmlFor="bacbCertNumber" className="text-sm font-semibold text-slate-700">
              BACB Certification Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="bacbCertNumber"
              type="text"
              placeholder="1-12-12345"
              value={formData.bacbCertNumber}
              onChange={(e) => handleInputChange('bacbCertNumber', e.target.value)}
              className={`h-12 text-base ${fieldErrors.bacbCertNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
              disabled={isSubmitting}
              required
            />
            {fieldErrors.bacbCertNumber && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.bacbCertNumber}</p>
            )}
            <p className="text-xs text-slate-500">
              Required for CEU certificate verification
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-emerald-50 rounded-xl p-4 sm:p-6 space-y-3">
            <h3 className="font-semibold text-slate-900 text-xs sm:text-sm mb-3">What You&apos;ll Get:</h3>
            <div className="space-y-2">
              {[
                'Instant access to all 4 video sections',
                '1.0 BACB CEU credit upon completion',
                'Downloadable CEU certificate',
                'Practical tools you can use immediately',
              ].map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Your Account...
              </>
            ) : (
              <>
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          {/* Privacy Note */}
          <p className="text-xs text-center text-slate-500 mt-4">
            By enrolling, you agree to receive your CEU certificate and course updates via email.
            Your information is secure and will never be shared.
          </p>
        </form>

        {/* BACB Provider Info */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            BACB ACE Provider: <span className="font-semibold text-slate-700">OP-25-11420</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
