import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Download, PlayCircle, Users, Target, FileText, Brain, Shield, Clock, BarChart3, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/ui/hero";

export const metadata: Metadata = {
  title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software for Special Education",
  description: "Special education software to plan lessons, track IEP goals, and generate progress reports with ease. AI-powered data collection and IDEA compliance tools for teachers and case managers.",
  keywords: [
    "special education teacher software",
    "IEP goal tracking tool",
    "progress monitoring app for special ed",
    "IEP progress report generator",
    "accommodations tracking tool",
    "sped data collection app",
    "special education planning software",
    "IDEA compliance",
    "parent communication tools",
    "assistive technology integration",
    "IEP data collection",
    "special education planning",
    "behavior data tracking",
    "special ed case management",
    "IEP management software"
  ],
  alternates: { canonical: "/products/classroom-pilot" },
  openGraph: {
    type: "website",
    title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
    description: "Special education software to plan lessons, track IEP goals, and generate progress reports with ease. AI-powered for teachers and case managers.",
    url: "/products/classroom-pilot",
    images: [
      {
        url: "/og-classroom-pilot.png",
        width: 1200,
        height: 630,
        alt: "ClassroomPilot - Special Education Teacher OS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
    description: "Special education software to plan lessons, track IEP goals, and generate progress reports with ease.",
    images: ["/og-classroom-pilot.png"],
  },
  robots: { index: true, follow: true },
};

export default function ClassroomPilotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section with Primary Keywords */}
      <Hero
        variant="product"
        eyebrow="ClassroomPilot"
        title="The Complete Special Education Teacher OS"
        highlight="IEP Goal Tracking & Progress Monitoring"
        subtitle="Streamline special education planning, track IEP goals in real-time, and generate comprehensive progress reports—all in one AI-powered platform designed for special ed teachers and case managers."
        primaryCta={{ href: "#get-started", label: "Start Free Trial" }}
        secondaryCta={{ href: "#how-it-works", label: "See How It Works" }}
      />

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-emerald-600">10,000+</p>
              <p className="text-sm text-slate-600">Special Ed Teachers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">500K+</p>
              <p className="text-sm text-slate-600">IEP Goals Tracked</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">IDEA</p>
              <p className="text-sm text-slate-600">Compliant</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">FERPA</p>
              <p className="text-sm text-slate-600">Certified</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Key SEO Content */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How ClassroomPilot Transforms Special Education Planning
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              From IEP goal setting to progress report generation—a seamless workflow for special education data collection and planning
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Set IEP Goals</h3>
              <p className="text-slate-600">Import or create SMART IEP goals with built-in templates aligned to state standards</p>
              <div className="hidden md:block absolute top-8 -right-4 w-8 text-slate-300">→</div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Plan Lessons</h3>
              <p className="text-slate-600">Generate differentiated lesson plans with accommodations tracking built-in</p>
              <div className="hidden md:block absolute top-8 -right-4 w-8 text-slate-300">→</div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <BarChart3 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Track Progress</h3>
              <p className="text-slate-600">Real-time IEP data collection with mobile-friendly tools for classroom use</p>
              <div className="hidden md:block absolute top-8 -right-4 w-8 text-slate-300">→</div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <MessageSquare className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Generate Reports</h3>
              <p className="text-slate-600">Automated IEP progress reports with parent communication tools</p>
            </div>
          </div>

          {/* Video Demo CTA */}
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" className="gap-2">
              <PlayCircle className="w-5 h-5" />
              Watch 3-Minute Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section with Semantic Keywords */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Special Education Planning Software
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Everything you need for effective sped data collection and IEP management in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Cards with Keywords */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">IEP Goal Tracking Tool</h3>
              <p className="text-slate-600 mb-4">
                Track multiple IEP goals simultaneously with customizable data collection methods. Monitor progress toward mastery with visual analytics.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>SMART goal templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Baseline data tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Progress monitoring graphs</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">IEP Progress Report Generator</h3>
              <p className="text-slate-600 mb-4">
                Generate comprehensive progress reports automatically from your daily data collection. IDEA-compliant formatting included.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Automated report writing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Parent-friendly summaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>District report templates</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Accommodations Tracking Tool</h3>
              <p className="text-slate-600 mb-4">
                Document and track accommodations implementation across all settings. Ensure IDEA compliance with detailed logs.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Accommodation library</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Implementation tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Effectiveness monitoring</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sped Data Collection App</h3>
              <p className="text-slate-600 mb-4">
                Mobile-friendly data collection for behavior tracking, academic progress, and skill acquisition. Works offline too.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Quick data entry forms</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Behavior incident tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Trial-by-trial recording</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Parent Communication Tools</h3>
              <p className="text-slate-600 mb-4">
                Keep parents informed with automated updates, progress snapshots, and secure messaging. Build stronger IEP teams.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Weekly progress updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Secure parent portal</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Home practice resources</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">IDEA Compliance Tools</h3>
              <p className="text-slate-600 mb-4">
                Stay compliant with built-in IDEA guidelines, audit trails, and automated documentation. Reduce legal risks.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Compliance checklists</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Timeline tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Audit-ready reports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Integration Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                AI-Powered Special Education Planning
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                ClassroomPilot uses advanced AI to help special education teachers save time while improving student outcomes.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Smart Goal Suggestions:</strong>
                    <span className="text-slate-600"> AI analyzes student data to recommend appropriate IEP goals and objectives</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Automated Progress Analysis:</strong>
                    <span className="text-slate-600"> Identify trends and predict goal attainment with machine learning</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Intervention Recommendations:</strong>
                    <span className="text-slate-600"> Get evidence-based suggestions when students aren't making expected progress</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Natural Language Reports:</strong>
                    <span className="text-slate-600"> Transform data into clear, professional progress narratives</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="aspect-video bg-slate-100 rounded-lg mb-6 flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">See AI in Action</h3>
              <p className="text-slate-600 mb-4">
                Watch how ClassroomPilot's AI helps create an IEP progress report in under 2 minutes
              </p>
              <Button className="w-full" size="lg">
                Watch Demo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Generation Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <Download className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">
              Free Resource: Top 10 IEP Data Tracking Tips
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Get our comprehensive checklist used by thousands of special education teachers to streamline their IEP data collection process. Includes templates and best practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500"
              />
              <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-slate-50">
                Download Free PDF
                <Download className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              No credit card required. Instant download.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Special Education Teams Nationwide
            </h2>
            <p className="text-lg text-slate-600">
              See how ClassroomPilot transforms special education planning and IEP management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-slate-600 mb-4">
                "ClassroomPilot has revolutionized how I track IEP goals. What used to take hours now takes minutes. The progress monitoring features are exactly what special ed teachers need."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold">SM</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Sarah Martinez</p>
                  <p className="text-sm text-slate-600">Special Education Teacher, CA</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-slate-600 mb-4">
                "The IEP progress report generator alone is worth it. Parents love the clear, visual reports, and I love that they're generated automatically from my daily data."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold">JT</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">James Thompson</p>
                  <p className="text-sm text-slate-600">SPED Coordinator, TX</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-slate-600 mb-4">
                "Finally, a special education planning software that understands IDEA compliance. The accommodations tracking alone has saved us from potential legal issues."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold">LW</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Lisa Wong</p>
                  <p className="text-sm text-slate-600">Director of Special Services, NY</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing for Special Education Teams
            </h2>
            <p className="text-lg text-slate-600">
              Start free, upgrade when you're ready. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="text-3xl font-bold mb-4">$0<span className="text-base font-normal text-slate-600">/month</span></p>
              <p className="text-slate-600 mb-6">Perfect for individual teachers getting started</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Up to 5 students</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Basic IEP goal tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Simple progress reports</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Start Free
              </Button>
            </div>

            {/* Professional Plan */}
            <div className="bg-white rounded-xl border-2 border-emerald-500 p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-emerald-500 text-white text-sm px-3 py-1 rounded-full">Most Popular</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional</h3>
              <p className="text-3xl font-bold mb-4">$29<span className="text-base font-normal text-slate-600">/month</span></p>
              <p className="text-slate-600 mb-6">For teachers managing full caseloads</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Unlimited students</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Advanced progress monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">AI-powered report generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Parent communication portal</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Accommodations tracking</span>
                </li>
              </ul>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Start 14-Day Trial
              </Button>
            </div>

            {/* School Plan */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold mb-2">School/District</h3>
              <p className="text-3xl font-bold mb-4">Custom</p>
              <p className="text-slate-600 mb-6">For teams and entire districts</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Everything in Professional</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Admin dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">District-wide reporting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Professional development</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Priority support</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about ClassroomPilot
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Is ClassroomPilot IDEA and FERPA compliant?</h3>
              <p className="text-slate-600">
                Yes! ClassroomPilot is fully compliant with IDEA, FERPA, and COPPA regulations. We use bank-level encryption and undergo regular security audits to ensure your student data is protected.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Can I import existing IEP goals?</h3>
              <p className="text-slate-600">
                Absolutely. ClassroomPilot supports importing IEP goals from common formats including PDF, Word, and most IEP management systems. Our AI helps parse and structure the goals automatically.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Does it work with my district's existing systems?</h3>
              <p className="text-slate-600">
                ClassroomPilot integrates with major Student Information Systems (SIS) and can export data in formats compatible with most district reporting requirements. Contact us for specific integration questions.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">How long does it take to set up?</h3>
              <p className="text-slate-600">
                Most teachers are up and running in under 15 minutes. We provide guided setup, video tutorials, and live support to help you get started quickly. Import your first IEP and start tracking immediately.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">What kind of support do you offer?</h3>
              <p className="text-slate-600">
                All plans include email support and access to our knowledge base. Professional and School plans include priority support, live chat, and optional professional development sessions for your team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="get-started" className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Special Education Planning?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of special education teachers using ClassroomPilot to streamline IEP management and improve student outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-slate-50">
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule Demo
              <PlayCircle className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-white/75 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Structured Data for SEO */}
      {(() => {
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
        
        // SoftwareApplication Schema
        const softwareApplicationJsonLd = {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "ClassroomPilot",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web, iOS, Android",
          "offers": {
            "@type": "AggregateOffer",
            "lowPrice": "0",
            "highPrice": "29",
            "priceCurrency": "USD",
            "offerCount": "3"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "1247"
          },
          "description": "Special education software to plan lessons, track IEP goals, and generate progress reports with ease. AI-powered data collection and IDEA compliance tools for teachers and case managers.",
          "screenshot": `${SITE_URL}/screenshots/classroom-pilot-dashboard.png`,
          "featureList": [
            "IEP Goal Tracking",
            "Progress Monitoring",
            "Automated Report Generation",
            "Accommodations Tracking",
            "Parent Communication Portal",
            "IDEA Compliance Tools",
            "AI-Powered Analytics"
          ],
          "softwareRequirements": "Modern web browser, iOS 12+ or Android 8+",
          "publisher": {
            "@type": "Organization",
            "name": "Behavior School",
            "url": SITE_URL
          }
        };

        // FAQ Schema
        const faqJsonLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is ClassroomPilot IDEA and FERPA compliant?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! ClassroomPilot is fully compliant with IDEA, FERPA, and COPPA regulations. We use bank-level encryption and undergo regular security audits to ensure your student data is protected."
              }
            },
            {
              "@type": "Question",
              "name": "Can I import existing IEP goals?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely. ClassroomPilot supports importing IEP goals from common formats including PDF, Word, and most IEP management systems. Our AI helps parse and structure the goals automatically."
              }
            },
            {
              "@type": "Question",
              "name": "How long does it take to set up ClassroomPilot?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Most teachers are up and running in under 15 minutes. We provide guided setup, video tutorials, and live support to help you get started quickly. Import your first IEP and start tracking immediately."
              }
            }
          ]
        };

        // BreadcrumbList Schema
        const breadcrumbJsonLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": SITE_URL
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Products",
              "item": `${SITE_URL}/products`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "ClassroomPilot",
              "item": `${SITE_URL}/products/classroom-pilot`
            }
          ]
        };

        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
          </>
        );
      })()}
    </div>
  );
}