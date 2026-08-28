import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { TRANSFORMATION_PROGRAM } from "@/lib/transformation-program";

type TransformationProgramPreviewProps = {
  className?: string;
  showLink?: boolean;
};

export function TransformationProgramPreview({
  className = "",
  showLink = true,
}: TransformationProgramPreviewProps) {
  const { cohort, pricing, name } = TRANSFORMATION_PROGRAM;

  return (
    <div
      className={`overflow-hidden border border-[#173f33]/20 bg-white ${className}`}
      aria-label="School BCBA Transformation Program preview"
    >
      <div className="flex h-10 items-center justify-between border-b border-[#173f33]/12 bg-[#f4f2ec] px-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#51645d]">
          Live cohort program
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1f6b50]">
          Live product view
        </span>
      </div>
      <div className="bg-[#f7f3ee] p-4">
        <div className="flex flex-wrap gap-2">
          {["Live cohort", "6 weeks", "School BCBAs", cohort.startBadge].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#1f4d3f]/20 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1f4d3f]"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-4 text-lg font-semibold leading-snug text-[#123628]">{name}</h3>
        <p className="mt-2 flex items-center gap-2 text-xs text-[#51645d]">
          <CalendarDays className="h-3.5 w-3.5 text-[#1f4d3f]" aria-hidden="true" />
          {cohort.startFull} · {cohort.sessionTime}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {cohort.sessionDates.map((date) => (
            <span
              key={date}
              className="rounded-md border border-[#1f4d3f]/15 bg-white px-2 py-1 text-[10px] font-semibold text-[#1f4d3f]"
            >
              {date}
            </span>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-[#1f4d3f]/10 bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#51645d]">
            Program investment
          </p>
          <p className="mt-1 text-2xl font-bold text-[#123628]">{pricing.payInFull}</p>
          <p className="mt-1 text-xs text-[#51645d]">
            Payment plan: {pricing.installmentCount} payments of {pricing.installment}
          </p>
        </div>
        {showLink && (
          <Link
            href="/transformation-program"
            className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-[#1f4d3f] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#123628]"
          >
            View program details
          </Link>
        )}
      </div>
    </div>
  );
}
