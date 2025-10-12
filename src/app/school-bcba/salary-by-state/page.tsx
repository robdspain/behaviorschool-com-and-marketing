import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "School BCBA Salary by State: 2025 Overview",
  description:
    "High-level salary context for School BCBA positions by state with notes on cost of living and district step/column effects.",
  alternates: { canonical: "https://behaviorschool.com/school-bcba/salary-by-state" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-bs-background">
      <section className="container mx-auto px-6 pt-24 pb-10">
        <nav className="text-sm mb-4 text-slate-500">
          <Link className="hover:underline" href="/school-bcba">School BCBA</Link>
          <span className="mx-2">/</span>
          <span>Salary by State</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">School BCBA Salary by State (2025)</h1>
        <p className="text-slate-700 max-w-3xl">
          Salary ranges vary by district, region, years of experience, and step/column placement. Use these ranges as directional benchmarks and confirm with local HR postings.
        </p>
      </section>

      <section className="container mx-auto px-6 pb-16 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Benchmark Ranges</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <ul className="space-y-2">
                  <li><strong>California:</strong> $90k–$125k+ (metro coastal higher; stipends common)</li>
                  <li><strong>Texas:</strong> $70k–$95k (district size and supplements vary)</li>
                  <li><strong>Florida:</strong> $65k–$90k (cost-of-living adjusted)</li>
                  <li><strong>New York (statewide):</strong> $80k–$115k (NYC and suburbs higher)</li>
                  <li><strong>Illinois:</strong> $72k–$100k (Chicagoland higher)</li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li><strong>Arizona:</strong> $65k–$90k</li>
                  <li><strong>Pennsylvania:</strong> $70k–$95k</li>
                  <li><strong>Ohio:</strong> $68k–$92k</li>
                  <li><strong>Washington:</strong> $85k–$115k</li>
                  <li><strong>Massachusetts:</strong> $85k–$120k</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-slate-600 text-sm">
              <p><strong>Methodology:</strong> Aggregated from public district postings (2024–2025), HR schedules, and recruiter ranges. Ranges reflect School BCBA/behavior analyst roles aligned to K–12 districts and assume full-time placements.</p>
              <p className="mt-2">Always verify step/column, education differentials, and stipends (e.g., bilingual, high-need sites). Some districts offer additional days and benefits that effectively raise total comp.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h3 className="font-semibold text-emerald-900 mb-3">💡 Salary Negotiation Tips</h3>
            <div className="space-y-3 text-sm text-emerald-900">
              <p><strong>Bring Evidence of Impact:</strong> When negotiating, bring a 90‑day systems plan and sample artifacts (<Link href="/iep-behavior-goals" className="underline hover:text-emerald-700">IEP goals</Link>, <Link href="/behavior-plans" className="underline hover:text-emerald-700">BIP</Link>, coaching plan). Demonstrating systems impact often improves offers.</p>
              <p><strong>Understand the Job Market:</strong> Research the specific <Link href="/school-bcba/job-guide" className="underline hover:text-emerald-700">job requirements</Link> and expectations for your target district.</p>
              <p><strong>Highlight Credentials:</strong> If you're still pursuing certification, review our <Link href="/school-bcba/how-to-become" className="underline hover:text-emerald-700">complete pathway guide</Link> to understand the full qualification process.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Beyond Base Salary</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <p><strong>Total Compensation Includes:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Step/column increases (typically 2-5% annually)</li>
                <li>Education differentials (Master's vs. Doctorate)</li>
                <li>Stipends (bilingual, high-need schools, department chair)</li>
                <li>Extended year contracts (200+ days vs. 180)</li>
                <li>Professional development funds ($500-$2000/year)</li>
                <li>Health benefits and retirement matching</li>
              </ul>
              <p className="mt-4"><strong>Hidden Value:</strong> Compare two offers holistically—a $75k offer with full benefits and 15 PTO days may exceed an $85k offer with minimal benefits.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Career Progression</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <p>School BCBA roles often start mid-range and grow over time:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Entry Level (0-2 years):</strong> Lower end of state range, focus on building portfolio</li>
                <li><strong>Experienced (3-7 years):</strong> Mid-to-upper range, may lead programs or departments</li>
                <li><strong>Senior/Leadership (8+ years):</strong> Top of range or beyond, district-wide roles, training others</li>
              </ul>
              <p className="mt-4">Many districts promote School BCBAs to <strong>Director of Special Education</strong> or <strong>Behavior Program Coordinator</strong> roles ($100k-$150k+).</p>
              <p className="mt-2">Ready to start your career? Check out the <Link href="/school-bcba/job-guide-2025" className="text-emerald-700 underline hover:text-emerald-800">2025 Job Guide</Link> for interview prep and resume tips.</p>
            </div>
          </div>
        </div>

        <aside className="md:col-span-1 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 sticky top-24">
            <h3 className="font-semibold text-slate-900 mb-3">Related Guides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="text-emerald-700 hover:underline flex items-center" href="/school-bcba/job-guide-2025">
                  📋 School BCBA Job Guide 2025
                </Link>
              </li>
              <li>
                <Link className="text-emerald-700 hover:underline flex items-center" href="/school-bcba/how-to-become">
                  🎓 How to Become a School BCBA
                </Link>
              </li>
              <li>
                <Link className="text-emerald-700 hover:underline flex items-center" href="/school-bcba/vs-school-based-bcba">
                  🔍 School BCBA vs School-Based BCBA
                </Link>
              </li>
              <li>
                <Link className="text-emerald-700 hover:underline flex items-center" href="/school-bcba">
                  🏠 School BCBA Hub
                </Link>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-3 text-sm">Free Tools</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link className="text-blue-700 hover:underline" href="/iep-behavior-goals">
                    IEP Goals Generator →
                  </Link>
                </li>
                <li>
                  <Link className="text-blue-700 hover:underline" href="/behavior-plans">
                    Behavior Plan Writer →
                  </Link>
                </li>
                <li>
                  <Link className="text-blue-700 hover:underline" href="/iep-goal-qualitychecker">
                    IEP Goal Quality Checker →
                  </Link>
                </li>
              </ul>
            </div>
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
                "name": "What is the average School BCBA salary?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "School BCBA salaries vary significantly by state and district. Ranges include: California $90k-$125k+, Texas $70k-$95k, Florida $65k-$90k, New York $80k-$115k, Washington $85k-$115k, and Massachusetts $85k-$120k. Always verify with local district HR schedules."
                }
              },
              {
                "@type": "Question",
                "name": "What factors affect School BCBA salary?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Salary depends on: district step/column placement, years of experience, education level (Master's vs. Doctorate), geographic location, district size, stipends (bilingual, high-need sites), and total compensation package including benefits."
                }
              },
              {
                "@type": "Question",
                "name": "How can I negotiate a higher School BCBA salary?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Bring evidence of systems-level impact: 90-day implementation plan, sample IEP goals, behavior intervention plans, staff coaching cycles, and progress monitoring data. Demonstrate competencies in MTSS/PBIS alignment and data-driven decision making."
                }
              },
              {
                "@type": "Question",
                "name": "What is included in School BCBA total compensation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Beyond base salary: step/column increases (2-5% annually), education differentials, stipends for bilingual or high-need schools, extended year contracts (200+ days vs 180), professional development funds ($500-$2000/year), health benefits, retirement matching, and paid time off."
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
            "headline": "School BCBA Salary by State: 2025 Overview",
            "description": "Comprehensive salary benchmarks for School BCBA positions across all 50 states with notes on cost of living, district factors, and compensation negotiation strategies.",
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
