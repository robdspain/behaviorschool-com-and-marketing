import { Metadata } from "next";
import { CheckCircle, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You're In! | Transformation Program | Behavior School",
  description: "Your Transformation Program purchase is confirmed. We'll be in touch within 1 business day to schedule your onboarding.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PurchaseCompletePage() {
  return (
    <div className="min-h-screen bg-bs-background flex items-center justify-center p-4 pt-24">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>

        {/* Main Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          You&apos;re in!
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Your <strong>Transformation Program</strong> purchase is confirmed. We&apos;re excited to work with you.
        </p>

        {/* What Happens Next */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-8 text-left">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            What happens next
          </h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-semibold text-sm">
                1
              </span>
              <div>
                <p className="font-semibold text-slate-900">We&apos;ll reach out within 1 business day</p>
                <p className="text-slate-600 text-sm mt-1">
                  Expect an email from Rob to schedule your onboarding call and get you set up with program access.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-semibold text-sm">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-900">Your onboarding call</p>
                <p className="text-slate-600 text-sm mt-1">
                  We&apos;ll walk through your caseload, goals, and what to expect so your first week is focused and productive.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-semibold text-sm">
                3
              </span>
              <div>
                <p className="font-semibold text-slate-900">Week 1 kicks off</p>
                <p className="text-slate-600 text-sm mt-1">
                  You&apos;ll get access to your first module and start building your Assessment Architecture system.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
          <p className="text-emerald-800 font-medium mb-4">
            While you wait, explore the tools you&apos;ll be building on:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/transformation-program">
                <ArrowRight className="mr-2 w-5 h-5" />
                Review the Program
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/resources">
                Explore Free Resources
              </Link>
            </Button>
          </div>
        </div>

        {/* Return Home */}
        <Link
          href="/"
          className="text-slate-600 hover:text-emerald-600 underline text-sm"
        >
          ← Return to Behavior School Homepage
        </Link>
      </div>
    </div>
  );
}
