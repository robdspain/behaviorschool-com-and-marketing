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
  TrendingUp,
  Zap,
  BarChart3,
  Brain,
  Shield,
  ArrowRight,
  Star,
  Award,
  Users,
  BookOpen,
  PlayCircle
} from "lucide-react";

import { mockTestFeatures, testBenefits, practiceOptions } from './data';

// Below-the-fold content temporarily disabled to ensure stable build

// Lazy load structured data
const StructuredData = dynamic(() => import('./structured-data').then(mod => ({ default: mod.CourseStructuredData })));

const FAQData = dynamic(() => import('./structured-data').then(mod => ({ default: mod.FAQStructuredData })));

export const metadata: Metadata = {
  title: "Best BCBA Mock Exam (FREE) | 185 Questions | Instant Results | 2025",
  description: "Professional BCBA mock exam with 185 realistic questions. Complete 4-hour simulation, instant results, detailed explanations. No signup required - start now.",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
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

      {/* Below-the-fold content disabled temporarily */}
    </div>
  );
}
