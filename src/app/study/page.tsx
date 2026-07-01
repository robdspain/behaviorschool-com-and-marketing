import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  GraduationCap,
  LineChart,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { BstMarketingTracker } from "@/components/marketing/BstMarketingTracker";
import { behaviorStudyToolsAppHref } from "@/lib/behavior-study-tools/links";
import { buildPageMetadata } from "@/lib/seo/metadata";

const canonical = "https://behaviorschool.com/study";

export const metadata = buildPageMetadata({
  title: "Behavior Study Tools | BCBA & RBT Exam Prep App",
  description:
    "Behavior Study Tools helps BCBA and RBT candidates study with mock exams, adaptive practice, rationales, readiness analytics, and supervision tracking.",
  canonical,
  image: "https://behaviorschool.com/BehaviorStudyTools/Hero-BST-Home.webp",
  imageAlt: "Behavior Study Tools app dashboard for BCBA and RBT exam prep",
});

const bcbaStartHref = behaviorStudyToolsAppHref("/onboarding/bcba", {
  intent: "homepage_primary",
  utm_content: "study_home_primary",
});

const freeMockHref = behaviorStudyToolsAppHref("/free-mock-exam/full", {
  intent: "full_mock",
  utm_content: "study_home_free_mock",
});

const rbtStartHref = behaviorStudyToolsAppHref("/onboarding/rbt", {
  intent: "rbt_path",
  utm_content: "study_home_rbt",
});

const supervisionHref = "https://supervision.behaviorschool.com/register?role=supervisor";
const hourTrackingHref = "https://supervision.behaviorschool.com/register?role=supervisee";

const studyFeatures = [
  {
    icon: Brain,
    title: "Adaptive practice questions",
    description:
      "Practice by BCBA or RBT pathway with questions that respond to performance instead of repeating the same static bank.",
  },
  {
    icon: BookOpen,
    title: "Detailed answer rationales",
    description:
      "Review why an answer is correct, why distractors miss the mark, and which concept to study next.",
  },
  {
    icon: Target,
    title: "Domain-level weak-area targeting",
    description:
      "See strengths and gaps by exam domain, subdomain, and practice history so the next session is obvious.",
  },
  {
    icon: Clock,
    title: "Timed mocks and mini exams",
    description:
      "Build stamina with full-length mock exams and shorter targeted sets for busy study days.",
  },
  {
    icon: LineChart,
    title: "Readiness analytics",
    description:
      "Track accuracy, pacing, consistency, recent trends, and progress toward exam readiness.",
  },
  {
    icon: Sparkles,
    title: "AI-supported study planning",
    description:
      "Turn results into a practical study plan instead of guessing what to review after each attempt.",
  },
];

const supervisionFeatures = [
  "Supervisor dashboard for BCBA, BCaBA, and RBT supervisees",
  "Restricted and unrestricted hour logging",
  "Monthly supervision percentage monitoring",
  "Competency notes, feedback, and session documentation",
  "Digital review workflow for pending hours",
  "Downloadable BACB-ready verification records",
  "Supervisee progress and exam-readiness visibility",
  "Designed to replace scattered spreadsheets and paper logs",
];

const platformLinks = [
  {
    title: "Study app",
    description: "BCBA and RBT practice, mocks, rationales, analytics, and study planning.",
    href: bcbaStartHref,
    cta: "Open study app",
    icon: GraduationCap,
  },
  {
    title: "Supervision platform",
    description: "Manage supervisees, review progress, document feedback, and keep records organized.",
    href: supervisionHref,
    cta: "Open supervision",
    icon: Users,
  },
  {
    title: "Hour tracking",
    description: "Log fieldwork hours, submit for approval, monitor totals, and stay audit-ready.",
    href: hourTrackingHref,
    cta: "Track hours",
    icon: ClipboardCheck,
  },
];

export default function StudyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <BstMarketingTracker />

      <section className="relative overflow-hidden bg-[#f7f3ee]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f4d3f12_1px,transparent_1px),linear-gradient(to_bottom,#1f4d3f12_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#1f4d3f] sm:text-5xl lg:text-6xl">
              Behavior Study Tools is the front door to your exam prep.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-700 sm:text-xl">
              Start at behaviorstudytools.com, practice in the app at study.behaviorschool.com,
              and connect your study progress with supervision and fieldwork hour tracking when you need it.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={bcbaStartHref}
                data-bst-cta="true"
                data-bst-location="study_home_hero"
                data-bst-intent="bcba_onboarding"
                data-bst-study-path="bcba"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f4d3f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#173a2f]"
              >
                Start the study app
                <ArrowRight size={16} />
              </a>
              <a
                href={freeMockHref}
                data-bst-cta="true"
                data-bst-location="study_home_hero_secondary"
                data-bst-intent="full_mock"
                data-bst-study-path="bcba"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1f4d3f]/35 bg-white px-6 py-3 text-sm font-semibold text-[#1f4d3f] transition-colors hover:bg-[#1f4d3f]/10"
              >
                Take a free mock exam
              </a>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
              {["BCBA exam prep", "RBT study path", "Supervision tools"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1f4d3f]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[30px] bg-[#1f4d3f]/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[24px] border border-[#1f4d3f]/10 bg-white shadow-[0_30px_90px_rgba(31,77,63,0.18)]">
              <Image
                src="/BehaviorStudyTools/Hero-BST-Home.webp"
                alt="Behavior Study Tools app dashboard for BCBA exam practice"
                width={720}
                height={480}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              One landing page for the study app and the platforms around it.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Behavior Study Tools should be the primary destination for exam candidates. From here,
              learners can start BCBA or RBT prep, supervisors can manage documentation, and supervisees
              can track fieldwork hours without hunting through separate product pages.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {platformLinks.map((platform) => {
              const Icon = platform.icon;
              return (
                <a
                  key={platform.title}
                  href={platform.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#1f4d3f]/35 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f4d3f]/10 text-[#1f4d3f]">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">{platform.title}</h3>
                  <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">{platform.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1f4d3f]">
                    {platform.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f9f7f2] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Everything the study app should make obvious.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                The app is not just a question bank. It helps candidates practice, review, interpret
                results, and decide what to study next.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={bcbaStartHref}
                  className="inline-flex items-center justify-center rounded-full bg-[#1f4d3f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#173a2f]"
                >
                  Start BCBA prep
                </a>
                <a
                  href={rbtStartHref}
                  className="inline-flex items-center justify-center rounded-full border border-[#1f4d3f]/35 bg-white px-6 py-3 text-sm font-semibold text-[#1f4d3f] transition hover:bg-[#1f4d3f]/10"
                >
                  Start RBT prep
                </a>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {studyFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-2xl border border-[#1f4d3f]/10 bg-white p-6 shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1f4d3f]/10 text-[#1f4d3f]">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-950">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Built to support supervision, not just exam prep.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Supervisors and supervisees need more than a study score. The connected supervision
              system helps document fieldwork, monitor progress, and keep BACB records organized.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {supervisionFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-[#1f4d3f]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.16)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-semibold">Supervision snapshot</h3>
                <p className="text-sm text-slate-300">supervision.behaviorschool.com</p>
              </div>
              <BadgeCheck className="h-7 w-7 text-[#e4b63d]" />
            </div>
            <div className="mt-6 space-y-4">
              {[
                { label: "Fieldwork hours approved", value: "1,420 / 2,000", width: "71%" },
                { label: "Monthly supervision minimum", value: "On track", width: "84%" },
                { label: "Competencies reviewed", value: "18 / 24", width: "75%" },
              ].map((row) => (
                <div key={row.label} className="rounded-xl bg-white/[0.08] p-4">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-300">{row.label}</span>
                    <span className="font-semibold">{row.value}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#e4b63d]" style={{ width: row.width }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={supervisionHref}
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Supervisor sign up
              </a>
              <a
                href={hourTrackingHref}
                className="inline-flex items-center justify-center rounded-full bg-[#e4b63d] px-5 py-3 text-sm font-semibold text-[#1f4d3f] transition hover:bg-[#d4a82d]"
              >
                Track my hours
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1f4d3f] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-white sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                A clearer path from studying to certification.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-emerald-100">
                Put the app first, then route people to the platform that matches their next job:
                practice, supervision, or hour documentation.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: FileText, title: "Practice", body: "Mock exams, mini sets, rationales, and domain analytics." },
                { icon: Users, title: "Supervise", body: "Caseload visibility, feedback, records, and progress checks." },
                { icon: BarChart3, title: "Verify", body: "Hour totals, approval status, documentation, and exports." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/15 bg-white/10 p-5">
                    <Icon className="h-6 w-6 text-[#e4b63d]" />
                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-emerald-100">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Start with Behavior Study Tools.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Use the landing page to get people into the app first, then send supervisors and
            supervisees to the connected tools when they are ready.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href={bcbaStartHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f4d3f] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#173a2f]"
            >
              Open study.behaviorschool.com
              <ArrowRight size={18} />
            </a>
            <Link
              href="/supervisors"
              className="inline-flex items-center justify-center rounded-full border border-[#1f4d3f]/35 px-8 py-4 text-base font-semibold text-[#1f4d3f] transition hover:bg-[#1f4d3f]/10"
            >
              Learn about supervision tools
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
