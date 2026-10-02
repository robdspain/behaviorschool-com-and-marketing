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
      <div className="flex min-h-11 items-center justify-between border-b border-[#d9cdb8] bg-[#f4efe5] px-4">
        <span className="text-sm font-semibold uppercase tracking-wide text-[#365548]">
          Live cohort program
        </span>
        <span className="text-sm font-semibold uppercase tracking-wide text-[#1f4d3f]">
          Live product view
        </span>
      </div>
      <div className="bg-[#f4efe5] p-4">
        <div className="flex flex-wrap gap-2">
          {["Live online", "6 sessions", "School BCBAs", cohort.startBadge].map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] px-2.5 py-1 text-sm font-semibold uppercase tracking-wide text-[#1f4d3f]"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-4 text-lg font-semibold leading-snug text-[#171f1d]">{name}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-[#365548]">
          <CalendarDays className="h-4 w-4 text-[#1f4d3f]" aria-hidden="true" />
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
        <div className="mt-4 rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#365548]">
            Program investment
          </p>
          <p className="mt-1 text-2xl font-bold text-[#171f1d]">{pricing.payInFull}</p>
          <p className="mt-1 text-sm text-[#365548]">
            {TRANSFORMATION_PAYMENT_PLAN_SENTENCE}
          </p>
        </div>
        {showLink && (
          <Link
            href="/transformation-program"
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#1f4d3f] px-4 py-2.5 text-sm font-bold text-[#fbfaf6] transition-colors hover:bg-[#123628]"
          >
            View program details
          </Link>
        )}
      </div>
    </div>
  );
}
