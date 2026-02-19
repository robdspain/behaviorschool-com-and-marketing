import type { Metadata } from "next";
import Link from "next/link";
import { Brain, Heart, Compass, ArrowRight, Sparkles } from "lucide-react";
import { ProTrialCTA } from "@/components/ui/ProTrialCTA";

export const metadata: Metadata = {
  title: "ACT Tools for Schools | Values, Matrix & Psychological Flexibility | Behavior School",
  description:
    "Free ACT (Acceptance and Commitment Therapy) tools for school-based behavior support. Values assessment, ACT Matrix, defusion exercises, and more for BCBAs and educators.",
  keywords: [
    "ACT tools",
    "ACT for schools",
    "acceptance and commitment therapy",
    "values assessment",
    "ACT matrix",
    "psychological flexibility",
    "school BCBA",
    "behavior support",
  ],
};

const tools = [
  {
    title: "Values Card Sort",
    description: "Help students identify what matters most to them through an interactive card sort activity.",
    href: "/act-tools/values-sort",
    icon: Heart,
    color: "bg-rose-100 text-rose-600",
  },
  {
    title: "ACT Metaphor Creator",
    description: "Generate age-appropriate ACT metaphors for teaching defusion, acceptance, and values.",
    href: "/act-tools/metaphor-creator",
    icon: Brain,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "ACT Matrix Builder",
    description: "Create a visual ACT Matrix to map student values, barriers, and committed actions.",
    href: "/act-fba-bip",
    icon: Compass,
    color: "bg-blue-100 text-blue-600",
  },
];

export default function ACTToolsPage() {
  return (
    <main className="min-h-screen bg-bs-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Brain className="w-4 h-4" />
            ACT for Schools
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            ACT Tools for School-Based Behavior Support
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            Free Acceptance and Commitment Therapy tools designed for BCBAs, school psychologists, and behavior teams working with students.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Choose a Tool</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-purple-300 hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center mb-4`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-slate-600 mb-4">{tool.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 group-hover:text-purple-700">
                Try it free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>

        {/* Pro Trial CTA */}
        <ProTrialCTA source="act-tools" className="mt-12" />

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What is ACT?</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              <strong>Acceptance and Commitment Therapy (ACT)</strong> is an evidence-based approach that helps students 
              develop psychological flexibility — the ability to be present, open up to difficult thoughts and feelings, 
              and take action guided by personal values.
            </p>
            <p>
              In school settings, ACT is particularly effective for students whose behavior is driven by rigid thinking 
              patterns, anxiety, or avoidance. Rather than just targeting surface behaviors, ACT addresses the underlying 
              psychological processes.
            </p>
            <h3>Six Core Processes of ACT:</h3>
            <ul>
              <li><strong>Acceptance:</strong> Making room for difficult feelings without struggling against them</li>
              <li><strong>Cognitive Defusion:</strong> Seeing thoughts as just thoughts, not literal truths</li>
              <li><strong>Present Moment:</strong> Paying attention to what&apos;s happening now</li>
              <li><strong>Self-as-Context:</strong> The observing self — &quot;I am not my thoughts&quot;</li>
              <li><strong>Values:</strong> Identifying what truly matters</li>
              <li><strong>Committed Action:</strong> Taking steps toward values, even when it&apos;s hard</li>
            </ul>
          </div>
        </div>

        {/* CalABA Link */}
        <div className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white text-center">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">ACT in Schools: CalABA 2026 Symposium</h3>
          <p className="text-slate-300 mb-6 max-w-lg mx-auto">
            Learn how Kings County USD implements ACT-informed FBAs and BIPs for students with internally-mediated behavior.
          </p>
          <Link
            href="/calaba-2026"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl transition-colors"
          >
            Get Symposium Materials <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
