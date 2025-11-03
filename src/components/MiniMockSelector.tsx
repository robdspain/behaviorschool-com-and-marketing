"use client";

import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { PlayCircle, ArrowRight } from "lucide-react";

const DOMAINS = [
  { id: "A", label: "Domain A" },
  { id: "B", label: "Domain B" },
  { id: "C", label: "Domain C" },
  { id: "D", label: "Domain D" },
  { id: "E", label: "Domain E" },
  { id: "F", label: "Domain F" },
  { id: "G", label: "Domain G" },
  { id: "H", label: "Domain H" },
  { id: "I", label: "Domain I" },
];

export default function MiniMockSelector({ location = "free-mock-mini" }: { location?: string }) {
  const [domain, setDomain] = useState<string>(DOMAINS[0].id);
  const { trackButtonClick } = useAnalytics();

  const start = () => {
    const ret = encodeURIComponent("https://behaviorschool.com/free-bcba-mock-practice-test?results=locked");
    const url = `https://study.behaviorschool.com/practice?mode=mini&domain=${encodeURIComponent(domain)}&return=${ret}`;
    try { trackButtonClick('mini_select_start', location, { domain, href: url }); } catch {}
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1">
          <label htmlFor="mini-domain" className="block text-sm font-semibold text-slate-900 mb-1">Choose Mini Mock</label>
          <select
            id="mini-domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
          >
            {DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        </div>
        <div className="sm:w-auto w-full">
          <button
            type="button"
            onClick={start}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold rounded-xl"
          >
            <PlayCircle className="w-4 h-4" /> Start Mini Mock <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">Opens the study platform start page for your selected mini. Results are gated; sign in after completing the guest quiz.</p>
    </div>
  );
}

