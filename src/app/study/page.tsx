import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  BadgeCheck,
  ArrowRight,
  Target,
  BarChart3,
  Clock,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Exam Prep - BCBA & RBT Practice Tests | BehaviorSchool",
  description:
    "Practice exams and study tools for BCBA and RBT certification. Mock exams, progress tracking, and focused practice.",
};

export default function StudyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f7f3ee]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#e4b63d22,transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f4d3f12_1px,transparent_1px),linear-gradient(to_bottom,#1f4d3f12_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1f4d3f]/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f4d3f]">
                Exam Prep
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1f4d3f] leading-tight tracking-tight">
                Practice for your certification exam.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                Mock exams, focused practice, and progress tracking for BCBA and RBT candidates. Start free — no account required.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="#exams"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-[#1f4d3f] rounded-full hover:bg-[#173a2f] transition-colors"
                >
                  Choose your exam
                </a>
                <Link
                  href="/free-study-plan"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[#1f4d3f] border border-[#1f4d3f]/40 rounded-full hover:bg-[#1f4d3f]/10 transition-colors"
                >
                  Get a free study plan
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-8 rounded-[32px] bg-[#1f4d3f]/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-[#1f4d3f]/10 bg-white/80 shadow-[0_30px_90px_rgba(31,77,63,0.18)]">
                <Image
                  src="/optimized/OperatingSystem/DD83BB21-6F33-4A94-BF67-311EDDE6D309.webp"
                  alt="Student studying for certification exam"
                  width={640}
                  height={480}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Exam Cards */}
      <section id="exams" className="py-24 sm:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1f4d3f] mb-4">
              Choose Your Path
            </p>
            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900">
              BCBA or RBT?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Both platforms include mock exams, progress tracking, and instant feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* BCBA Card */}
            <article className="group rounded-[28px] border border-[#1f4d3f]/10 bg-[#fbfaf8] overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(31,77,63,0.08)]">
              <div className="bg-[#1f4d3f] px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <GraduationCap className="text-white" size={28} strokeWidth={1.6} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">BCBA Exam Prep</h3>
                    <p className="text-emerald-200 text-sm">Board Certified Behavior Analyst</p>
                  </div>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="text-[#1f4d3f] mt-0.5 flex-shrink-0" size={18} />
                    <span>Full-length 185-question mock exams</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="text-[#1f4d3f] mt-0.5 flex-shrink-0" size={18} />
                    <span>6th edition task list coverage</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="text-[#1f4d3f] mt-0.5 flex-shrink-0" size={18} />
                    <span>Domain-specific mini exams</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="text-[#1f4d3f] mt-0.5 flex-shrink-0" size={18} />
                    <span>Score reports and progress tracking</span>
                  </li>
                </ul>
                <a
                  href="https://study.behaviorschool.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f4d3f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#173a2f] transition"
                >
                  Start BCBA Practice
                  <ArrowRight size={16} />
                </a>
              </div>
            </article>

            {/* RBT Card */}
            <article className="group rounded-[28px] border border-[#e4b63d]/30 bg-[#fffcf5] overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(228,182,61,0.12)]">
              <div className="bg-[#e4b63d] px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/30 flex items-center justify-center">
                    <BadgeCheck className="text-[#1f4d3f]" size={28} strokeWidth={1.6} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-[#1f4d3f]">RBT Exam Prep</h3>
                    <p className="text-[#1f4d3f]/70 text-sm">Registered Behavior Technician</p>
                  </div>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <ul className="space-y-3 mb-6 flex-1">
                  <li className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="text-[#e4b63d] mt-0.5 flex-shrink-0" size={18} />
                    <span>Full-length 85-question mock exams</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="text-[#e4b63d] mt-0.5 flex-shrink-0" size={18} />
                    <span>2nd edition task list coverage</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="text-[#e4b63d] mt-0.5 flex-shrink-0" size={18} />
                    <span>Flashcards and SAFMEDS practice</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="text-[#e4b63d] mt-0.5 flex-shrink-0" size={18} />
                    <span>Score reports and progress tracking</span>
                  </li>
                </ul>
                <Link
                  href="/rbt-study"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e4b63d] px-6 py-3 text-sm font-semibold text-[#1f4d3f] hover:bg-[#d4a82d] transition"
                >
                  Start RBT Practice
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 sm:py-32 bg-[#f9f7f2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1f4d3f] mb-4">
              What You Get
            </p>
            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900">
              Practice tools that work
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: "Realistic Format",
                description: "Questions and timing that match the actual exam.",
              },
              {
                icon: BarChart3,
                title: "Progress Tracking",
                description: "See your scores improve over time.",
              },
              {
                icon: Clock,
                title: "Timed Practice",
                description: "Build pacing confidence before test day.",
              },
              {
                icon: BookOpen,
                title: "Explanations",
                description: "Learn from every question with rationales.",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-[#1f4d3f]/10 bg-white p-6 shadow-sm"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#1f4d3f]/10 flex items-center justify-center mb-4">
                    <Icon className="text-[#1f4d3f]" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1f4d3f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Ready to start practicing?
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            No signup required to begin. Create an account when you're ready to track your progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://study.behaviorschool.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-[#1f4d3f] bg-white rounded-full hover:bg-emerald-50 transition-colors"
            >
              BCBA Practice
            </a>
            <Link
              href="/rbt-study"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-[#1f4d3f] bg-[#e4b63d] rounded-full hover:bg-[#d4a82d] transition-colors"
            >
              RBT Practice
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
