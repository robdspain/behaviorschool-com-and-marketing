import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClassroomPilot – FAQ | Behavior School",
  description:
    "Answers to common questions about ClassroomPilot, including IEP goal tracking, progress monitoring, accommodations, and collaboration features.",
};

export default function ClassroomPilotFaqPage() {
  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h1>
      </header>

      <div className="grid gap-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">What is the best IEP goal tracking software for teachers?</h3>
          <p className="mt-2 text-slate-700">ClassroomPilot helps special education teachers track IEP goals, monitor student progress, and generate reports — all in a single, user-friendly platform.</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Can ClassroomPilot help with IEP progress monitoring?</h3>
          <p className="mt-2 text-slate-700">Yes. The platform lets you log progress in real time, view trends, and create parent- and admin-friendly reports instantly.</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Does ClassroomPilot work for tracking accommodations?</h3>
          <p className="mt-2 text-slate-700">Absolutely. ClassroomPilot includes tools for documenting accommodations and modifications, ensuring IDEA compliance and easy reporting.</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Can ClassroomPilot improve collaboration with paras and service providers?</h3>
          <p className="mt-2 text-slate-700">Yes. You can share lesson plans, track shared student progress, and communicate updates with paraprofessionals and service providers securely.</p>
        </div>
      </div>
    </div>
  );
}