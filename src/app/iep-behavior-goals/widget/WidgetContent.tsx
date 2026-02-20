"use client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { GoalWriterWizard } from "@/components/iep-goal-writer/GoalWriterWizard";

export default function WidgetContent() {
  return (
    <div className="min-h-screen bg-slate-50/50 w-full max-w-full overflow-x-hidden">
      {/* Breadcrumbs */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: "IEP Goal Writer", href: "/iep-goals" },
            { label: "Free Behavior Goals", href: "/iep-behavior-goals" },
            { label: "Generator" }
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 shadow-sm">
            Values-Based Tool
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            IEP Behavior Goal <span className="text-emerald-600">Generator</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Create research-backed, Level 5 SMART behavior goals with baseline, fluency, generalization, and maintenance in under 5 minutes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
              No Registration Required
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
              100% Free
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
              PDF Export
            </div>
          </div>
        </div>
      </section>

      {/* Goal Writer Widget */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <GoalWriterWizard />
      </section>

      {/* Email Signup Section */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-indigo-100">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Want to Save Your Goals & Get Weekly IEP Tips?
            </h3>
            <p className="text-slate-600">
              Join our community and get expert tips, templates, and resources for writing effective IEP goals.
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}