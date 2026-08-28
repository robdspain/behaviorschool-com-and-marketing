import Image from "next/image";
import type { ReactNode } from "react";

const domainRows = [
  { label: "A · Behavior analytic concepts", value: 82 },
  { label: "B · Measurement", value: 78 },
  { label: "C · Assessment", value: 84 },
  { label: "D · Skill acquisition", value: 76 },
  { label: "E · Behavior reduction", value: 80 },
  { label: "F · Systems", value: 74 },
  { label: "G · Behavior change", value: 79 },
  { label: "H · Implementation", value: 81 },
  { label: "I · Ethics", value: 88 },
];

type StudyToolsProductPreviewProps = {
  variant?: "hero" | "card";
  className?: string;
};

export function StudyToolsProductPreview({
  variant = "hero",
  className = "",
}: StudyToolsProductPreviewProps) {
  if (variant === "card") {
    return (
      <div className={`overflow-hidden border border-[#173f33]/20 bg-white ${className}`}>
        <div className="flex h-10 items-center justify-between border-b border-[#173f33]/12 bg-[#f4f2ec] px-4">
          <div className="flex items-center gap-2">
            <Image
              src="/behavior-study-tools-icon.png"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 rounded object-cover"
              aria-hidden="true"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#51645d]">
              Behavior Study Tools
            </span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1f6b50]">
            Live product view
          </span>
        </div>
        <div className="bg-[#123628] p-4">
          <ResultsPanel compact />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-[420px] ${className}`} aria-label="Behavior Study Tools product preview">
      <div className="absolute left-0 top-6 w-[42%] rotate-[-4deg]">
        <PreviewCard label="Dashboard">
          <div className="space-y-3 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#51645d]">
              Welcome back
            </p>
            <p className="text-xs font-bold text-[#123628]">Today&apos;s study desk</p>
            <div className="rounded-lg bg-[#123628] p-3 text-white">
              <p className="text-[11px] font-semibold">Review measurement decisions</p>
              <p className="mt-1 text-[10px] text-white/70">
                Start the next 5-question block in Domain B.
              </p>
              <span className="mt-3 inline-flex rounded-md bg-[#e4b63d] px-2.5 py-1 text-[10px] font-bold text-[#123628]">
                Start 5-question block
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[9px] text-[#51645d]">
              <div>
                <p className="font-semibold text-[#123628]">Streak</p>
                <p>9 days</p>
              </div>
              <div>
                <p className="font-semibold text-[#123628]">This week</p>
                <p>38 questions</p>
              </div>
              <div>
                <p className="font-semibold text-[#123628]">Accuracy</p>
                <p>74%</p>
              </div>
            </div>
          </div>
        </PreviewCard>
      </div>

      <div className="absolute left-[28%] top-0 z-20 w-[52%]">
        <PreviewCard label="Results" emphasized>
          <ResultsPanel />
        </PreviewCard>
      </div>

      <div className="absolute right-0 top-16 z-10 w-[34%] rotate-[3deg] opacity-90">
        <PreviewCard label="Quiz / Plan">
          <div className="space-y-2 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#51645d]">
              Recommended next
            </p>
            <p className="text-xs font-semibold text-[#123628]">
              Which next step best addresses the weak area?
            </p>
            <div className="rounded-md border border-[#1f4d3f]/15 bg-[#f8f7f3] p-2.5 text-[10px] leading-4 text-[#263b34]">
              Review Domain B measurement, answer a focused set, then retest with a timed block.
            </div>
          </div>
        </PreviewCard>
      </div>
    </div>
  );
}

function PreviewCard({
  label,
  emphasized = false,
  children,
}: {
  label: string;
  emphasized?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-[0_24px_60px_rgba(18,54,40,0.18)] ${
        emphasized ? "border-[#e4b63d]/50" : "border-[#173f33]/15"
      }`}
    >
      <div className="flex items-center justify-between border-b border-[#173f33]/10 bg-[#f4f2ec] px-3 py-2">
        <div className="flex items-center gap-2">
          <Image
            src="/behavior-study-tools-icon.png"
            alt=""
            width={18}
            height={18}
            className="h-4 w-4 rounded object-cover"
            aria-hidden="true"
          />
          <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#1f4d3f]">
            Behavior Study Tools
          </span>
        </div>
        <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#1f6b50]">
          Live product UI
        </span>
      </div>
      {children}
      <div className="border-t border-[#173f33]/10 bg-[#f8f7f3] px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-[0.16em] text-[#51645d]">
        {label}
      </div>
    </div>
  );
}

function ResultsPanel({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${compact ? "p-3" : "p-4"} bg-[#123628] text-white`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">Results</p>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold">BCBA</span>
      </div>
      <div className={`mt-3 grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
        {[
          { label: "Accuracy", value: "81%" },
          { label: "Improvement", value: "+13%" },
          { label: "Avg. pace", value: "52s" },
          { label: "Mastered", value: "18" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-md border border-white/10 bg-white/5 px-2 py-2">
            <p className="text-[9px] uppercase tracking-[0.1em] text-white/55">{stat.label}</p>
            <p className="text-sm font-bold text-[#e4b63d]">{stat.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">
        Domain performance
      </p>
      <div className={`mt-2 space-y-2 ${compact ? "max-h-36 overflow-hidden" : ""}`}>
        {domainRows.slice(0, compact ? 5 : domainRows.length).map((row) => (
          <div key={row.label}>
            <div className="flex justify-between text-[9px] text-white/80">
              <span className="truncate pr-2">{row.label}</span>
              <span className="font-semibold text-[#e4b63d]">{row.value}%</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full bg-[#e4b63d]"
                style={{ width: `${row.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
