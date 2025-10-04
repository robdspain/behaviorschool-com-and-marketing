import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Become a School BCBA: Complete Pathway",
  description:
    "Credentials, competencies, and school-specific experience that districts value. Step-by-step pathway to becoming a School BCBA.",
  alternates: { canonical: "https://behaviorschool.com/school-bcba/how-to-become" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-bs-background">
      <section className="container mx-auto px-6 pt-24 pb-10">
        <nav className="text-sm mb-4 text-slate-500">
          <Link className="hover:underline" href="/school-bcba">School BCBA</Link>
          <span className="mx-2">/</span>
          <span>How to Become</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">How to Become a School BCBA</h1>
        <p className="text-slate-700 max-w-3xl">
          A step-by-step pathway from coursework to portfolio—tailored to district expectations, IEP compliance, and MTSS/PBIS alignment.
        </p>
      </section>

      <section className="container mx-auto px-6 grid md:grid-cols-3 gap-8 pb-16">
        <article className="md:col-span-2 prose prose-slate max-w-none">
          <h2>Step-by-Step Pathway</h2>
          <ol>
            <li><strong>Coursework:</strong> Complete BACB-required graduate coursework. Add electives in special education law, classroom management, and school systems.</li>
            <li><strong>Supervised Experience:</strong> Secure hours in K–12 settings. Prioritize FBAs, BIPs, IEP meetings, staff coaching, and MTSS integration.</li>
            <li><strong>Certification:</strong> Sit for the BCBA exam. Build fluency with real school scenarios.</li>
            <li><strong>School Competencies:</strong> Learn IEP writing (90–100% mastery), progress monitoring, crisis procedures, and data workflows.</li>
            <li><strong>Portfolio:</strong> Assemble artifacts: 90‑day plan, BIP sample, coaching cycle, IEP goal set, and data dashboard.</li>
            <li><strong>Applications:</strong> Use district keywords (FBA/BIP, MTSS, PBIS, progress monitoring, fidelity). Attach your one‑pager and artifact links.</li>
            <li><strong>Interview:</strong> Lead with systems. Show how you implement supports that teachers can sustain.</li>
          </ol>

          <h3>Essential Artifacts</h3>
          <ul>
            <li>IEP goal set validated with the <Link href="/iep-goal-qualitychecker" className="text-emerald-700 underline">Goal Quality Checker</Link>.</li>
            <li>BIP with clear function, replacement behavior, and classroom-feasible strategies.</li>
            <li>Coaching cycle plan with fidelity criteria and timelines.</li>
            <li>Progress monitoring template with charted examples.</li>
          </ul>

          <h3>Tools to Accelerate</h3>
          <ul>
            <li><Link href="/iep-goals" className="text-emerald-700 underline">IEP Goal Writer</Link> for measurable behavior goals.</li>
            <li><Link href="/behavior-plans" className="text-emerald-700 underline">Behavior Plan Writer</Link> for efficient BIP drafting.</li>
          </ul>

          <h3>Timeline Planner (Typical)</h3>
          <ul>
            <li>Months 0–6: Coursework + initial school practicum.</li>
            <li>Months 6–12: Advanced school hours + portfolio building.</li>
            <li>Months 12–15: Exam prep, artifact refinement, and applications.</li>
          </ul>
        </article>

        <aside className="md:col-span-1 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold mb-2">Related Guides</h3>
            <ul className="space-y-1 text-sm">
              <li><Link className="text-emerald-700 hover:underline" href="/school-bcba/job-guide">Job Guide</Link></li>
              <li><Link className="text-emerald-700 hover:underline" href="/school-bcba/salary-by-state">Salary by State</Link></li>
              <li><Link className="text-emerald-700 hover:underline" href="/school-bcba">School BCBA Hub</Link></li>
            </ul>
          </div>
        </aside>
      </section>

      {/* HowTo structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Become a School BCBA",
            description: "Step-by-step pathway to becoming a School BCBA with district-ready competencies and portfolio artifacts.",
            totalTime: "P12M",
            supply: [
              { "@type": "HowToSupply", name: "Graduate coursework" },
              { "@type": "HowToSupply", name: "Supervised fieldwork" },
              { "@type": "HowToSupply", name: "Portfolio artifacts" }
            ],
            step: [
              { "@type": "HowToStep", name: "Complete coursework" },
              { "@type": "HowToStep", name: "Gain school-based hours" },
              { "@type": "HowToStep", name: "Pass BCBA exam" },
              { "@type": "HowToStep", name: "Build portfolio" },
              { "@type": "HowToStep", name: "Apply and interview" }
            ]
          })
        }}
      />
    </main>
  );
}
