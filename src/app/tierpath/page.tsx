import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = {
  title: "TierPath — MTSS & PBIS Software for Tiered Intervention Tracking",
  description:
    "Connect teams, track MTSS tiers, manage PBIS interventions, and monitor progress from universal screening to Tier 3 fidelity — all in a single, district-wide data system.",
};

export default function TierPathPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF3E0' }}>
      <section className="relative overflow-hidden" style={{ backgroundColor: '#1F4D3F' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">TierPath — MTSS & PBIS Software for Tiered Intervention Tracking</h1>
          <p className="mt-4 text-lg text-slate-200 max-w-3xl mx-auto">Connect teams, track MTSS tiers, manage PBIS interventions, and monitor progress from universal screening to Tier 3 fidelity — all in a single, district-wide data system.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>What is TierPath and how does it support MTSS and PBIS?</AccordionTrigger>
              <AccordionContent>TierPath is MTSS and PBIS software that aligns campus and district teams around data. Track universal supports, targeted interventions, and intensive plans in one place.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How does TierPath handle universal screening and tiered intervention tracking?</AccordionTrigger>
              <AccordionContent>Import or enter screening data, then assign students to tiers and document interventions with clear start dates, frequencies, and progress checks over time.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Can we monitor Tier 3 fidelity and document interventions?</AccordionTrigger>
              <AccordionContent>Yes. TierPath includes fidelity checklists, staff ownership, and evidence attachments so Tier 3 plans are implemented consistently and transparently.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Is TierPath built for district-wide collaboration?</AccordionTrigger>
              <AccordionContent>TierPath supports district-wide visibility with role-based access so school teams, coaches, and leaders can collaborate while keeping data secure.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {(() => {
        const faqJsonLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is TierPath and how does it support MTSS and PBIS?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "TierPath is MTSS and PBIS software that aligns campus and district teams around data. Track universal supports, targeted interventions, and intensive plans in one place.",
              },
            },
            {
              "@type": "Question",
              name: "How does TierPath handle universal screening and tiered intervention tracking?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Import or enter screening data, then assign students to tiers and document interventions with clear start dates, frequencies, and progress checks over time.",
              },
            },
            {
              "@type": "Question",
              name: "Can we monitor Tier 3 fidelity and document interventions?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. TierPath includes fidelity checklists, staff ownership, and evidence attachments so Tier 3 plans are implemented consistently and transparently.",
              },
            },
            {
              "@type": "Question",
              name: "Is TierPath built for district-wide collaboration?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "TierPath supports district-wide visibility with role-based access so school teams, coaches, and leaders can collaborate while keeping data secure.",
              },
            },
          ],
        } as const;
        return (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        );
      })()}
    </div>
  );
}