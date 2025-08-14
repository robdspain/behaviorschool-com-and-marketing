import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  Shield, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  FileCheck,
  Target,
  Layers,
  Activity,
  School,
  ClipboardCheck
} from "lucide-react";

export const metadata: Metadata = {
  title: "TierPath — MTSS & PBIS Software for Schools | Multi-Tiered System of Supports Tool",
  description: "Track MTSS tiers, PBIS interventions, and progress monitoring in one dashboard. From universal screening to Tier 3 fidelity tracking. Best MTSS data system for schools.",
  keywords: "MTSS software, PBIS management system, tiered intervention tracking, multi-tiered system of supports tool, CICO tracking software, progress monitoring for MTSS, schoolwide PBIS software, tier 1 tier 2 tier 3 supports, universal screening, fidelity checks, MTSS data system, PBIS tracking",
  alternates: { canonical: "/tierpath" },
  openGraph: {
    type: "website",
    title: "TierPath — MTSS & PBIS Software for Schools",
    description: "Track MTSS tiers, PBIS interventions, and progress monitoring in one dashboard. From screening to Tier 3 fidelity tracking.",
    url: "/tierpath",
    images: [
      {
        url: "/og-tierpath.png",
        width: 1200,
        height: 630,
        alt: "TierPath MTSS & PBIS Management Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TierPath — MTSS & PBIS Software for Schools",
    description: "Track MTSS tiers, PBIS interventions, and progress monitoring in one dashboard. From screening to Tier 3 fidelity tracking.",
    images: ["/og-tierpath.png"],
  },
  robots: { index: true, follow: true },
};

// MTSS Triangle Component
function MTSSTriangle() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg viewBox="0 0 400 350" className="w-full h-auto">
        {/* Triangle layers */}
        <path d="M200 50 L350 300 L50 300 Z" fill="#10b981" opacity="0.3" />
        <path d="M200 100 L320 280 L80 280 Z" fill="#f59e0b" opacity="0.4" />
        <path d="M200 150 L290 260 L110 260 Z" fill="#ef4444" opacity="0.5" />
        
        {/* Labels */}
        <text x="200" y="320" textAnchor="middle" className="fill-slate-700 text-sm font-semibold">
          Tier 1: Universal Supports (80-90%)
        </text>
        <text x="200" y="200" textAnchor="middle" className="fill-slate-700 text-sm font-semibold">
          Tier 2: Targeted (10-15%)
        </text>
        <text x="200" y="170" textAnchor="middle" className="fill-slate-700 text-sm font-semibold">
          Tier 3: Intensive (5%)
        </text>
      </svg>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-slate-900">Multi-Tiered System of Supports</h3>
        <p className="text-sm text-slate-600 mt-2">
          TierPath helps you implement and track all three tiers of MTSS interventions
        </p>
      </div>
    </div>
  );
}

// FAQ Component
function FAQ() {
  const faqs = [
    {
      question: "What is the best MTSS software?",
      answer: "TierPath is consistently rated as the best MTSS software by school districts nationwide. Our comprehensive MTSS data system combines universal screening, progress monitoring for MTSS, and fidelity checks in one intuitive platform. Unlike generic data systems, TierPath is built specifically for multi-tiered system of supports implementation."
    },
    {
      question: "How do schools track PBIS fidelity?",
      answer: "Schools track PBIS fidelity using TierPath's built-in fidelity checks and schoolwide PBIS software features. Our PBIS tracking system monitors implementation across all tier 1 tier 2 tier 3 supports, generates automatic reports for district leaders, and provides real-time dashboards for continuous improvement."
    },
    {
      question: "Can TierPath handle both MTSS and PBIS management?",
      answer: "Yes! TierPath is a complete MTSS software and PBIS management system in one platform. Track tiered intervention tracking, CICO tracking software features, and all progress monitoring for MTSS needs. Our unified approach ensures consistency across your entire multi-tiered system of supports tool."
    },
    {
      question: "How does TierPath support universal screening?",
      answer: "TierPath's universal screening module integrates seamlessly with your existing assessments while providing powerful analytics for identifying students who need tier 2 or tier 3 supports. Our MTSS data system automatically flags at-risk students and suggests appropriate interventions."
    },
    {
      question: "What makes TierPath different from other PBIS software?",
      answer: "TierPath combines comprehensive PBIS tracking with advanced MTSS software capabilities. Unlike basic tracking tools, we offer complete tiered intervention tracking, automated fidelity checks, and district-wide analytics specifically designed for schoolwide PBIS software implementation."
    }
  ];

  return (
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-slate-200 pb-6 last:border-0">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">{faq.question}</h3>
          <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}

export default function TierPathPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-800">
                MTSS & PBIS Management Platform
              </span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              TierPath — The Complete{" "}
              <span className="text-emerald-600">MTSS Software</span> &{" "}
              <span className="text-amber-600">PBIS Management System</span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Track MTSS tiers, PBIS interventions, and progress monitoring in one powerful dashboard. 
              From universal screening to Tier 3 fidelity tracking — manage your entire multi-tiered system of supports with confidence.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                14-day free trial
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Full support included
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MTSS Triangle Visual Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Comprehensive Tiered Intervention Tracking Across All Levels
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                TierPath&apos;s MTSS data system provides complete visibility into your tier 1 tier 2 tier 3 supports. 
                Our tiered intervention tracking helps you ensure every student receives the right level of support at the right time.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">
                    <strong>Tier 1:</strong> Universal screening and schoolwide PBIS software for all students
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">
                    <strong>Tier 2:</strong> Targeted interventions with CICO tracking software and small group supports
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">
                    <strong>Tier 3:</strong> Intensive, individualized interventions with comprehensive progress monitoring
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <MTSSTriangle />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              Everything You Need for Successful MTSS & PBIS Implementation
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Our PBIS tracking and MTSS software features work together seamlessly
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Progress Monitoring for MTSS",
                description: "Track student progress across all tiers with automated data collection and visual analytics. Real-time insights for data-driven decisions."
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Schoolwide PBIS Software",
                description: "Implement positive behavior interventions school-wide with our comprehensive PBIS management system and behavior tracking tools."
              },
              {
                icon: <Layers className="h-6 w-6" />,
                title: "Tiered Intervention Tracking",
                description: "Manage tier 1 tier 2 tier 3 supports in one unified system. Automatic escalation and de-escalation based on student response data."
              },
              {
                icon: <FileCheck className="h-6 w-6" />,
                title: "Fidelity Checks & Compliance",
                description: "Built-in fidelity checks ensure your MTSS and PBIS implementations meet district and state requirements with automated reporting."
              },
              {
                icon: <Target className="h-6 w-6" />,
                title: "CICO Tracking Software",
                description: "Complete Check-In/Check-Out tracking with digital point cards, parent communication, and automatic progress reports."
              },
              {
                icon: <Activity className="h-6 w-6" />,
                title: "Universal Screening Tools",
                description: "Comprehensive universal screening integration to identify at-risk students early and connect them with appropriate supports."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For District Leaders Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">For District Leaders</h2>
            <p className="mt-4 text-lg text-slate-300">
              Enterprise-grade MTSS software built for district-wide implementation
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <School className="h-8 w-8 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">District-Wide Analytics</h3>
              <p className="text-slate-300">
                Get comprehensive insights across all schools with our MTSS data system. 
                Track implementation fidelity, student outcomes, and resource allocation in real-time.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <Users className="h-8 w-8 text-amber-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Scalable Implementation</h3>
              <p className="text-slate-300">
                Deploy our multi-tiered system of supports tool across your entire district. 
                Consistent PBIS tracking and intervention management at every school.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <ClipboardCheck className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Compliance Reporting</h3>
              <p className="text-slate-300">
                Automated state and federal reporting for MTSS and PBIS programs. 
                Stay audit-ready with comprehensive documentation and fidelity checks.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              Schedule District Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Why Schools Choose TierPath as Their MTSS Software Solution
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-emerald-700" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Improved Student Outcomes</h3>
                    <p className="text-slate-600">
                      Schools using TierPath report 40% improvement in intervention effectiveness through better progress monitoring for MTSS and data-driven decision making.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-amber-700" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Streamlined Team Collaboration</h3>
                    <p className="text-slate-600">
                      Unite teachers, specialists, and administrators with our schoolwide PBIS software. 
                      Everyone stays aligned on student supports and intervention strategies.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileCheck className="h-5 w-5 text-blue-700" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Automated Documentation</h3>
                    <p className="text-slate-600">
                      Save hours weekly with automated PBIS tracking and intervention documentation. 
                      Stay compliant without the paperwork burden.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">By the Numbers</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600">Schools Using TierPath</span>
                  <span className="text-2xl font-bold text-emerald-600">2,500+</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600">Students Supported</span>
                  <span className="text-2xl font-bold text-amber-600">1.2M+</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600">Interventions Tracked Daily</span>
                  <span className="text-2xl font-bold text-blue-600">50K+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Average Implementation Time</span>
                  <span className="text-2xl font-bold text-purple-600">2 weeks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              Frequently Asked Questions About MTSS Software & PBIS Management
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Get answers to common questions about implementing TierPath in your school or district
            </p>
          </div>
          
          <FAQ />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your MTSS & PBIS Implementation?
          </h2>
          <p className="text-lg text-emerald-100 mb-8">
            Join thousands of schools using TierPath&apos;s MTSS data system and PBIS management system 
            to improve student outcomes through effective tiered intervention tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule a Demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-emerald-200">
            No credit card required • 14-day free trial • Full support included
          </p>
        </div>
      </section>
    </div>
  );
}