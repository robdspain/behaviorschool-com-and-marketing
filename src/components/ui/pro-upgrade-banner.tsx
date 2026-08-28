"use client";

import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
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
      <div className="bg-[#f5eedc] border border-[#e4b63d]/40 rounded-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[#123628]">
          <Lock className="h-4 w-4 text-[#1f4d3f]" />
          <span>
            You&apos;ve used <strong>{usageCount} of {usageLimit}</strong> free generations this month
          </span>
        </div>
        <Link href="/pro" className="text-xs font-bold text-[#1f4d3f] hover:text-[#123628] underline">
          Invite-only workspace
        </Link>
      </div>

      <div className="rounded-xl border border-[#1f4d3f]/15 bg-[#1f4d3f] px-6 py-5 text-center">
        <p className="text-white font-bold text-lg mb-1">BehaviorSchool Pro is invite only</p>
        <p className="text-white/75 text-sm mb-4">
          The commercial FBA/BIP workspace is in development. Public account creation is not available.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/pro/waitlist">
            <Button className="bg-[#e4b63d] hover:bg-[#d7aa32] text-[#123628] font-bold rounded-lg px-6">
              Request invite-only access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          {showSave && (
            <Link href="/pro">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-lg px-6">
                View Pro preview
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
