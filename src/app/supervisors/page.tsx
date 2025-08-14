import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual BCBA Supervision Tools & RBT Management Platform | Behavior School",
  description: "Comprehensive virtual BCBA supervision tools for managing RBT supervision, tracking competencies, and maintaining BACB compliance. Digital documentation, hours tracking, and automated workflows for behavior analysts.",
  keywords: [
    "virtual BCBA supervision",
    "RBT supervision tools",
    "BCBA supervision platform",
    "behavior analyst supervision",
    "BACB compliance tracking",
    "virtual supervision software",
    "RBT competency tracking",
    "supervision hours management",
    "digital supervision documentation",
    "remote BCBA supervision",
    "behavior analyst management",
    "supervision workflow automation"
  ],
  alternates: { canonical: "/supervisors" },
  openGraph: {
    type: "website",
    title: "Virtual BCBA Supervision Tools & RBT Management Platform | Behavior School",
    description: "Comprehensive virtual BCBA supervision tools for managing RBT supervision, tracking competencies, and maintaining BACB compliance. Digital documentation, hours tracking, and automated workflows for behavior analysts.",
    url: "/supervisors",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Virtual BCBA Supervision Tools - Comprehensive platform for behavior analyst supervision and RBT management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual BCBA Supervision Tools & RBT Management Platform | Behavior School",
    description: "Comprehensive virtual BCBA supervision tools for managing RBT supervision, tracking competencies, and maintaining BACB compliance. Digital documentation, hours tracking, and automated workflows for behavior analysts.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
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
          <Badge className="bg-white/10 text-white border-white/20 mb-4">Virtual BCBA Supervision Platform</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Virtual BCBA Supervision Tools for Modern Behavior Analysts</h1>
          <p className="mt-4 text-lg text-slate-200 max-w-2xl mx-auto">
            Comprehensive virtual supervision platform for managing RBT supervision, tracking competencies, maintaining BACB compliance, and streamlining supervision workflows. Everything you need for effective behavior analyst supervision in one integrated system.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              <Link href="https://study.behaviorschool.com/supervisors" target="_blank" rel="noopener noreferrer">Join the Waitlist</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900">
              <Link href="/study">BCBA Exam Prep</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key features */}
      <section id="features" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Complete Virtual BCBA Supervision Solution</h2>
            <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
              Advanced supervision tools designed specifically for behavior analysts managing RBT supervision and maintaining BACB compliance standards
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: 'RBT Competency Matrix & Tracking', 
                desc: 'Comprehensive competency mapping for RBT and BCBA supervision with evidence attachment, progress tracking, and digital signature verification for BACB compliance.' 
              },
              { 
                title: 'Virtual Supervision Hours Management', 
                desc: 'Automated tracking of restricted and unrestricted supervision hours with built‑in attestations, digital documentation, and clean export functionality for audit readiness.' 
              },
              { 
                title: 'Supervision Session Templates & Workflows', 
                desc: 'Reusable supervision agendas, structured feedback forms, goal-setting templates, and automated follow-up systems for consistent, high‑quality virtual supervision meetings.' 
              },
              { 
                title: 'BACB Compliance & Documentation', 
                desc: 'Structured feedback loops, SMART goal tracking, progress snapshots, and comprehensive documentation systems designed to meet all BACB supervision requirements.' 
              },
              { 
                title: 'Supervision Workflow Automation', 
                desc: 'Smart reminders, automated document requests, task follow‑ups, and notification systems that eliminate administrative busywork for behavior analysts.' 
              },
              { 
                title: 'Virtual Supervision Analytics & Insights', 
                desc: 'Comprehensive dashboards showing supervision hours balance, competency coverage, risk identification, and performance metrics for data-driven supervision decisions.' 
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

      {/* Benefits Section */}
      <section className="py-16" style={{ backgroundColor: '#FFF8EA' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Our Virtual BCBA Supervision Platform</h2>
            <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
              Streamline your supervision practice with tools designed by experienced behavior analysts for modern virtual supervision needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900">For BCBA Supervisors</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Reduce administrative time with automated supervision workflows and documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Ensure BACB compliance with built-in supervision hour tracking and competency verification</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Manage multiple RBT supervisees efficiently with centralized virtual supervision tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Access real-time analytics and insights to optimize supervision effectiveness</span>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900">For RBTs & Supervisees</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Clear competency tracking with visual progress indicators and goal setting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Structured feedback and professional development planning for career growth</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Seamless virtual supervision experience with integrated video and documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Digital portfolio of supervision hours and competency achievements</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex gap-3 flex-wrap justify-center">
            <Button asChild size="lg" className="bg-[#E3B23C] hover:bg-[#d9a42f] text-slate-900">
              <Link href="https://study.behaviorschool.com/supervisors" target="_blank" rel="noopener noreferrer">Join the Waitlist</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Explore All Tools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Virtual BCBA Supervision FAQs</h2>
            <p className="text-lg text-slate-600 mt-4">
              Common questions about our virtual supervision platform and RBT management tools
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="q1" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                When will the virtual BCBA supervision tools be available for use?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                We are currently opening early access to our virtual BCBA supervision platform in waves to ensure quality and gather feedback. Join the waitlist to secure priority onboarding and be among the first behavior analysts to experience our comprehensive supervision management system. Early access participants will receive special pricing and direct input into platform development.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q2" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                Can I import existing supervision hours and competency records into the platform?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Yes! Our virtual supervision platform supports CSV import and bulk evidence uploads for fast migration of existing supervision data. You can easily transfer supervision hours, competency assessments, and historical documentation from spreadsheets or other systems. We also provide migration assistance to ensure a smooth transition to our BACB-compliant supervision management system.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                Are the exported supervision records defensible for BACB audits and compliance reviews?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Absolutely. All supervision logs include comprehensive timestamps, digital signatures, and role attestations specifically designed for BACB audit readiness. Our virtual supervision platform maintains detailed documentation trails, competency verification records, and supervision hour tracking that meet all BACB requirements. The system generates professional reports suitable for compliance reviews and certification maintenance.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q4" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                How does virtual BCBA supervision work compared to in-person supervision?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Our virtual supervision platform provides all the tools needed for effective remote supervision while maintaining BACB compliance standards. The system includes video conferencing integration, real-time competency tracking, digital observation forms, and collaborative goal-setting tools. Virtual supervision can be just as effective as in-person when supported by the right technology and structured workflows that our platform provides.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q5" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                Can the platform manage supervision for multiple RBTs and different competency levels?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Yes! Our virtual supervision platform is designed to efficiently manage multiple RBT supervisees with varying competency levels and supervision needs. The system provides individualized competency matrices, customizable supervision schedules, and automated tracking for each supervisee. BCBAs can easily monitor progress across their entire caseload while maintaining personalized supervision plans for each RBT.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q6" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                How does the platform integrate with existing behavior analysis practice management systems?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Our virtual BCBA supervision platform is designed to complement existing practice management systems through API integrations and data export capabilities. While the platform can function as a standalone supervision solution, it also integrates with common billing systems, client management platforms, and electronic health records. We provide technical support to help behavior analysts integrate supervision workflows with their existing practice infrastructure.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Structured Data */}
      {(() => {
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
        const webPageJsonLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Virtual BCBA Supervision Tools & RBT Management Platform | Behavior School",
          url: `${SITE_URL}/supervisors`,
          description: "Comprehensive virtual BCBA supervision tools for managing RBT supervision, tracking competencies, and maintaining BACB compliance. Digital documentation, hours tracking, and automated workflows for behavior analysts.",
          isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Behavior School" },
          mainEntity: {
            "@type": "SoftwareApplication",
            name: "Virtual BCBA Supervision Platform",
            description: "Comprehensive supervision management tools for behavior analysts",
            applicationCategory: "Professional Development Software",
            provider: {
              "@type": "Organization",
              name: "Behavior School",
              url: SITE_URL
            }
          }
        } as const;
        
        const breadcrumbJsonLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Supervision Tools",
              item: `${SITE_URL}/supervisors`,
            },
          ],
        } as const;

        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
          </>
        );
      })()}
    </div>
  );
}


