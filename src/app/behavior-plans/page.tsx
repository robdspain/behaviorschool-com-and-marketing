import type { Metadata } from "next";
import { BehaviorPlanWizard } from "@/components/behavior-plan-writer/BehaviorPlanWizard";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ShareButtons } from "@/components/ui/share-buttons";

const baseUrl = "https://behaviorschool.com";
const pageUrl = `${baseUrl}/behavior-plans`;

const faqItems = [
  {
    question: "What is a Behavior Intervention Plan?",
    answer:
      "A BIP is a proactive, written plan that outlines specific strategies, supports, and data collection methods designed to reduce challenging behavior and teach replacement skills. It is based on a functional behavior assessment.",
  },
  {
    question: "Who is the Behavior Plan Writer for?",
    answer:
      "School-based BCBAs, behavior specialists, special education teachers, school psychologists, and IEP teams responsible for developing and implementing behavior intervention plans.",
  },
  {
    question: "What makes this different from a BIP template?",
    answer:
      "Instead of a blank template, the Behavior Plan Writer guides you through a step-by-step process, provides function-based strategy recommendations, and generates a complete, formatted plan ready for team review.",
  },
  {
    question: "Can I customize the generated plan?",
    answer:
      "Yes. The wizard lets you select from evidence-based strategies, add custom interventions, and adjust all components. The final output is fully editable before you save or print.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes. The Behavior Plan Writer is completely free with no registration required. Simply complete the wizard and generate your plan.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Behavior Plan Writer",
      description:
        "Free behavior intervention plan (BIP) generator that creates comprehensive, evidence-based plans with function-matched strategies, data collection systems, and implementation guides.",
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
  title: "Behavior Plan Writer - Free BIP Generator | Behavior School",
  description:
    "Free behavior intervention plan (BIP) writer for BCBAs and educators. Create comprehensive, evidence-based plans with function-matched strategies in minutes. Start now!",
  keywords: [
    "behavior plan writer",
    "BIP generator",
    "behavior intervention plan",
    "BIP template",
    "BCBA tools",
    "behavior support plan",
    "special education",
    "positive behavior support",
    "PBS plan",
    "school behavior plan",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Behavior Plan Writer | Free BIP Generator for School Teams",
    description:
      "Create comprehensive behavior intervention plans with evidence-based strategies, data collection systems, and implementation guides. Free for BCBAs and educators.",
    url: pageUrl,
    images: [
      {
        url: `${baseUrl}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "Behavior Plan Writer by Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Behavior Plan Writer | Free BIP Generator for School Teams",
    description:
      "Create comprehensive behavior intervention plans with evidence-based strategies, data collection systems, and implementation guides. Free for BCBAs and educators.",
    images: [`${baseUrl}/og-image.webp`],
  },
};

export default function BehaviorPlanWriterPage() {
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
            { label: "Behavior Plan Writer" },
          ]}
        />
      </div>

      <article className="container mx-auto px-6 pb-16 pt-8">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_1.2fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              BIP Wizard
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Create Comprehensive Behavior Intervention Plans in Minutes
              </h1>
              <p className="text-base text-slate-600">
                Stop wrestling with blank templates. Build complete, evidence-based behavior plans with function-matched strategies, data collection systems, and staff training guides.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Step-by-step wizard",
                "Function-based interventions",
                "Data collection plans included",
                "Staff training materials",
                "Print-ready output",
                "No registration required",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-700">
                  <span className="mt-0.5 text-emerald-600">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">How it works</p>
              <p>Enter student info, define target behavior, identify function, select prevention strategies, choose teaching interventions, set up reinforcement, create data collection plan, and generate your complete BIP.</p>
            </div>
          </div>

          <BehaviorPlanWizard />
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]" aria-labelledby="behavior-plan-what">
          <div className="space-y-4">
            <h2 id="behavior-plan-what" className="text-2xl font-semibold text-slate-900">
              What is the Behavior Plan Writer?
            </h2>
            <p className="text-base text-slate-600">
              The Behavior Plan Writer is a free, comprehensive tool that guides you through creating a complete behavior intervention plan. It walks you through identifying the target behavior, determining its function, selecting evidence-based strategies, and building data collection and staff training systems.
            </p>
            <p className="text-base text-slate-600">
              Every plan includes operational definitions, function-based interventions, antecedent strategies, teaching plans for replacement behaviors, reinforcement procedures, consequence strategies, data collection methods, and progress monitoring systems.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6">
            <h3 className="text-lg font-semibold text-emerald-900">What is included in your BIP</h3>
            <ul className="mt-3 space-y-2 text-sm text-emerald-900/90">
              <li>✓ Student information and behavior definition</li>
              <li>✓ Function of behavior (escape, attention, tangible, automatic)</li>
              <li>✓ Antecedent/prevention strategies</li>
              <li>✓ Replacement behavior teaching plan</li>
              <li>✓ Reinforcement procedures</li>
              <li>✓ Consequence strategies</li>
              <li>✓ Data collection plan with measurement methods</li>
              <li>✓ Progress monitoring schedule</li>
              <li>✓ Staff training guidelines</li>
            </ul>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="behavior-plan-faq">
          <h2 id="behavior-plan-faq" className="text-2xl font-semibold text-slate-900">
            Behavior Plan Writer FAQ
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

        <section className="mt-12" aria-labelledby="behavior-plan-share">
          <h2 id="behavior-plan-share" className="text-2xl font-semibold text-slate-900">
            Share this tool
          </h2>
          <ShareButtons title="Behavior Plan Writer" url={pageUrl} className="mt-4" />
        </section>
      </article>
    </main>
  );
}
