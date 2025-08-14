import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TierPath — MTSS & PBIS Software for Tiered Intervention Tracking",
  description:
    "Connect teams, track MTSS tiers, manage PBIS interventions, and monitor progress from universal screening to Tier 3 fidelity — all in a single, district-wide data system.",
  alternates: { canonical: "/tierpath" },
  openGraph: {
    type: "website",
    title: "TierPath — MTSS & PBIS Software for Tiered Intervention Tracking",
    description:
      "Connect teams, track MTSS tiers, manage PBIS interventions, and monitor progress from universal screening to Tier 3 fidelity — all in a single, district-wide data system.",
    url: "/tierpath",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TierPath - MTSS & PBIS Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TierPath — MTSS & PBIS Software for Tiered Intervention Tracking",
    description:
      "Connect teams, track MTSS tiers, manage PBIS interventions, and monitor progress from universal screening to Tier 3 fidelity — all in a single, district-wide data system.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Layers, TrendingUp, Users, BarChart3, Shield, Activity } from "lucide-react";
import Footer from "@/components/ui/Footer";
import { Hero } from "@/components/ui/hero";

export default function TierPathPage() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      <Hero
        variant="product"
        eyebrow="TierPath"
        title="TierPath — MTSS & PBIS Software for Tiered Intervention Tracking"
        subtitle="Connect teams, track MTSS tiers, manage PBIS interventions, and monitor progress from universal screening to Tier 3 fidelity — all in a single, district-wide data system."
        primaryCta={{ href: "/subscribe", label: "Get Early Access" }}
        secondaryCta={{ href: "#features", label: "Learn More" }}
      />

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Complete MTSS & PBIS Management Platform
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Unify your multi-tiered system of supports with tools for screening, intervention tracking, progress monitoring, and team collaboration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: "Universal Screening",
                description: "Conduct district-wide screenings with automated risk identification, tier placement recommendations, and trend analysis across schools."
              },
              {
                icon: Layers,
                title: "Tiered Intervention Tracking",
                description: "Manage Tier 1, 2, and 3 interventions with clear protocols, assignment workflows, and movement criteria between tiers."
              },
              {
                icon: TrendingUp,
                title: "Progress Monitoring",
                description: "Track student response to interventions with customizable metrics, automatic graphing, and decision rules for tier movement."
              },
              {
                icon: Shield,
                title: "Tier 3 Fidelity Checks",
                description: "Ensure intensive interventions are implemented correctly with fidelity monitoring tools, observation forms, and coaching notes."
              },
              {
                icon: BarChart3,
                title: "PBIS Implementation",
                description: "Manage behavior interventions, track point systems, monitor office referrals, and analyze school-wide behavior data patterns."
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Coordinate MTSS/PBIS teams with meeting agendas, action items, student reviews, and shared intervention planning tools."
              }
            ].map((feature) => (
              <div key={feature.title} className="relative group">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-indigo-400/5 text-blue-700">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-slate-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Why Districts Choose TierPath for MTSS & PBIS
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">District-Wide Visibility</h3>
                <p className="mt-1 text-slate-600">
                  See intervention effectiveness across all schools with real-time dashboards, comparative analytics, and resource allocation insights.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Evidence-Based Decision Making</h3>
                <p className="mt-1 text-slate-600">
                  Use data-driven protocols for tier placement, intervention selection, and progress monitoring based on research-validated decision rules.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Streamlined Team Processes</h3>
                <p className="mt-1 text-slate-600">
                  Reduce meeting time by 50% with automated data preparation, structured problem-solving protocols, and clear action item tracking.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Compliance & Reporting</h3>
                <p className="mt-1 text-slate-600">
                  Generate state-required MTSS/PBIS reports automatically, track implementation fidelity, and maintain audit-ready documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Implementation That Scales With Your District
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              From single schools to entire districts, TierPath grows with your MTSS/PBIS implementation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Quick Setup</h3>
              <p className="mt-2 text-slate-600">
                Import existing data, configure tier criteria, and train teams in under 2 weeks with our guided onboarding.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Flexible Integration</h3>
              <p className="mt-2 text-slate-600">
                Works with your existing assessment tools, curriculum, and student information systems.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Ongoing Support</h3>
              <p className="mt-2 text-slate-600">
                Professional development, implementation coaching, and technical support throughout your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Ready to Unify Your MTSS & PBIS Systems?
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Join leading districts using TierPath to improve student outcomes through coordinated, data-driven support systems.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-12 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              <a href="/subscribe">
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base font-semibold rounded-xl">
              <a href="/contact">
                Request District Demo
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      {(() => {
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
        const softwareJsonLd = {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "TierPath",
          applicationCategory: "EducationApplication",
          operatingSystem: "Web",
          description: "Connect teams, track MTSS tiers, manage PBIS interventions, and monitor progress from universal screening to Tier 3 fidelity — all in a single, district-wide data system.",
          url: `${SITE_URL}/tierpath`,
          provider: {
            "@type": "Organization",
            name: "Behavior School",
            url: SITE_URL
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/PreOrder"
          }
        };
        
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
              item: `${SITE_URL}/tierpath`,
            },
          ],
        };
        
        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
          </>
        );
      })()}

      <Footer />
    </div>
  );
}