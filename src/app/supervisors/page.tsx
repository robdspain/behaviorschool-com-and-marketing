"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";

export default function SupervisorsPage() {
  const [showPopup, setShowPopup] = useState(false);

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
            <Button 
              size="lg" 
              className="bg-white text-slate-900 hover:bg-slate-100"
              onClick={() => setShowPopup(true)}
            >
              Join the Waitlist
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
              <AccordionTrigger>Are the exported supervision records BACB audit-ready?</AccordionTrigger>
              <AccordionContent>Yes. All supervision logs include detailed timestamps, digital signatures, role attestations, and compliance documentation specifically designed for BACB audits. Our export formats meet professional standards and regulatory requirements.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Does the platform support both RBT and BCaBA supervision?</AccordionTrigger>
              <AccordionContent>Yes. Our supervision platform is designed for all levels of behavior analyst supervision, including RBT supervision by BCBAs, BCaBA supervision, and BCBA-to-BCBA mentoring relationships with appropriate competency frameworks for each level.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How does the digital signature feature work for supervision documentation?</AccordionTrigger>
              <AccordionContent>Our digital signature system uses secure, legally-binding electronic signatures that meet industry standards. Both supervisors and supervisees can sign documents remotely, with automatic timestamp and identity verification for complete audit trails.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Email Signup Popup */}
      <EmailSignupPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="Join the Supervision Tools Waitlist"
        description="Be the first to know when our comprehensive BCBA supervision platform launches. Get early access and priority onboarding."
        pageSource="supervisors"
      />
    </div>
  );
}


