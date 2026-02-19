"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";

interface ProTrialCTAProps {
  source?: string;
  variant?: "banner" | "card" | "inline";
  className?: string;
}

export function ProTrialCTA({ source = "tool-page", variant = "banner", className = "" }: ProTrialCTAProps) {
  const baseUrl = `https://plan.behaviorschool.com/register?source=${encodeURIComponent(source)}`;

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-3 text-sm ${className}`}>
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span className="text-slate-600">Want unlimited access?</span>
        <Link 
          href={baseUrl}
          className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
        >
          Try Pro free for 14 days <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-amber-400 font-semibold text-sm">Behavior School Pro</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Unlock All Tools</h3>
        <p className="text-slate-300 text-sm mb-4">
          Get unlimited access to FBA-to-BIP, IEP Goal Writer, Goal Bank, ACT tools, and more.
        </p>
        <ul className="space-y-2 mb-5">
          {["Unlimited FBAs & BIPs", "AI-powered IEP goals", "500+ goal bank", "ACT assessment tools"].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              {item}
            </li>
          ))}
        </ul>
        <Link
          href={baseUrl}
          className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl text-center transition-colors"
        >
          Start 14-Day Free Trial
        </Link>
        <p className="text-xs text-slate-500 text-center mt-3">No credit card required</p>
      </div>
    );
  }

  // Default: banner
  return (
    <div className={`bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white ${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-xl p-3">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Like this tool? Get unlimited access.</h3>
            <p className="text-emerald-100 text-sm">
              Try Behavior School Pro free for 14 days — all tools, no limits.
            </p>
          </div>
        </div>
        <Link
          href={baseUrl}
          className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          Start Free Trial <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
