import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Target, TrendingUp, BookOpen, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Free BCBA Mock Practice Test | AI-Powered Exam Simulation | Behavior School",
  description: "Take free BCBA mock practice tests with AI-powered questions. Simulate the real exam experience with timed tests and detailed explanations.",
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
    "bcba mock practice test free",
    "free bcba practice test",
    "bcba exam simulation",
    "bcba mock exam",
    "bcba practice questions free",
    "bcba test prep"
  ],
  openGraph: {
    title: "Free BCBA Mock Practice Test | AI-Powered Exam Simulation | Behavior School",
    description: "Take free BCBA mock practice tests with AI-powered questions. Simulate the real exam experience with timed tests and detailed explanations.",
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
    title: "Free BCBA Mock Practice Test | AI-Powered Exam Simulation | Behavior School",
    description: "Take free BCBA mock practice tests with AI-powered questions. Simulate the real exam experience with timed tests and detailed explanations.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function BCBAMockPracticeTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "BCBA Mock Practice Test", href: "/bcba-mock-practice-test" }
          ]}
        />
        
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Free BCBA Mock Practice Test
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Simulate the real BCBA exam experience with our free mock practice tests. 
              Get AI-powered questions, timed sessions, and detailed explanations to boost your confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/behavior-study-tools">
                  <Zap className="mr-2 h-5 w-5" />
                  Take Free Mock Test
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/bcba-exam-prep">
                  <BookOpen className="mr-2 h-5 w-5" />
                  View All Study Tools
                </Link>
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              What Makes Our Mock Tests Different
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Real Exam Timing</h3>
                </div>
                <p className="text-slate-600">
                  Practice with the same time constraints as the actual BCBA exam. Build your confidence 
                  and learn to manage your time effectively under pressure.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">AI-Powered Questions</h3>
                </div>
                <p className="text-slate-600">
                  Our AI generates fresh questions aligned with the BACB® 6th Edition Task List. 
                  No more memorizing old test banks—every question is designed to challenge your understanding.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Performance Tracking</h3>
                </div>
                <p className="text-slate-600">
                  Track your progress across different content areas. Identify your strengths and 
                  weaknesses to focus your study time where it matters most.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Detailed Explanations</h3>
                </div>
                <p className="text-slate-600">
                  Get comprehensive explanations for every question, including why each answer is correct 
                  and references to the BACB® Task List for deeper understanding.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              How Our Mock Tests Work
            </h2>
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Choose Your Test Length</h3>
                    <p className="text-slate-600">
                      Select from 25, 50, or 100 question mock tests to match your study schedule. 
                      Full-length tests simulate the complete exam experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Timed Practice Session</h3>
                    <p className="text-slate-600">
                      Take the test under real exam conditions with a countdown timer. 
                      Practice managing your time and building exam-day confidence.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Instant Results & Analysis</h3>
                    <p className="text-slate-600">
                      Get your score immediately with detailed breakdowns by content area. 
                      See exactly where you need to focus your study efforts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Review & Learn</h3>
                    <p className="text-slate-600">
                      Review every question with detailed explanations and BACB® Task List references. 
                      Turn mistakes into learning opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Why Take Mock Practice Tests?
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">Build Exam Confidence</h3>
                  <p className="text-slate-600 mb-4">
                    Familiarize yourself with the exam format, question types, and timing. 
                    Reduce anxiety and feel prepared for the real thing.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Practice under real exam conditions
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Learn to manage time effectively
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Build familiarity with question formats
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">Identify Knowledge Gaps</h3>
                  <p className="text-slate-600 mb-4">
                    Discover which content areas need more attention. Focus your study time 
                    on the topics that will have the biggest impact on your score.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Detailed performance breakdowns
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Track improvement over time
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Personalized study recommendations
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-12 text-center bg-blue-600 rounded-lg text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Test Your BCBA Knowledge?</h2>
            <p className="text-xl mb-8 opacity-90">
              Take your first free mock practice test and see how you measure up to the real exam.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/behavior-study-tools">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Free Mock Test
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/bcba-exam-prep">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore All Study Tools
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
