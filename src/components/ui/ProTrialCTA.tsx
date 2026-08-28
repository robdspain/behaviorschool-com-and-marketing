"use client";

import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

interface ProTrialCTAProps {
  source?: string;
  variant?: "banner" | "card" | "inline";
  className?: string;
}

export function ProTrialCTA({ variant = "banner", className = "" }: ProTrialCTAProps) {
  const accessHref = "/pro";

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-3 text-sm ${className}`}>
        <Lock className="w-4 h-4 text-[#1f4d3f]" />
        <span className="text-[#59645f]">Need the full FBA/BIP workspace?</span>
        <Link
          href={accessHref}
          className="text-[#1f4d3f] hover:text-[#123628] font-medium inline-flex items-center gap-1"
        >
          Request invite-only access <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`rounded-2xl border border-[#1f4d3f]/15 bg-[#123628] p-6 text-white ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-[#e4b63d]" />
          <span className="text-[#e4b63d] font-semibold text-sm">BehaviorSchool Pro</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Invite-only workspace</h3>
        <p className="text-white/75 text-sm mb-4">
          BehaviorSchool Pro is in development for school FBA/BIP drafting, IEP goals, and student
          plan exports. Public account creation is not available.
        </p>
        <Link
          href={accessHref}
          className="block w-full bg-[#e4b63d] hover:bg-[#d7aa32] text-[#123628] font-semibold py-3 px-4 rounded-xl text-center transition-colors"
        >
          View invite-only access
        </Link>
        <p className="text-xs text-white/55 text-center mt-3">Not available for public signup today</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-[#1f4d3f]/15 bg-[#1f4d3f] p-6 text-white ${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-white/15 bg-white/10 p-3">
            <Lock className="w-6 h-6 text-[#e4b63d]" />
          </div>
          <div>
            <h3 className="font-bold text-lg">BehaviorSchool Pro is invite only</h3>
            <p className="text-white/75 text-sm">
              The commercial FBA/BIP workspace is in development. Public account creation is not available.
            </p>
          </div>
        </div>
        <Link
          href={accessHref}
          className="bg-[#e4b63d] text-[#123628] hover:bg-[#d7aa32] font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          Request access <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
