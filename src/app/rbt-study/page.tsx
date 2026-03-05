import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  ArrowRight,
  Target,
  BarChart3,
  Clock,
  BookOpen,
  Layers,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "RBT Exam Prep - Practice Tests & Flashcards | BehaviorSchool",
  description:
    "Prepare for the RBT certification exam with mock exams, flashcards, SAFMEDS practice, and progress tracking. 2nd edition task list coverage.",
};

export default function RBTStudyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f7f3ee]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#e4b63d33,transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f4d3f12_1px,transparent_1px),linear-gradient(to_bottom,#1f4d3f12_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e4b63d]/40 bg-[#e4b63d]/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f4d3f]">
              <BadgeCheck size={16} />
              RBT Exam Prep
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1f4d3f] leading-tight tracking-tight">
              Pass the RBT exam on your first try.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
              Mock exams, flashcards, and SAFMEDS practice aligned to the 2nd edition RBT task list. Track your progress and know when you're ready.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="https://rbtstudy.behaviorschool.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[#1f4d3f] bg-[#e4b63d] rounded-full hover:bg-[#d4a82d] transition-colors"
              >
                Start free practice
                <ArrowRight className="ml-2" size={16} />
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[#1f4d3f] border border-[#1f4d3f]/40 rounded-full hover:bg-[#1f4d3f]/10 transition-colors"
              >
                See what's included
              </a>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              No credit card required. Start practicing immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#1f4d3f]">85</div>
              <div className="text-sm text-slate-500 mt-1">Questions per exam</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1f4d3f]">2nd Ed</div>
              <div className="text-sm text-slate-500 mt-1">Task list aligned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1f4d3f]">Free</div>
              <div className="text-sm text-slate-500 mt-1">To start practicing</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1f4d3f]">Instant</div>
              <div className="text-sm text-slate-500 mt-1">Feedback on answers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 sm:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1f4d3f] mb-4">
              Study Tools
            </p>
            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900">
              Everything you need to prepare
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Full Mock Exams",
                description: "85-question timed exams that mirror the real RBT certification test format.",
              },
              {
                icon: Layers,
                title: "Flashcards",
                description: "Review key terms, definitions, and concepts with digital flashcard decks.",
              },
              {
                icon: Zap,
                title: "SAFMEDS Practice",
                description: "Say-All-Fast-Minute-Every-Day-Shuffled drills for fluency building.",
              },
              {
                icon: BarChart3,
                title: "Progress Tracking",
                description: "See your scores improve and identify weak areas to focus on.",
              },
              {
                icon: BookOpen,
                title: "Answer Explanations",
                description: "Learn from every question with detailed rationales for correct answers.",
              },
              {
                icon: Clock,
                title: "Timed Practice",
                description: "Build pacing confidence with realistic exam timing conditions.",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-[28px] border border-[#e4b63d]/20 bg-[#fffcf5] p-8 shadow-[0_20px_60px_rgba(228,182,61,0.08)]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#e4b63d]/20 flex items-center justify-center mb-6">
                    <Icon className="text-[#1f4d3f]" size={22} strokeWidth={1.6} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Task List Coverage */}
      <section className="py-24 sm:py-32 bg-[#f9f7f2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900">
              2nd Edition Task List Coverage
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Questions aligned to every section of the current RBT task list.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "A. Measurement",
              "B. Assessment",
              "C. Skill Acquisition",
              "D. Behavior Reduction",
              "E. Documentation & Reporting",
              "F. Professional Conduct & Scope of Practice",
            ].map((section) => (
              <div
                key={section}
                className="flex items-center gap-4 rounded-2xl border border-[#1f4d3f]/10 bg-white p-5 shadow-sm"
              >
                <CheckCircle2 className="text-[#1f4d3f] flex-shrink-0" size={22} />
                <p className="text-lg font-medium text-slate-800">{section}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#e4b63d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1f4d3f] mb-4">
            Ready to start practicing?
          </h2>
          <p className="text-[#1f4d3f]/70 text-lg mb-8 max-w-2xl mx-auto">
            Create a free account and take your first mock exam today.
          </p>
          <a
            href="https://rbtstudy.behaviorschool.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#1f4d3f] rounded-full hover:bg-[#173a2f] transition-colors"
          >
            Start free practice
            <ArrowRight className="ml-2" size={18} />
          </a>
        </div>
      </section>

      {/* Also check out BCBA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 mb-4">Pursuing your BCBA?</p>
          <Link
            href="/study"
            className="inline-flex items-center text-[#1f4d3f] font-semibold hover:underline"
          >
            See BCBA exam prep tools
            <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
