"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProUpgradeBannerProps {
  /** Number of free uses consumed this month */
  usageCount?: number;
  /** Max free uses per month */
  usageLimit?: number;
  /** Show the save-to-account CTA */
  showSave?: boolean;
}

export function ProUpgradeBanner({
  usageCount = 2,
  usageLimit = 3,
  showSave = true,
}: ProUpgradeBannerProps) {
  return (
    <div className="mt-8 space-y-3">
      {/* Usage limit indicator */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-amber-800">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>
            You&apos;ve used <strong>{usageCount} of {usageLimit}</strong> free generations this month
          </span>
        </div>
        <Link href="/pro/waitlist" className="text-xs font-bold text-amber-700 hover:text-amber-900 underline">
          Get Unlimited
        </Link>
      </div>

      {/* Upgrade banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-xl px-6 py-5 text-center">
        <p className="text-white font-bold text-lg mb-1">Want unlimited access?</p>
        <p className="text-emerald-100 text-sm mb-4">Try BehaviorSchool Pro free for 14 days — no credit card required.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/pro/waitlist">
            <Button className="bg-amber-400 hover:bg-amber-300 text-emerald-900 font-bold rounded-lg px-6">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          {showSave && (
            <Link href="/pro">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-lg px-6">
                <Save className="mr-2 h-4 w-4" />
                Save to Your Account
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
