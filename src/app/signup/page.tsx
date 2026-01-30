"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, Mail } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useAnalytics } from "@/hooks/useAnalytics";
import Link from "next/link";
import Script from "next/script";

export default function SignupPage() {
  const { trackFormSubmission, trackButtonClick, trackConversion } = useAnalytics();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    currentChallenges: "",
    website: "" // Honeypot field - bots fill this, humans don't see it
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Auto-format phone number as user types
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;

      if (cleaned.length >= 6) {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
      } else if (cleaned.length >= 3) {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      }

      setFormData({
        ...formData,
        [name]: formatted
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackButtonClick('signup_submit_click', 'signup form', { role: formData.role || 'unknown' });
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        trackFormSubmission('signup', true, { role: formData.role || 'unknown' });
        trackConversion({ event_name: 'signup_submitted', event_category: 'lead_generation', event_label: formData.role || 'unknown' });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Something went wrong. Please try again.");
        trackFormSubmission('signup', false, { role: formData.role || 'unknown', error: errorData.message || 'unknown' });
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      trackFormSubmission('signup', false, { role: formData.role || 'unknown', error: 'network' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load Calendly widget after submission
  useEffect(() => {
    if (isSubmitted && typeof window !== 'undefined') {
      // Initialize Calendly widget
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup script on unmount
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isSubmitted]);

  if (isSubmitted) {
    return (
      <>
        {/* ContactPage JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              name: "School BCBA Transformation System Signup",
              description: "Apply for the School BCBA Transformation System and schedule a consultation call.",
              url: "https://behaviorschool.com/signup",
              inLanguage: "en",
              isPartOf: {
                "@type": "WebSite",
                name: "Behavior School",
                url: "https://behaviorschool.com"
              }
            })
          }}
        />
        <Script
          src="https://assets.calendly.com/assets/external/widget.css"
          strategy="afterInteractive"
        />
        <div className="min-h-screen bg-bs-background py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted Successfully! 🎉</h2>
              <p className="text-lg text-slate-700 mb-4">
                Thank you for your interest in the <strong>School BCBA Transformation System</strong>.
              </p>
              <p className="text-slate-600 mb-6">
                Let&apos;s get you scheduled for a consultation call right now! Pick a time that works best for you below.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                📅 Schedule Your Consultation Call
              </h2>

              <div
                className="calendly-inline-widget"
                data-url="https://calendly.com/robspain/behavior-school-transformation-system-phone-call?hide_gdpr_banner=1&primary_color=10b981"
                style={{ minWidth: '320px', height: '700px' }}
              />

              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">What to expect on the call:</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>We&apos;ll discuss your specific challenges and goals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>You&apos;ll see exactly how the system can transform your practice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Get answers to all your questions about the program</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>No pressure - just a conversation about what&apos;s possible</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/transformation-program"
                  className="inline-flex items-center text-slate-600 hover:text-slate-900 text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Program Details
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-bs-background">
      {/* ContactPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "School BCBA Transformation System Signup",
            description: "Apply for the School BCBA Transformation System and schedule a consultation call.",
            url: "https://behaviorschool.com/signup",
            inLanguage: "en",
            isPartOf: {
              "@type": "WebSite",
              name: "Behavior School",
              url: "https://behaviorschool.com"
            }
          })
        }}
      />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
          <div className="flex items-center justify-between">
            <Breadcrumbs 
              items={[
                { label: "School BCBA Transformation System", href: "/transformation-program" },
                { label: "Registration" }
              ]}
            />
            <Link href="/transformation-program" className="inline-flex items-center text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Program Details
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Secure Your Spot in the School BCBA Transformation System
              </h1>
              <p className="text-slate-600">
                Join the 8-week program that transforms overwhelmed BCBAs into confident district leaders.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="your.email@school.org"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number <span className="text-emerald-600 text-xs font-semibold">(Preferred for fastest response)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="(555) 123-4567"
                />
                <p className="text-xs text-slate-500 mt-1">
                  💬 Optional but recommended - we can reach you 2-3x faster with a quick call to discuss your goals!
                </p>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-2">
                  Your Role *
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select your role</option>
                  <option value="BCBA">BCBA</option>
                  <option value="BCaBA">BCaBA</option>
                  <option value="RBT">RBT</option>
                  <option value="Special Education Teacher">Special Education Teacher</option>
                  <option value="School Psychologist">School Psychologist</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Other">Other</option>
                </select>
              </div>


              <div>
                <label htmlFor="currentChallenges" className="block text-sm font-medium text-slate-700 mb-2">
                  What&apos;s your biggest current challenge? <span className="text-slate-500 text-sm">(Optional but helps us prepare)</span>
                </label>
                <textarea
                  id="currentChallenges"
                  name="currentChallenges"
                  value={formData.currentChallenges}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Examples: struggling with teacher buy-in, overwhelmed by documentation, need better crisis protocols, can&apos;t show measurable outcomes, etc."
                />
                <p className="text-xs text-slate-500 mt-1">
                  Sharing this helps us tailor our consultation call specifically to your needs and show you relevant solutions right away.
                </p>
              </div>

              {/* Honeypot field - invisible to humans, bots fill it */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-emerald-700 hover:to-emerald-600 focus:ring-4 focus:ring-emerald-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Secure My Spot - Limited Availability"}
              </button>

              <p className="text-xs text-slate-500 text-center">
                By submitting this form, you agree to receive communications about the School BCBA Transformation System. 
                We respect your privacy and will never share your information.
              </p>
            </form>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What Happens Next?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Application Review</h3>
                    <p className="text-slate-600 text-sm">We&apos;ll review your application within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Consultation Call</h3>
                    <p className="text-slate-600 text-sm">15-minute call to discuss your specific needs</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Program Access</h3>
                    <p className="text-slate-600 text-sm">Get immediate access to exclusive resources</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Limited Spots Available</h2>
              <p className="mb-6">
                Only 20 spots available for this cohort. Join BCBAs who are already transforming their practice.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>8-week comprehensive program</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>Proven templates and systems</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
