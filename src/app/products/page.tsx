import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ProductCards } from "./ProductCards";
import { FeatureHighlights } from "./FeatureHighlights";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BCBA Tools & Software | Behavior Analysis Products | Behavior School",
  description: "Comprehensive behavior analysis tools for school-based BCBAs. AI-powered BCBA exam prep, supervision management software, and RBT training tools designed for educational settings.",
  keywords: [
    "BCBA tools",
    "behavior analysis software",
    "BCBA exam prep tools",
    "RBT supervision software",
    "school-based BCBA tools",
    "behavior analyst products",
    "BACB compliance software",
    "behavior analysis technology",
    "BCBA certification tools",
    "educational behavior tools"
  ],
  openGraph: {
    title: "BCBA Tools & Software | Behavior School",
    description: "Comprehensive behavior analysis tools for school-based BCBAs. From exam prep to supervision management.",
    type: "website",
  },
};

export default function ProductsPage() {
  return (
    <div className="relative overflow-hidden">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 select-none">
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
      </div>

      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Behavior Analysis Tools for School-Based BCBAs
          </h1>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
            Comprehensive BCBA tools designed for education settings. From BCBA exam prep to supervision management—build 
            structured systems for student success, streamline RBT training, and grow your behavior analysis practice with confidence.
          </p>
        </div>

        <ProductCards />
      </section>

      {/* Problem/Solution Section */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Why School-Based BCBAs Choose Our Behavior Analysis Tools
          </h2>
          <p className="mt-3 text-slate-600 max-w-3xl mx-auto">
            Built by behavior analysts for behavior analysts. Our tools address the unique challenges of 
            school-based practice—from managing large caseloads to ensuring BACB compliance.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-2xl bg-slate-50 p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">The Challenge</h3>
            <p className="text-slate-700 mb-4">
              School-based BCBAs face unique pressures: managing multiple RBT supervisees, tracking student behavior data, 
              preparing for certification exams, and maintaining compliance—all while supporting classroom teams.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li>• Time-consuming manual documentation</li>
              <li>• Difficulty tracking supervision hours</li>
              <li>• Limited exam prep resources for busy professionals</li>
              <li>• Compliance risks from incomplete records</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Our Solution</h3>
            <p className="text-slate-700 mb-4">
              Purpose-built tools that automate administrative tasks, enhance learning efficiency, and ensure 
              defensible documentation—giving you more time to focus on what matters: student outcomes.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li>• Automated supervision documentation</li>
              <li>• AI-powered adaptive exam prep</li>
              <li>• BACB-compliant record keeping</li>
              <li>• Intelligent analytics and insights</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Highlights similar to feature showcase */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Why Behavior Analysis Teams Choose Behavior School
          </h2>
          <p className="mt-3 text-slate-600 max-w-3xl mx-auto">
            Practical BCBA tools and workflows designed for real educational settings—fast to adopt, 
            easy to implement, proven to deliver results.
          </p>
        </div>
        <FeatureHighlights />
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-6 lg:px-8 pb-20">
        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
          Frequently Asked Questions About Our BCBA Tools
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>What behavior analysis tools does Behavior School offer?</AccordionTrigger>
            <AccordionContent>
              Behavior School provides two main product lines for BCBAs and behavior analysts: (1) BCBA Exam Prep Tools 
              featuring AI-powered adaptive practice tests, personalized study plans, and performance analytics to help 
              you pass certification exams, and (2) BCBA Supervision Tools for managing RBT training, tracking supervision 
              hours, documenting competencies, and maintaining BACB compliance. Both tools are designed specifically for 
              school-based behavior analysts and educational settings.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>How do these tools help with BACB compliance and documentation?</AccordionTrigger>
            <AccordionContent>
              Our supervision tools generate BACB-compliant documentation automatically, including timestamped supervision 
              logs, digital signatures, competency assessments, and hour tracking (restricted/unrestricted). All records 
              are audit-ready and exportable in formats accepted by the BACB. The platform ensures you meet current 
              supervision standards and maintains defensible documentation for certification applications and audits.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>Can school districts use these tools for multiple BCBAs and RBTs?</AccordionTrigger>
            <AccordionContent>
              Yes! Our tools scale from individual BCBAs to large school districts with multiple behavior analysts and 
              RBT teams. Districts can standardize supervision practices, monitor compliance across sites, track exam 
              prep progress for new hires, and maintain centralized oversight of all behavior analysis activities. 
              Volume pricing and district partnerships are available for larger implementations.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>What makes these tools different from generic behavior tracking apps?</AccordionTrigger>
            <AccordionContent>
              Unlike generic apps, Behavior School tools are built specifically for school-based BCBAs by practicing 
              behavior analysts who understand educational settings. Our tools integrate with existing school systems, 
              address classroom-specific challenges, and follow evidence-based practices from behavior science research. 
              The AI-powered features adapt to individual learning needs while maintaining the rigor required for 
              professional certification and compliance.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/study">Start BCBA Exam Prep</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/supervisors">Explore Supervision Tools</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}


