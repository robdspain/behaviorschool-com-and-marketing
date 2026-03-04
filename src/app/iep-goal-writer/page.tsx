import type { Metadata } from "next";
import IEPGoalWriter from "@/components/iep-goal-writer/IEPGoalWriter";

export const metadata: Metadata = {
  title: "IEP Behavior Goal Writer | Free Tool | BehaviorSchool",
  description:
    "Generate 3 draft SMART IEP behavior goals in minutes. Enter the target behavior, function, and grade level — get measurable, legally defensible goal language. Free for BCBAs and special education teachers.",
  openGraph: {
    title: "IEP Behavior Goal Writer | Free Tool | BehaviorSchool",
    description:
      "Generate 3 draft SMART IEP behavior goals in minutes. Free for BCBAs and special education teachers.",
    url: "https://behaviorschool.com/iep-goal-writer",
  },
};

export default function IEPGoalWriterPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="pt-20 pb-10 sm:pt-24 sm:pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald-700 mb-3">Free tool</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            IEP Behavior Goal Writer
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Generate three draft SMART behavior goals in under 60 seconds using function-based goal structure.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm">
            <IEPGoalWriter />
          </div>
          <p className="text-center text-sm text-slate-500 mt-6">
            Free tool from <a href="/" className="text-emerald-700 font-medium">BehaviorSchool</a> · No login required
          </p>
        </div>
      </section>
    </main>
  );
}
