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
} from "lucide-react";
import { behaviorStudyToolsAppHref } from "@/lib/behavior-study-tools/links";

const freePracticeHref = behaviorStudyToolsAppHref("/free-practice/", {
  intent: "passbehavior_alternative",
  utm_content: "passbehavior_alternative_page",
});

export const metadata: Metadata = {
  title: "PassBehavior Alternative: BCBA Exam Prep | Behavior School",
  description:
    "Comparing PassBehavior alternatives? Behavior Study Tools offers free BCBA practice questions, timed mock exams, and domain-level results with a rationale on every answer.",
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
  { number: "1", title: "Start with free practice", description: "Answer a free set on study.behaviorschool.com. No credit card required." },
  { number: "2", title: "Read your domain results", description: "See which BACB content domains you missed and the rationale for each question." },
  { number: "3", title: "Choose the next study task", description: "Drill the weak domain, or take a free timed mock when you want a readiness check." },
];

export default function PassBehaviorAlternativePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 pt-32 pb-20 sm:pt-36 sm:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            Looking for PassBehavior? Try BehaviorSchool for BCBA Exam Prep
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 mb-8 leading-relaxed">
            If PassBehavior is not the right fit, Behavior Study Tools gives you practice questions with a rationale on every answer, timed mock exams, and domain-level results you can start using today, free.
          </p>
          <Link
            href={freePracticeHref}
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
            If you searched for PassBehavior and landed here, you are comparing options. The things that matter in any BCBA prep tool are the same: questions organized by BACB content domain, timed mock exams that match the real format, and results that tell you what to study next rather than just a score. That is what Behavior Study Tools is built around, and you can test it on free questions before deciding.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Two free ways to test it today
            </h2>
            <p className="mt-4 text-slate-700 leading-relaxed">
              Pick the one that matches where you are in your study plan. Both show domain-level results without a credit card.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link href="https://study.behaviorschool.com/free-practice/" className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50">
              <h3 className="font-bold text-slate-900">Free practice questions</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">A short set with a rationale on every answer. Start here if you want to see how the questions and explanations work.</p>
            </Link>
            <Link href="https://study.behaviorschool.com/free-mock-exam/" className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50">
              <h3 className="font-bold text-slate-900">Free timed mock exam</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">A timed run scored by domain. Start here if you already have a routine and want to know where you stand.</p>
            </Link>
          </div>
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
              href={freePracticeHref}
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
