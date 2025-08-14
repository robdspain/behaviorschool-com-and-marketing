import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "ClassroomPilot FAQ — IEP Goal Tracking & Progress Monitoring",
  description:
    "Answers to common questions about ClassroomPilot: IEP goal tracking, progress monitoring, accommodations, and collaboration tools.",
  alternates: { canonical: "/classroom-pilot/faq" },
};

export default function ClassroomPilotFaqPage() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>
              What is the best IEP goal tracking software for teachers?
            </AccordionTrigger>
            <AccordionContent>
              ClassroomPilot helps special education teachers track IEP goals, monitor student progress, and generate reports — all in a single, user-friendly platform.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>
              Can ClassroomPilot help with IEP progress monitoring?
            </AccordionTrigger>
            <AccordionContent>
              Yes. The platform lets you log progress in real time, view trends, and create parent- and admin-friendly reports instantly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>
              Does ClassroomPilot work for tracking accommodations?
            </AccordionTrigger>
            <AccordionContent>
              Absolutely. ClassroomPilot includes tools for documenting accommodations and modifications, ensuring IDEA compliance and easy reporting.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>
              Can ClassroomPilot improve collaboration with paras and service providers?
            </AccordionTrigger>
            <AccordionContent>
              Yes. You can share lesson plans, track shared student progress, and communicate updates with paraprofessionals and service providers securely.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}