"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Lock } from "lucide-react";

export function CalabaBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-[90] bg-[#123628] text-white py-2.5 px-4 text-center text-sm font-semibold shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span className="flex items-center gap-2">
          <Lock className="h-4 w-4 flex-shrink-0 text-[#e4b63d]" />
          BehaviorSchool Pro is invite only — no public account creation.
        </span>
        <Link
          href="/pro"
          className="inline-flex items-center bg-[#e4b63d] text-[#123628] text-xs font-bold px-3 py-1 rounded-full hover:bg-[#d7aa32] transition-colors"
        >
          View preview
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 text-white/60 hover:text-white transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
