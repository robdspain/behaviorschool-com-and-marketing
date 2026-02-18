import React from "react";
import { ShieldCheck } from "lucide-react";

export function FerpaNotice({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 ${className}`}
    >
      <ShieldCheck className="h-5 w-5 flex-shrink-0 text-emerald-700" />
      <div className="text-sm leading-relaxed">
        <div className="font-semibold">FERPA‑safe</div>
        <div>
          {compact ? (
            <>Inputs stay on‑device. If saved, they’re encrypted locally in your browser.</>
          ) : (
            <>
              Inputs stay on‑device. If saved, they’re encrypted locally in your browser. Avoid sharing sensitive data you don’t
              need.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
