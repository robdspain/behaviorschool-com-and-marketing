import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "School BCBA Job Guide: Roles, Interviews, Portfolios",
  description:
    "Everything for School BCBA job searches: responsibilities, resume keywords, interview questions, and district-ready artifacts.",
  alternates: { canonical: "https://behaviorschool.com/school-bcba/job-guide" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-bs-background">
      <section className="container mx-auto px-6 pt-24 pb-10">
        <nav className="text-sm mb-4 text-slate-500">
          <Link className="hover:underline" href="/school-bcba">School BCBA</Link>
          <span className="mx-2">/</span>
          <span>Job Guide</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">School BCBA Job Guide</h1>
        <p className="text-slate-700 max-w-3xl">
          What districts expect, how to stand out, and the exact artifacts that prove systems-level impact in schools.
        </p>
      </section>
    
      <section className="container mx-auto px-6 grid md:grid-cols-3 gap-8 pb-16">
        <article className="md:col-span-2 prose prose-slate max-w-none">
          <h2>Role Expectations</h2>
          <ul>
            <li>Lead FBAs and implement function-based BIPs that integrate classroom realities.</li>
            <li>Align supports to MTSS/PBIS; build tiered flow from universal → targeted → intensive.</li>
            <li>Coach teachers and paras; document coaching cycles with clear goals and fidelity checks.</li>
            <li>Write measurable IEP behavior goals (90–100% mastery) and show progress monitoring.</li>
            <li>Build sustainable systems: data collection, staff training, and crisis plan alignment.</li>
          </ul>

          <h3>Portfolio Artifacts to Bring</h3>
          <ul>
            <li>90‑day systems plan for a typical district (tiered supports, training cadence, metrics).</li>
            <li>Sample BIP with clear function statement, prevention/teaching/consequence, and data plan.</li>
            <li>IEP goal samples and a <Link href="/iep-goal-qualitychecker" className="text-emerald-700 underline">goal quality checklist</Link> report.</li>
            <li>Coaching cycle template (goal → model → practice → feedback → fidelity).</li>
            <li>Progress dashboard example (even a simple spreadsheet with charted trends works).</li>
          </ul>

          <h3>Interview Questions (Be Ready)</h3>
          <ul>
            <li>“Walk us through a complex FBA and how you translated it into a feasible BIP.”</li>
            <li>“How do you align your work with PBIS/MTSS without diluting function-based support?”</li>
            <li>“Show how you coach a new teacher through a challenging routine.”</li>
            <li>“How do you write and monitor behavior goals that are measurable and achievable?”</li>
            <li>“What does your 90‑day plan look like for a new district?”</li>
          </ul>

          <h3>Resume Keywords That Map to District Filters</h3>
          <p>Add keywords naturally in bullets and project summaries:</p>
          <ul>
            <li>MTSS, PBIS, IEP goals, progress monitoring, FBA/BIP, staff coaching, fidelity, data systems</li>
            <li>De‑escalation, classroom routines, replacement skills, social validity, crisis planning</li>
          </ul>

          <h3>Practical Prep</h3>
          <ul>
            <li>Use the <Link href="/iep-goals" className="text-emerald-700 underline">IEP Goal Writer</Link> to prepare goal samples.</li>
            <li>Run your drafts through the <Link href="/iep-goal-qualitychecker" className="text-emerald-700 underline">Goal Quality Checker</Link>.</li>
            <li>Assemble a one‑pager: your philosophy, systems map, and 90‑day plan highlights.</li>
          </ul>

          <h2>Job Guide FAQ</h2>
          <h3>What artifacts should I bring to a School BCBA interview?</h3>
          <p>Bring a 90‑day systems plan, a sample BIP, IEP goal samples with progress monitoring, and a coaching cycle template with fidelity checks.</p>

          <h3>How should I prepare for district interview questions?</h3>
          <p>Prepare examples that demonstrate MTSS/PBIS alignment, feasible function‑based interventions, teacher coaching plans, and measurable IEP goals (90–100% mastery).</p>

          <h3>What resume keywords matter for School BCBA roles?</h3>
          <p>Include MTSS, PBIS, IEP goals, progress monitoring, FBA/BIP, staff coaching, fidelity, and data systems where they genuinely apply.</p>
        </article>

        <aside className="md:col-span-1 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold mb-2">Tools for Candidates</h3>
            <ul className="space-y-1 text-sm">
              <li><Link className="text-emerald-700 hover:underline" href="/iep-goals">IEP Goal Writer</Link></li>
              <li><Link className="text-emerald-700 hover:underline" href="/iep-goal-qualitychecker">Goal Quality Checker</Link></li>
              <li><Link className="text-emerald-700 hover:underline" href="/behavior-plans">Behavior Plan Writer</Link></li>
            </ul>
          </div>
        </aside>
      </section>
      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What artifacts should I bring to a School BCBA interview?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Bring a 90-day systems plan, a sample BIP, IEP goal samples with progress monitoring, and a coaching cycle template with fidelity checks."
                }
              },
              {
                "@type": "Question",
                name: "How should I prepare for district interview questions?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Prepare examples that demonstrate MTSS/PBIS alignment, feasible function-based interventions, teacher coaching plans, and measurable IEP goals (90–100% mastery)."
                }
              },
              {
                "@type": "Question",
                name: "What resume keywords matter for School BCBA roles?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Include MTSS, PBIS, IEP goals, progress monitoring, FBA/BIP, staff coaching, fidelity, and data systems where they genuinely apply."
                }
              }
            ]
          })
        }}
      />
    </main>
  );
}

