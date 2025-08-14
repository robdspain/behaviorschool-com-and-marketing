import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, BarChart3, Users, Target, Shield, Clock, Layers } from "lucide-react";
import Footer from "@/components/ui/Footer";
import { Hero } from "@/components/ui/hero";

export const metadata: Metadata = {
  title: "TierPath — MTSS & PBIS Software for Schools",
  description: "Track MTSS tiers, PBIS interventions, and progress monitoring in one dashboard. From screening to Tier 3 fidelity tracking.",
  keywords: [
    "MTSS software",
    "PBIS management system", 
    "tiered intervention tracking",
    "multi-tiered system of supports tool",
    "CICO tracking software",
    "progress monitoring for MTSS",
    "schoolwide PBIS software",
    "tier 1 tier 2 tier 3 supports",
    "universal screening",
    "fidelity checks",
    "MTSS data system",
    "PBIS tracking"
  ],
  alternates: { canonical: "/products/tierpath" },
  openGraph: {
    type: "website",
    title: "TierPath — MTSS & PBIS Software for Schools",
    description: "Track MTSS tiers, PBIS interventions, and progress monitoring in one dashboard. From screening to Tier 3 fidelity tracking.",
    url: "/products/tierpath",
    images: [
      {
        url: "/tierpath-og-image.png",
        width: 1200,
        height: 630,
        alt: "TierPath MTSS & PBIS Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TierPath — MTSS & PBIS Software for Schools",
    description: "Track MTSS tiers, PBIS interventions, and progress monitoring in one dashboard. From screening to Tier 3 fidelity tracking.",
    images: ["/tierpath-og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function TierPathPage() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      <Hero
        variant="brand"
        eyebrow="TierPath"
        title="MTSS & PBIS Software"
        highlight="for Schools"
        subtitle="Track MTSS tiers, PBIS interventions, and progress monitoring in one comprehensive dashboard. From universal screening to Tier 3 fidelity tracking."
        primaryCta={{ href: "/contact", label: "Request Demo" }}
        secondaryCta={{ href: "#features", label: "See Features" }}
      />

      {/* MTSS Triangle Visual Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Complete Multi-Tiered System of Supports Tool
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              TierPath provides a comprehensive MTSS data system that tracks student progress across all three tiers of intervention, 
              ensuring your PBIS tracking meets fidelity standards.
            </p>
          </div>
          
          {/* MTSS Triangle Visual */}
          <div className="flex justify-center mb-12">
            <div className="relative w-96 h-80">
              {/* Tier 1 - Base */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-center text-white font-semibold text-lg rounded-b-lg">
                <div className="text-center">
                  <div className="text-xl font-bold">Tier 1</div>
                  <div className="text-sm">Universal Supports (80-85%)</div>
                </div>
              </div>
              {/* Tier 2 - Middle */}
              <div className="absolute bottom-32 left-16 right-16 h-24 bg-gradient-to-r from-yellow-500 to-amber-400 flex items-center justify-center text-white font-semibold text-lg">
                <div className="text-center">
                  <div className="text-lg font-bold">Tier 2</div>
                  <div className="text-xs">Targeted (10-15%)</div>
                </div>
              </div>
              {/* Tier 3 - Top */}
              <div className="absolute bottom-56 left-32 right-32 h-16 bg-gradient-to-r from-red-500 to-red-400 flex items-center justify-center text-white font-semibold text-lg rounded-t-lg">
                <div className="text-center">
                  <div className="text-base font-bold">Tier 3</div>
                  <div className="text-xs">Intensive (1-5%)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Tier 1 Universal Screening</h3>
              <p className="text-slate-600">Schoolwide PBIS software that tracks universal interventions and identifies students needing additional support.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Tier 2 Targeted Supports</h3>
              <p className="text-slate-600">CICO tracking software and small group intervention monitoring with progress monitoring for MTSS.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Tier 3 Intensive Interventions</h3>
              <p className="text-slate-600">Individual behavior plans, intensive data collection, and fidelity checks for the highest-need students.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Tiered Intervention Tracking
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our MTSS software provides everything you need for effective PBIS management system implementation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Real-Time Progress Monitoring",
                description: "Track student progress across all MTSS tiers with automated data collection and visual dashboards."
              },
              {
                icon: CheckCircle,
                title: "PBIS Fidelity Tracking",
                description: "Ensure implementation fidelity with built-in fidelity checks and compliance monitoring."
              },
              {
                icon: Users,
                title: "Universal Screening Tools",
                description: "Efficient screening processes to identify students who need tier 2 tier 3 supports."
              },
              {
                icon: Target,
                title: "CICO Management",
                description: "Streamlined Check-In/Check-Out tracking software with automated reports and parent communication."
              },
              {
                icon: Layers,
                title: "Multi-Tiered Data System",
                description: "Comprehensive MTSS data system that connects all intervention levels in one platform."
              },
              {
                icon: Clock,
                title: "Time-Saving Automation",
                description: "Automate routine data collection and reporting to focus more time on student support."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For District Leaders Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                For District Leaders
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                TierPath provides district administrators with the data and insights needed to make informed decisions 
                about MTSS implementation and resource allocation.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">District-wide PBIS tracking and reporting</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Resource allocation insights based on tier data</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Compliance reporting for state and federal requirements</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Professional development tracking and support</span>
                </li>
              </ul>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Schedule Administrator Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">ROI Impact</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Reduced disciplinary incidents</span>
                  <span className="font-semibold text-emerald-600">↓ 35%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Time saved on data collection</span>
                  <span className="font-semibold text-emerald-600">8 hrs/week</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Improved student outcomes</span>
                  <span className="font-semibold text-emerald-600">↑ 42%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Staff satisfaction increase</span>
                  <span className="font-semibold text-emerald-600">↑ 28%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Common questions about implementing MTSS software and PBIS management systems.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                question: "What is the best MTSS software for schools?",
                answer: "TierPath is designed specifically for schools implementing multi-tiered system of supports. Our MTSS software provides comprehensive tracking across all three tiers, real-time progress monitoring for MTSS, and built-in fidelity checks to ensure successful implementation."
              },
              {
                question: "How do schools track PBIS fidelity?",
                answer: "TierPath includes automated fidelity checks and compliance monitoring tools. Our PBIS management system tracks implementation across all tiers, provides regular fidelity reports, and alerts administrators when interventions need adjustment to maintain effectiveness."
              },
              {
                question: "Can TierPath integrate with our existing student information system?",
                answer: "Yes, TierPath is designed to work with most major student information systems and IEP platforms. Our tiered intervention tracking seamlessly imports student data and exports progress reports to maintain workflow continuity."
              },
              {
                question: "What training is provided for staff using the MTSS data system?",
                answer: "TierPath includes comprehensive training modules for all staff levels, from teachers using daily tracking tools to administrators managing district-wide PBIS tracking. We provide ongoing support to ensure successful implementation."
              },
              {
                question: "How does TierPath support universal screening processes?",
                answer: "Our universal screening tools are built into the platform, allowing for efficient identification of students who need tier 2 tier 3 supports. The system automates screening workflows and provides clear recommendations for next steps."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{faq.question}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your MTSS Implementation?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join schools across the country using TierPath for comprehensive MTSS software and PBIS management system success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-slate-50">
              Request Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
              Download Resource Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      {(() => {
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
        
        const productJsonLd = {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "TierPath",
          description: "MTSS & PBIS Software for Schools - Track MTSS tiers, PBIS interventions, and progress monitoring in one dashboard",
          url: `${SITE_URL}/products/tierpath`,
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web Browser",
          offers: {
            "@type": "Offer",
            category: "Educational Software",
            eligibleCustomerType: "Schools, School Districts"
          },
          featureList: [
            "MTSS tier tracking",
            "PBIS intervention management", 
            "Progress monitoring",
            "Universal screening",
            "Fidelity checks",
            "CICO tracking",
            "Data analytics"
          ]
        } as const;

        const breadcrumbJsonLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL,
            },
            {
              "@type": "ListItem", 
              position: 2,
              name: "Products",
              item: `${SITE_URL}/products`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "TierPath",
              item: `${SITE_URL}/products/tierpath`,
            },
          ],
        } as const;

        const faqJsonLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is the best MTSS software for schools?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "TierPath is designed specifically for schools implementing multi-tiered system of supports. Our MTSS software provides comprehensive tracking across all three tiers, real-time progress monitoring for MTSS, and built-in fidelity checks to ensure successful implementation."
              }
            },
            {
              "@type": "Question", 
              name: "How do schools track PBIS fidelity?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "TierPath includes automated fidelity checks and compliance monitoring tools. Our PBIS management system tracks implementation across all tiers, provides regular fidelity reports, and alerts administrators when interventions need adjustment to maintain effectiveness."
              }
            }
          ]
        } as const;

        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
          </>
        );
      })()}

      <Footer />
    </div>
  );
}