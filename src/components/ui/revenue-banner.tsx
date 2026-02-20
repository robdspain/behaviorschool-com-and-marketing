"use client";

import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";

export function RevenueBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="hidden md:block fixed top-0 left-0 right-0 z-[95] bg-emerald-900 text-white py-2.5 px-4 text-center text-sm font-semibold shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span className="text-white">CalABA 2026 is coming. Join the founding member offer and the School BCBA Accelerator waitlist.</span>
        <Link
          href="/calaba-2026"
          className="inline-flex items-center bg-amber-400 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full hover:bg-amber-300 transition-colors whitespace-nowrap"
        >
          CalABA 2026 Offer
        </Link>
        <Link
          href="/transformation-program#enroll"
          className="inline-flex items-center bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-emerald-600 transition-colors whitespace-nowrap"
        >
          Accelerator Waitlist
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 text-white/70 hover:text-white transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
