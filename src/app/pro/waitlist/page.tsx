"use client";

import Link from "next/link";
import { ArrowLeft, Lock, CheckCircle } from "lucide-react";
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
      if (!response.ok) throw new Error(result.error || "Unable to submit your request.");
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit your request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f5f0] px-4">
      <div className="max-w-lg w-full text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#edf5f0] mb-6">
          <Lock className="w-8 h-8 text-[#1f4d3f]" />
        </div>

        <h1 className="text-3xl font-bold text-[#123628] mb-4">
          Request invite-only access to BehaviorSchool Pro
        </h1>

        <p className="text-lg text-[#59645f] mb-8">
          BehaviorSchool Pro is an invite-only workspace in development for school FBA and BIP
          drafting, IEP goals, and student plan exports. Public account creation is not available.
          Share your email if you want to be considered when invitations open.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mb-8 text-left">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-[#1f4d3f]/20 focus:outline-none focus:ring-2 focus:ring-[#1f4d3f] text-[#123628]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#1f4d3f] text-white font-semibold rounded-lg hover:bg-[#123628] transition-colors whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Request access"}
              </button>
            </div>
            <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-[#59645f]">
              <input
                type="checkbox"
                checked={newsletterOptIn}
                onChange={(event) => setNewsletterOptIn(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[#1f4d3f]"
              />
              <span>
                Also send me The Weekly Research Brief with practical research notes
                and occasional Behavior School product announcements. Unsubscribe anytime.
              </span>
            </label>
            <p className="mt-2 text-xs text-[#59645f]">
              Requesting access does not create an account or subscribe you to the weekly newsletter.
            </p>
            {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 text-[#1f4d3f] font-semibold mb-8 bg-[#edf5f0] rounded-lg py-4 px-6">
            <CheckCircle className="w-5 h-5" />
            <span>Request received. We will contact you if invite-only access opens for your team.</span>
          </div>
        )}

        <p className="text-sm text-[#59645f] mb-8">
          BehaviorSchool Pro is not available for public signup today. Free school-practice tools
          remain open on BehaviorSchool.com.
        </p>

        <div className="space-y-3">
          <Link
            href="/free-tools"
            className="inline-flex items-center gap-2 text-[#1f4d3f] hover:text-[#123628] font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore free tools while you wait
          </Link>
        </div>
      </div>
    </main>
  );
}
