import type { Metadata } from "next";
import { CheckCircle, Users, Target, BarChart3, Shield, FileCheck, HelpCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "TierPath - MTSS & PBIS Software for Schools | Behavior School",
  description: "Streamline multi-tiered systems of support (MTSS) with TierPath. Centralize Tier 1-3 interventions, PBIS tracking, and progress monitoring in one platform.",
  alternates: { canonical: "/products/tierpath" },
  openGraph: {
    type: "website",
    title: "TierPath - MTSS & PBIS Software for Schools",
    description: "Streamline multi-tiered systems of support (MTSS) with TierPath. Centralize Tier 1-3 interventions, PBIS tracking, and progress monitoring.",
    url: "/products/tierpath",
  },
};

export default function TierPathPage() {
  const features = [
    {
      icon: Target,
      title: "Multi-Tiered Support",
      description: "Manage Tier 1, 2, and 3 interventions seamlessly in one centralized platform."
    },
    {
      icon: BarChart3,
      title: "Progress Monitoring",
      description: "Track student progress with real-time data and customizable dashboards."
    },
    {
      icon: Shield,
      title: "PBIS Integration",
      description: "Built-in PBIS tracking from Check-In/Check-Out to Tier 3 interventions."
    },
    {
      icon: FileCheck,
      title: "Fidelity Tracking",
      description: "Monitor implementation fidelity at all tiers with comprehensive reporting."
    },
    {
      icon: Users,
      title: "Universal Screening",
      description: "Identify at-risk students early with integrated screening tools."
    },
    {
      icon: HelpCircle,
      title: "Data-Driven Insights",
      description: "Make informed decisions with comprehensive analytics and reporting."
    }
  ];

  const faqs = [
    {
      question: "What is the best MTSS software for schools?",
      answer: "TierPath streamlines multi-tiered systems of support (MTSS) by centralizing Tier 1–3 interventions, PBIS tracking, and progress monitoring into one platform."
    },
    {
      question: "Can TierPath help track PBIS interventions?",
      answer: "Yes. TierPath includes built-in PBIS tracking, from Check-In/Check-Out (CICO) to Tier 3 intervention fidelity, with easy-to-read dashboards."
    },
    {
      question: "Does TierPath support universal screening?",
      answer: "Absolutely. TierPath includes a universal screening module with risk flagging so you can identify students in need of additional support early."
    },
    {
      question: "How does TierPath help with fidelity checks?",
      answer: "TierPath tracks implementation fidelity at all tiers, giving district leaders and coaches the data they need to improve program consistency."
    },
    {
      question: "Is TierPath suitable for both academic and behavioral interventions?",
      answer: "Yes, TierPath is designed to support both academic and behavioral interventions, providing a comprehensive solution for whole-child support."
    },
    {
      question: "How does TierPath integrate with existing school systems?",
      answer: "TierPath offers seamless integration with popular student information systems and assessment platforms, ensuring smooth data flow across your educational technology stack."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bs-background,#FAF3E0)] to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-yellow-300/20 blur-3xl" />
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-emerald-100 px-4 py-2">
              <span className="text-sm font-semibold text-emerald-700">MTSS & PBIS Platform</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              TierPath
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Streamline your multi-tiered systems of support with a comprehensive platform that centralizes interventions, tracks progress, and ensures fidelity across all tiers.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Request Demo
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything You Need for Effective MTSS
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Comprehensive tools to support every student, track every intervention, and measure every outcome.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="relative rounded-2xl bg-slate-50 p-8 hover:bg-slate-100 transition-colors">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Get answers to common questions about TierPath and how it can transform your school's MTSS implementation.
            </p>
          </div>
          
          <div className="mx-auto max-w-4xl">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200/50 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-start">
                    <HelpCircle className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 ml-8">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your MTSS Implementation?
            </h2>
            <p className="mt-4 text-lg text-emerald-100">
              Join hundreds of schools already using TierPath to support every student's success.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-slate-100">
                Schedule a Demo
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}