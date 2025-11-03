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

      {/* Test Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-bs-section-odd">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FreePracticeTestWidget />
        </div>
      </section>
    </div>
  );
}
