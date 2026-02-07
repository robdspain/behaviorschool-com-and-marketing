import type { Metadata } from "next";
import { GoalGeneratorWizard } from "@/components/iep-goal-generator/GoalGeneratorWizard";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ShareButtons } from "@/components/ui/share-buttons";

const baseUrl = "https://behaviorschool.com";
const pageUrl = `${baseUrl}/iep-goal-generator`;

const faqItems = [
  {
    question: "What is the IEP Goal Generator?",
    answer:
      "The IEP Goal Generator is a free tool that creates complete, measurable, legally defensible IEP goals for behavior reduction and skill building. It generates annual goals, short-term objectives, data collection methods, and progress monitoring schedules — all without AI or paid APIs.",
  },
  {
    question: "How is this different from the IEP Goal Writer?",
    answer:
      "The IEP Goal Writer is a values-based wizard for quick goals. The IEP Goal Generator is more comprehensive — it covers both problem behavior reduction and skill increase, includes detailed baseline data, multiple measurement methods, mastery criteria, and produces a complete goal package with benchmarks and data collection plans.",
  },
  {
    question: "What types of behaviors does it cover?",
    answer:
      "For behavior reduction: aggression, elopement, self-injury, task refusal, disruption, property destruction, tantrums, and more. For skill building: social skills, self-regulation, communication, daily living, academic engagement, compliance, coping strategies, transition skills, and play skills.",
  },
  {
    question: "Are the generated goals legally defensible?",
    answer:
      "Yes. Goals follow the Condition-Behavior-Criteria format required by IDEA. They include measurable criteria, specific timelines, designated measurement methods, and baseline data — all elements needed for legally compliant IEP goals.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account is required. Enter your email to get the complete goal package with objectives and data collection plans, or preview the annual goal without an email.",
  },
  {
    question: "Can I use these goals in actual IEP meetings?",
    answer:
      "Absolutely. The output is designed to be copy-ready for your IEP software. Always review and customize generated goals with your IEP team to fit the individual student's needs.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "IEP Goal Generator",
      description:
        "Free IEP goal generator for behavior reduction and skill building. Creates SMART goals with short-term objectives, data collection methods, and progress monitoring schedules.",
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
  title: "Free IEP Goal Generator | Behavior Reduction & Skill Building Goals",
  description:
    "Free IEP goal generator for behavior analysts and special educators. Generate complete, measurable IEP goals for problem behavior reduction and skill building with objectives, data collection, and progress monitoring.",
  keywords: [
    "IEP goal generator",
    "behavior IEP goals",
    "IEP goal bank",
    "behavior reduction goals",
    "behavior skill goals",
    "SMART IEP goals",
    "IEP objectives",
    "special education goals",
    "BCBA IEP goals",
    "measurable IEP goals",
    "IEP goal writer",
    "behavior intervention plan goals",
    "social skills IEP goals",
    "self-regulation IEP goals",
    "aggression IEP goals",
    "elopement IEP goals",
    "task refusal IEP goals",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Free IEP Goal Generator | Behavior Reduction & Skill Building",
    description:
      "Generate complete, legally defensible IEP behavior goals with short-term objectives, data collection methods, and progress monitoring schedules. Free for educators and BCBAs.",
    url: pageUrl,
    images: [
      {
        url: `${baseUrl}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "IEP Goal Generator by Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free IEP Goal Generator | Behavior Reduction & Skill Building",
    description:
      "Generate complete, legally defensible IEP behavior goals with objectives and data collection plans. Free for educators and BCBAs.",
    images: [`${baseUrl}/og-image.webp`],
  },
};

export default function IEPGoalGeneratorPage() {
  return (
    <main className="min-h-screen bg-bs-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-6 pt-20">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: "IEP Goal Generator" },
          ]}
        />
      </div>

      <article className="container mx-auto px-6 pb-16 pt-8">
        {/* Hero + Wizard */}
        <section className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Comprehensive Generator
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Generate Complete, Measurable IEP Behavior Goals
              </h1>
              <p className="text-base text-slate-600">
                Create legally defensible IEP goals for problem behavior reduction and skill building — with short-term objectives, data collection methods, and progress monitoring schedules built in.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Behavior reduction & skill building",
                "SMART goal format (Condition-Behavior-Criteria)",
                "Short-term objectives included",
                "Data collection & progress monitoring",
                "No AI — template-based & instant",
                "Free for educators & BCBAs",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-700">
                  <span className="mt-0.5 text-emerald-600">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Quick links to goal types */}
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Two Goal Modes</p>
              <ul className="mt-2 space-y-1">
                <li><span className="text-lg">📉</span> <strong>Problem Behavior Reduction</strong> — aggression, elopement, self-injury, task refusal, disruption, property destruction</li>
                <li><span className="text-lg">📈</span> <strong>Behavior Skill Increase</strong> — social skills, self-regulation, communication, daily living, academic engagement, coping strategies</li>
              </ul>
            </div>
          </div>

          <GoalGeneratorWizard />
        </section>

        {/* SEO Content Section */}
        <section className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]" aria-labelledby="iep-goal-generator-what">
          <div className="space-y-4">
            <h2 id="iep-goal-generator-what" className="text-2xl font-semibold text-slate-900">
              What Makes a Great IEP Behavior Goal?
            </h2>
            <p className="text-base text-slate-600">
              A well-written IEP behavior goal follows the <strong>Condition-Behavior-Criteria</strong> format and is SMART: Specific, Measurable, Achievable, Relevant, and Time-bound. Under IDEA, goals must be measurable and designed to enable the student to make progress in the general education curriculum.
            </p>
            <p className="text-base text-slate-600">
              The IEP Goal Generator builds goals that include all required elements: a clear condition statement describing when and where the behavior should occur, an observable and measurable behavior definition, specific mastery criteria with a timeline, baseline data, and a data collection plan.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-6">
              IEP Goal Bank for Behavior
            </h3>
            <p className="text-base text-slate-600">
              Our generator draws from an extensive IEP goal bank covering the most common behavior categories in special education. Whether you need goals for reducing physical aggression, increasing social skills, or building self-regulation, the generator produces research-aligned goals that are ready for your IEP team.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6">
              <h3 className="text-lg font-semibold text-emerald-900">Goal Components</h3>
              <ul className="mt-3 space-y-2 text-sm text-emerald-900/90">
                <li>✅ <strong>Condition</strong> — When/where the behavior should occur</li>
                <li>✅ <strong>Behavior</strong> — Observable, measurable target</li>
                <li>✅ <strong>Criteria</strong> — How much, how often, for how long</li>
                <li>✅ <strong>Baseline</strong> — Current performance level</li>
                <li>✅ <strong>Objectives</strong> — Stepping stones to the annual goal</li>
                <li>✅ <strong>Data Collection</strong> — How to measure progress</li>
                <li>✅ <strong>Monitoring</strong> — When to review and adjust</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">Who Is This For?</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Special education teachers writing IEPs</li>
                <li>• School-based BCBAs developing behavior goals</li>
                <li>• School psychologists supporting IEP teams</li>
                <li>• Related service providers</li>
                <li>• Parents preparing for IEP meetings</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12" aria-labelledby="iep-goal-generator-faq">
          <h2 id="iep-goal-generator-faq" className="text-2xl font-semibold text-slate-900">
            IEP Goal Generator FAQ
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Share */}
        <section className="mt-12" aria-labelledby="iep-goal-generator-share">
          <h2 id="iep-goal-generator-share" className="text-2xl font-semibold text-slate-900">
            Share this tool
          </h2>
          <ShareButtons title="IEP Goal Generator" url={pageUrl} className="mt-4" />
        </section>
      </article>
    </main>
  );
}
