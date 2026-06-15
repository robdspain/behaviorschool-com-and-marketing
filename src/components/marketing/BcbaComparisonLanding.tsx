import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Check, ClipboardCheck, FileText, ShieldCheck, X } from "lucide-react";

type Row = {
  label: string;
  behaviorSchool: string;
  competitor: string;
};

type BcbaComparisonLandingProps = {
  competitor: string;
  title: string;
  description: string;
  primaryCta?: string;
  bestForCompetitor: string;
  rows: Row[];
};

const appHref = "https://study.behaviorschool.com/free-mock-exam";

export function BcbaComparisonLanding({
  competitor,
  title,
  description,
  primaryCta = "Try BehaviorSchool free",
  bestForCompetitor,
  rows,
}: BcbaComparisonLandingProps) {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="bg-[#f7f3ee]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-32">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#1f4d3f]">
              BCBA exam prep comparison
            </p>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={appHref}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1f4d3f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#173a2f]"
              >
                {primaryCta}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-[#1f4d3f]/15 bg-white shadow-2xl">
            <Image
              src="/BehaviorStudyTools/before-after-behaviorstudytools.webp"
              alt="BehaviorSchool Study product preview"
              width={1184}
              height={864}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-lg border border-[#1f4d3f]/20 bg-[#eef6f1] p-6">
            <ShieldCheck className="mb-4 text-[#1f4d3f]" size={30} />
            <h2 className="text-xl font-bold text-slate-950">BehaviorSchool is strongest for</h2>
            <p className="mt-3 leading-7 text-slate-700">
              Candidates who want a complete study workflow: practice questions, full mocks, readiness score, review labels, and supervisor-ready reporting.
            </p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-6">
            <ClipboardCheck className="mb-4 text-[#1f4d3f]" size={30} />
            <h2 className="text-xl font-bold text-slate-950">{competitor} may fit when</h2>
            <p className="mt-3 leading-7 text-slate-700">{bestForCompetitor}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-6">
            <BarChart3 className="mb-4 text-[#1f4d3f]" size={30} />
            <h2 className="text-xl font-bold text-slate-950">Key differentiator</h2>
            <p className="mt-3 leading-7 text-slate-700">
              BehaviorSchool ties results to readiness and next actions, so candidates can see whether they are building, near ready, or ready.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-[#f9f7f2] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#1f4d3f]">Side-by-side</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Compare the study experience
            </h2>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-[#1f4d3f] text-sm font-bold text-white">
              <div className="p-4">Decision factor</div>
              <div className="p-4">BehaviorSchool</div>
              <div className="p-4">{competitor}</div>
            </div>
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[1.1fr_1fr_1fr] border-t border-slate-200 text-sm">
                <div className="p-4 font-bold text-slate-950">{row.label}</div>
                <div className="flex gap-2 p-4 text-slate-700">
                  <Check className="mt-0.5 shrink-0 text-[#1f4d3f]" size={16} />
                  <span>{row.behaviorSchool}</span>
                </div>
                <div className="flex gap-2 p-4 text-slate-700">
                  <X className="mt-0.5 shrink-0 text-slate-400" size={16} />
                  <span>{row.competitor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-[#1f4d3f] p-8 text-white">
          <FileText className="mb-4 text-[#e4b63d]" size={32} />
          <h2 className="text-2xl font-extrabold">Use the comparison, then test the workflow.</h2>
          <p className="mt-3 max-w-2xl text-emerald-50">
            The fastest way to judge fit is to answer questions, review rationales, and see whether the score report gives you a clearer next study step.
          </p>
          <Link
            href={appHref}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-[#e4b63d] px-6 py-3 text-sm font-bold text-[#143d32] transition hover:bg-[#d8aa30]"
          >
            Start free practice
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
