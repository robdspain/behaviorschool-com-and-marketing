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
import { Hero } from "@/components/ui/hero";
import { CheckCircle, Layers, Users, BarChart3, Shield, Target, Network } from "lucide-react";
import Link from "next/link";

export default function TierPathPage() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      <Hero
        variant="brand"
        eyebrow="TierPath"
        title="MTSS & PBIS Software for"
        highlight="Tiered Intervention Tracking"
        subtitle="Connect teams, track MTSS tiers, manage PBIS interventions, and monitor progress from universal screening to Tier 3 fidelity — all in a single, district-wide data system."
        primaryCta={{ href: "/subscribe", label: "Get Early Access" }}
        secondaryCta={{ href: "/contact", label: "Schedule Demo" }}
      />

      {/* Key Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Complete MTSS and PBIS management
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Streamline your multi-tiered support systems with comprehensive tools for tracking, collaboration, and data-driven decision making.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Layers,
                title: "MTSS Tier Tracking",
                description: "Seamlessly track student progress across all MTSS tiers with automated escalation and intervention recommendations."
              },
              {
                icon: Target,
                title: "PBIS Interventions",
                description: "Manage positive behavior interventions and supports with evidence-based strategies and fidelity monitoring."
              },
              {
                icon: BarChart3,
                title: "Universal Screening",
                description: "Conduct comprehensive universal screenings with automated risk identification and tier placement recommendations."
              },
              {
                icon: Shield,
                title: "Tier 3 Fidelity",
                description: "Ensure high-fidelity implementation of intensive interventions with detailed monitoring and compliance tracking."
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Connect administrators, teachers, specialists, and support staff in a unified intervention planning workspace."
              },
              {
                icon: Network,
                title: "District-Wide System",
                description: "Scale MTSS and PBIS implementation across your entire district with centralized data and reporting."
              }
            ].map((feature, index) => (
              <div key={index} className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/15 to-purple-400/5 text-purple-700">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MTSS Tiers Visualization */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Visualize your MTSS framework
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              See student movement across tiers and intervention effectiveness at a glance.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                tier: "Tier 1",
                title: "Universal Support",
                description: "Core instruction and school-wide positive behavior supports for all students.",
                percentage: "80-85%",
                color: "bg-green-500"
              },
              {
                tier: "Tier 2",
                title: "Targeted Support",
                description: "Small group interventions for students at risk who need additional support.",
                percentage: "10-15%",
                color: "bg-yellow-500"
              },
              {
                tier: "Tier 3",
                title: "Intensive Support",
                description: "Individualized interventions for students with significant needs.",
                percentage: "3-5%",
                color: "bg-red-500"
              }
            ].map((tier, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-4 h-4 rounded-full ${tier.color}`}></div>
                  <h3 className="text-xl font-bold text-slate-900">{tier.tier}</h3>
                  <span className="text-sm text-slate-500 ml-auto">{tier.percentage}</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">{tier.title}</h4>
                <p className="text-slate-600 text-sm">{tier.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-6">
                Built for district-wide implementation
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                TierPath scales with your district's needs, providing the infrastructure and tools necessary for successful MTSS and PBIS implementation across all schools and grade levels.
              </p>
              <ul className="space-y-4">
                {[
                  "Evidence-based intervention libraries and protocols",
                  "Real-time data dashboards for administrators",
                  "Automated progress monitoring and alerts",
                  "Comprehensive fidelity and compliance tracking",
                  "Seamless integration with existing student information systems"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to transform your MTSS?</h3>
              <p className="mb-6 opacity-90">
                Join the waitlist to be among the first districts to experience TierPath's comprehensive MTSS and PBIS platform.
              </p>
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-slate-50">
                <Link href="/subscribe">Get Early Access</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Administrator Testimonial Preview */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-8">
            Trusted by education leaders
          </h2>
          <blockquote className="text-xl text-slate-600 italic mb-8">
            "TierPath has revolutionized how we implement MTSS across our district. The data visibility and team collaboration features have made our intervention process more effective than ever."
          </blockquote>
          <p className="text-slate-500">— Dr. Maria Rodriguez, Director of Student Services</p>
        </div>
      </section>
    </div>
  );
}