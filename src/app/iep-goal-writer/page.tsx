import type { Metadata } from "next";
import BehaviorGoalWriter from "@/components/iep-goal-writer/ValuesWizard";
import { ClipboardList, FileCheck, SlidersHorizontal } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "IEP Behavior Goal Writer | BehaviorSchool",
  description:
    "Build a measurable IEP behavior goal from student-specific baseline, context, supports, and data-collection details.",
  canonical: "https://behaviorschool.com/iep-goal-writer",
});

export default function IEPGoalWriterPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="pt-20 pb-8 sm:pt-24 sm:pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald-700 mb-3">
            Free Tool | No Login Required
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            IEP Behavior Goal Writer
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
            Build a measurable behavior goal from student-specific baseline, context, supports, and data-collection details.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1">✓ Observable behavior</span>
            <span className="flex items-center gap-1">✓ Objective baseline</span>
            <span className="flex items-center gap-1">✓ Direction-specific criteria</span>
            <span className="flex items-center gap-1">✓ IEP team review</span>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-10 shadow-sm">
            <BehaviorGoalWriter />
          </div>
          <p className="text-center text-sm text-slate-500 mt-6">
            Free tool from <a href="/" className="text-emerald-700 font-medium hover:underline">BehaviorSchool</a>. Entries stay in this browser session and are not submitted.
          </p>
        </div>
      </section>
      
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-10">
            What the writer includes
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mb-3">
                <ClipboardList className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Student-specific inputs</h3>
              <p className="text-sm text-slate-600">
                Define the observable behavior, baseline, context, supports, and measurement method before generating the goal.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mb-3">
                <SlidersHorizontal className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Direction-specific criteria</h3>
              <p className="text-sm text-slate-600">
                Use separate defaults for increasing a skill or decreasing a behavior, then edit the criteria for the student.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mb-3">
                <FileCheck className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Reviewable output</h3>
              <p className="text-sm text-slate-600">
                Review a separate baseline and annual goal, with an optional replacement-skill goal and quarterly objectives.
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </main>
  );
}
