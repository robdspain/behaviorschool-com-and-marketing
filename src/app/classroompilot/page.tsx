import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = {
  title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
  description:
    "Special education software for teachers to plan IEP-aligned lessons, track student progress, document accommodations, and generate compliant reports quickly — all in one AI-driven workspace.",
};

export default function ClassroomPilotPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF3E0' }}>
      <section className="relative overflow-hidden" style={{ backgroundColor: '#1F4D3F' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software</h1>
          <p className="mt-4 text-lg text-slate-200 max-w-3xl mx-auto">Special education software for teachers to plan IEP-aligned lessons, track student progress, document accommodations, and generate compliant reports quickly — all in one AI-driven workspace.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>How does ClassroomPilot support IEP goal tracking and progress monitoring?</AccordionTrigger>
              <AccordionContent>ClassroomPilot streamlines IEP goal tracking with clear targets, scheduled probes, and progress monitoring graphs that update automatically from teacher-entered data.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Can teachers document accommodations and modifications?</AccordionTrigger>
              <AccordionContent>Yes. Document accommodations and modifications alongside lesson plans, then quickly reference them during instruction and reporting.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Does ClassroomPilot generate compliant IEP reports?</AccordionTrigger>
              <AccordionContent>It helps produce compliant reports with consistent templates, goal‑aligned evidence, and clear summaries you can share with teams and families.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Is ClassroomPilot designed for special education teachers?</AccordionTrigger>
              <AccordionContent>ClassroomPilot is special education software built for classrooms—fast to use during instruction, and robust enough for audits and reviews.</AccordionContent>
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
              name: "How does ClassroomPilot support IEP goal tracking and progress monitoring?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "ClassroomPilot streamlines IEP goal tracking with clear targets, scheduled probes, and progress monitoring graphs that update automatically from teacher-entered data.",
              },
            },
            {
              "@type": "Question",
              name: "Can teachers document accommodations and modifications?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Document accommodations and modifications alongside lesson plans, then quickly reference them during instruction and reporting.",
              },
            },
            {
              "@type": "Question",
              name: "Does ClassroomPilot generate compliant IEP reports?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "It helps produce compliant reports with consistent templates, goal‑aligned evidence, and clear summaries you can share with teams and families.",
              },
            },
            {
              "@type": "Question",
              name: "Is ClassroomPilot designed for special education teachers?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "ClassroomPilot is special education software built for classrooms—fast to use during instruction, and robust enough for audits and reviews.",
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