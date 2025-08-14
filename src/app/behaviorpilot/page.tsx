import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
  description:
    "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking. Create, collect, and report with speed and fidelity.",
  alternates: { canonical: "/behaviorpilot" },
  robots: { index: true, follow: true },
  keywords: [
    "behavior analyst software",
    "BCBA data collection tool",
    "FBA and BIP templates",
    "school-based behavior analysis software",
    "behavior intervention plan tool",
    "functional behavior assessment app",
    "special education data tracking",
    "behavior plan generator",
    "fidelity monitoring",
  ],
  openGraph: {
    title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
    description:
      "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking. Create, collect, and report with speed and fidelity.",
    url: "/behaviorpilot",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Behavior School" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
    description:
      "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking. Create, collect, and report with speed and fidelity.",
    images: ["/og-image.png"],
  },
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
            "The best BCBA software for schools is built around school workflows, fast FBA/BIP authoring, reliable data collection, fidelity monitoring, and defensible reporting. BehaviorPilot focuses on School-Based BCBA teams with templates, integrations, and audit-ready exports.",
        },
      },
      {
        "@type": "Question",
        name: "How to create a Behavior Intervention Plan fast?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Use a behavior plan generator with prebuilt, research-aligned templates. BehaviorPilot guides you from FBA hypotheses to aligned BIP goals, strategies, and progress measures, then routes for signatures and implementation with fidelity checks.",
        },
      },
    ],
  } as const;

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BehaviorPilot",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/behaviorpilot`,
    description:
      "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking. Create, collect, and report with speed and fidelity.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      category: "FreeTrial",
    },
    publisher: { "@type": "Organization", name: "Behavior School", url: SITE_URL },
  } as const;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF3E0' }}>
      <section className="relative overflow-hidden" style={{ backgroundColor: '#1F4D3F' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="mb-4 flex items-center justify-center">
            <Badge className="bg-white/10 text-white border-white/20">BCBA OS</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection</h1>
          <p className="mt-4 text-lg text-slate-200 max-w-3xl mx-auto">
            BehaviorPilot is AI-powered behavior analyst software designed for the realities of schools. Built for
            <strong> School-Based BCBA </strong> teams and every <strong> Behavior Analyst </strong> supporting classrooms, it combines a functional behavior assessment app,
            a behavior intervention plan tool, and a BCBA data collection tool with fidelity monitoring and audit‑ready reports.
          </p>
          <p className="mt-3 text-slate-200 max-w-3xl mx-auto">
            Create FBAs and BIPs with research-aligned templates, streamline special education data tracking, and deploy
            school-based behavior analysis software that staff will actually use—fast and with confidence.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              <Link href="/contact">Request a demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#comparison">See comparison</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Built for School Workflows</h2>
            <p className="mt-2 text-slate-600 max-w-3xl mx-auto">Templates and tools that help every School-Based BCBA and Behavior Analyst move from assessment to action with speed and fidelity.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[ 
              { title: 'FBA Builder & Templates', desc: 'FBA and BIP templates streamline hypothesis statements, function-based strategies, and goals.' },
              { title: 'BIP Generator', desc: 'A behavior plan generator that aligns with FBA results and routes for approvals and signatures.' },
              { title: 'Data Collection', desc: 'A BCBA data collection tool for frequency, duration, interval, ABC, and IOA with offline-friendly capture.' },
              { title: 'Fidelity Monitoring', desc: 'Fidelity monitoring with checklists, prompts, and trends to support coaching and integrity.' },
              { title: 'Special Education Data Tracking', desc: 'Centralize special education data tracking across IEP goals, progress reports, and service logs.' },
              { title: 'School Integrations', desc: 'Export to district systems and share audit-ready documentation in clicks.' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="comparison" className="py-16" style={{ backgroundColor: '#FFF8EA' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="text-left text-slate-600 text-sm font-semibold px-4 py-2">Feature</th>
                  <th className="text-left text-slate-900 text-sm font-semibold px-4 py-2">BehaviorPilot</th>
                  <th className="text-left text-slate-900 text-sm font-semibold px-4 py-2">Paper/Excel</th>
                  <th className="text-left text-slate-900 text-sm font-semibold px-4 py-2">Typical Competitor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'FBA builder with templates', bp: 'yes', paper: 'no', comp: 'partial' },
                  { feature: 'BIP generator aligned to FBA', bp: 'yes', paper: 'no', comp: 'partial' },
                  { feature: 'Real-time data collection (web + mobile)', bp: 'yes', paper: 'no', comp: 'yes' },
                  { feature: 'Fidelity monitoring', bp: 'yes', paper: 'no', comp: 'partial' },
                  { feature: 'Progress reporting & exports', bp: 'yes', paper: 'partial', comp: 'yes' },
                  { feature: 'Signatures & audit trail', bp: 'yes', paper: 'no', comp: 'partial' },
                  { feature: 'School SIS/IEP integration', bp: 'partial', paper: 'no', comp: 'partial' },
                ].map((row) => (
                  <tr key={row.feature} className="bg-white">
                    <td className="px-4 py-3 text-slate-700">{row.feature}</td>
                    <td className="px-4 py-3">
                      {row.bp === 'yes' ? (
                        <span className="inline-flex items-center gap-2 text-emerald-700"><Check className="h-4 w-4" aria-hidden /><span className="sr-only">Yes</span>Yes</span>
                      ) : row.bp === 'partial' ? (
                        <span className="text-slate-700">Partial</span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-rose-600"><X className="h-4 w-4" aria-hidden /><span className="sr-only">No</span>No</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.paper === 'yes' ? (
                        <span className="inline-flex items-center gap-2 text-emerald-700"><Check className="h-4 w-4" aria-hidden /><span className="sr-only">Yes</span>Yes</span>
                      ) : row.paper === 'partial' ? (
                        <span className="text-slate-700">Partial</span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-rose-600"><X className="h-4 w-4" aria-hidden /><span className="sr-only">No</span>No</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.comp === 'yes' ? (
                        <span className="inline-flex items-center gap-2 text-emerald-700"><Check className="h-4 w-4" aria-hidden /><span className="sr-only">Yes</span>Yes</span>
                      ) : row.comp === 'partial' ? (
                        <span className="text-slate-700">Partial</span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-rose-600"><X className="h-4 w-4" aria-hidden /><span className="sr-only">No</span>No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>What is the best BCBA software for schools?</AccordionTrigger>
              <AccordionContent>
                The best solution supports school schedules, multiple classrooms, and district reporting. BehaviorPilot is built for School-Based BCBA teams, with streamlined FBA and BIP templates, reliable data collection, and fidelity monitoring so every Behavior Analyst can focus on students—not spreadsheets.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How to create a Behavior Intervention Plan fast?</AccordionTrigger>
              <AccordionContent>
                Start from an FBA. In BehaviorPilot, the behavior plan generator turns your hypotheses into aligned strategies, goals, data collection methods, and progress reports. Templates speed drafting, and routing captures approvals and signatures.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
    </div>
  );
}