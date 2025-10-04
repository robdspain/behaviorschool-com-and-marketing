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
            <li>Link to role-aligned tools: <Link href="/iep-goals" className="text-emerald-700 underline">IEP Goal Writer</Link>, <Link href="/behavior-plans" className="text-emerald-700 underline">Behavior Plan Writer</Link>, and the <Link href="/iep-goal-qualitychecker" className="text-emerald-700 underline">IEP Goal Quality Checker</Link>.</li>
          </ul>

          <h3>SEO Considerations for Districts</h3>
          <ul>
            <li>Include both terms in job descriptions to maximize candidate reach.</li>
            <li>Publish a short “About the Role” page describing systems-level impact and MTSS/PBIS alignment.</li>
            <li>Link to examples of expected deliverables (FBAs, BIPs, IEP goal quality guidelines).</li>
          </ul>

          <h3>FAQs</h3>
          <p><strong>Is a “School BCBA” different from a “School-Based BCBA”?</strong> No. Both refer to a BCBA practicing in K–12 settings. The difference is language preference and search behavior.</p>
          <p><strong>Which title should I use?</strong> Use both. Lead with “School BCBA” for job search visibility, and include “school-based BCBA” in long-form materials.</p>
          <p><strong>How should I showcase impact?</strong> Provide a 90-day plan, staff coaching cycle, sample BIP, and progress monitoring visuals with clear outcomes.</p>
        </article>

        <aside className="md:col-span-1 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold mb-2">Related Guides</h3>
            <ul className="space-y-1 text-sm">
              <li><Link className="text-emerald-700 hover:underline" href="/school-bcba">School BCBA Hub</Link></li>
              <li><Link className="text-emerald-700 hover:underline" href="/school-bcba/job-guide">School BCBA Job Guide</Link></li>
              <li><Link className="text-emerald-700 hover:underline" href="/school-bcba/salary-by-state">Salary by State</Link></li>
              <li><Link className="text-emerald-700 hover:underline" href="/school-bcba/how-to-become">How to Become</Link></li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
