"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function CalabaBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-[90] bg-gradient-to-r from-amber-500 to-amber-400 text-emerald-900 py-2.5 px-4 text-center text-sm font-semibold shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span>🎉 See us at CALABA 2026! Conference attendees get <strong>40% off</strong> the first year.</span>
        <Link
          href="https://plan.behaviorschool.com/signup?promo=calaba2026"
          className="inline-flex items-center bg-emerald-800 text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-emerald-700 transition-colors"
        >
          Claim Offer
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 text-emerald-900/60 hover:text-emerald-900 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
