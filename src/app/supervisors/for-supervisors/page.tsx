import Link from "next/link";
import Image from "next/image";
import {
  Users,
  ClipboardList,
  BarChart3,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  Shield,
} from "lucide-react";

export const metadata = {
  title: "For Supervisors - BCBA Supervision Tracking | BehaviorSchool",
  description:
    "Track supervisee hours, generate BACB verification forms, and monitor competency progress. Built for school-based BCBAs.",
};

export default function ForSupervisorsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1f4d3f]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#e4b63d22,transparent_55%)]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                For Supervisors
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight tracking-tight">
                Manage your entire caseload in one place.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-emerald-100/80 max-w-2xl leading-relaxed">
                Log hours, track competencies, generate BACB verification forms, and monitor supervisee progress — without spreadsheets.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="https://supervision.behaviorschool.com/register?role=supervisor"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[#1f4d3f] bg-white rounded-full hover:bg-emerald-50 transition-colors"
                >
                  Create supervisor account
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white border border-white/40 rounded-full hover:bg-white/10 transition-colors"
                >
                  See what you get
                </a>
              </div>
            </div>
            <div className="relative hidden lg:block">
              {/* Product mockup */}
              <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-white">
                <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="mx-auto bg-white rounded-md px-3 py-1 text-xs text-slate-400 font-mono border border-slate-200">
                    supervision.behaviorschool.com
                  </div>
                </div>
                <div className="p-5 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Supervisor Dashboard</p>
                      <p className="text-base font-bold text-slate-900">My Supervisees</p>
                    </div>
                    <div className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">3 Active</div>
                  </div>
                  {[
                    { name: "Sarah M.", pathway: "BCBA", hours: 1420, required: 2000, status: "On Track" },
                    { name: "Jordan T.", pathway: "RBT", hours: 380, required: 500, status: "Needs Review" },
                    { name: "Alex R.", pathway: "BCBA", hours: 1890, required: 2000, status: "Exam Ready" },
                  ].map((s) => {
                    const pct = Math.round((s.hours / s.required) * 100);
                    const statusColor = s.status === "Exam Ready" ? "text-emerald-700 bg-emerald-50" : s.status === "On Track" ? "text-blue-700 bg-blue-50" : "text-amber-700 bg-amber-50";
                    return (
                      <div key={s.name} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#1E3A34] text-white flex items-center justify-center text-xs font-bold">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                              <p className="text-xs text-slate-400">{s.pathway} Candidate</p>
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>{s.status}</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Fieldwork Hours</span>
                            <span className="font-semibold text-slate-700">{s.hours} / {s.required}h</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
              Supervisor Tools
            </p>
            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900">
              Everything you need to supervise
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Caseload Overview",
                description: "See all your supervisees, their hours, and status at a glance.",
              },
              {
                icon: Clock,
                title: "Hour Tracking",
                description: "Log restricted and unrestricted hours with timestamps and notes.",
              },
              {
                icon: FileCheck,
                title: "Verification Forms",
                description: "Generate BACB monthly and final verification forms automatically.",
              },
              {
                icon: ClipboardList,
                title: "Competency Tracking",
                description: "Monitor task list competency progress for each supervisee.",
              },
              {
                icon: BarChart3,
                title: "Progress Analytics",
                description: "Track study accuracy and exam readiness over time.",
              },
              {
                icon: Shield,
                title: "Digital Signatures",
                description: "Secure digital signature workflow for all documentation.",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-[28px] border border-[#1f4d3f]/10 bg-[#fbfaf8] p-8 shadow-[0_20px_60px_rgba(31,77,63,0.08)]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#1f4d3f]/10 flex items-center justify-center mb-6">
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
              Built for school-based BCBAs
            </h2>
          </div>

          <div className="space-y-6">
            {[
              "Eliminate spreadsheet tracking — everything in one dashboard",
              "Generate audit-ready BACB documentation in seconds",
              "Monitor supervisee exam readiness with live study data",
              "Track multiple supervisees across BCBA and RBT pathways",
              "Digital signatures for all verification forms",
            ].map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-4 rounded-2xl border border-[#1f4d3f]/10 bg-white p-6 shadow-sm"
              >
                <CheckCircle2 className="text-[#1f4d3f] mt-0.5 flex-shrink-0" size={22} />
                <p className="text-lg text-slate-800">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1f4d3f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Ready to simplify your supervision workflow?
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Create your supervisor account and start tracking your caseload today.
          </p>
          <a
            href="https://supervision.behaviorschool.com/register?role=supervisor"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-[#1f4d3f] bg-white rounded-full hover:bg-emerald-50 transition-colors"
          >
            Create supervisor account
            <ArrowRight className="ml-2" size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}
