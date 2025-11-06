"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAnalytics } from "@/hooks/useAnalytics";
import { X, LogIn } from "lucide-react";

export default function GuestResultsModal() {
  const params = useSearchParams();
  const router = useRouter();
  const { trackButtonClick } = useAnalytics();
  const [open, setOpen] = useState(false);
  const quiz = params.get('quiz') || undefined;

  const shouldOpen = useMemo(() => {
    const markers = [
      params.get("results"),
      params.get("resultsLocked"),
      params.get("completed"),
      params.get("needsAuth"),
    ];
    return markers.includes("1") || markers.includes("true") || markers.includes("locked");
  }, [params]);

  useEffect(() => {
    if (shouldOpen) {
      setOpen(true);
      try {
        trackButtonClick('results_modal_open', 'free-mock-return', { reason: 'query_param' });
      } catch {}
    }
  }, [shouldOpen]);

  const clearParam = () => {
    const sp = new URLSearchParams(params.toString());
    ["results", "resultsLocked", "completed", "needsAuth"].forEach((k) => sp.delete(k));
    router.replace(`?${sp.toString()}`);
    setOpen(false);
  };

  if (!open) return null;

  const signupUrl = "https://study.behaviorschool.com/auth?mode=signup&source=free-mock-return";
  const loginUrl = "https://study.behaviorschool.com/auth?mode=login&source=free-mock-return";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Sign in to see your results</h3>
          <button onClick={clearParam} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-slate-700 text-sm mb-2">
          You completed a guest quiz{quiz ? `: ${quiz}` : ''}.
        </p>
        <p className="text-slate-700 text-sm mb-4">Sign in to unlock your score, explanations, and full analytics.</p>
        <div className="flex items-center gap-3">
          <a
            href={signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackButtonClick("results_modal_signup", "free-mock-return", { href: signupUrl })}
            className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Create Account
          </a>
          <a
            href={loginUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackButtonClick("results_modal_login", "free-mock-return", { href: loginUrl })}
            className="flex-1 text-center border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold px-4 py-2 rounded-lg"
          >
            <span className="inline-flex items-center gap-2 justify-center"><LogIn className="w-4 h-4" /> Sign In</span>
          </a>
        </div>
      </div>
    </div>
  );
}
