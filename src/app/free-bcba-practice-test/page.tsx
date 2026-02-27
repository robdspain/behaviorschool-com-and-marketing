import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import FreePracticeTestWidget from "./FreePracticeTestWidget";
import { CheckCircle, Zap, Lock, Target, BookOpen } from "lucide-react";

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
              <CheckCircle className="w-4 h-4 mr-2" />
              No Signup Required
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
              <Target className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-900">BACB Task List Aligned</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
              <Zap className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-900">Instant Feedback</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
              <Lock className="w-5 h-5 text-emerald-600" />
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

      {/* Free Ebook Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-bs-section-even">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Mockup Image */}
            <div className="flex justify-center lg:justify-end">
              <img 
                src="/images/bcba-exam-guide-3d-mockup.png" 
                alt="The 2026 BCBA Exam Survival Guide - Free Download"
                className="w-full max-w-md drop-shadow-2xl"
              />
            </div>
            
            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 text-sm font-semibold rounded-full mb-6">
                <BookOpen className="w-4 h-4 mr-2" />
                Free Download
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                The 2026 BCBA Exam Survival Guide
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Your complete roadmap to certification success. Includes evidence-based study strategies, 
                the 12-week study plan, key concepts breakdown, test-taking tips, and full APA references.
              </p>
              
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">5th Edition Task List breakdown with exam weights</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Research-backed 12-week study schedule</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">High-yield concepts: SEAT functions, reinforcement quadrant</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Test-taking strategies from cognitive science</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Full APA references (Cooper, Iwata, Bailey &amp; Burch, etc.)</span>
                </li>
              </ul>
              
              <a 
                href="/downloads/bcba-exam-survival-guide-2026.pdf"
                download
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                Download Free Guide →
              </a>
              <p className="text-sm text-slate-500 mt-4">
                Edited by Rob Spain, BCBA, IBA
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
