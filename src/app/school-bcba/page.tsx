import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "School BCBA: Tools, Guides, Jobs, and Training | Behavior School",
  description:
    "School BCBA hub: tools, job guides, salary insights & training. Build authority with practical systems, IEP generators & MTSS-aligned resources for school behavior analysts.",
  keywords: [
    "School BCBA",
    "school bcba jobs",
    "school bcba salary",
    "how to become a school bcba",
    "school-based bcba vs school bcba",
    "bcba in schools",
    "iep behavior goals",
    "behavior intervention plan",
    "mtss pbis",
  ],
  openGraph: {
    title: "School BCBA: Tools, Guides, Jobs, and Training | Behavior School",
    description:
      "Free School BCBA tools and guides: job paths, salary by state, interview prep, and IEP goal generator.",
    url: "https://behaviorschool.com/school-bcba",
    siteName: "Behavior School",
    images: [
      { url: "/optimized/og-image.webp", width: 1200, height: 630, alt: "School BCBA" },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://behaviorschool.com/school-bcba" },
  robots: { index: true, follow: true },
};

const crumbs = [
  { label: "Home", href: "/" },
  { label: "School BCBA" },
];

export default function SchoolBCBAHub() {
  return (
    <main className="min-h-screen bg-bs-background">
      <div className="container mx-auto px-6 pt-24 pb-4">
        <Breadcrumbs items={crumbs} />
      </div>

      {/* Hero */}
      <section className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          School BCBA Hub
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
          Your home for School BCBA tools, job guides, salary insights, and
          practical systems for real classrooms. Build authority and impact with
          MTSS- and PBIS-aligned workflows.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/iep-behavior-goals">Free IEP Goals Generator</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/school-based-bcba">School-Based BCBA Program</Link>
          </Button>
        </div>
      </section>

      {/* Key Guides */}
      <section className="container mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Start Here</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="School BCBA vs School-Based BCBA"
            desc="Clear the confusion and position your role using language districts search for."
            href="/school-bcba/vs-school-based-bcba"
          />
          <Card
            title="School BCBA Job Guide"
            desc="Roles, interview questions, resume keywords, and district expectations."
            href="/school-bcba/job-guide"
          />
          <Card
            title="School BCBA Salary by State"
            desc="Benchmark compensation and market demand with a state-by-state overview."
            href="/school-bcba/salary-by-state"
          />
          <Card
            title="How to Become a School BCBA"
            desc="Credentials, experience pathways, and school-specific competencies that matter."
            href="/school-bcba/how-to-become"
          />
          <Card
            title="ACT Matrix for School BCBAs"
            desc="A values-based framework that complements behavior analysis in schools."
            href="/the-act-matrix-a-framework-for-school-based-bcbas"
          />
          <Card
            title="Behavior Plan Writer"
            desc="Write stronger BIPs faster with guided workflows and exemplar language."
            href="/behavior-plans"
          />
        </div>
      </section>

      {/* Locations placeholder (intentionally no location pages live) */}
      <section className="container mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Locations</h2>
        <p className="text-slate-600">
          Localized School BCBA resources coming soon. Tell us which city/state you want first.
        </p>
      </section>

      {/* Lead Magnets */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Free School BCBA Tools</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <LMCard
            title="IEP Behavior Goals Generator"
            desc="Generate high‑quality, measurable behavior goals in minutes."
            href="/iep-behavior-goals"
          />
          <LMCard
            title="School BCBA Interview Kit"
            desc="Questions, scoring rubric, and scenario prompts for districts and candidates."
            href="/products" // Placeholder until dedicated page is created
          />
        </div>
      </section>

      {/* Structured Data - WebPage + BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "School BCBA Hub: Tools, Guides, Jobs, and Training",
            "description": "School BCBA hub with tools, job guides, salary insights, and step-by-step training. Build authority in schools with practical systems, IEP goal tools, and MTSS-aligned resources.",
            "url": "https://behaviorschool.com/school-bcba",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://behaviorschool.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "School BCBA",
                  "item": "https://behaviorschool.com/school-bcba"
                }
              ]
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "School BCBA Resources",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "School BCBA vs School-Based BCBA",
                  "url": "https://behaviorschool.com/school-bcba/vs-school-based-bcba"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "School BCBA Job Guide",
                  "url": "https://behaviorschool.com/school-bcba/job-guide"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "School BCBA Salary by State",
                  "url": "https://behaviorschool.com/school-bcba/salary-by-state"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "How to Become a School BCBA",
                  "url": "https://behaviorschool.com/school-bcba/how-to-become"
                }
              ]
            }
          })
        }}
      />
    </main>
  );
}

function Card({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="block group rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700">{title}</h3>
      <p className="text-slate-600 mt-2 text-sm">{desc}</p>
      <span className="inline-block mt-4 text-emerald-700 group-hover:underline">Explore →</span>
    </Link>
  );
}

function LMCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="block rounded-2xl border border-emerald-200 bg-emerald-50 p-6 hover:bg-emerald-100 transition">
      <h3 className="text-lg font-semibold text-emerald-900">{title}</h3>
      <p className="text-emerald-800 mt-2 text-sm">{desc}</p>
      <span className="inline-block mt-4 text-emerald-800 underline">Get it free</span>
    </Link>
  );
}
