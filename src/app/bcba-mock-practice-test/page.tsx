import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  ArrowRight,
  Star,
  PlayCircle
} from "lucide-react";

import { practiceOptions } from './data';

// Below-the-fold content temporarily disabled to ensure stable build

// Lazy load structured data
const StructuredData = dynamic(() => import('./structured-data').then(mod => ({ default: mod.CourseStructuredData })));

const FAQData = dynamic(() => import('./structured-data').then(mod => ({ default: mod.FAQStructuredData })));

export const metadata: Metadata = {
  title: "🏆 FREE BCBA Mock Exam (185 Questions) | Pass Your BCBA Exam 2025",
  description: "Take the best FREE BCBA mock exam with 185 real exam-style questions. Get instant results, detailed explanations & personalized study plan. No signup - start your 4-hour BCBA practice test now!",
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
    "best bcba mock exams",
    "bcba mock exam",
    "free bcba mock exam",
    "bcba mock exam free",
    "mock bcba exam",
    "bcba free mock exam",
    "bcba mock practice test free",
    "free bcba practice test",
    "bcba exam simulation",
    "bcba practice questions free",
    "bcba test prep",
    "bcba exam prep",
    "bcba mock exam questions",
    "bcba mock exam questions free",
    "best bcba mock exam",
    "mock exams bcba",
    "free bcba exam prep",
    "bcba practice exam free"
  ],
  alternates: {
    canonical: "https://behaviorschool.com/bcba-mock-practice-test"
  },
  openGraph: {
    title: "Best BCBA Mock Exam (FREE) | 185 Questions | Instant Results",
    description: "Professional BCBA mock exam with 185 realistic questions. Complete 4-hour simulation, instant results, detailed explanations. Start now.",
    url: "https://behaviorschool.com/bcba-mock-practice-test",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Free BCBA Mock Practice Test",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best BCBA Mock Exam (FREE) | Instant Results | Start Now",
    description: "Professional BCBA mock exam with 185 realistic questions. Complete 4-hour simulation, instant results, detailed explanations.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function BCBAMockPracticeTestPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "BCBA Resources", href: "/bcba-exam-prep" },
    { label: "Mock Practice Test", href: "/bcba-mock-practice-test" },
  ];

  return (
    <div className="min-h-screen bg-bs-background">
      {/* Structured Data - Lazy Loaded */}
      <Suspense fallback={null}>
        <StructuredData />
        <FAQData />
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="pt-8 pb-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero Section - Above the fold, critical */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50 rounded-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100 to-transparent opacity-30 blur-3xl" />
          <div className="absolute -bottom-10 left-0 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-100 to-transparent opacity-20 blur-2xl" />

          <div className="relative text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <PlayCircle className="mr-2 h-4 w-4" />
              Free Mock Practice Tests
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Master the BCBA Exam with
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent"> Realistic Mock Tests</span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Build confidence, identify weak areas, and perfect your test-taking strategy with our comprehensive BCBA mock practice tests. Experience the real exam before exam day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              >
                <a href="https://study.behaviorschool.com/free-practice" target="_blank" rel="noopener noreferrer">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Start Free Mock Test
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Quick signup</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span>Realistic timing</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-emerald-600" />
                <span>Detailed analytics</span>
              </div>
            </div>
          </div>
        </section>

        {/* Practice Test Options - Above the fold */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Choose Your Practice Format
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Whether you have 30 minutes or 4 hours, we have the perfect practice option for your schedule
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {practiceOptions.map((option, index) => (
              <div key={index} className={`relative bg-white rounded-3xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 ${option.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''}`}>
                {option.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{option.title}</h3>
                  <p className="text-slate-600 mb-6">{option.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>{option.duration}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span>{option.questions}</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {option.ideal}
                    </div>
                  </div>

                  {option.features && (
                    <div className="text-left space-y-2 mb-6">
                      {option.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  asChild
                  size="lg"
                  className={`w-full rounded-2xl ${option.popular ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
                >
                  <a href={option.ctaUrl} target="_blank" rel="noopener noreferrer">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    {option.ctaText}
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FAQ Section for Mock Exam Queries */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              BCBA Mock Exam Questions - Answered
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about BCBA mock exams and practice tests
            </p>
          </div>

          <div className="space-y-6">
            {/* FAQ 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                What is a BCBA mock exam?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                A BCBA mock exam is a full-length practice test designed to simulate the actual BCBA certification exam. It contains 185 questions (just like the real exam), covers all 9 content areas from the BACB Task List, and has a 4-hour time limit. Mock exams help you identify knowledge gaps, practice time management, and build confidence before your actual exam date.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                How many BCBA mock exams should I take?
              </h3>
              <p className="text-slate-700 leading-relaxed mb-3">
                Most successful BCBA candidates take <strong>3-5 full mock exams</strong> during their study period. Here&apos;s the recommended schedule:
              </p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">→</span>
                  <span><strong>Baseline Mock (Week 1):</strong> Identify your starting point and weak areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">→</span>
                  <span><strong>Mid-Study Mocks (Weeks 8-12):</strong> Take 2-3 exams to track progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">→</span>
                  <span><strong>Final Mock (1 week before exam):</strong> Confirm readiness and fine-tune</span>
                </li>
              </ul>
            </div>

            {/* FAQ 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Are BCBA mock exams harder than the real exam?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Quality BCBA mock exams should be <strong>slightly harder</strong> than the actual exam. This &ldquo;over-preparation&rdquo; strategy ensures you&apos;re ready for any difficulty level. Our mock exams include challenging scenario-based questions that require application of knowledge (not just memorization), mirroring the real exam&apos;s emphasis on practical application. If you consistently score 70%+ on mock exams, you&apos;re likely ready for the actual BCBA exam.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                What&apos;s the difference between BCBA practice questions and mock exams?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                <strong>BCBA Practice Questions:</strong> Short quizzes (10-50 questions) focused on specific content areas or task list items. Great for daily study and targeting weak areas. No time pressure.<br/><br/>
                <strong>BCBA Mock Exams:</strong> Full 185-question tests covering all content areas with a 4-hour time limit. Simulates the actual exam experience including stamina, pacing, and decision-making under pressure. Use these to assess overall readiness.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Where can I find free BCBA mock exams?
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Behavior School offers <strong>completely free BCBA mock exams</strong> with no signup required. Our platform includes:
              </p>
              <ul className="space-y-2 text-slate-700 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Full 185-question mock exams</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Instant scoring and performance analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Detailed explanations for every question</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Performance breakdown by content area</span>
                </li>
              </ul>
              <Link href="/behavior-study-tools" className="text-emerald-700 hover:text-emerald-800 font-semibold">
                Start Your Free BCBA Mock Exam →
              </Link>
            </div>

            {/* FAQ 6 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                What score do I need on a BCBA mock exam to pass the real exam?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                While the BACB doesn&apos;t publish an exact passing score, research and historical data suggest the passing threshold is around <strong>65-70%</strong>. On mock exams, aim for <strong>75%+ consistently</strong> to account for test-day anxiety and variation. If you&apos;re scoring below 70% on mock exams, focus on your weakest content areas before scheduling your actual exam. Remember: the 2024 first-time pass rate is only 54%, so thorough preparation is essential.
              </p>
            </div>

            {/* FAQ 7 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Best BCBA mock exams: What should I look for?
              </h3>
              <p className="text-slate-700 leading-relaxed mb-3">
                The best BCBA mock exams have these characteristics:
              </p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span><strong>185 questions</strong> matching real exam length</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span><strong>BACB Task List alignment</strong> with proper content distribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Detailed explanations</strong> for correct and incorrect answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Performance analytics</strong> showing strengths and weaknesses</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Scenario-based questions</strong> requiring application, not memorization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Created by BCBAs</strong> with exam writing experience</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Test Your BCBA Knowledge?</h3>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Take a free BCBA mock exam now and get instant feedback on your readiness. No signup required.
            </p>
            <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-slate-100">
              <Link href="/behavior-study-tools">
                Start Free Mock Exam
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
