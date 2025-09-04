import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Target, TrendingUp, BookOpen, Zap, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Free BCBA Mock Practice Test: The Ultimate Tool for Exam Success",
  description: "Boost your confidence and pass the BCBA exam with our free mock practice tests. Simulate the real exam, identify your weaknesses, and get detailed feedback to focus your studies.",
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
    "bcba test prep",
    "bcba exam prep"
  ],
  openGraph: {
    title: "Free BCBA Mock Practice Test: The Ultimate Tool for Exam Success",
    description: "Boost your confidence and pass the BCBA exam with our free mock practice tests. Simulate the real exam, identify your weaknesses, and get detailed feedback to focus your studies.",
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
    title: "Free BCBA Mock Practice Test: The Ultimate Tool for Exam Success",
    description: "Boost your confidence and pass the BCBA exam with our free mock practice tests. Simulate the real exam, identify your weaknesses, and get detailed feedback to focus your studies.",
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
            { label: "Free BCBA Mock Practice Test" }
          ]}
        />
        
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              From Fear to Confidence: Conquer the BCBA Exam with Mock Tests
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              The BCBA exam is a high-stakes test that can be intimidating. But what if you could walk into the exam room feeling confident, prepared, and ready to succeed? That's the power of mock exams.
            </p>
          </div>

          {/* Why Free BCBA Mock Practice Tests Are a Game-Changer */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Why Free BCBA Mock Practice Tests Are a Game-Changer for Your Studies
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <Clock className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Master the BCBA Exam Format and Timing</h3>
                <p className="text-slate-600">The BCBA exam is a 4-hour, 185-question marathon. Our mock exams simulate this experience perfectly, so you can get used to the pace and pressure of the real thing.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <Target className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Identify Your Strengths and Weaknesses</h3>
                <p className="text-slate-600">Don't waste time studying what you already know. Our mock exams provide detailed feedback on your performance, so you can focus your studies on the areas where you need the most improvement.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <Zap className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Reduce Exam Anxiety and Build Confidence</h3>
                <p className="text-slate-600">The more you practice in a simulated exam environment, the more comfortable and confident you'll feel on test day. Walk in with the confidence of a seasoned pro.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <TrendingUp className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Improve Your Knowledge Retention</h3>
                <p className="text-slate-600">The act of retrieving information during a mock exam (a process known as active recall) is a powerful way to strengthen your memory and improve long-term retention.</p>
              </div>
            </div>
          </div>

          {/* How to Use Our Free BCBA Mock Practice Tests Effectively */}
          <div className="py-12 bg-white rounded-lg shadow-sm border">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              How to Use Our Free BCBA Mock Practice Tests Effectively
            </h2>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">1</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Take a Baseline Mock Exam</h3>
                  <p className="text-slate-600 mt-2">Before you start studying, take a full-length mock exam to get a baseline of your current knowledge. This will help you identify your strengths and weaknesses from the very beginning.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">2</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Create a Realistic Exam Environment</h3>
                  <p className="text-slate-600 mt-2">Find a quiet place where you won't be disturbed, set a timer for 4 hours, and take the mock exam as if it were the real thing. No distractions, no breaks (except for the ones you'd get in the real exam).</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">3</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Analyze Your Results</h3>
                  <p className="text-slate-600 mt-2">Don't just look at your score. Go through every question, including the ones you got right, and read the detailed explanations. Understand why the correct answer is correct and why the other answers are incorrect.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">4</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Focus Your Studies</h3>
                  <p className="text-slate-600 mt-2">Use the results of your mock exam to create a targeted study plan. Focus on the areas where you scored the lowest, but don't neglect your areas of strength. Use our detailed analytics to track your progress over time.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">5</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-slate-900">Repeat the Process</h3>
                  <p className="text-slate-600 mt-2">Take multiple mock exams throughout your studies to track your progress and identify new areas of weakness. The more you practice, the more confident you'll become.</p>
                </div>
              </div>
            </div>
          </div>

          {/* What Makes Our Free BCBA Mock Practice Tests Different */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              What Makes Our Free BCBA Mock Practice Tests Different
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <Zap className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">AI-Powered Questions</h3>
                <p className="text-slate-600">Our mock exams are powered by AI, which means you'll get a unique set of questions every time. No more memorizing old test banks.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <Clock className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Real Exam Timing</h3>
                <p className="text-slate-600">Practice with the same time constraints as the actual BCBA exam. Build your confidence and learn to manage your time effectively under pressure.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <TrendingUp className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Detailed Explanations</h3>
                <p className="text-slate-600">Get comprehensive explanations for every question, including why each answer is correct and why the other answers are incorrect.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <CheckCircle className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Performance Tracking</h3>
                <p className="text-slate-600">Track your progress across different content areas. Identify your strengths and weaknesses to focus your study time where it matters most.</p>
              </div>
            </div>
          </div>

          {/* Ready to Get Started? */}
          <div className="py-12 text-center bg-blue-600 rounded-lg text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Take a free mock exam now and get a baseline of your current knowledge. It's the first step on your path to BCBA exam success.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="https://study.behaviorschool.com/product-tour/welcome">
                <Zap className="mr-2 h-5 w-5" />
                Take a Free Mock Exam Now
              </Link>
            </Button>
          </div>

          {/* FAQ Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">How many questions are on the BCBA exam?</h3>
                <p className="text-slate-600">The BCBA exam has 185 multiple-choice questions. 160 of these questions are scored, and 25 are unscored pilot questions.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">How long is the BCBA exam?</h3>
                <p className="text-slate-600">You will have 4 hours to complete the BCBA exam.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">What is a passing score on the BCBA exam?</h3>
                <p className="text-slate-600">The passing score for the BCBA exam is determined by the BACB and can vary. However, it is typically around 400 out of a possible 500.</p>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="py-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Path to BCBA Exam Success Starts Here</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Don't leave your BCBA exam success to chance. Use our free mock practice tests to build your confidence, identify your weaknesses, and go into the exam room with the skills you need to succeed.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
