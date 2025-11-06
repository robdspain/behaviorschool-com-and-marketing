"use client";

import { useSearchParams } from "next/navigation";

export default function TopQuizBanner() {
  const params = useSearchParams();
  const quiz = params.get('quiz');
  if (!quiz) return null;
  return (
    <div className="mb-4">
      <div className="w-full rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-900 px-4 py-3">
        <div className="text-sm font-semibold">Selected Quiz</div>
        <div className="text-base">{quiz}</div>
      </div>
    </div>
  );
}

