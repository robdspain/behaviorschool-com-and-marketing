import type { Metadata } from "next";
import ValuesWizard from "@/components/iep-goal-writer/ValuesWizard";
import { Target, BarChart3, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "IEP Behavior Goal Writer | Values Wizard | BehaviorSchool",
  description:
    "Create Level 5 SMART IEP behavior goals in under 5 minutes. Values-based approach creates student-driven goals with baseline, fluency, generalization, and maintenance components. Free for BCBAs and special education teachers.",
  openGraph: {
    title: "IEP Behavior Goal Writer | Values Wizard | BehaviorSchool",
    description:
      "Create Level 5 SMART IEP behavior goals in under 5 minutes with the Values Wizard. Free for BCBAs and teachers.",
    url: "https://behaviorschool.com/iep-goal-writer",
  },
};

export default function IEPGoalWriterPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="pt-20 pb-8 sm:pt-24 sm:pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald-700 mb-3">
            Free Tool · No Login Required
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            IEP Behavior Goal Writer
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
            Create research-backed Level 5 SMART goals in under 5 minutes with the <strong>Values Wizard</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1">✓ Baseline data</span>
            <span className="flex items-center gap-1">✓ Fluency criteria</span>
            <span className="flex items-center gap-1">✓ Generalization</span>
            <span className="flex items-center gap-1">✓ Maintenance</span>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
            <ValuesWizard />
          </div>
          <p className="text-center text-sm text-slate-500 mt-6">
            Free tool from <a href="/" className="text-emerald-700 font-medium hover:underline">BehaviorSchool</a> · Built on research by Cooper, Heron &amp; Heward; Stokes &amp; Baer; Kubina &amp; Yurich
          </p>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-10">
            Why Values-Based Goals Work Better
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="mb-3">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Student Investment</h3>
              <p className="text-sm text-slate-600">
                When goals connect to what students care about, they become partners in their own growth instead of passive recipients.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="mb-3">
                <BarChart3 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Level 5 SMART Goals</h3>
              <p className="text-sm text-slate-600">
                Include all research-backed components: baseline, accuracy criteria, fluency, generalization across settings, and maintenance.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="mb-3">
                <Zap className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">5 Minutes, Not 5 Hours</h3>
              <p className="text-sm text-slate-600">
                The guided wizard ensures you hit every component without starting from scratch. Copy, paste, done.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quote Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-xl italic text-slate-700 mb-4">
            &ldquo;When we start with what matters to students — their own values like being brave, kind, or helpful — everything changes. The goals become meaningful, and students become invested in their own growth.&rdquo;
          </blockquote>
          <p className="text-sm text-slate-500">
            — Rob Spain, M.S., BCBA, IBA
          </p>
        </div>
      </section>
    </main>
  );
}
