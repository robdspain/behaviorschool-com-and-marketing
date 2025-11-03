import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, FileText, Briefcase, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "School BCBA vs School-Based BCBA: What's the Difference? | Career Guide 2025",
  description:
    "Understand the key differences between School BCBA and School-Based BCBA terminology. Learn which title to use for job searches, how to position yourself, and why the wording matters for career success.",
  alternates: { canonical: "https://behaviorschool.com/school-bcba/vs-school-based-bcba" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <section className="container mx-auto px-6 pt-24 pb-6">
        <nav className="text-sm text-slate-500">
          <Link className="hover:text-emerald-700 transition-colors" href="/school-bcba">
            School BCBA
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">VS School-Based BCBA</span>
        </nav>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold mb-6">
            <Search className="h-4 w-4 mr-2" />
            Keyword Strategy Guide
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            School BCBA vs <br className="hidden md:block" />
            School-Based BCBA
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8">
            Same credential, slightly different wording—here's why it matters for your job search,
            professional positioning, and career visibility.
          </p>
        </div>
      </section>

      {/* Quick Answer Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border-2 border-emerald-200 shadow-lg">
            <h2 className="text-2xl font-bold text-emerald-900 mb-4">Quick Answer</h2>
            <p className="text-lg text-emerald-800 leading-relaxed">
              <strong className="font-bold">They're the same role.</strong> "School BCBA" and "School-Based BCBA"
              both refer to a Board Certified Behavior Analyst working in K-12 educational settings. The difference
              is search behavior and language preference—not job responsibilities, qualifications, or scope of practice.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <article className="lg:col-span-2 space-y-12">
            {/* Why The Wording Matters */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why the Wording Matters</h2>
              <div className="prose prose-lg max-w-none text-slate-700">
                <p className="mb-4">
                  District job boards, HR systems, and candidate searches don't always use the same phrase. Understanding
                  the nuanced differences in how these terms are used can significantly impact your job search success
                  and professional visibility.
                </p>
                <p>
                  <strong>"School BCBA"</strong> tends to match how candidates search and appears in job titles,
                  while <strong>"School-Based BCBA"</strong> shows up more often in long-form content, training programs,
                  and professional development materials. Optimizing for both terms increases your discoverability
                  without changing the actual work.
                </p>
              </div>
            </div>

            {/* Comparison Grid */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">How Each Term Is Used</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">School BCBA</h3>
                  <ul className="space-y-3 text-blue-900">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Job titles and postings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>LinkedIn profiles</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Quick Google searches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Resume headlines</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Candidate self-identification</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border-2 border-emerald-200">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-900 mb-4">School-Based BCBA</h3>
                  <ul className="space-y-3 text-emerald-900">
                    <li className="flex items-start">
                      <span className="text-emerald-600 mr-2">•</span>
                      <span>Articles and blog posts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-600 mr-2">•</span>
                      <span>Training program descriptions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-600 mr-2">•</span>
                      <span>Research literature</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-600 mr-2">•</span>
                      <span>Professional development materials</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-600 mr-2">•</span>
                      <span>Academic contexts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Core Responsibilities */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Core Responsibilities (Identical for Both Terms)
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Conduct functional behavior assessments (FBAs)",
                  "Develop behavior intervention plans (BIPs)",
                  "Collaborate on IEP teams",
                  "Align interventions with MTSS/PBIS frameworks",
                  "Coach and train school staff",
                  "Implement systems-level supports",
                  "Use data-driven decision making",
                  "Provide crisis intervention support"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start">
                    <svg className="h-6 w-6 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Strategy */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border-2 border-purple-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">Strategic Positioning Tips</h2>
                  <p className="text-purple-800">Maximize your visibility and opportunities</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-purple-900 mb-3">For Job Seekers</h3>
                  <ul className="space-y-3 text-purple-900">
                    <li className="flex items-start">
                      <span className="text-purple-600 font-bold mr-2">→</span>
                      <span><strong>Use both terms</strong> throughout your resume, cover letter, and portfolio to match different recruiter search patterns</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 font-bold mr-2">→</span>
                      <span><strong>Lead with "School BCBA"</strong> in job titles and LinkedIn for maximum visibility</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 font-bold mr-2">→</span>
                      <span><strong>Include "school-based BCBA"</strong> in your professional summary and about sections</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 font-bold mr-2">→</span>
                      <span>Create artifacts that demonstrate district-ready competencies (see links below)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-purple-900 mb-3">For Districts & Employers</h3>
                  <ul className="space-y-3 text-purple-900">
                    <li className="flex items-start">
                      <span className="text-purple-600 font-bold mr-2">→</span>
                      <span><strong>Include both terms</strong> in job postings to maximize qualified candidate reach</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 font-bold mr-2">→</span>
                      <span><strong>Publish role descriptions</strong> that outline systems-level impact expectations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 font-bold mr-2">→</span>
                      <span><strong>Provide examples</strong> of expected deliverables (FBAs, BIPs, IEP goal frameworks)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Essential Resources */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Essential Resources by Career Stage</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <ResourceCard
                  icon={<GraduationCap className="h-6 w-6 text-white" />}
                  color="blue"
                  title="New to the Field"
                  items={[
                    { text: "Complete pathway guide", href: "/school-bcba/how-to-become" },
                    { text: "Credential requirements", href: "/school-bcba/how-to-become" },
                    { text: "Fieldwork & competencies", href: "/school-bcba/how-to-become" }
                  ]}
                />

                <ResourceCard
                  icon={<Briefcase className="h-6 w-6 text-white" />}
                  color="emerald"
                  title="Actively Job Searching"
                  items={[
                    { text: "2025 job guide & interview prep", href: "/school-bcba/job-guide" },
                    { text: "Resume keywords that work", href: "/school-bcba/job-guide" },
                    { text: "Portfolio examples", href: "/school-bcba/job-guide" }
                  ]}
                />

                <ResourceCard
                  icon={<DollarSign className="h-6 w-6 text-white" />}
                  color="green"
                  title="Evaluating Offers"
                  items={[
                    { text: "Salary by state (50 states)", href: "/school-bcba/salary-by-state" },
                    { text: "Benefits comparison", href: "/school-bcba/salary-by-state" },
                    { text: "Negotiation strategies", href: "/school-bcba/salary-by-state" }
                  ]}
                />

                <ResourceCard
                  icon={<Award className="h-6 w-6 text-white" />}
                  color="purple"
                  title="Building Your Practice"
                  items={[
                    { text: "School behavior support framework", href: "/school-based-behavior-support" },
                    { text: "ACT Matrix for schools", href: "/the-act-matrix-a-framework-for-school-based-bcbas" },
                    { text: "Free IEP tools", href: "/iep-behavior-goals" }
                  ]}
                />
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Quick Links */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Related Guides</h3>
                <ul className="space-y-3">
                  <li>
                    <Link className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center group" href="/school-bcba">
                      🏠 School BCBA Hub
                      <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                  <li>
                    <Link className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center group" href="/school-bcba/job-guide">
                      📋 Job Guide 2025
                      <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                  <li>
                    <Link className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center group" href="/school-bcba/salary-by-state">
                      💰 Salary by State
                      <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                  <li>
                    <Link className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center group" href="/school-bcba/how-to-become">
                      🎓 How to Become
                      <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Free Tools */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200">
                <h3 className="font-bold text-lg text-emerald-900 mb-4">Free Tools</h3>
                <ul className="space-y-3 text-emerald-900">
                  <li>
                    <Link className="hover:text-emerald-700 font-medium flex items-center group" href="/iep-behavior-goals">
                      IEP Goals Generator
                      <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-emerald-700 font-medium flex items-center group" href="/behavior-plans">
                      Behavior Plan Writer
                      <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-emerald-700 font-medium flex items-center group" href="/iep-goal-qualitychecker">
                      Goal Quality Checker
                      <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Training CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="font-bold text-lg mb-2">Ready to Excel?</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Comprehensive training for school-based BCBAs
                </p>
                <Link href="/transformation-program" className="block w-full bg-white text-blue-700 hover:bg-blue-50 py-3 px-4 rounded-xl font-semibold text-center transition-colors">
                  View Training Program →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Structured Data - FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is a School BCBA different from a School-Based BCBA?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Both terms refer to a BCBA practicing in K-12 settings. The difference is language preference and search behavior. School BCBA tends to match how candidates search, while school-based BCBA appears more often in long-form content and training resources."
                }
              },
              {
                "@type": "Question",
                "name": "Which title should I use: School BCBA or School-Based BCBA?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Use both. Lead with School BCBA for job search visibility and LinkedIn profiles, and include school-based BCBA in long-form materials, articles, and training descriptions. This maximizes discoverability across different search contexts."
                }
              },
              {
                "@type": "Question",
                "name": "How should I showcase my impact as a School BCBA?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Provide concrete artifacts: 90-day implementation plan, staff coaching cycle documentation, sample behavior intervention plans (BIPs), IEP goal quality examples, and progress monitoring visuals with clear outcome data. Demonstrate systems-level impact aligned with MTSS/PBIS frameworks."
                }
              },
              {
                "@type": "Question",
                "name": "What are the core responsibilities of a School BCBA?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Core responsibilities include: conducting functional behavior assessments (FBAs), developing behavior intervention plans (BIPs), collaborating on IEPs, aligning interventions with MTSS/PBIS frameworks, coaching staff, implementing systems-level supports, and using data-driven decision making."
                }
              }
            ]
          })
        }}
      />
    </main>
  );
}

import { DollarSign, GraduationCap } from "lucide-react";

function ResourceCard({
  icon,
  color,
  title,
  items
}: {
  icon: React.ReactNode;
  color: "blue" | "emerald" | "green" | "purple";
  title: string;
  items: { text: string; href: string }[];
}) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-900",
    emerald: "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-900",
    green: "from-green-50 to-green-100 border-green-200 text-green-900",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-900"
  };

  const iconBgClasses = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-600",
    green: "bg-green-600",
    purple: "bg-purple-600"
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 border-2`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${iconBgClasses[color]} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx}>
            <Link href={item.href} className="text-sm hover:underline flex items-center group">
              <span className="mr-1">→</span>
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
