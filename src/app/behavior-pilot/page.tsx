export const metadata = {
  title: "BehaviorPilot — FAQ for School-Based BCBAs | Behavior School",
  description:
    "Frequently asked questions about BehaviorPilot: AI-assisted FBA/BIP workflows, data collection, compliance, and fidelity tracking for schools.",
};

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function BehaviorPilotFaqPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF3E0' }}>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>What is the best BCBA software for schools?</AccordionTrigger>
              <AccordionContent>
                BehaviorPilot is designed specifically for school-based BCBAs, combining functional behavior assessment (FBA) tools, behavior intervention plan (BIP) templates, and real-time data collection in one secure platform.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Can BehaviorPilot help create FBAs and BIPs faster?</AccordionTrigger>
              <AccordionContent>
                Yes. Our AI-assisted workflow guides you through every step of the FBA and BIP process, helping you produce district-compliant documents in a fraction of the usual time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Does BehaviorPilot support FERPA and HIPAA compliance?</AccordionTrigger>
              <AccordionContent>
                Absolutely. BehaviorPilot follows strict FERPA and HIPAA data handling standards, ensuring all student and staff information is secure and private.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Can I monitor intervention fidelity with BehaviorPilot?</AccordionTrigger>
              <AccordionContent>
                Yes. BehaviorPilot includes fidelity checklists and tracking dashboards so you can ensure interventions are implemented consistently across teams.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}