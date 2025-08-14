import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = {
  title: "BCBA Supervision Tools | RBT Training Management | Behavior School",
  description: "Streamline BCBA supervision with automated documentation, competency tracking, and defensible records. Manage RBT training, track supervision hours, and ensure BACB compliance.",
  keywords: [
    "BCBA supervision tools",
    "RBT supervision software",
    "behavior analyst supervision",
    "BACB supervision requirements",
    "supervision hours tracking",
    "RBT competency assessment",
    "BCBA fieldwork supervision",
    "supervision documentation",
    "behavior analysis training",
    "clinical supervision management"
  ],
  openGraph: {
    title: "BCBA Supervision Tools | Behavior School",
    description: "Plan, deliver, and document high-quality BCBA supervision with automation and defensible records for BACB compliance.",
    type: "website",
  },
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
          <Badge className="bg-white/10 text-white border-white/20 mb-4">BCBA Supervision Platform</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Streamline BCBA Supervision & RBT Training Management
          </h1>
          <p className="mt-4 text-lg text-slate-200 max-w-2xl mx-auto">
            Transform your BCBA supervision process with automated documentation, competency tracking, and BACB-compliant 
            records. From RBT training to fieldwork hours—manage effective supervision in one integrated platform.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              <Link href="https://study.behaviorschool.com/supervisors" target="_blank" rel="noopener noreferrer">Join the Waitlist</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <Link href="/study">Explore BCBA Exam Prep</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">The Challenge of BCBA Supervision</h2>
          <p className="text-lg text-slate-700 mb-8">
            Managing BCBA supervision and RBT training requires juggling multiple responsibilities: tracking supervision hours, 
            documenting competency assessments, maintaining BACB compliance, and providing meaningful feedback—all while 
            balancing your clinical caseload. Manual tracking systems lead to missed documentation and compliance risks.
          </p>
          <h3 className="text-2xl font-semibold text-slate-900 mb-4">Our Solution: Automated Supervision Management</h3>
          <p className="text-lg text-slate-700">
            Our BCBA supervision tools automate the administrative burden of supervision, allowing you to focus on mentoring. 
            Track restricted and unrestricted hours automatically, generate BACB-compliant documentation, and monitor 
            supervisee progress with intelligent dashboards that highlight areas needing attention.
          </p>
        </div>
      </section>

      {/* Key features */}
      <section id="features" className="py-16" style={{ backgroundColor: '#FAF3E0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Complete BCBA Supervision Management Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: 'RBT Competency Matrix', 
                desc: 'Track RBT and BCBA competency assessments with digital evidence attachments and supervisor signatures for BACB compliance.' 
              },
              { 
                title: 'Supervision Hours Tracking', 
                desc: 'Automatically log restricted and unrestricted supervision hours with built-in attestations that export cleanly for BACB submission.' 
              },
              { 
                title: 'Session Templates & Agendas', 
                desc: 'Create reusable supervision meeting templates, structured agendas, and checklists for consistent high-quality supervision delivery.' 
              },
              { 
                title: 'Feedback & Goal Management', 
                desc: 'Document structured feedback loops and track SMART goals with progress snapshots for effective supervisee development.' 
              },
              { 
                title: 'Automated Workflows', 
                desc: 'Set up automatic reminders for documentation, supervision meetings, and task follow-ups to eliminate administrative burden.' 
              },
              { 
                title: 'Supervision Analytics', 
                desc: 'Monitor supervision hours balance, competency coverage gaps, and identify at-risk supervisees with intelligent dashboards.' 
              },
            ].map((f) => (
              <Card key={f.title} className="rounded-2xl border-0 shadow-feature bg-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-600">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Who Benefits from BCBA Supervision Tools
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Individual BCBAs</h3>
              <p className="text-slate-700 mb-4">
                Manage your RBT supervision caseload efficiently with automated documentation and progress tracking. 
                Ensure BACB compliance while providing meaningful mentorship.
              </p>
              <ul className="space-y-2 text-slate-600">
                <li>• Track multiple supervisee hours simultaneously</li>
                <li>• Generate supervision contracts and attestations</li>
                <li>• Monitor competency completion rates</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Behavior Analysis Organizations</h3>
              <p className="text-slate-700 mb-4">
                Standardize supervision practices across your organization with consistent documentation and quality assurance. 
                Scale your training programs while maintaining compliance.
              </p>
              <ul className="space-y-2 text-slate-600">
                <li>• Centralized supervision oversight</li>
                <li>• Standardized competency assessments</li>
                <li>• Organization-wide compliance monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Complete Your Behavior Analysis Toolkit</h2>
          <p className="text-lg text-slate-600 mb-6">
            Combine supervision tools with exam prep for comprehensive professional development
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/study">BCBA Exam Prep Tools</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">BCBA Supervision Tools FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>When will BCBA supervision tools be available for my organization?</AccordionTrigger>
              <AccordionContent>
                We're launching our BCBA supervision platform in phases to ensure quality and reliability. Early access is opening 
                soon for select behavior analysis organizations and individual BCBAs. Join the waitlist to secure priority onboarding 
                and help shape features based on your supervision needs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Can I import existing RBT supervision hours and competency records?</AccordionTrigger>
              <AccordionContent>
                Yes! Our platform supports CSV import for bulk migration of existing supervision hours and competency assessments. 
                You can upload historical RBT training records, supervision logs, and evidence documentation. Our import wizard 
                maps your data to BACB requirements, ensuring seamless transition without losing valuable supervision history.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Are supervision records defensible for BACB audits and compliance?</AccordionTrigger>
              <AccordionContent>
                Absolutely. All supervision documentation includes timestamps, digital signatures, and role-based attestations 
                designed specifically for BACB audit requirements. Export comprehensive reports with supervisor credentials, 
                supervision dates, hour types (restricted/unrestricted), and competency evidence—everything needed for 
                defensible documentation during audits or certification applications.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How does the platform handle different supervision types (individual, group, remote)?</AccordionTrigger>
              <AccordionContent>
                Our supervision tools accommodate all BACB-approved supervision formats including individual, small group, and 
                remote supervision sessions. Configure supervision ratios, track participant attendance, and document supervision 
                modality for each session. The platform automatically calculates hour allocations based on supervision type and 
                ensures compliance with current BACB supervision standards.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-8 text-center">
            <Button asChild size="lg" className="bg-[#E3B23C] hover:bg-[#d9a42f] text-slate-900">
              <Link href="https://study.behaviorschool.com/supervisors" target="_blank" rel="noopener noreferrer">Join Supervision Waitlist</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}


