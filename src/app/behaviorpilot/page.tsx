import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = {
  title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
  description:
    "All-in-one school-based BCBA platform to create functional behavior assessments (FBAs), build behavior intervention plans (BIPs), and track progress with AI-powered data collection and fidelity monitoring.",
};

export default function BehaviorPilotPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF3E0' }}>
      <section className="relative overflow-hidden" style={{ backgroundColor: '#1F4D3F' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection</h1>
          <p className="mt-4 text-lg text-slate-200 max-w-3xl mx-auto">All-in-one school-based BCBA platform to create functional behavior assessments (FBAs), build behavior intervention plans (BIPs), and track progress with AI-powered data collection and fidelity monitoring.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>What is BehaviorPilot and how does it help with FBAs and BIPs?</AccordionTrigger>
              <AccordionContent>BehaviorPilot is BCBA software built for schools. Create functional behavior assessments (FBAs), turn results into defensible behavior intervention plans (BIPs), and keep everything aligned to student goals in one place.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Can BehaviorPilot collect ABC data and automate progress monitoring?</AccordionTrigger>
              <AccordionContent>Yes. Use mobile-friendly forms for ABC and frequency data collection, then view progress monitoring dashboards that summarize trends, rate changes, and next steps.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How does fidelity monitoring work for BIPs?</AccordionTrigger>
              <AccordionContent>Built-in fidelity monitoring lets teams document implementation steps, track adherence, and schedule quick fidelity checks so BIPs are delivered consistently across settings.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Is BehaviorPilot compliant with district privacy requirements?</AccordionTrigger>
              <AccordionContent>BehaviorPilot supports secure data collection and storage aligned with school privacy expectations (e.g., FERPA) and district policies, with role-based access for staff.</AccordionContent>
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
              name: "What is BehaviorPilot and how does it help with FBAs and BIPs?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "BehaviorPilot is BCBA software built for schools. Create functional behavior assessments (FBAs), turn results into defensible behavior intervention plans (BIPs), and keep everything aligned to student goals in one place.",
              },
            },
            {
              "@type": "Question",
              name: "Can BehaviorPilot collect ABC data and automate progress monitoring?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Use mobile-friendly forms for ABC and frequency data collection, then view progress monitoring dashboards that summarize trends, rate changes, and next steps.",
              },
            },
            {
              "@type": "Question",
              name: "How does fidelity monitoring work for BIPs?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Built-in fidelity monitoring lets teams document implementation steps, track adherence, and schedule quick fidelity checks so BIPs are delivered consistently across settings.",
              },
            },
            {
              "@type": "Question",
              name: "Is BehaviorPilot compliant with district privacy requirements?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "BehaviorPilot supports secure data collection and storage aligned with school privacy expectations (e.g., FERPA) and district policies, with role-based access for staff.",
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