import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import GhostNewsletterSignup from "@/components/ghost-newsletter-signup";

export const metadata = {
  title: "Behavior School Supervision Tools",
  description: "Plan, deliver, and document high‑quality BCBA supervision with automation and defensible records.",
};

export default function SupervisorsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF3E0' }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#1F4D3F' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">Coming Soon</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Supervision Tools for BCBAs</h1>
          <p className="mt-4 text-lg text-slate-200 max-w-2xl mx-auto">From competency tracking to signed hours logs—everything you need to run effective, compliant supervision in one place.</p>
          <div className="mt-8 flex items-center justify-center">
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              <Link href="https://study.behaviorschool.com/supervisors" target="_blank" rel="noopener noreferrer">Join the Waitlist</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key features */}
      <section id="features" className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            { title: 'Competency Matrix', desc: 'Map RBT/BCBA competencies, attach evidence, and verify with digital signatures.' },
            { title: 'Hours & Signatures', desc: 'Track restricted/unrestricted hours with built‑in attestations that export cleanly.' },
            { title: 'Session Templates', desc: 'Reusable supervision agendas, goals, and checklists for consistent high‑quality meetings.' },
            { title: 'Feedback & Goals', desc: 'Structured feedback loops and SMART goals with progress snapshots.' },
            { title: 'Automations', desc: 'Reminders, document requests, and task follow‑ups without the busywork.' },
            { title: 'Insights', desc: 'Dashboards for hours balance, competency coverage, and risks that need attention.' },
          ].map((f) => (
            <Card key={f.title} className="rounded-2xl border-0 shadow-feature bg-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>When will supervision tools be available?</AccordionTrigger>
              <AccordionContent>We are opening early access in waves. Join the waitlist to secure priority onboarding.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Can I import existing hours or competency records?</AccordionTrigger>
              <AccordionContent>Yes. CSV import and bulk evidence uploads are supported for fast migration.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Are exported records defensible for audits?</AccordionTrigger>
              <AccordionContent>All logs include timestamps, signatures, and role attestations designed for audit readiness.</AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-[#E3B23C] hover:bg-[#d9a42f] text-slate-900">
              <Link href="https://study.behaviorschool.com/supervisors" target="_blank" rel="noopener noreferrer">Join the Waitlist</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16" style={{ backgroundColor: '#FFF8EA' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Stay Informed About Supervision Tools</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Get updates on our supervision platform launch, plus weekly insights on effective BCBA supervision practices.</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
            <GhostNewsletterSignup
              title="Supervision Newsletter"
              description="Early access updates, supervision best practices, and resources for effective BCBA supervision."
              backgroundColor="#FFFFFF"
              textColor="#1F4D3F"
              buttonColor="#E3B23C"
              buttonTextColor="#FFFFFF"
              compact={true}
              className="mx-auto"
            />
          </div>
        </div>
      </section>
    </div>
  );
}


