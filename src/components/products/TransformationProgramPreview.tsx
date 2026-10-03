import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { cohortScheduleEntries, TRANSFORMATION_PAYMENT_PLAN_SENTENCE, TRANSFORMATION_PROGRAM } from "@/lib/transformation-program";

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
      aria-label="School BCBA Systems Transformation Program preview"
    >
      <div className="flex h-10 items-center justify-between border-b border-[#173f33]/12 bg-[#f4f2ec] px-4">
        <span className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#365548]">
          Live cohort program
        </span>
        <span className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#365548]">
          Live product view
        </span>
      </div>
      <div className="bg-[#f4efe5] p-4">
        <div className="flex flex-wrap gap-2">
          {["Live online", "6 sessions", "School BCBAs", cohort.startBadge].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#1f4d3f]/20 bg-white px-2.5 py-1 text-[14px] font-semibold uppercase tracking-[0.08em] text-[#1f4d3f]"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-4 text-lg font-semibold leading-snug text-[#123628]">{name}</h3>
        <p className="mt-2 flex items-center gap-2 text-[14px] text-[#365548]">
          <CalendarDays className="h-3.5 w-3.5 text-[#1f4d3f]" aria-hidden="true" />
          {cohort.summaryHeadline}. {cohort.summaryDetail}
        </p>
        <ul className="mt-3 space-y-1">
          {cohortScheduleEntries().map((entry) => (
            <li
              key={`${entry.shortDate}-${entry.label}`}
              className={entry.skipped ? "text-sm text-[#365548]" : "text-sm font-semibold text-[#1f4d3f]"}
            >
              Thu, {entry.shortDate}: {entry.label}
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-lg border border-[#1f4d3f]/10 bg-white p-4">
          <p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#365548]">
            Program investment
          </p>
          <p className="mt-1 text-2xl font-bold text-[#123628]">{pricing.payInFull}</p>
          <p className="mt-1 text-[14px] text-[#365548]">
            {TRANSFORMATION_PAYMENT_PLAN_SENTENCE}
          </p>
        </div>
        {showLink && (
          <Link
            href="/transformation-program"
            className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-[#1f4d3f] px-4 py-2.5 text-[14px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#123628]"
          >
            View program details
          </Link>
        )}
      </div>
    </div>
  );
}
