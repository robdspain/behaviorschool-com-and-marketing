import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, Target, Clock, TrendingUp, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "BCBA Study Fluency Practice Test | AI-Powered Exam Prep | Behavior School",
  description: "Master BCBA exam concepts with fluency-based practice tests. AI-powered questions, adaptive learning, and performance tracking for behavior analysts.",
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
    "bcba study fluency practice test",
    "bcba fluency practice",
    "bcba exam prep",
    "behavior analyst study",
    "bcba practice questions",
    "fluency based learning"
  ],
  openGraph: {
    title: "BCBA Study Fluency Practice Test | AI-Powered Exam Prep | Behavior School",
    description: "Master BCBA exam concepts with fluency-based practice tests. AI-powered questions, adaptive learning, and performance tracking for behavior analysts.",
    url: "https://behaviorschool.com/bcba-study-fluency",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BCBA Study Fluency Practice Test",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Study Fluency Practice Test | AI-Powered Exam Prep | Behavior School",
    description: "Master BCBA exam concepts with fluency-based practice tests. AI-powered questions, adaptive learning, and performance tracking for behavior analysts.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function BCBAStudyFluencyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "BCBA Study Fluency", href: "/bcba-study-fluency" }
          ]}
        />
        
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              BCBA Study Fluency Practice Test
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Master BCBA exam concepts through fluency-based learning. Our AI-powered practice tests help you achieve 
              both accuracy and speed—the key to exam success and real-world application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/behavior-study-tools">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Fluency Practice
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

          {/* What is Fluency Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              What is Fluency-Based Learning?
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-sm border mb-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">Beyond Just Getting It Right</h3>
                  <p className="text-slate-600 mb-4">
                    Traditional study methods focus on accuracy alone. Fluency-based learning combines accuracy with speed, 
                    ensuring you can apply knowledge quickly and confidently in high-pressure situations.
                  </p>
                  <p className="text-slate-600">
                    Research shows that fluency-based practice leads to better retention, faster recall, and improved 
                    performance under stress—exactly what you need for the BCBA exam.
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Fluency = Accuracy + Speed</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                      <strong>Accuracy:</strong> Getting the answer right
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                      <strong>Speed:</strong> Responding quickly and confidently
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                      <strong>Retention:</strong> Remembering long-term
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                      <strong>Application:</strong> Using knowledge in real situations
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Why Fluency Practice Works for BCBA Exam Prep
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Exam Time Pressure</h3>
                </div>
                <p className="text-slate-600">
                  The BCBA exam is timed, and fluency practice helps you answer questions quickly without sacrificing accuracy. 
                  You&apos;ll feel confident and in control during the actual exam.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Long-term Retention</h3>
                </div>
                <p className="text-slate-600">
                  Fluency-based practice creates stronger neural pathways, leading to better long-term retention. 
                  You&apos;ll remember concepts months after the exam, not just during it.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Real-World Application</h3>
                </div>
                <p className="text-slate-600">
                  As a BCBA, you&apos;ll need to make quick, accurate decisions in clinical settings. Fluency practice 
                  prepares you for the fast-paced nature of behavior analysis work.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Confidence Building</h3>
                </div>
                <p className="text-slate-600">
                  When you can answer questions quickly and accurately, you build confidence. This reduces test anxiety 
                  and helps you perform at your best on exam day.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              How Our Fluency Practice Works
            </h2>
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Adaptive Question Selection</h3>
                    <p className="text-slate-600">
                      Our AI selects questions based on your performance, focusing on areas where you need more practice 
                      while maintaining fluency in areas you&apos;ve mastered.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Speed and Accuracy Tracking</h3>
                    <p className="text-slate-600">
                      We track both your accuracy and response time, helping you identify when you&apos;ve achieved true fluency 
                      in each topic area.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Fluency Benchmarks</h3>
                    <p className="text-slate-600">
                      Set fluency goals for each topic (e.g., 90% accuracy in under 30 seconds). Our system helps you 
                      track progress toward these benchmarks.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Maintenance Practice</h3>
                    <p className="text-slate-600">
                      Once you achieve fluency, we provide maintenance practice to ensure you retain your skills 
                      leading up to the exam.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-12 text-center bg-emerald-600 rounded-lg text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Master BCBA Concepts with Fluency?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of behavior analysts who have passed the BCBA exam using fluency-based practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/behavior-study-tools">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Fluency Practice Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
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
