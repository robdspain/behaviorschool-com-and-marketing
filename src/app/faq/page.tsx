import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "TierPath FAQ | Behavior School",
  description:
    "Frequently asked questions about TierPath — MTSS, PBIS tracking, universal screening, and fidelity checks.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "What is the best MTSS software for schools?",
      a:
        "TierPath streamlines multi-tiered systems of support (MTSS) by centralizing Tier 1–3 interventions, PBIS tracking, and progress monitoring into one platform.",
    },
    {
      q: "Can TierPath help track PBIS interventions?",
      a:
        "Yes. TierPath includes built-in PBIS tracking, from Check-In/Check-Out (CICO) to Tier 3 intervention fidelity, with easy-to-read dashboards.",
    },
    {
      q: "Does TierPath support universal screening?",
      a:
        "Absolutely. TierPath includes a universal screening module with risk flagging so you can identify students in need of additional support early.",
    },
    {
      q: "How does TierPath help with fidelity checks?",
      a:
        "TierPath tracks implementation fidelity at all tiers, giving district leaders and coaches the data they need to improve program consistency.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } as const;

  return (
    <section aria-labelledby="faq-heading" className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <header className="mb-10 text-center">
        <h1 id="faq-heading" className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto">
          Answers to common questions about TierPath and MTSS.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {faqs.map((item) => (
          <Card key={item.q} className="rounded-2xl border-0 bg-white shadow-feature">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{item.q}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-slate-700">{item.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}