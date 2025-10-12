import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "School BCBA vs School-Based BCBA: What’s the Difference?",
  description:
    "Clarity on titles, roles, and search intent: how 'School BCBA' differs from 'School-Based BCBA' and why the wording matters for districts and candidates.",
  alternates: { canonical: "https://behaviorschool.com/school-bcba/vs-school-based-bcba" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-bs-background">
      <section className="container mx-auto px-6 pt-24 pb-10">
        <nav className="text-sm mb-4 text-slate-500">
          <Link className="hover:underline" href="/school-bcba">School BCBA</Link>
          <span className="mx-2">/</span>
          <span>VS School-Based BCBA</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">School BCBA vs School-Based BCBA</h1>
        <p className="text-slate-700 max-w-3xl">
          Same credential, slightly different wording. Here’s how districts and candidates can use the titles strategically for search visibility, hiring alignment, and clarity of responsibilities.
        </p>
      </section>

      <section className="container mx-auto px-6 grid md:grid-cols-3 gap-8 pb-16">
        <article className="md:col-span-2 prose prose-slate max-w-none">
          <h2>Why the Wording Matters</h2>
          <p>
            District job boards, HR systems, and candidate searches don’t always use the same phrase. “School BCBA” tends to match how candidates search, while “school-based BCBA” appears more often in long-form content and training resources. Optimizing for both increases discoverability without changing the work itself.
          </p>

          <h3>Typical Usage</h3>
          <ul>
            <li><strong>School BCBA</strong>: shows up in job titles, LinkedIn profiles, and quick searches.</li>
            <li><strong>School-Based BCBA</strong>: used in articles, training, and program descriptions.</li>
          </ul>

          <h3>Responsibilities Are the Same</h3>
          <p>
            Regardless of title, responsibilities include FBAs, BIPs, IEP collaboration, MTSS/PBIS alignment, staff coaching, and systems-level implementation. Your portfolio (IEP goals, BIPs, coaching plans, data systems) demonstrates impact better than any title nuance.
          </p>

          <h3>How to Position Yourself</h3>
          <ul>
            <li>Use both phrases across your resume and portfolio to match recruiter searches.</li>
            <li>Create artifacts that map to district needs: 90-day plan, BIP sample, coaching cycle, progress monitoring templates.</li>
            <li>Link to role-aligned tools: <Link href="/iep-behavior-goals" className="text-emerald-700 underline">IEP Goal Writer</Link>, <Link href="/behavior-plans" className="text-emerald-700 underline">Behavior Plan Writer</Link>, and the <Link href="/iep-goal-qualitychecker" className="text-emerald-700 underline">IEP Goal Quality Checker</Link>.</li>
            <li>Review salary expectations by state with our <Link href="/school-bcba/salary-by-state" className="text-emerald-700 underline">comprehensive salary guide</Link>.</li>
            <li>Prepare for interviews using our <Link href="/school-bcba/job-guide-2025" className="text-emerald-700 underline">2025 job guide</Link> with real questions and scoring rubrics.</li>
          </ul>

          <h3>SEO Considerations for Districts</h3>
          <ul>
            <li>Include both terms in job descriptions to maximize candidate reach.</li>
            <li>Publish a short “About the Role” page describing systems-level impact and MTSS/PBIS alignment.</li>
            <li>Link to examples of expected deliverables (FBAs, BIPs, IEP goal quality guidelines).</li>
          </ul>

          <h3>FAQs</h3>
          <p><strong>Is a "School BCBA" different from a "School-Based BCBA"?</strong> No. Both refer to a BCBA practicing in K–12 settings. The difference is language preference and search behavior.</p>
          <p><strong>Which title should I use?</strong> Use both. Lead with "School BCBA" for job search visibility, and include "school-based BCBA" in long-form materials.</p>
          <p><strong>How should I showcase impact?</strong> Provide a 90-day plan, staff coaching cycle, sample BIP, and progress monitoring visuals with clear outcomes.</p>
          
          <h3>Getting Started Resources</h3>
          <p>Whether you're just entering the field or positioning yourself for a new role:</p>
          <ul>
            <li><strong>New to School-Based Work:</strong> Start with our <Link href="/school-bcba/how-to-become" className="text-emerald-700 underline">complete pathway guide</Link> covering credentials, fieldwork, and competencies.</li>
            <li><strong>Already Certified:</strong> Review our <Link href="/school-bcba/job-guide-2025" className="text-emerald-700 underline">job guide</Link> for interview prep, resume keywords, and portfolio examples.</li>
            <li><strong>Comparing Offers:</strong> Use our <Link href="/school-bcba/salary-by-state" className="text-emerald-700 underline">salary benchmarks</Link> to evaluate compensation packages.</li>
            <li><strong>Building Your Practice:</strong> Explore the <Link href="/school-based-behavior-support" className="text-emerald-700 underline">school-based behavior support framework</Link> and <Link href="/the-act-matrix-a-framework-for-school-based-bcbas" className="text-emerald-700 underline">ACT Matrix for schools</Link>.</li>
          </ul>
        </article>

        <aside className="md:col-span-1 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold mb-3">Related Guides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-emerald-700 hover:underline flex items-center" href="/school-bcba">🏠 School BCBA Hub</Link></li>
              <li><Link className="text-emerald-700 hover:underline flex items-center" href="/school-bcba/job-guide-2025">📋 Job Guide 2025</Link></li>
              <li><Link className="text-emerald-700 hover:underline flex items-center" href="/school-bcba/salary-by-state">💰 Salary by State</Link></li>
              <li><Link className="text-emerald-700 hover:underline flex items-center" href="/school-bcba/how-to-become">🎓 How to Become</Link></li>
            </ul>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="font-semibold mb-3 text-emerald-900">Free Tools</h3>
            <ul className="space-y-2 text-sm text-emerald-900">
              <li><Link className="hover:underline" href="/iep-behavior-goals">IEP Goals Generator →</Link></li>
              <li><Link className="hover:underline" href="/behavior-plans">Behavior Plan Writer →</Link></li>
              <li><Link className="hover:underline" href="/iep-goal-qualitychecker">Goal Quality Checker →</Link></li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h3 className="font-semibold mb-2 text-blue-900 text-sm">Training Programs</h3>
            <p className="text-xs text-blue-800 mb-3">Comprehensive training for school-based BCBAs</p>
            <Link href="/school-based-bcba" className="text-blue-700 hover:underline text-sm font-medium">
              Explore Program →
            </Link>
          </div>
        </aside>
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

      {/* Structured Data - Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "School BCBA vs School-Based BCBA: What's the Difference?",
            "description": "Clarity on titles, roles, and search intent: how School BCBA differs from School-Based BCBA and why the wording matters for districts and candidates.",
            "author": {
              "@type": "Organization",
              "name": "Behavior School"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Behavior School",
              "logo": {
                "@type": "ImageObject",
                "url": "https://behaviorschool.com/optimized/og-image.webp"
              }
            },
            "datePublished": "2025-01-15",
            "dateModified": new Date().toISOString().split('T')[0]
          })
        }}
      />
    </main>
  );
}
