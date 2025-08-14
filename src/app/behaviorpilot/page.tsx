import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
  description: "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking. Create, collect, and report with speed and fidelity.",
  keywords: [
    "behavior analyst software",
    "BCBA data collection tool",
    "FBA and BIP templates",
    "school-based behavior analysis software",
    "behavior intervention plan tool",
    "functional behavior assessment app",
    "special education data tracking",
    "behavior plan generator",
    "fidelity monitoring",
    "BCBA OS",
    "school-based BCBA",
    "behavior analyst"
  ],
  alternates: { canonical: "/behaviorpilot" },
  openGraph: {
    type: "website",
    title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
    description: "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking. Create, collect, and report with speed and fidelity.",
    url: "/behaviorpilot",
    images: [
      {
        url: "/og-behaviorpilot.png",
        width: 1200,
        height: 630,
        alt: "BehaviorPilot - BCBA Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
    description: "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking. Create, collect, and report with speed and fidelity.",
    images: ["/og-behaviorpilot.png"],
  },
  robots: { index: true, follow: true },
};

import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, FileText, BarChart3, Shield, Clock, Users } from "lucide-react";
import Footer from "@/components/ui/Footer";
import { Hero } from "@/components/ui/hero";

export default function BehaviorPilotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Hero
        variant="brand"
        eyebrow="BehaviorPilot (BCBA OS)"
        title="The Complete"
        highlight="Behavior Analyst Software"
        subtitle="AI-powered BCBA platform for creating FBAs, BIPs, and school-based behavior analysis. Streamline data collection, intervention planning, and fidelity monitoring — all in one comprehensive behavior intervention plan tool."
        primaryCta={{ href: "/subscribe", label: "Start Free Trial" }}
      />

      {/* Key Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Complete School-Based Behavior Analysis Software
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              BehaviorPilot is the leading BCBA data collection tool designed specifically for School-Based BCBAs 
              and Behavior Analysts who need efficient, evidence-based solutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "FBA and BIP Templates",
                description: "Professional functional behavior assessment app with customizable templates. Generate comprehensive FBAs and behavior intervention plans in minutes, not hours."
              },
              {
                icon: BarChart3,
                title: "Real-Time Data Collection",
                description: "Special education data tracking made simple. Collect behavioral data with our mobile-friendly BCBA data collection tool that works offline."
              },
              {
                icon: Zap,
                title: "AI-Powered Behavior Plan Generator",
                description: "Create evidence-based behavior intervention plans with our intelligent behavior plan generator. Get research-backed strategies tailored to each student."
              },
              {
                icon: Shield,
                title: "Fidelity Monitoring",
                description: "Ensure intervention integrity with built-in fidelity monitoring tools. Track implementation accuracy across your entire team."
              },
              {
                icon: Clock,
                title: "Automated Reporting",
                description: "Generate progress reports, graphs, and documentation automatically. Save hours on paperwork with our behavior analyst software."
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Coordinate with teachers, paraprofessionals, and support staff. Our school-based behavior analysis software keeps everyone aligned."
              }
            ].map((feature) => (
              <div key={feature.title} className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Why Choose BehaviorPilot Over Traditional Methods
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              See how our behavior intervention plan tool compares to paper forms, Excel sheets, and other solutions
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-4 font-semibold text-slate-900">Feature</th>
                  <th className="text-center p-4 font-semibold text-slate-900">BehaviorPilot</th>
                  <th className="text-center p-4 font-semibold text-slate-600">Paper/Excel</th>
                  <th className="text-center p-4 font-semibold text-slate-600">Other Tools</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "FBA Creation Time", bp: "30 minutes", paper: "3-4 hours", other: "1-2 hours" },
                  { feature: "BIP Templates", bp: "50+ evidence-based", paper: "Manual creation", other: "10-20 basic" },
                  { feature: "Data Collection", bp: "Real-time, mobile", paper: "Manual entry", other: "Desktop only" },
                  { feature: "Automatic Graphing", bp: "✓ Instant", paper: "✗ Manual", other: "✓ Limited" },
                  { feature: "Fidelity Tracking", bp: "✓ Built-in", paper: "✗ Separate process", other: "✗ Add-on cost" },
                  { feature: "Team Collaboration", bp: "✓ Real-time sync", paper: "✗ Email/print", other: "✓ Basic" },
                  { feature: "FERPA Compliant", bp: "✓ Full compliance", paper: "? Depends", other: "✓ Most" },
                  { feature: "AI Assistance", bp: "✓ Advanced", paper: "✗ None", other: "✗ None" },
                  { feature: "Cost", bp: "$49/month", paper: "Time cost high", other: "$80-150/month" }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="p-4 font-medium text-slate-700">{row.feature}</td>
                    <td className="p-4 text-center">
                      <span className="text-emerald-700 font-semibold">{row.bp}</span>
                    </td>
                    <td className="p-4 text-center text-slate-500">{row.paper}</td>
                    <td className="p-4 text-center text-slate-500">{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section with Schema Markup */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Everything you need to know about BehaviorPilot BCBA software
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                question: "What is the best BCBA software for schools?",
                answer: "BehaviorPilot is widely recognized as the best BCBA software for schools, offering comprehensive FBA and BIP templates, real-time data collection, and AI-powered behavior plan generation. Our school-based behavior analysis software is specifically designed for the unique needs of School-Based BCBAs and Behavior Analysts working in educational settings."
              },
              {
                question: "How to create a Behavior Intervention Plan fast?",
                answer: "With BehaviorPilot's behavior plan generator, you can create a comprehensive Behavior Intervention Plan in just 30 minutes. Our AI-powered system guides you through evidence-based strategies, automatically populates relevant sections based on your FBA data, and ensures all components meet best practice standards. This behavior intervention plan tool reduces planning time by 75% compared to traditional methods."
              },
              {
                question: "What makes BehaviorPilot different from other behavior analyst software?",
                answer: "BehaviorPilot is the only BCBA data collection tool that combines AI-powered plan generation, comprehensive FBA and BIP templates, real-time fidelity monitoring, and mobile data collection in one platform. Unlike generic special education data tracking tools, we're built specifically for School-Based BCBAs and Behavior Analysts."
              },
              {
                question: "Can BehaviorPilot help with functional behavior assessment?",
                answer: "Yes! BehaviorPilot includes a complete functional behavior assessment app with guided workflows, interview protocols, observation tools, and data analysis features. Our FBA templates are research-based and align with best practices in school-based behavior analysis software."
              },
              {
                question: "Is BehaviorPilot suitable for district-wide implementation?",
                answer: "Absolutely. BehaviorPilot scales seamlessly from individual BCBAs to entire districts. Our school-based behavior analysis software includes administrative dashboards, fidelity monitoring across schools, and bulk user management. Many districts use BehaviorPilot as their primary behavior intervention plan tool."
              },
              {
                question: "How does the AI-powered behavior plan generator work?",
                answer: "Our behavior plan generator uses machine learning trained on thousands of successful interventions. It analyzes your FBA data, student needs, and environmental factors to suggest evidence-based strategies. The AI assists but never replaces clinical judgment — you maintain full control over all recommendations."
              },
              {
                question: "What kind of special education data tracking does BehaviorPilot offer?",
                answer: "BehaviorPilot provides comprehensive special education data tracking including frequency, duration, latency, and interval recording. Data syncs in real-time across devices, generates automatic graphs, and integrates with IEP goals. Our BCBA data collection tool works offline and syncs when connected."
              },
              {
                question: "Does BehaviorPilot include fidelity monitoring features?",
                answer: "Yes, fidelity monitoring is built into every intervention plan. Track implementation accuracy, receive alerts for low fidelity, and generate fidelity reports. This ensures your behavior intervention plans are implemented correctly across all team members."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Transform Your Behavior Analysis Practice
          </h2>
          <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
            Join thousands of School-Based BCBAs and Behavior Analysts using BehaviorPilot 
            to create better outcomes with less burnout.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-12 px-8 text-base font-semibold bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl">
              <a href="/subscribe">
                Start Free 14-Day Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base font-semibold bg-transparent text-white border-white hover:bg-white/10 rounded-xl">
              <a href="/contact">
                Schedule Demo
              </a>
            </Button>
          </div>
          <p className="mt-6 text-emerald-100 text-sm">
            No credit card required • Full access to all features • Cancel anytime
          </p>
        </div>
      </section>

      {/* Structured Data */}
      {(() => {
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
        
        // Software Application Schema
        const softwareJsonLd = {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "BehaviorPilot",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web, iOS, Android",
          offers: {
            "@type": "Offer",
            price: "49.00",
            priceCurrency: "USD",
            priceValidUntil: "2025-12-31"
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "327"
          },
          description: "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking."
        };

        // FAQ Schema
        const faqJsonLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is the best BCBA software for schools?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "BehaviorPilot is widely recognized as the best BCBA software for schools, offering comprehensive FBA and BIP templates, real-time data collection, and AI-powered behavior plan generation. Our school-based behavior analysis software is specifically designed for the unique needs of School-Based BCBAs and Behavior Analysts working in educational settings."
              }
            },
            {
              "@type": "Question",
              name: "How to create a Behavior Intervention Plan fast?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "With BehaviorPilot's behavior plan generator, you can create a comprehensive Behavior Intervention Plan in just 30 minutes. Our AI-powered system guides you through evidence-based strategies, automatically populates relevant sections based on your FBA data, and ensures all components meet best practice standards."
              }
            },
            {
              "@type": "Question",
              name: "What makes BehaviorPilot different from other behavior analyst software?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "BehaviorPilot is the only BCBA data collection tool that combines AI-powered plan generation, comprehensive FBA and BIP templates, real-time fidelity monitoring, and mobile data collection in one platform."
              }
            },
            {
              "@type": "Question",
              name: "Can BehaviorPilot help with functional behavior assessment?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes! BehaviorPilot includes a complete functional behavior assessment app with guided workflows, interview protocols, observation tools, and data analysis features."
              }
            },
            {
              "@type": "Question",
              name: "Is BehaviorPilot suitable for district-wide implementation?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Absolutely. BehaviorPilot scales seamlessly from individual BCBAs to entire districts. Our school-based behavior analysis software includes administrative dashboards, fidelity monitoring across schools, and bulk user management."
              }
            }
          ]
        };

        // Breadcrumb Schema
        const breadcrumbJsonLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Products",
              item: `${SITE_URL}/products`
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "BehaviorPilot",
              item: `${SITE_URL}/behaviorpilot`
            }
          ]
        };

        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
          </>
        );
      })()}

      <Footer />
    </div>
  );
}