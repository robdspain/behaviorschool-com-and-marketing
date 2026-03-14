import Link from "next/link";
import {
  Clock,
  FileCheck,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  BookOpen,
  Target,
} from "lucide-react";

export const metadata = {
  title: "For Supervisees - Track Your Fieldwork Hours | BehaviorSchool",
  description:
    "Log your BCBA or RBT fieldwork hours, submit for supervisor review, and track your progress toward certification.",
};

export default function ForSuperviseesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f7f3ee]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#e4b63d33,transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f4d3f12_1px,transparent_1px),linear-gradient(to_bottom,#1f4d3f12_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e4b63d]/40 bg-[#e4b63d]/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f4d3f]">
                For Supervisees
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1f4d3f] leading-tight tracking-tight">
                Track your hours. Get certified.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                Log your BCBA or RBT fieldwork hours, submit for supervisor review, and track your progress toward certification — all in one place.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="https://supervision.behaviorschool.com/register?role=supervisee"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[#1f4d3f] bg-[#e4b63d] rounded-full hover:bg-[#d4a82d] transition-colors"
                >
                  Start tracking my hours
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[#1f4d3f] border border-[#1f4d3f]/40 rounded-full hover:bg-[#1f4d3f]/10 transition-colors"
                >
                  See what you get
                </a>
              </div>
            </div>
            <div className="relative hidden lg:block">
              {/* Product mockup for supervisee */}
              <div className="rounded-2xl overflow-hidden border border-[#1f4d3f]/10 shadow-2xl bg-white">
                <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="mx-auto bg-white rounded-md px-3 py-1 text-xs text-slate-400 font-mono border border-slate-200">
                    supervision.behaviorschool.com
                  </div>
                </div>
                <div className="p-5 bg-slate-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">My Progress</p>
                      <p className="text-base font-bold text-slate-900">BCBA Fieldwork</p>
                    </div>
                    <div className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">On Track</div>
                  </div>
                  
                  {/* Hours card */}
                  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-semibold text-slate-900">Total Hours</p>
                      <p className="text-2xl font-bold text-[#1f4d3f]">1,420 <span className="text-sm text-slate-400 font-normal">/ 2,000</span></p>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-[#1f4d3f] rounded-full" style={{ width: "71%" }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 rounded-lg p-2">
                        <p className="text-slate-500">Restricted</p>
                        <p className="font-semibold text-slate-900">320h</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2">
                        <p className="text-slate-500">Unrestricted</p>
                        <p className="font-semibold text-slate-900">1,100h</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent sessions */}
                  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900 mb-3">Recent Sessions</p>
                    <div className="space-y-2">
                      {[
                        { date: "Mar 4", hours: "2.5h", type: "Direct", status: "Approved" },
                        { date: "Mar 3", hours: "1.5h", type: "Supervision", status: "Pending" },
                      ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">{session.date}</span>
                            <span className="font-medium text-slate-700">{session.hours}</span>
                            <span className="text-slate-400">{session.type}</span>
                          </div>
                          <span className={session.status === "Approved" ? "text-emerald-600" : "text-amber-600"}>{session.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 sm:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1f4d3f] mb-4">
              Supervisee Tools
            </p>
            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900">
              Everything you need to track your fieldwork
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Hour Logging",
                description: "Log restricted and unrestricted hours with dates, activities, and notes.",
              },
              {
                icon: FileCheck,
                title: "Supervisor Review",
                description: "Submit hours for supervisor approval and track pending sessions.",
              },
              {
                icon: BarChart3,
                title: "Progress Dashboard",
                description: "See your total hours, pace, and estimated completion date.",
              },
              {
                icon: Target,
                title: "BCBA & RBT Pathways",
                description: "Track requirements for either certification pathway.",
              },
              {
                icon: GraduationCap,
                title: "Exam Prep Integration",
                description: "Pair with study.behaviorschool.com for exam preparation.",
              },
              {
                icon: BookOpen,
                title: "Verification Forms",
                description: "Download BACB-compliant verification forms anytime.",
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

      {/* Benefits */}
      <section className="py-24 sm:py-32 bg-[#f9f7f2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900">
              Stay on track to certification
            </h2>
          </div>

          <div className="space-y-6">
            {[
              "Log hours from any device — no spreadsheets needed",
              "Submit sessions to your supervisor for instant review",
              "Track restricted vs. unrestricted hours automatically",
              "See your progress toward BCBA or RBT requirements",
              "Download BACB verification forms when you need them",
              "Pair with exam prep to study while you gain hours",
            ].map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-4 rounded-2xl border border-[#e4b63d]/20 bg-white p-6 shadow-sm"
              >
                <CheckCircle2 className="text-[#e4b63d] mt-0.5 flex-shrink-0" size={22} />
                <p className="text-lg text-slate-800">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#e4b63d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1f4d3f] mb-4">
            Ready to start tracking your hours?
          </h2>
          <p className="text-[#1f4d3f]/70 text-lg mb-8 max-w-2xl mx-auto">
            Create your free account and connect with your supervisor today.
          </p>
          <a
            href="https://supervision.behaviorschool.com/register?role=supervisee"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#1f4d3f] rounded-full hover:bg-[#173a2f] transition-colors"
          >
            Start tracking my hours
            <ArrowRight className="ml-2" size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}
