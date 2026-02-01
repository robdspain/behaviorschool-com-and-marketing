import type { Metadata } from "next";
import { GoalWriterWizard } from "@/components/iep-goal-writer/GoalWriterWizard";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ShareButtons } from "@/components/ui/share-buttons";

const baseUrl = "https://behaviorschool.com";
const pageUrl = `${baseUrl}/iep-goal-writer`;

const faqItems = [
  {
    question: "Who is the IEP Goal Writer for?",
    answer:
      "It is built for special educators, school-based BCBAs, and support staff who need a fast, values-aligned behavior goal.",
  },
  {
    question: "What makes this different from a generic IEP goal template?",
    answer:
      "It starts with student values, then walks you through baseline, target, fluency, generalization, and maintenance so goals are actionable and measurable.",
  },
  {
    question: "Can I use the output in an IEP meeting?",
    answer:
      "Yes. The tool produces a copy-ready goal statement with baseline and maintenance language you can refine for the team.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes. No registration is required to generate a goal.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "IEP Goal Writer",
      description:
        "A values-based IEP goal writer that generates Level 5 SMART behavior goals with baseline, fluency, generalization, and maintenance.",
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
  title: "IEP Goal Writer | Values-Based Behavior Goals in Minutes",
  description:
    "Free IEP Goal Writer that turns student values into Level 5 SMART behavior goals with baseline, fluency, and maintenance in minutes.",
  keywords: [
    "IEP goal writer",
    "behavior goals",
    "SMART IEP goals",
    "BCBA tools",
    "special education",
    "values-based goals",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "IEP Goal Writer | Values-Based Behavior Goals in Minutes",
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
    title: "IEP Goal Writer | Values-Based Behavior Goals in Minutes",
    description:
      "Generate a research-aligned IEP behavior goal with baseline, fluency, generalization, and maintenance in under five minutes.",
    images: [`${baseUrl}/og-image.webp`],
  },
};

export default function IEPGoalWriterPage() {
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
            { label: "IEP Goal Writer" },
          ]}
        />
      </div>

      <article className="container mx-auto px-6 pb-16 pt-8">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_1.2fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Values Wizard
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                IEP Behavior Goals that students actually care about
              </h1>
              <p className="text-base text-slate-600">
                Move beyond compliance. Start with student values and generate a research-backed, Level 5 SMART behavior goal in under five minutes.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "No registration required",
                "Baseline + fluency + maintenance included",
                "Built for special educators and BCBAs",
                "Copy-ready goal output",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-700">
                  <span className="mt-0.5 text-emerald-600">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">How it works</p>
              <p>Pick a value, define the behavior, set baseline and target, add fluency/generalization, and lock in maintenance.</p>
            </div>
          </div>

          <GoalWriterWizard />
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]" aria-labelledby="iep-goal-writer-what">
          <div className="space-y-4">
            <h2 id="iep-goal-writer-what" className="text-2xl font-semibold text-slate-900">
              What is the IEP Goal Writer?
            </h2>
            <p className="text-base text-slate-600">
              The IEP Goal Writer is a free, values-based tool that helps you create clear, measurable IEP behavior goals. It guides you through
              selecting a student value, defining the behavior, setting baseline and target levels, and adding fluency, generalization, and maintenance
              so the goal is ready for team review.
            </p>
            <p className="text-base text-slate-600">
              Use it when you need a fast, research-aligned goal statement that still feels personal and meaningful for the student.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6">
            <h3 className="text-lg font-semibold text-emerald-900">Best-fit use cases</h3>
            <ul className="mt-3 space-y-2 text-sm text-emerald-900/90">
              <li>Build a new IEP goal from scratch in minutes.</li>
              <li>Refresh a goal to include baseline, fluency, and maintenance.</li>
              <li>Create values-based targets students can connect with.</li>
            </ul>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="iep-goal-writer-faq">
          <h2 id="iep-goal-writer-faq" className="text-2xl font-semibold text-slate-900">
            IEP Goal Writer FAQ
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

        <section className="mt-12" aria-labelledby="iep-goal-writer-share">
          <h2 id="iep-goal-writer-share" className="text-2xl font-semibold text-slate-900">
            Share this tool
          </h2>
          <ShareButtons title="IEP Goal Writer" url={pageUrl} className="mt-4" />
        </section>
      </article>
    </main>
  );
}
