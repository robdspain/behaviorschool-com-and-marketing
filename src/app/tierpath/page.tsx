import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TierPath — MTSS & PBIS Software for Tiered Intervention Tracking",
  description:
    "Connect teams, track MTSS tiers, manage PBIS interventions, and monitor progress from universal screening to Tier 3 fidelity — all in a single, district-wide data system.",
};

export default function TierPathPage() {
  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          TierPath — MTSS & PBIS Software for Tiered Intervention Tracking
        </h1>
        <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
          Connect teams, track MTSS tiers, manage PBIS interventions, and monitor progress from universal screening to Tier 3 fidelity — all in a single, district-wide data system.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4 text-center">TierPath FAQs</h2>
        <div className="space-y-6 max-w-3xl mx-auto text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900">What is TierPath and how does it support MTSS/PBIS?</h3>
            <p>
              TierPath is MTSS and PBIS software that centralizes tiered intervention tracking, team communication, and progress monitoring across Tier 1, Tier 2, and Tier 3.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">How does TierPath handle universal screening?</h3>
            <p>
              Import or administer screeners, flag students based on risk thresholds, and route them to appropriate interventions with timelines and owners.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Can we monitor Tier 3 fidelity and student response?</h3>
            <p>
              Yes. Fidelity checklists, task analyses, and observation workflows track implementation quality while graphs show response to intervention over time.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Is TierPath designed for district‑wide use?</h3>
            <p>
              The platform supports district‑level roles, school teams, and standardized data definitions so you can compare outcomes across programs and ensure consistency.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}