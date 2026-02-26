import Link from "next/link";
import { Metadata } from "next";
import {
  BookOpen,
  ClipboardList,
  BarChart3,
  Brain,
  Search,
  TrendingUp,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "BDS Modules Alternative — BCBA Exam Prep That's Actually Available",
  description:
    "Looking for BDS Modules? The site appears to be down. BehaviorSchool offers BCBA practice questions, mock exams, and analytics — available now.",
};

const FEATURES = [
  {
    icon: BookOpen,
    title: "Practice Questions by BACB Content Domain",
    description:
      "Questions organized around the BACB Task List so you study what the exam actually tests.",
  },
  {
    icon: ClipboardList,
    title: "Full-Length Mock Exams with Timing",
    description:
      "Simulate real exam conditions with timed, full-length practice tests that mirror the BCBA format.",
  },
  {
    icon: Search,
    title: "Domain Mini-Exams",
    description:
      "Drill into specific content domains when you need focused practice on a particular area.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "See your scores broken down by domain so you know exactly where to spend your study time.",
  },
  {
    icon: Brain,
    title: "Flashcard Study Sessions with SAFMEDS Mode",
    description:
      "Build fluency with flashcards, including a dedicated SAFMEDS (Say All Fast Minute Every Day Shuffled) practice mode.",
  },
  {
    icon: TrendingUp,
    title: "Error Analysis",
    description:
      "Review the specific questions you keep getting wrong so you can close your knowledge gaps systematically.",
  },
];

const STEPS = [
  { number: "1", title: "Create a free account", description: "Sign up at study.behaviorschool.com — no credit card required to start." },
  { number: "2", title: "Pick your domains", description: "Select the BACB content areas you want to focus on first." },
  { number: "3", title: "Start practicing", description: "Work through questions, review explanations, and track your progress." },
];

export default function BDSModulesAlternativePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 pt-32 pb-20 sm:pt-36 sm:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            BDS Modules Appears to Be Down — Here&apos;s What BCBA Candidates Are Using Instead
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 mb-8 leading-relaxed">
            If you came here looking for BDS Modules, you&apos;re not alone. Many BCBA candidates have noticed the site has been unavailable. BehaviorSchool is an actively maintained exam prep platform you can use right now.
          </p>
          <Link
            href="https://study.behaviorschool.com/signup"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-900 font-bold text-lg px-8 py-4 rounded-xl transition-colors"
          >
            Try BehaviorSchool Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-slate-700 leading-relaxed">
            BCBAs searching for BDS Modules are looking for serious, structured exam prep — practice questions, mock exams, and a way to track their readiness across BACB content domains. BDS Modules has been a recognized name in BCBA study resources, but its site has been experiencing availability issues. BehaviorSchool was built to serve the same need and is actively developed and maintained.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-10 text-center">
            What BehaviorSchool Offers
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex gap-4 p-6 rounded-xl border border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-16 sm:py-20 bg-emerald-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-10 text-center">
            How to Get Started
          </h2>
          <div className="space-y-6 mb-12">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="https://study.behaviorschool.com/signup"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors"
            >
              Try BehaviorSchool Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
