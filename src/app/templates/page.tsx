import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Downloadable Templates | Behavior School",
  description: "Download free printable templates for values-based interventions, behavior plans, ACT matrix worksheets, and more for school-based BCBAs.",
  alternates: { canonical: "https://behaviorschool.com/templates" },
  openGraph: {
    title: "Downloadable Templates | Behavior School",
    description: "Free printable templates for school-based BCBAs and behavior analysts",
    url: "https://behaviorschool.com/templates",
  },
};

const templates = [
  {
    name: "Values Interview (≈5 minutes)",
    url: "/templates/values-interview.html",
    description: "Brief interview to anchor goals in what matters to the student",
  },
  {
    name: "ACT Matrix / Choice-Point (Student)",
    url: "/templates/act-matrix-choice-point.html",
    description: "Values-based framework to guide choice-making when difficult thoughts or feelings show up",
  },
  {
    name: "Goal Builder (Values-Aligned)",
    url: "/templates/goal-builder.html",
    description: "Template for writing behavior goals aligned to student values with measurement criteria",
  },
  {
    name: "Daily Check Card",
    url: "/templates/daily-check-card.html",
    description: "Quick daily tracking tool for toward moves and value-aligned behaviors",
  },
  {
    name: "Weekly Review",
    url: "/templates/weekly-review.html",
    description: "Reflection template to assess barriers, micro-routines, and plan next steps",
  },
  {
    name: "Staff Fidelity Quick-Check",
    url: "/templates/staff-fidelity-check.html",
    description: "Checklist to monitor intervention fidelity and data collection",
  },
];

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Downloadable Templates
          </h1>
          <p className="text-lg text-slate-600">
            Free, printable templates for values-based interventions and behavior planning. Perfect for school-based BCBAs and behavior analysts.
          </p>
        </header>

        <div className="space-y-4 mb-8">
          {templates.map((template) => (
            <div
              key={template.url}
              className="border border-slate-200 rounded-lg p-6 hover:border-emerald-300 transition-colors bg-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    {template.name}
                  </h2>
                  <p className="text-slate-600">{template.description}</p>
                </div>
                <Link
                  href={template.url}
                  target="_blank"
                  className="ml-4 flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium whitespace-nowrap"
                >
                  <Download className="w-5 h-5" />
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            Custom Branding Available
          </h2>
          <p className="text-slate-600 mb-4">
            We can export these templates to PDF and style them with your school or district branding. 
            Perfect for creating a cohesive set of intervention tools across your campus.
          </p>
          <Link
            href="/contact"
            className="inline-block text-emerald-700 hover:text-emerald-800 font-medium"
          >
            Contact us for custom branding →
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            More Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/values-goal-assistant-landing"
              className="text-emerald-700 hover:text-emerald-800 font-medium"
            >
              Values-Based Goal Setting →
            </Link>
            <Link
              href="/act-matrix"
              className="text-emerald-700 hover:text-emerald-800 font-medium"
            >
              ACT Matrix Framework →
            </Link>
            <Link
              href="/behavior-plans"
              className="text-emerald-700 hover:text-emerald-800 font-medium"
            >
              Behavior Plan Writer →
            </Link>
            <Link
              href="/products"
              className="text-emerald-700 hover:text-emerald-800 font-medium"
            >
              Tools & Products →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}


