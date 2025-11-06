"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";

const HIDE_KEY = 'free_mock_sticky_hide_until';

export default function StickyGuestCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HIDE_KEY);
      const now = Date.now();
      if (!raw) {
        setVisible(true);
      } else {
        const until = Number(raw);
        if (Number.isFinite(until) && now > until) setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const hideForDays = (days: number) => {
    try {
      const until = Date.now() + days * 24 * 60 * 60 * 1000;
      localStorage.setItem(HIDE_KEY, String(until));
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  const returnParam = encodeURIComponent('https://behaviorschool.com/free-bcba-mock-practice-test?results=locked&quiz=' + encodeURIComponent('Mini-Mock Exam (10 Questions)'));
  const guest10 = `https://study.behaviorschool.com/quiz/guest?limit=10&return=${returnParam}`;

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4">
      <div className="max-w-3xl w-full bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-slate-200 p-3 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-700">
          Ready? Try a free 10‑question BCBA guest quiz with instant scoring.
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => hideForDays(7)} className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1">Dismiss</button>
          <a
            onClick={() => hideForDays(7)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-sm font-semibold px-3 py-2 rounded-xl"
            href={guest10}
            target="_blank"
            rel="noopener noreferrer"
          >
            Start 10‑Q Guest Quiz <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
