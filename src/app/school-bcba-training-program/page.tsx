import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, FileCheck, Users, BarChart3 } from "lucide-react";
import { SchoolBcbasTransformationCta } from "@/components/marketing/SchoolBcbasTransformationCta";

const canonical = "https://behaviorschool.com/school-bcba-training-program";

export const metadata: Metadata = {
  title: "School BCBA Training Program | Build Better FBA and BIP Systems",
  description:
    "A 6-week school BCBA training program for building repeatable FBA, BIP, staff training, and caseload systems. August cohort now open.",
  alternates: { canonical },
  robots: { index: true, follow: true },
  openGraph: {
    title: "School BCBA Training Program | Behavior School",
    description:
      "Build school BCBA systems for assessment, BIP design, staff implementation, and caseload management in a 6-week live cohort.",
    url: canonical,
    siteName: "Behavior School",
    type: "website",
    images: [
      {
        url: "/optimized/BIP-Writer/BIP-Writer-Team.webp",
        width: 1200,
        height: 630,
        alt: "School team reviewing behavior support systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "School BCBA Training Program | Behavior School",
    description:
      "A practical school BCBA systems cohort for FBA, BIP, staff training, and caseload management.",
    images: ["/optimized/BIP-Writer/BIP-Writer-Team.webp"],
  },
};

const systemAreas = [
  {
    title: "FBA intake and triage",
    body: "Sort referrals by severity, data quality, and decision need so every concern does not become a full rebuild from scratch.",
    icon: ClipboardList,
  },
  {
    title: "Function-based BIP design",
    body: "Match interventions to behavioral function and write plans staff can actually implement in classrooms.",
    icon: FileCheck,
  },
  {
    title: "Staff implementation routines",
    body: "Turn BIPs into one-page guides, fidelity checks, and follow-up routines that reduce drift.",
    icon: Users,
  },
  {
    title: "Caseload review systems",
    body: "Use a weekly review rhythm to catch stalled plans, missing data, and students who need a next decision.",
    icon: BarChart3,
  },
];

const weeklyPath = [
  "Assessment architecture",
  "Data collection systems",
  "FBA to hypothesis",
  "BIP design by function",
  "Implementation and staff training",
  "Progress monitoring and caseload management",
];

export default function SchoolBcbaTrainingProgramPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden bg-[#f7f3ee]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#e4b63d33,transparent_42%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1f4d3f]">
              School BCBA training program
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Build school BCBA systems that survive a real caseload.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              The School BCBA Transformation Program is a 6-week live cohort for BCBAs who need repeatable systems for FBA intake, BIP design, staff training, and progress monitoring in K-12 settings.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/transformation-program?utm_source=school_bcba_training_program&utm_medium=landing_page&utm_campaign=august_2026_cohort"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f4d3f] px-7 py-3 text-sm font-bold text-white hover:bg-[#173a30]"
              >
                Apply for the August cohort
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/school-bcba"
                className="inline-flex items-center justify-center rounded-full border border-[#1f4d3f]/30 bg-white px-7 py-3 text-sm font-bold text-[#1f4d3f] hover:bg-emerald-50"
              >
                Explore school BCBA resources
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
              {["Starts Aug 12", "6 live sessions", "12 seats max", "$1,997 tuition"].map((item) => (
                <span key={item} className="rounded-full bg-white px-3 py-1.5 shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-[#1f4d3f]/10 bg-white p-3 shadow-xl">
              <Image
                src="/optimized/BIP-Writer/BIP-Writer-Team.webp"
                alt="School behavior team building FBA and BIP systems"
                width={1200}
                height={900}
                className="aspect-[4/3] w-full rounded-xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              What the program solves
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              School BCBA work breaks when every student has a custom process.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              The goal is not more templates for their own sake. The goal is a shared operating system: when a referral comes in, you know what data to request, what level of assessment is appropriate, how the BIP should connect to function, and how staff will be trained.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {systemAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div key={area.title} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <Icon className="h-6 w-6 text-[#1f4d3f]" />
                  <h3 className="mt-4 text-xl font-bold text-slate-950">{area.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{area.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#e4b63d]">
                Six-week school BCBA systems path
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Each week produces a usable piece of your operating system.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/70">
                This is built for working school BCBAs. The deliverables are meant to be used with your current caseload, not saved in a folder for later.
              </p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {weeklyPath.map((item, index) => (
                <li key={item} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#e4b63d]">
                    Week {index + 1}
                  </span>
                  <p className="mt-2 font-bold text-white">{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">
              This is a fit if you already know ABA and need your school systems to catch up.
            </h2>
            <div className="mt-6 grid gap-3 text-sm leading-6 text-slate-700 sm:grid-cols-2">
              {[
                "You are a BCBA working in a school or district.",
                "Your FBA and BIP workload keeps expanding.",
                "Staff implementation is inconsistent across buildings or classrooms.",
                "You want systems you can explain to administrators and IEP teams.",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-700" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SchoolBcbasTransformationCta source="school_bcba_training_program_bottom" />
        </div>
      </section>
    </main>
  );
}
