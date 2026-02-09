import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CALABA 2026 Exclusive: 40% Off BCBA Study Tools | Behavior School",
  description:
    "CALABA 2026 attendees get 40% off Behavior School's AI-powered BCBA exam prep. Use code CALABA40 at checkout.",
  robots: { index: false, follow: false },
};

export default function CALABA40Page() {
  const studyAppUrl = "https://study.behaviorschool.com/auth?source=calaba40&action=signup";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Hero */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-emerald-500/30">
            🎓 CALABA 2026 Exclusive Offer
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            <span className="text-emerald-400">40% Off</span> AI-Powered
            <br />
            BCBA Exam Prep
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Thanks for attending our session! As a CALABA 2026 attendee, get
            exclusive access to Behavior School&apos;s study platform at 40% off.
          </p>

          <div className="bg-slate-800/80 border-2 border-dashed border-emerald-500/50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
            <p className="text-sm text-slate-400 mb-2">Use code at checkout:</p>
            <div className="text-3xl font-mono font-bold text-emerald-400 tracking-widest">
              CALABA40
            </div>
          </div>

          <Link
            href={studyAppUrl}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold px-10 py-5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
          >
            Start Your Free Trial →
          </Link>

          <p className="text-sm text-slate-500 mt-4">
            Free to start · Apply CALABA40 when you subscribe
          </p>
        </div>
      </div>

      {/* What You Get */}
      <div className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            What&apos;s Inside the Study Platform
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🧠",
                title: "10,000+ AI Questions",
                desc: "Adaptive practice that targets your weak areas automatically.",
              },
              {
                icon: "🤖",
                title: "AI Tutor",
                desc: "Ask questions and get detailed explanations in real time.",
              },
              {
                icon: "📊",
                title: "Mock Exams",
                desc: "Full-length simulated exams with score tracking and analytics.",
              },
              {
                icon: "📱",
                title: "Study Anywhere",
                desc: "Works on phone, tablet, and desktop. Study on the go.",
              },
              {
                icon: "🎯",
                title: "Task List Aligned",
                desc: "Questions mapped to the 5th Edition BCBA Task List.",
              },
              {
                icon: "⚡",
                title: "Progress Tracking",
                desc: "See exactly where you stand and what to study next.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing with discount */}
      <div className="pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            Your CALABA Pricing
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <h3 className="font-bold text-lg mb-2">Monthly</h3>
              <div className="mb-1">
                <span className="text-slate-500 line-through text-lg">$29.99</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400 mb-4">
                $17.99<span className="text-sm text-slate-400">/mo</span>
              </div>
              <Link
                href={studyAppUrl}
                className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-emerald-500/10 border-2 border-emerald-500 rounded-xl p-6 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </div>
              <h3 className="font-bold text-lg mb-2">Quarterly</h3>
              <div className="mb-1">
                <span className="text-slate-500 line-through text-lg">$89.99</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400 mb-4">
                $53.99<span className="text-sm text-slate-400">/qtr</span>
              </div>
              <Link
                href={studyAppUrl}
                className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
              <h3 className="font-bold text-lg mb-2">Annual</h3>
              <div className="mb-1">
                <span className="text-slate-500 line-through text-lg">$288</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400 mb-4">
                $172.80<span className="text-sm text-slate-400">/yr</span>
              </div>
              <Link
                href={studyAppUrl}
                className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About the session */}
      <div className="pb-20 px-4">
        <div className="max-w-3xl mx-auto bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-4">
            About Our CALABA 2026 Session
          </h2>
          <p className="text-slate-400 mb-4">
            <strong className="text-white">Beyond Observable Behavior:</strong>{" "}
            Measuring and Modifying the Function of Thought in School-Based
            Assessment
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Saturday, March 7 · 2:55–3:55 PM · Sacramento Convention Center
          </p>
          <p className="text-sm text-slate-400">
            Presented by Rob Spain, BCBA · Cristal Lopez, BCaBA · Megan Caluza,
            BCBA — KCUSD Behavior Team
          </p>
          <div className="mt-6">
            <Link
              href="https://robspain.com/calaba-2026/"
              className="text-emerald-400 hover:text-emerald-300 font-medium text-sm"
            >
              View full session details & download slides →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 py-8 px-4 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Behavior School · Code CALABA40 valid
          through March 31, 2026
        </p>
      </div>
    </div>
  );
}
