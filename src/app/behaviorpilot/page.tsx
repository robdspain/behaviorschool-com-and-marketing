import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { Hero } from "@/components/ui/hero";

export const metadata: Metadata = {
  title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
  description:
    "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking. Create, collect, and report with speed and fidelity.",
  alternates: { canonical: "/behaviorpilot" },
  openGraph: {
    type: "website",
    title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
    description:
      "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking. Create, collect, and report with speed and fidelity.",
    url: "/behaviorpilot",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BehaviorPilot by Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
    description:
      "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking. Create, collect, and report with speed and fidelity.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function BehaviorPilotPage() {
  const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best BCBA software for schools?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "BehaviorPilot is designed specifically for School-Based BCBA workflows. It combines behavior analyst software for FBAs, BIPs, and special education data tracking with audit-ready reports and fidelity monitoring, making it a top choice for school teams.",
        },
      },
      {
        "@type": "Question",
        name: "How to create a Behavior Intervention Plan fast?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Use BehaviorPilot’s behavior plan generator with FBA and BIP templates. Import assessment results, select evidence-based strategies, and export a complete Behavior Intervention Plan in minutes while maintaining clinical quality.",
        },
      },
    ],
  } as const;

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BehaviorPilot",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/behaviorpilot`,
    description:
      "AI-powered BCBA software for school-based behavior analysis: FBA and BIP templates, BCBA data collection tools, and fidelity monitoring.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
    },
    keywords:
      "behavior analyst software, BCBA data collection tool, FBA and BIP templates, school-based behavior analysis software, behavior intervention plan tool, functional behavior assessment app, special education data tracking, behavior plan generator, fidelity monitoring",
  } as const;

  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      <Hero
        variant="brand"
        eyebrow="BehaviorPilot (BCBA OS)"
        title="BCBA Software for"
        highlight="FBAs, BIPs & Data Collection"
        subtitle="AI-powered behavior analyst software built for School-Based BCBA teams. Create FBAs, generate BIPs, and run school‑day data collection with speed and fidelity."
        primaryCta={{ href: "/subscribe", label: "Join Waitlist" }}
      />

      {/* Key value props with target keywords */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Built for School Teams</h2>
            <p className="mt-4 text-slate-700 max-w-3xl mx-auto">
              BehaviorPilot is a school-based behavior analysis software platform that helps every Behavior Analyst on your team move faster without sacrificing quality.
              Designed with and for School-Based BCBA professionals, it streamlines assessment, planning, data collection, and fidelity monitoring.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">FBA & BIP Templates</h3>
              <p className="mt-2 text-slate-700">Opinionated, editable templates for Functional Behavior Assessment and Behavior Intervention Plan workflows with clear prompts and exemplars.</p>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">BCBA Data Collection Tool</h3>
              <p className="mt-2 text-slate-700">Simple, reliable data collection across frequency, duration, ABC, and interval systems—optimized for the school day and special education data tracking.</p>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Behavior Plan Generator</h3>
              <p className="mt-2 text-slate-700">Generate high‑quality BIPs from your FBA in minutes. Export to district formats and ensure intervention integrity with built‑in fidelity checks.</p>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Functional Behavior Assessment App</h3>
              <p className="mt-2 text-slate-700">Guide teams through hypothesis development, competing pathways, and testable intervention logic rooted in behavioral science.</p>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Fidelity Monitoring</h3>
              <p className="mt-2 text-slate-700">Track implementation, visualize adherence, and coach effectively with actionable alerts—across classrooms, programs, and campuses.</p>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">School‑Based Reporting</h3>
              <p className="mt-2 text-slate-700">Audit‑ready exports and progress summaries that fit IEP and district documentation requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Why BehaviorPilot vs. Paper/Excel and Generic Tools</h2>
            <p className="mt-4 text-slate-700 max-w-3xl mx-auto">See how BehaviorPilot compares on speed, fidelity, and outcomes.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-900">
                <tr>
                  <th className="px-4 py-3">Feature</th>
                  <th className="px-4 py-3">Paper/Excel</th>
                  <th className="px-4 py-3">Generic Competitor</th>
                  <th className="px-4 py-3">BehaviorPilot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3">FBA & BIP templates</td>
                  <td className="px-4 py-3">Manual setup</td>
                  <td className="px-4 py-3">Basic templates</td>
                  <td className="px-4 py-3">Evidence‑based, school‑ready flows</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">BCBA data collection tool</td>
                  <td className="px-4 py-3">Inconsistent, delayed</td>
                  <td className="px-4 py-3">Limited modalities</td>
                  <td className="px-4 py-3">Multiple modalities + realtime charts</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Behavior intervention plan tool</td>
                  <td className="px-4 py-3">Time‑consuming</td>
                  <td className="px-4 py-3">Semi‑automated</td>
                  <td className="px-4 py-3">Fast generator with export options</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Special education data tracking</td>
                  <td className="px-4 py-3">Scattered files</td>
                  <td className="px-4 py-3">Partial coverage</td>
                  <td className="px-4 py-3">Centralized and audit‑ready</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Fidelity monitoring</td>
                  <td className="px-4 py-3">Not tracked</td>
                  <td className="px-4 py-3">Manual checks</td>
                  <td className="px-4 py-3">Automated prompts and coaching views</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">BehaviorPilot FAQs</h2>
            <p className="mt-3 text-slate-700 max-w-3xl mx-auto">Answers to common questions from School-Based BCBA teams and every Behavior Analyst supporting schools.</p>
          </div>
          <div className="mx-auto max-w-3xl divide-y divide-slate-200">
            <div className="py-6">
              <h3 className="text-lg font-semibold text-slate-900">What is the best BCBA software for schools?</h3>
              <p className="mt-2 text-slate-700">BehaviorPilot is purpose‑built for school contexts. It combines behavior analyst software, a functional behavior assessment app, and school‑ready BIP workflows with strong reporting and fidelity monitoring. Districts choose it to standardize quality while saving time.</p>
            </div>
            <div className="py-6">
              <h3 className="text-lg font-semibold text-slate-900">How to create a Behavior Intervention Plan fast?</h3>
              <p className="mt-2 text-slate-700">Start with an FBA using guided prompts, then use the behavior plan generator to translate functions to matched interventions. Customize strategies, add environmental supports, and export a complete BIP in minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />

      <Footer />
    </div>
  );
}