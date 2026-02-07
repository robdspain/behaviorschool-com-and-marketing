import type { Metadata } from "next";
import { FBAToBIPWizard } from "@/components/fba-to-bip/FBAToBIPWizard";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ShareButtons } from "@/components/ui/share-buttons";

const baseUrl = "https://behaviorschool.com";
const pageUrl = `${baseUrl}/fba-to-bip`;

const faqItems = [
  {
    question: "What is an FBA-to-BIP generator?",
    answer:
      "It takes the data from a Functional Behavior Assessment (FBA) — target behaviors, antecedents, consequences, and the function of behavior — and generates a complete Behavior Intervention Plan (BIP) with evidence-based strategies tailored to the identified function.",
  },
  {
    question: "Who is this tool designed for?",
    answer:
      "School-based BCBAs, special educators, behavior specialists, school psychologists, and any team member responsible for writing BIPs based on FBA data.",
  },
  {
    question: "How does it generate strategies without AI?",
    answer:
      "The tool uses a comprehensive rules-based system built on ABA research and best practices. Strategies are selected and matched based on the function of behavior, identified antecedents, and the student's individual context.",
  },
  {
    question: "Can I use the output in an IEP or team meeting?",
    answer:
      "Yes. The BIP is designed to be copy-ready and professional. You can print it, save as PDF, or copy the text directly. Always review and customize the output with your team before finalizing.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes. The generator is completely free. We ask for an email to deliver your BIP, and we'll send occasional behavior support tips you can unsubscribe from anytime.",
  },
  {
    question: "Does it include a crisis plan?",
    answer:
      "Yes, if you indicate safety concerns during the FBA data entry, the generator automatically includes a crisis/safety plan section with step-by-step response procedures.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "FBA to BIP Generator",
      description:
        "Free FBA-to-BIP generator that turns Functional Behavior Assessment data into a complete, evidence-based Behavior Intervention Plan with antecedent strategies, teaching strategies, reinforcement, data collection, and more.",
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
  title: "FBA to BIP Generator | Free Behavior Intervention Plan Builder",
  description:
    "Free FBA-to-BIP generator for BCBAs and special educators. Enter your FBA data and generate a complete Behavior Intervention Plan with evidence-based strategies in minutes.",
  keywords: [
    "FBA to BIP generator",
    "behavior intervention plan generator",
    "BIP template generator",
    "FBA to BIP",
    "behavior intervention plan",
    "BIP generator",
    "BCBA tools",
    "behavior plan template",
    "functional behavior assessment",
    "special education tools",
    "school BCBA",
    "behavior support plan",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "FBA to BIP Generator | Free Behavior Intervention Plan Builder",
    description:
      "Turn your FBA data into a complete, evidence-based Behavior Intervention Plan. Free tool for BCBAs and special educators.",
    url: pageUrl,
    images: [
      {
        url: `${baseUrl}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "FBA to BIP Generator by Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FBA to BIP Generator | Free Behavior Intervention Plan Builder",
    description:
      "Turn your FBA data into a complete, evidence-based Behavior Intervention Plan. Free tool for BCBAs and special educators.",
    images: [`${baseUrl}/og-image.webp`],
  },
};

export default function FBAToBIPPage() {
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
            { label: "FBA to BIP Generator" },
          ]}
        />
      </div>

      <article className="container mx-auto px-6 pb-16 pt-8">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_1.2fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              FBA → BIP
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Turn your FBA into a complete Behavior Intervention Plan
              </h1>
              <p className="text-base text-slate-600">
                Stop staring at blank BIP templates. Enter your FBA data and get a professional, evidence-based Behavior Intervention Plan with function-matched strategies in minutes.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Function-matched strategies",
                "Antecedent, teaching & consequence plans",
                "Data collection plan included",
                "Crisis/safety plan when needed",
                "Print-ready PDF output",
                "Built for BCBAs & special educators",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-700">
                  <span className="mt-0.5 text-emerald-600">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">How it works</p>
              <p>Enter student info, define target behaviors, identify antecedents and consequences, select the function of behavior, add replacement behaviors, and generate a complete BIP.</p>
            </div>
          </div>

          <FBAToBIPWizard />
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]" aria-labelledby="fba-to-bip-what">
          <div className="space-y-4">
            <h2 id="fba-to-bip-what" className="text-2xl font-semibold text-slate-900">
              What is the FBA to BIP Generator?
            </h2>
            <p className="text-base text-slate-600">
              The FBA to BIP Generator is a free tool that transforms your Functional Behavior Assessment data into a comprehensive Behavior Intervention Plan. It matches evidence-based strategies to the identified function of behavior, so your BIP is grounded in ABA principles from the start.
            </p>
            <p className="text-base text-slate-600">
              Every BIP includes operational behavior definitions, a function summary, antecedent/prevention strategies, teaching strategies for replacement behaviors, reinforcement and response strategies, a data collection plan, and generalization and maintenance plans.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6">
            <h3 className="text-lg font-semibold text-emerald-900">What&apos;s included in your BIP</h3>
            <ul className="mt-3 space-y-2 text-sm text-emerald-900/90">
              <li>✓ Target Behavior for Reduction (with precursors &amp; triggers)</li>
              <li>✓ Baseline for Problem Behavior</li>
              <li>✓ Function of Behavior (to get / to avoid / sensory)</li>
              <li>✓ Replacement Behavior &amp; Baseline</li>
              <li>✓ Antecedent Interventions</li>
              <li>✓ Reinforcement Procedures</li>
              <li>✓ Consequence Interventions</li>
              <li>✓ Data Collection Matrix</li>
              <li>✓ Criteria for Success &amp; Goals</li>
              <li>✓ Crisis/Safety Plan (when applicable)</li>
            </ul>
          </div>
        </section>

        <section className="mt-14 space-y-6" aria-labelledby="fba-to-bip-why">
          <h2 id="fba-to-bip-why" className="text-2xl font-semibold text-slate-900">
            Why use an FBA to BIP Generator?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Save hours of writing time",
                description: "A complete BIP can take 2-4 hours to write from scratch. This tool generates a professional draft in minutes that you can customize for the student.",
              },
              {
                title: "Function-matched strategies",
                description: "Strategies are automatically matched to the identified function — attention, escape, tangible, or sensory — so your interventions are aligned from the start.",
              },
              {
                title: "Nothing falls through the cracks",
                description: "The structured format ensures every section is addressed: prevention, teaching, reinforcement, response, data collection, generalization, and maintenance.",
              },
              {
                title: "Research-aligned best practices",
                description: "All strategies are based on applied behavior analysis research and school-based behavior support best practices.",
              },
              {
                title: "Professional, print-ready output",
                description: "Copy the BIP text, print it, or save as PDF. The output is formatted for team meetings and IEP documentation.",
              },
              {
                title: "Free for educators",
                description: "No subscription, no credit card, no hidden costs. Built by Behavior School to support school-based behavior professionals.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="fba-to-bip-faq">
          <h2 id="fba-to-bip-faq" className="text-2xl font-semibold text-slate-900">
            FBA to BIP Generator FAQ
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

        <section className="mt-12" aria-labelledby="fba-to-bip-share">
          <h2 id="fba-to-bip-share" className="text-2xl font-semibold text-slate-900">
            Share this tool
          </h2>
          <ShareButtons title="FBA to BIP Generator" url={pageUrl} className="mt-4" />
        </section>
      </article>
    </main>
  );
}
