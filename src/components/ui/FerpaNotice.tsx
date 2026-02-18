import React from "react";
import { ShieldCheck } from "lucide-react";

export function FerpaNotice({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 ${className}`}
    >
      <ShieldCheck className="h-5 w-5 flex-shrink-0 text-emerald-700" />
      <div className="text-sm leading-relaxed">
        <div className="font-semibold">FERPA‑safe tip</div>
        <div>
          {compact ? (
            <>Do not enter student names, IDs, or other identifying details. Keep entries de‑identified.</>
          ) : (
            <>
              Do not enter student names, IDs, or other identifying details. Keep entries de‑identified. This tool runs in your
              browser and does not store or transmit your inputs.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
