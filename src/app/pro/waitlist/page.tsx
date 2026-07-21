"use client";

import Link from "next/link";
import { ArrowLeft, Bell, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(
        "https://modest-malamute-868.convex.site/api/product-waitlist",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            product: "plan",
            sourceDomain: "behaviorschool.com/pro/waitlist",
            newsletterOptIn,
          }),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to join the waitlist.");
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to join the waitlist.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4">
      <div className="max-w-lg w-full text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-6">
          <Bell className="w-8 h-8 text-emerald-700" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          BehaviorSchool Pro is Coming Soon
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          AI-powered FBA-to-BIP, IEP Goal Generator, Goal Bank, and ACT-informed FBA → BIP
          — built by school BCBAs, for school BCBAs. Join the waitlist to get
          early access and founding member pricing.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mb-8 text-left">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Joining..." : "Join Waitlist"}
              </button>
            </div>
            <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-gray-600">
              <input
                type="checkbox"
                checked={newsletterOptIn}
                onChange={(event) => setNewsletterOptIn(event.target.checked)}
                className="mt-1 h-4 w-4 accent-emerald-700"
              />
              <span>
                Also send me the weekly School BCBA Systems Letter with practical research notes
                and occasional Behavior School product announcements. Unsubscribe anytime.
              </span>
            </label>
            <p className="mt-2 text-xs text-gray-500">
              Joining the product waitlist does not subscribe you to the weekly newsletter.
            </p>
            {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold mb-8 bg-emerald-50 rounded-lg py-4 px-6">
            <CheckCircle className="w-5 h-5" />
            <span>You are on the list! We will notify you at launch.</span>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-8">
          Launching at CalABA 2026 (March 5-7) with 40% off founding member pricing.
        </p>

        <div className="space-y-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore our free tools while you wait
          </Link>
        </div>
      </div>
    </main>
  );
}
