import type { Metadata } from "next";
import { GoalWriterWizard } from "@/components/iep-goal-writer/GoalWriterWizard";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ShareButtons } from "@/components/ui/share-buttons";
import { ProTrialCTA } from "@/components/ui/ProTrialCTA";

const baseUrl = "https://behaviorschool.com";
const pageUrl = `${baseUrl}/iep-goal-writer`;

const faqItems = [
  {
    question: "What is an IEP behavior goal?",
    answer:
      "An IEP behavior goal is a measurable objective written into a student's Individualized Education Program that targets specific behaviors needing improvement. It includes baseline data, target criteria, and conditions for success. Effective behavior goals focus on observable actions and include timelines for achievement.",
  },
  {
    question: "How do I write measurable behavior goals for IEPs?",
    answer:
      "To write measurable IEP behavior goals, start with a clear definition of the target behavior, establish baseline data, set specific criteria for success (e.g., '4 out of 5 days'), and include conditions under which the behavior should occur. Include fluency, generalization, and maintenance components to ensure the skill transfers across settings and time.",
  },
  {
    question: "What are examples of IEP behavior goals?",
    answer:
      "Examples include: 'Student will raise hand before speaking in class 80% of opportunities for 3 consecutive weeks' or 'Student will use calming strategies when frustrated in 4 out of 5 instances across all school settings.' Strong behavior goals specify the behavior, measurement method, success criteria, and timeframe.",
  },
  {
    question: "How many behavior goals should an IEP have?",
    answer:
      "Most IEPs include 2-4 behavior goals, though this varies based on student needs. Focus on priority behaviors that significantly impact learning or safety rather than creating too many goals. Quality and achievability matter more than quantity.",
  },
  {
    question: "Who is the IEP Goal Writer for?",
    answer:
      "It is built for special educators, school-based BCBAs, and support staff who need a fast, values-aligned behavior goal. The tool is designed for professionals working in K-12 settings who need to create research-backed IEP goals efficiently.",
  },
  {
    question: "What makes this different from a generic IEP goal template?",
    answer:
      "Walk through baseline, target, fluency, generalization, and maintenance so goals are actionable, measurable, and SMART.",
  },
  {
    question: "Can I use the output in an IEP meeting?",
    answer:
      "Yes. The tool produces a copy-ready goal statement with baseline and maintenance language you can refine for the team. All generated goals follow SMART criteria and include the components required for legally compliant IEPs.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes. No registration is required to generate a goal. You can create unlimited IEP behavior goals at no cost.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "IEP Goal Writer",
      description:
        "An IEP goal writer that generates Level 5 SMART behavior goals with baseline, fluency, generalization, and maintenance.",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: pageUrl,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      provider: {
        "@type": "Organization",
        name: "Behavior School",
        url: baseUrl,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export const metadata: Metadata = {
  title: "IEP Goal Writer | Behavior School",
  description:
    "Free IEP Goal Writer that creates Level 5 SMART behavior goals with baseline, fluency, and maintenance in minutes. For BCBAs and educators. Start now!",
  keywords: [
    "IEP goal writer",
    "behavior goals",
    "SMART IEP goals",
    "BCBA tools",
    "special education",
    "SMART behavior goals",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "IEP Goal Writer | SMART Behavior Goals in Minutes",
    description:
      "Generate a research-aligned IEP behavior goal with baseline, fluency, generalization, and maintenance in under five minutes.",
    url: pageUrl,
    images: [
      {
        url: `${baseUrl}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "IEP Goal Writer by Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IEP Goal Writer | SMART Behavior Goals in Minutes",
    description:
      "Generate a research-aligned IEP behavior goal with baseline, fluency, generalization, and maintenance in under five minutes.",
    images: [`${baseUrl}/og-image.webp`],
  },
};

export default function IEPGoalWriterPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-6 pt-8">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: "IEP Goal Writer" },
          ]}
        />
      </div>

      <article className="container mx-auto max-w-6xl px-6 pt-12">
        {/* Hero Section */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 shadow-sm">
            IEP Goal Writer
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Write IEP Goals that <span className="text-emerald-700">Matter</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Generate a research-backed, Level 5 SMART behavior goal with baseline, fluency, and maintenance in under five minutes.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-6">
            {[
              "No registration needed",
              "Baseline + Fluency included",
              "Built for BCBAs & Educators",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard App Section */}
        <section className="relative mb-12 scroll-mt-24" id="tool">
          <GoalWriterWizard />
        </section>

        {/* Pro Trial CTA */}
        <ProTrialCTA source="iep-goal-writer" className="mb-24" />

        {/* Info Content */}
        <div className="mx-auto max-w-4xl space-y-24">
          <section className="grid gap-12 md:grid-cols-2 md:items-center" aria-labelledby="iep-goal-writer-what">
            <div className="space-y-6">
              <h2 id="iep-goal-writer-what" className="text-3xl font-bold text-slate-900">
                Why use the Goal Writer?
              </h2>
              <p className="text-lg leading-relaxed text-slate-600">
                Most IEP goals fail because they are compliant but not meaningful. This tool flips the script.
              </p>
              <p className="text-lg leading-relaxed text-slate-600">
                It guides you through selecting a core student value first, then helps you operationalize it into a measurable behavior with all the technical components (baseline, fluency, generalization, maintenance) required for a robust IEP.
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-8 shadow-sm">
              <h3 className="mb-6 text-xl font-bold text-emerald-900">Perfect for:</h3>
              <ul className="space-y-4">
                {[
                  "Building a new IEP goal from scratch in minutes",
                  "Refreshing old goals with fluency & maintenance criteria",
                  "Creating measurable, actionable targets students can achieve",
                  "Ensuring legal defensibility with SMART criteria"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-emerald-900/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section aria-labelledby="iep-goal-writer-faq">
            <h2 id="iep-goal-writer-faq" className="mb-10 text-center text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <h3 className="mb-3 font-bold text-slate-900">{item.question}</h3>
                  <p className="text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-slate-900 px-8 py-12 text-center text-white" aria-labelledby="iep-goal-writer-share">
            <h2 id="iep-goal-writer-share" className="mb-4 text-2xl font-bold">
              Know a teacher who is drowning in paperwork?
            </h2>
            <p className="mb-8 text-slate-300">Share this free tool and help them get their weekend back.</p>
            <div className="flex justify-center">
              <ShareButtons title="IEP Goal Writer" url={pageUrl} className="text-white" />
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
