import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Briefcase, DollarSign, GraduationCap, FileText, Users, BookOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "School-Based BCBA: Complete Career Guide, Jobs & Resources | Behavior School",
  description:
    "Everything you need as a school-based BCBA: job guides, salary data by state, career pathways, free tools, and practical training. Build your school BCBA career with confidence.",
  keywords: [
    "school-based BCBA",
    "school BCBA",
    "school bcba jobs",
    "school bcba salary",
    "how to become a school bcba",
    "bcba in schools",
    "iep behavior goals",
    "behavior intervention plan",
    "mtss pbis",
  ],
  openGraph: {
    title: "School-Based BCBA: Complete Career Guide & Resources | Behavior School",
    description:
      "Comprehensive school BCBA resources: job guides, salary insights, career pathways, free tools, and training for school-based behavior analysts.",
    url: "https://behaviorschool.com/school-bcba",
    siteName: "Behavior School",
    images: [
      { url: "/optimized/og-image.webp", width: 1200, height: 630, alt: "School BCBA Resources" },
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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-6 pt-24 pb-4">
        <Breadcrumbs items={crumbs} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 opacity-95"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(5, 150, 105, 0.3) 0%, transparent 50%)',
        }}></div>

        <div className="relative container mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-6 border border-white/30">
            <GraduationCap className="h-4 w-4 mr-2" />
            Complete School BCBA Resource Hub
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Everything You Need to <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Excel as a School-Based BCBA
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-emerald-50 max-w-4xl mx-auto mb-10 leading-relaxed">
            From getting your first school BCBA job to mastering systems-level impact—free tools, comprehensive guides, and proven frameworks for school-based behavior analysts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6 shadow-xl">
              <Link href="/iep-behavior-goals">
                Free IEP Goals Generator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              <Link href="/transformation-program">
                8-Week Training Program
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 -mt-20 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 hover:shadow-2xl transition-shadow">
            <div className="text-4xl font-bold text-emerald-600 mb-2">5,000+</div>
            <div className="text-slate-600 font-medium">School BCBAs Using Our Resources</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 hover:shadow-2xl transition-shadow">
            <div className="text-4xl font-bold text-emerald-600 mb-2">50 States</div>
            <div className="text-slate-600 font-medium">Salary & Job Market Data</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 hover:shadow-2xl transition-shadow">
            <div className="text-4xl font-bold text-emerald-600 mb-2">100% Free</div>
            <div className="text-slate-600 font-medium">Core Tools & Resources</div>
          </div>
        </div>
      </section>

      {/* Key Guides */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Your School BCBA Career Roadmap
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about becoming and excelling as a school-based behavior analyst
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card
            icon={<FileText className="h-8 w-8 text-blue-600" />}
            title="School BCBA vs School-Based BCBA"
            desc="Understand the terminology, position your role effectively, and use language that districts actually search for in job postings."
            href="/school-bcba/vs-school-based-bcba"
            badge="Start Here"
          />
          <Card
            icon={<Briefcase className="h-8 w-8 text-emerald-600" />}
            title="School BCBA Job Guide"
            desc="Complete job search strategy: roles, interview questions, resume keywords, portfolio artifacts, and what districts really expect."
            href="/school-bcba/job-guide"
            badge="Popular"
          />
          <Card
            icon={<DollarSign className="h-8 w-8 text-green-600" />}
            title="School BCBA Salary by State"
            desc="Comprehensive salary data by state, cost-of-living adjustments, benefits analysis, and negotiation strategies."
            href="/school-bcba/salary-by-state"
            badge="Essential"
          />
          <Card
            icon={<GraduationCap className="h-8 w-8 text-purple-600" />}
            title="How to Become a School BCBA"
            desc="Step-by-step pathway from coursework to certification: credentials, fieldwork, competencies, and portfolio building."
            href="/school-bcba/how-to-become"
          />
          <Card
            icon={<BookOpen className="h-8 w-8 text-indigo-600" />}
            title="ACT Matrix for School BCBAs"
            desc="Values-based framework that complements applied behavior analysis for deeper student engagement and motivation."
            href="/the-act-matrix-a-framework-for-school-based-bcbas"
          />
          <Card
            icon={<Users className="h-8 w-8 text-orange-600" />}
            title="BCBAs in Schools"
            desc="Comprehensive guide to the school BCBA role: challenges, solutions, success stories, and systems-level strategies."
            href="/bcbas-in-schools"
          />
        </div>
      </section>

      {/* Lead Magnets */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 md:p-12 border border-emerald-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Free School BCBA Tools
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Professional-grade tools used by thousands of school-based behavior analysts
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <LMCard
              title="IEP Behavior Goals Generator"
              desc="Generate high-quality, measurable, SMART behavior goals aligned with state standards. Save hours on IEP writing."
              href="/iep-behavior-goals"
              features={["SMART goal framework", "State standards aligned", "Progress monitoring built-in"]}
            />
            <LMCard
              title="Behavior Plan Writer"
              desc="Create function-based behavior intervention plans with evidence-based strategies, data collection systems, and implementation guides."
              href="/behavior-plans"
              features={["Function-based strategies", "Data collection tools", "Implementation guides"]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your School BCBA Practice?
          </h2>
          <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
            Join our 8-week transformation program designed specifically for school-based behavior analysts
          </p>
          <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6">
            <Link href="/transformation-program">
              See the Program Details
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
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

function Card({
  icon,
  title,
  desc,
  href,
  badge
}: {
  icon?: React.ReactNode;
  title: string;
  desc: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link href={href} className="group block relative">
      <div className="h-full rounded-2xl border-2 border-slate-200 bg-white p-6 hover:border-emerald-400 hover:shadow-xl transition-all duration-300">
        {badge && (
          <div className="absolute -top-3 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
              {badge}
            </span>
          </div>
        )}

        {icon && (
          <div className="mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}

        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">{desc}</p>
        <span className="inline-flex items-center text-emerald-700 font-semibold group-hover:gap-2 transition-all">
          Learn More
          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

function LMCard({
  title,
  desc,
  href,
  features
}: {
  title: string;
  desc: string;
  href: string;
  features?: string[];
}) {
  return (
    <Link href={href} className="group block">
      <div className="h-full rounded-2xl border-2 border-emerald-200 bg-white p-8 hover:border-emerald-400 hover:shadow-xl transition-all duration-300">
        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 mb-6 leading-relaxed">{desc}</p>

        {features && (
          <ul className="space-y-2 mb-6">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm text-slate-700">
                <svg className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        )}

        <span className="inline-flex items-center text-emerald-700 font-bold group-hover:gap-2 transition-all">
          Try It Free
          <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
