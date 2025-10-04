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

      <section className="container mx-auto px-6 pb-16">
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

        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
          Tip: When negotiating, bring a 90‑day systems plan and sample artifacts (IEP goals, BIP, coaching plan). Demonstrating systems impact often improves offers.
        </div>
      </section>
    </main>
  );
}
