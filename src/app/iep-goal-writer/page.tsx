import type { Metadata } from "next";
import Link from "next/link";
import BehaviorGoalWriter from "@/components/iep-goal-writer/ValuesWizard";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "BehaviorSchool Goal Writing System | IEP Behavior Goals",
  description:
    "Use the BehaviorSchool Goal Writing System to build an editable IEP behavior goal draft from student-specific baseline, context, supports, and measurement decisions.",
  canonical: "https://behaviorschool.com/iep-goal-writer",
});

export default function IEPGoalWriterPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="pt-14 pb-8 sm:pt-16 sm:pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald-700 mb-3">
            Free Tool | No Login Required
          </p>
          <h1 className="text-balance text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl mb-4">
            BehaviorSchool Goal Writing System
          </h1>
          <p className="max-w-2xl mx-auto text-base leading-7 text-slate-600 sm:text-lg mb-4">
            Build an editable IEP behavior goal draft from student-specific baseline, context, supports, and measurement decisions.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span>Observable behavior</span>
            <span>Objective baseline</span>
            <span>Direction-specific criteria</span>
            <span>BehaviorSchool Goal Draft</span>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-10 shadow-sm">
            <BehaviorGoalWriter />
          </div>
          <p className="text-center text-sm text-slate-500 mt-6">
            Free tool from <Link href="/" className="text-emerald-700 font-medium hover:underline">BehaviorSchool</Link>. Entries stay in this browser session and are not submitted.
          </p>
        </div>
      </section>
    </main>
  );
}
