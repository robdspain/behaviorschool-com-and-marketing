import { GoalWriterWizard } from "@/components/iep-goal-writer/GoalWriterWizard";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function IEPGoalWriterPage() {
  return (
    <main className="min-h-screen bg-bs-background">
      <div className="container mx-auto px-6 pt-20">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: "IEP Goal Writer" },
          ]}
        />
      </div>

      <section className="container mx-auto px-6 pb-16 pt-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1.2fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Values Wizard
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                IEP Behavior Goals that students actually care about
              </h1>
              <p className="text-base text-slate-600">
                Move beyond compliance. Start with student values and generate a research-backed, Level 5 SMART behavior goal in under five minutes.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "No registration required",
                "Baseline + fluency + maintenance included",
                "Built for special educators and BCBAs",
                "Copy-ready goal output",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-700">
                  <span className="mt-0.5 text-emerald-600">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">How it works</p>
              <p>Pick a value, define the behavior, set baseline and target, add fluency/generalization, and lock in maintenance.</p>
            </div>
          </div>

          <GoalWriterWizard />
        </div>
      </section>
    </main>
  );
}
