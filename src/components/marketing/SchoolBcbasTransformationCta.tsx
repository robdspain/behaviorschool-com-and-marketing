import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2 } from "lucide-react";

type SchoolBcbasTransformationCtaProps = {
  variant?: "light" | "dark" | "compact";
  source?: string;
};

export function SchoolBcbasTransformationCta({
  variant = "light",
  source = "school-bcba-cta",
}: SchoolBcbasTransformationCtaProps) {
  const href = `/transformation-program?utm_source=${encodeURIComponent(source)}&utm_medium=site_cta&utm_campaign=august_2026_cohort`;

  if (variant === "compact") {
    return (
      <aside className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
          For school BCBAs
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">
          August cohort now open
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Build repeatable FBA, BIP, implementation, and caseload systems over 6 live weeks.
        </p>
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1f4d3f] px-4 py-2 text-sm font-bold text-white hover:bg-[#173a30]"
        >
          See the school BCBA program
          <ArrowRight className="h-4 w-4" />
        </Link>
      </aside>
    );
  }

  const dark = variant === "dark";
  return (
    <aside className={dark ? "rounded-2xl bg-[#123628] p-6 text-white" : "rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm"}>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className={dark ? "text-xs font-bold uppercase tracking-widest text-[#e4b63d]" : "text-xs font-bold uppercase tracking-widest text-emerald-700"}>
            School BCBA Transformation Program
          </p>
          <h2 className={dark ? "mt-2 text-2xl font-bold text-white" : "mt-2 text-2xl font-bold text-slate-950"}>
            August cohort now open for school BCBAs.
          </h2>
          <p className={dark ? "mt-3 text-sm leading-6 text-white/75" : "mt-3 text-sm leading-6 text-slate-700"}>
            If you are studying for the BCBA exam and plan to work in schools, this is the next step after passing: assessment systems, function-based BIPs, staff training, and caseload management that hold up in real districts.
          </p>
          <div className={dark ? "mt-4 flex flex-wrap gap-3 text-sm text-white/80" : "mt-4 flex flex-wrap gap-3 text-sm text-slate-700"}>
            {["Starts Aug 12", "6 live sessions", "12 seats"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                {item === "Starts Aug 12" ? <Calendar className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                {item}
              </span>
            ))}
          </div>
        </div>
        <Link
          href={href}
          className={dark ? "inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#e4b63d] px-6 py-3 text-sm font-bold text-[#123628] hover:bg-[#d7aa32]" : "inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#1f4d3f] px-6 py-3 text-sm font-bold text-white hover:bg-[#173a30]"}
        >
          Apply for August cohort
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
