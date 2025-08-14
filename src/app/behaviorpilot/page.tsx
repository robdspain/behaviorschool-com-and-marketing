import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
  description:
    "All-in-one school-based BCBA platform to create functional behavior assessments (FBAs), build behavior intervention plans (BIPs), and track progress with AI-powered data collection and fidelity monitoring.",
};

export default function BehaviorPilotPage() {
  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection
        </h1>
        <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
          All-in-one school-based BCBA platform to create functional behavior assessments (FBAs), build behavior intervention plans (BIPs), and track progress with AI-powered data collection and fidelity monitoring.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4 text-center">BehaviorPilot FAQs</h2>
        <div className="space-y-6 max-w-3xl mx-auto text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900">What is BehaviorPilot and who is it for?</h3>
            <p>
              BehaviorPilot is BCBA software designed for school-based teams to streamline functional behavior assessments (FBAs), build high‑quality behavior intervention plans (BIPs), and manage ongoing data collection with fidelity monitoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Can BehaviorPilot speed up FBAs and BIPs while staying compliant?</h3>
            <p>
              Yes. Guided workflows, defensible templates, and required fields help you complete FBAs and BIPs faster while maintaining audit‑ready documentation and signatures.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">How does the AI‑powered data collection work?</h3>
            <p>
              The platform prompts observers with context‑aware options to capture ABC data, frequency, duration, and IOA. Data visualizes instantly in graphs and feeds into progress monitoring summaries.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Does BehaviorPilot include fidelity monitoring and reporting?</h3>
            <p>
              Built‑in fidelity checklists, observer workflows, digital attestations, and exportable reports help teams track implementation fidelity at Tier 2 and Tier 3 and share clear, compliant progress updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}