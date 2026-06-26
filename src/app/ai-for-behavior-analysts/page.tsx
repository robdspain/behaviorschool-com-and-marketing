import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI for Behavior Analysts | ABA Tools for BCBAs",
  description:
    "A practical guide to AI for behavior analysts, including BCBA exam prep, FBA and BIP workflows, IEP goal writing, supervision support, and ethical guardrails.",
  keywords:
    "AI for behavior analysts, AI for BCBAs, ABA AI tools, behavior analyst AI, AI BCBA exam prep, AI behavior plan tools",
  alternates: {
    canonical: "https://behaviorschool.com/ai-for-behavior-analysts",
  },
  openGraph: {
    title: "AI for Behavior Analysts | Behavior School",
    description:
      "Practical AI tools and guardrails for BCBAs, school behavior teams, supervisors, and exam candidates.",
    url: "https://behaviorschool.com/ai-for-behavior-analysts",
    siteName: "Behavior School",
    type: "website",
    images: [
      {
        url: "/BehaviorStudyTools/Hero-BST-Home.webp",
        width: 1200,
        height: 630,
        alt: "Behavior Study Tools dashboard for behavior analysts using AI-supported exam prep",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI for Behavior Analysts | Behavior School",
    description:
      "See practical AI workflows for BCBA exam prep, FBA to BIP, IEP goals, and school-based behavior support.",
    images: ["/BehaviorStudyTools/Hero-BST-Home.webp"],
  },
};

const workflows = [
  {
    icon: GraduationCap,
    title: "BCBA exam prep",
    description:
      "Use adaptive practice, domain-level trends, rationales, and timed mock exams to turn study data into the next best session.",
    href: "/bcba-exam-prep",
    cta: "Explore BCBA exam prep",
  },
  {
    icon: ClipboardList,
    title: "FBA to BIP workflows",
    description:
      "Move from interviews, ABC patterns, and hypothesis statements into function-aligned intervention planning with clearer documentation.",
    href: "/fba-to-bip",
    cta: "See FBA to BIP tools",
  },
  {
    icon: FileText,
    title: "IEP behavior goals",
    description:
      "Draft measurable, function-aware behavior goals faster while keeping the BCBA's clinical judgment in the driver's seat.",
    href: "/iep-goal-writer",
    cta: "Open the IEP goal writer",
  },
];

const principles = [
  "Use AI to organize data, draft language, and surface options, not to replace professional judgment.",
  "Keep student-identifying information out of unsecured general AI tools.",
  "Require human review before anything reaches an IEP, BIP, supervision record, or clinical document.",
  "Prefer tools built around ABA concepts, task-list language, and school workflows instead of generic prompts.",
];

const resources = [
  {
    title: "Behavior Study Tools",
    description: "Adaptive BCBA and RBT study tools with mock exams, rationales, analytics, and study planning.",
    href: "/study",
  },
  {
    title: "BehaviorSchool vs MagicSchool AI",
    description: "Compare a behavior-analysis-specific platform with a broad education AI platform.",
    href: "/compare/behaviorschool-vs-magicschool",
  },
  {
    title: "Teaching machines to adaptive instruction",
    description: "A behavior analytic history of adaptive learning, from programmed instruction to AI-supported practice.",
    href: "/blog/blog-linking-skinner-s-teaching-machines-to-modern-adaptive-instructional-design",
  },
  {
    title: "BCBA exam practice questions",
    description: "Practice realistic BCBA exam questions with rationales and links into the full exam prep cluster.",
    href: "/bcba-exam-practice-questions",
  },
];

const faqs = [
  {
    question: "Can behavior analysts use AI ethically?",
    answer:
      "Yes, when AI is used as a support tool with clear human review, privacy protection, and professional accountability. AI should not make clinical decisions or replace a BCBA's responsibility for recommendations.",
  },
  {
    question: "What is the best AI use case for BCBAs right now?",
    answer:
      "The strongest use cases are drafting, organizing, studying, and documentation support: practice question review, study planning, FBA summaries, BIP language drafts, IEP goal drafts, and supervision preparation.",
  },
  {
    question: "Should I put student information into AI tools?",
    answer:
      "Do not put identifiable student information into unsecured general AI tools. Use de-identified examples or FERPA-conscious systems with appropriate privacy practices.",
  },
];

export default function AIForBehaviorAnalystsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI for Behavior Analysts",
    description:
      "A Behavior School hub for practical AI tools, workflows, and ethical guardrails for behavior analysts.",
    url: "https://behaviorschool.com/ai-for-behavior-analysts",
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="relative overflow-hidden bg-[#f7f3ee]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f4d3f12_1px,transparent_1px),linear-gradient(to_bottom,#1f4d3f12_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1f4d3f]/20 bg-white px-4 py-2 text-sm font-semibold text-[#1f4d3f] shadow-sm">
              <Sparkles className="h-4 w-4" />
              AI tools for ABA work
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-[#1f4d3f] sm:text-5xl lg:text-6xl">
              AI for behavior analysts should make the work clearer, not sloppier.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Behavior School builds practical AI-supported tools for BCBAs, school behavior teams,
              supervisors, and exam candidates. The goal is better thinking: clearer study data,
              stronger drafts, tighter documentation, and human review at every important step.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/study"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f4d3f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#173a2f]"
              >
                Start with study tools
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/compare/behaviorschool-vs-magicschool"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1f4d3f]/30 bg-white px-6 py-3 text-sm font-semibold text-[#1f4d3f] transition hover:bg-[#1f4d3f]/10"
              >
                Compare AI platforms
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[24px] border border-[#1f4d3f]/10 bg-white shadow-[0_30px_80px_rgba(31,77,63,0.18)]">
              <Image
                src="/BehaviorStudyTools/Hero-BST-Home.webp"
                alt="Behavior Study Tools app showing AI-supported study planning and exam prep"
                width={1024}
                height={1024}
                className="aspect-[4/3] h-full w-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:left-auto sm:w-80">
              <div className="flex items-center gap-3">
                <Image
                  src="/profile-Rob.webp"
                  alt="Rob Spain, BCBA"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-950">Built by a practicing BCBA</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Tools shaped around real school-based behavior work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Practical AI workflows for behavior analysts
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Generic AI tools can produce generic output. These workflows start from behavior
              analytic tasks: studying, assessing, planning, writing, and reviewing.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {workflows.map((workflow) => {
              const Icon = workflow.icon;
              return (
                <Link
                  key={workflow.title}
                  href={workflow.href}
                  className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#1f4d3f]/35 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1f4d3f]/10 text-[#1f4d3f]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{workflow.title}</h3>
                  <p className="mt-3 min-h-[7rem] text-sm leading-6 text-slate-600">
                    {workflow.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1f4d3f]">
                    {workflow.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              <ShieldCheck className="h-4 w-4" />
              Guardrails first
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              The difference is not AI or no AI. It is governed AI or messy AI.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              BCBAs already work with sensitive decisions, student records, and high-stakes
              recommendations. The useful path is to make AI bounded, reviewable, and clinically
              accountable.
            </p>
          </div>
          <div className="grid gap-4">
            {principles.map((principle) => (
              <div key={principle} className="flex gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <p className="text-sm leading-6 text-slate-200">{principle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ee] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1f4d3f] sm:text-4xl">
                Keep reading: AI, behavior analysis, and exam prep
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                This hub should grow into the practical AI literacy center for behavior analysts:
                less hype, more useful examples, and stronger routes into the tools.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {resources.map((resource) => (
                <Link
                  key={resource.title}
                  href={resource.href}
                  className="group rounded-lg border border-[#1f4d3f]/15 bg-white p-5 shadow-sm transition hover:border-[#1f4d3f]/35 hover:shadow-md"
                >
                  <h3 className="font-semibold text-slate-950">{resource.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{resource.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1f4d3f]">
                    Read more
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            AI for behavior analysts FAQ
          </h2>
          <div className="mt-8 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {faqs.map((faq) => (
              <div key={faq.question} className="p-6">
                <h3 className="flex items-center gap-2 font-semibold text-slate-950">
                  <BadgeCheck className="h-5 w-5 text-[#1f4d3f]" />
                  {faq.question}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Start with the AI-supported study workflow.
            </h2>
            <p className="mt-2 text-slate-600">
              The fastest useful entry point is exam prep: practice, feedback, trends, and a next-step plan.
            </p>
          </div>
          <Link
            href="/bcba-practice-exam"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f4d3f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#173a2f]"
          >
            Take a BCBA practice exam
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
