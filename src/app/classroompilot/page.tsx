import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
  description:
    "Special education software for teachers to plan IEP-aligned lessons, track student progress, document accommodations, and generate compliant reports quickly — all in one AI-driven workspace.",
};

export default function ClassroomPilotPage() {
  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software
        </h1>
        <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
          Special education software for teachers to plan IEP-aligned lessons, track student progress, document accommodations, and generate compliant reports quickly — all in one AI-driven workspace.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4 text-center">ClassroomPilot FAQs</h2>
        <div className="space-y-6 max-w-3xl mx-auto text-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900">What is ClassroomPilot used for?</h3>
            <p>
              ClassroomPilot is special education software for IEP goal tracking and progress monitoring. Plan IEP‑aligned lessons, collect data, and see growth by goal and standard.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Can it generate compliant reports for IEP meetings?</h3>
            <p>
              Yes. One‑click, compliant reports summarize progress monitoring, accommodations provided, and service delivery—ready to share with families and teams.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">How are accommodations documented?</h3>
            <p>
              Teachers can document accommodations during instruction, attach evidence, and track frequency to ensure compliance and support data‑driven decisions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Does it support IEP‑aligned lesson planning?</h3>
            <p>
              Built‑in templates help plan lessons aligned to goals and objectives, while real‑time dashboards show mastery trends and next steps for reteaching.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}