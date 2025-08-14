import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "School Behavior Data Tools & BCBA Training | Behavior School",
  description:
    "Evidence-based behavior analysis tools for schools, BCBA exam prep, and virtual supervision systems. Functional behavior assessments, data collection, and training designed for K-12 education.",
  keywords: [
    "school behavior data tool",
    "BCBA exam prep",
    "virtual BCBA supervision", 
    "functional behavior assessment",
    "behavior intervention plan",
    "school behavior tracking",
    "RBT supervision tools",
    "behavior analysis training",
    "K-12 behavior support",
    "educational behavior analytics",
    "student behavior management",
    "behavior data collection"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "School Behavior Data Tools & BCBA Training | Behavior School",
    description:
      "Evidence-based behavior analysis tools for schools, BCBA exam prep, and virtual supervision systems. Functional behavior assessments, data collection, and training designed for K-12 education.",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Behavior School - Evidence-based behavior analysis tools for schools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "School Behavior Data Tools & BCBA Training | Behavior School",
    description:
      "Evidence-based behavior analysis tools for schools, BCBA exam prep, and virtual supervision systems. Functional behavior assessments, data collection, and training designed for K-12 education.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Footer from "@/components/ui/Footer";
import { Hero } from "@/components/ui/hero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      <Hero
        variant="brand"
        eyebrow="Behavior School"
        title="School Behavior Data Tools &"
        highlight="BCBA Training Solutions"
        subtitle="Evidence-based behavior analysis tools for schools, BCBA exam preparation, and virtual supervision systems. Transform functional behavior assessments and data collection in K-12 education."
        primaryCta={{ href: "/subscribe", label: "Join the Community" }}
        secondaryCta={{ href: "/products", label: "Explore Tools" }}
      />

      {/* Section 1 – What We Do */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Evidence-Based School Behavior Solutions</h2>
            <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
              Comprehensive behavior analysis tools designed specifically for K-12 educational environments
            </p>
          </div>
          <div className="mx-auto max-w-3xl text-slate-700 space-y-6">
            <p>
              Behavior School delivers practical school behavior data tools and BCBA training solutions built for the realities of working in education. Our evidence-based platform provides:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Functional behavior assessment (FBA) templates and workflows optimized for school settings</li>
              <li>Behavior intervention plan (BIP) development and tracking systems</li>
              <li>Real-time behavior data collection tools that integrate with classroom routines</li>
              <li>Professional development and BCBA exam preparation designed for busy school teams</li>
              <li>Virtual supervision tools for RBT and BCBA supervision compliance</li>
            </ul>
            <p>
              Whether you're implementing a new behavior support program or enhancing existing interventions, our research-backed tools are field-tested and ready to improve student outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 – For BCBAs & Behavior Teams */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">From Behavior Assessment to Implementation</h2>
            <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
              Complete behavior analysis workflow solutions for school-based BCBAs and behavior specialists
            </p>
          </div>
          <div className="mx-auto max-w-3xl text-slate-700 space-y-6">
            <p>Our comprehensive behavior analysis platform supports the entire intervention process:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Functional Behavior Assessments (FBA) with school-specific data collection protocols</li>
              <li>Behavior Intervention Plan (BIP) development with evidence-based strategy libraries</li>
              <li>Student behavior tracking systems that seamlessly integrate into daily classroom operations</li>
              <li>Progress monitoring dashboards with visual analytics for data-driven decision making</li>
              <li>Virtual BCBA supervision tools with automated documentation and compliance tracking</li>
              <li>Professional development modules covering applied behavior analysis in educational settings</li>
            </ul>
            <p>Every behavior data tool and training resource we offer is designed to save time, ensure compliance, and measurably improve student behavioral outcomes in K-12 environments.</p>
          </div>
        </div>
      </section>

      {/* Section 3 – Join the Community */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">BCBA Training & Professional Collaboration</h2>
            <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
              Join a network of behavior analysts, educators, and leaders transforming school behavior support systems
            </p>
          </div>
          <div className="mx-auto max-w-3xl text-slate-700 space-y-6">
            <p>
              Beyond providing school behavior data tools, we're building a professional community of behavior analysts, special education teachers, and school leaders committed to evidence-based practice in educational settings.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Connect with certified BCBAs and behavior specialists working in K-12 schools</li>
              <li>Access collaborative problem-solving forums for complex behavior cases</li>
              <li>Share proven intervention strategies and behavior data collection methods</li>
              <li>Participate in virtual supervision groups and professional development webinars</li>
              <li>Stay current with behavior analysis research and best practices in education</li>
            </ul>
            <div className="pt-2 flex gap-4 flex-wrap">
              <Button asChild size="lg" className="h-12 px-6 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                <a href="https://community.behaviorschool.com" target="_blank" rel="noopener noreferrer">
                  Join the Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base font-semibold rounded-xl">
                <a href="/study">
                  BCBA Exam Prep
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base font-semibold rounded-xl">
                <a href="/supervisors">
                  Supervision Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600 mt-4">
              Common questions about our school behavior data tools and BCBA training solutions
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="faq1" className="bg-white rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                What makes Behavior School's behavior data tools different from other school behavior tracking systems?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Our school behavior data tools are specifically designed by experienced school-based BCBAs for K-12 educational environments. Unlike generic behavior tracking apps, our platform integrates functional behavior assessments, behavior intervention plans, and data collection workflows that align with IEP requirements and school district protocols. We focus on evidence-based practices that actually work in real classrooms.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq2" className="bg-white rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                How does virtual BCBA supervision work with your platform?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Our virtual BCBA supervision tools provide comprehensive tracking for both restricted and unrestricted supervision hours, digital signature capabilities, and automated documentation that meets BACB compliance requirements. The platform includes competency matrices, session templates, and progress monitoring specifically designed for RBT supervision and BCBA supervision in school settings.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq3" className="bg-white rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                Can your BCBA exam prep tools help with both initial certification and recertification requirements?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Yes! Our BCBA exam preparation platform includes adaptive practice tests, comprehensive study materials covering all BACB task list items, and continuing education resources. The AI-powered system identifies knowledge gaps and provides targeted practice to improve exam readiness. We also offer professional development modules that can count toward BACB continuing education requirements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq4" className="bg-white rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                How do your functional behavior assessment tools integrate with existing school data systems?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Our functional behavior assessment (FBA) and behavior intervention plan (BIP) tools are designed to complement existing student information systems and IEP platforms. We provide export capabilities for seamless integration with district databases, and our behavior data collection methods align with special education documentation requirements while maintaining FERPA compliance for student privacy.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      
      {/* Structured data (WebPage + Breadcrumbs) */}
      {(() => {
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
        const webPageJsonLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "School Behavior Data Tools & BCBA Training | Behavior School",
          url: SITE_URL,
          description:
            "Evidence-based behavior analysis tools for schools, BCBA exam prep, and virtual supervision systems. Functional behavior assessments, data collection, and training designed for K-12 education.",
          isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Behavior School" },
          mainEntity: {
            "@type": "Organization",
            name: "Behavior School",
            description: "Evidence-based behavior analysis tools and training for K-12 education",
            url: SITE_URL
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
          ],
        } as const;
        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
          </>
        );
      })()}

      <Footer />
    </div>
  );
}