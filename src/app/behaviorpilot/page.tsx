import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
  description:
    "All-in-one school-based BCBA platform to create functional behavior assessments (FBAs), build behavior intervention plans (BIPs), and track progress with AI-powered data collection and fidelity monitoring.",
  alternates: { canonical: "/behaviorpilot" },
  openGraph: {
    type: "website",
    title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
    description:
      "All-in-one school-based BCBA platform to create functional behavior assessments (FBAs), build behavior intervention plans (BIPs), and track progress with AI-powered data collection and fidelity monitoring.",
    url: "/behaviorpilot",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BehaviorPilot - BCBA Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
    description:
      "All-in-one school-based BCBA platform to create functional behavior assessments (FBAs), build behavior intervention plans (BIPs), and track progress with AI-powered data collection and fidelity monitoring.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

import { Button } from "@/components/ui/button";
import { Hero } from "@/components/ui/hero";
import { CheckCircle, Brain, FileText, BarChart3, Shield, Users, Clock } from "lucide-react";
import Link from "next/link";

export default function BehaviorPilotPage() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      <Hero
        variant="brand"
        eyebrow="BehaviorPilot"
        title="BCBA Software for"
        highlight="FBAs, BIPs & Data Collection"
        subtitle="All-in-one school-based BCBA platform to create functional behavior assessments (FBAs), build behavior intervention plans (BIPs), and track progress with AI-powered data collection and fidelity monitoring."
        primaryCta={{ href: "/subscribe", label: "Get Early Access" }}
        secondaryCta={{ href: "/contact", label: "Schedule Demo" }}
      />

      {/* Key Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Everything you need for effective behavior analysis
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Streamline your BCBA workflow with tools designed specifically for school-based behavior analysts.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: FileText,
                title: "FBA Creation",
                description: "Build comprehensive functional behavior assessments with guided templates and evidence-based frameworks."
              },
              {
                icon: Brain,
                title: "BIP Development",
                description: "Create targeted behavior intervention plans with function-based strategies and clear implementation guidelines."
              },
              {
                icon: BarChart3,
                title: "Data Collection",
                description: "Track student progress with customizable data collection forms and real-time analytics."
              },
              {
                icon: Shield,
                title: "Fidelity Monitoring",
                description: "Ensure intervention integrity with automated fidelity checks and compliance tracking."
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Share assessments and plans with teachers, parents, and team members seamlessly."
              },
              {
                icon: Clock,
                title: "Time-Saving Automation",
                description: "Generate reports, track deadlines, and manage caseloads with intelligent automation."
              }
            ].map((feature, index) => (
              <div key={index} className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-400/5 text-emerald-700">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-6">
                Built for school-based BCBAs
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                BehaviorPilot understands the unique challenges of working in educational settings. Our platform is designed to help you deliver high-quality behavior analysis services while managing complex caseloads efficiently.
              </p>
              <ul className="space-y-4">
                {[
                  "Compliant with IDEA and state regulations",
                  "Integrates with existing school systems",
                  "Evidence-based assessment tools",
                  "Collaborative team features",
                  "Automated progress reporting"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to transform your practice?</h3>
              <p className="mb-6 opacity-90">
                Join the waitlist to be among the first to experience BehaviorPilot when it launches.
              </p>
              <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-slate-50">
                <Link href="/subscribe">Get Early Access</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}