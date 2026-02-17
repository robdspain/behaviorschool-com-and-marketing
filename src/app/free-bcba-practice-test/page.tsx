import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import FreePracticeTestWidget from "./FreePracticeTestWidget";

export const metadata: Metadata = {
  title: "Free BCBA Practice Test - No Signup Required | Instant Results",
  description: "Take a comprehensive BCBA practice test completely free. No signup required until you want to save your results. Get instant feedback and detailed explanations.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: [
    "free bcba practice test",
    "bcba exam practice",
    "bcba test no signup",
    "free bcba exam",
    "bcba practice questions",
    "bcba test prep"
  ],
  alternates: {
    canonical: "https://behaviorschool.com/free-bcba-practice-test"
  },
  openGraph: {
    title: "Free BCBA Practice Test - No Signup Required",
    description: "Take a comprehensive BCBA practice test completely free. Get instant feedback and detailed explanations.",
    url: "https://behaviorschool.com/free-bcba-practice-test",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Free BCBA Practice Test",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free BCBA Practice Test - No Signup Required",
    description: "Take a comprehensive BCBA practice test completely free. Get instant feedback and detailed explanations.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function FreeBCBAPracticeTestPage() {
  return (
    <div className="min-h-screen bg-bs-background">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs items={[
          { label: "BCBA Exam Prep", href: "/bcba-exam-prep" },
          { label: "Free Practice Test" }
        ]} />
      </div>

      {/* Hero Section */}
      <section className="pt-8 md:pt-10 pb-12 sm:pb-16 lg:pb-20 bg-bs-section-even">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full mb-6">
              ✨ No Signup Required
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Free BCBA Practice Test
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Take a comprehensive BCBA practice test right now - no signup required. Complete the test, then optionally create a free account to save your results and unlock daily practice questions with detailed explanations.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
              <span className="text-2xl">🎯</span>
              <span className="text-sm font-semibold text-slate-900">BACB Task List Aligned</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
              <span className="text-2xl">⚡</span>
              <span className="text-sm font-semibold text-slate-900">Instant Feedback</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
              <span className="text-2xl">🔓</span>
              <span className="text-sm font-semibold text-slate-900">No Signup Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tutor Preview Section */}
      <section className="py-14 sm:py-18 lg:py-20 bg-bs-section-odd">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-4">
                🤖 AI Tutor Preview
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                See how our AI coach helps you answer questions faster
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                In study.behaviorschool.com/quiz, our AI assistant explains why each option is right or wrong, highlights key Task List clues, and gives a quick rule of thumb so you can learn while you practice.
              </p>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-emerald-600">✔</span>
                  <span><strong>Instant rationale</strong> after every question.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-emerald-600">✔</span>
                  <span><strong>Task List tags</strong> so you know what to study next.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-emerald-600">✔</span>
                  <span><strong>Confidence tips</strong> to avoid common distractors.</span>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://study.behaviorschool.com/quiz"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-700 transition-colors"
                >
                  Try the AI‑guided quiz
                </a>
                <a
                  href="https://study.behaviorschool.com"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-emerald-700 text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors"
                >
                  Explore the full study suite
                </a>
              </div>
              <p className="text-xs text-slate-500 mt-3">No signup required for the preview quiz.</p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-slate-900">AI Tutor Demo</div>
                <span className="text-xs text-slate-500">BCBA Task List 6</span>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Sample Question</div>
                  <p className="text-slate-900 font-semibold">
                    A student screams to escape a writing task. Which function is most likely maintaining the behavior?
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                    <div className="px-3 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900">Escape (correct)</div>
                    <div className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600">Attention</div>
                    <div className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600">Tangibles</div>
                    <div className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600">Automatic</div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">AI Coach Explanation</div>
                  <div className="space-y-3 text-sm text-slate-700">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">AI</div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">Why “Escape” is correct</p>
                        <p>The behavior removes an aversive task. That’s classic negative reinforcement.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-amber-400 text-emerald-900 flex items-center justify-center font-bold">Tip</div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">Rule of thumb</p>
                        <p>If the demand stops, think <strong>escape</strong> before anything else.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">Task List: F-01</span>
                    <span className="px-3 py-1 rounded-full text-xs bg-slate-200 text-slate-700">Confidence: 92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-bs-section-even">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FreePracticeTestWidget />
        </div>
      </section>
    </div>
  );
}
