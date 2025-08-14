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
import { CheckCircle, ArrowRight, BarChart3, FileText, Users, Zap, Shield, Clock } from "lucide-react";
import Footer from "@/components/ui/Footer";
import { Hero } from "@/components/ui/hero";

export default function BehaviorPilotPage() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      <Hero
        variant="product"
        eyebrow="BehaviorPilot"
        title="BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection"
        subtitle="All-in-one school-based BCBA platform to create functional behavior assessments (FBAs), build behavior intervention plans (BIPs), and track progress with AI-powered data collection and fidelity monitoring."
        primaryCta={{ href: "/subscribe", label: "Get Early Access" }}
        secondaryCta={{ href: "#features", label: "Learn More" }}
      />

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Complete BCBA Software for School-Based Teams
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Streamline your entire workflow from assessment to intervention with tools designed specifically for educational settings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Functional Behavior Assessments",
                description: "Create comprehensive FBAs with guided templates, automated data analysis, and evidence-based recommendations."
              },
              {
                icon: BarChart3,
                title: "Behavior Intervention Plans",
                description: "Build effective BIPs with research-backed strategies, clear implementation steps, and progress monitoring tools."
              },
              {
                icon: Zap,
                title: "AI-Powered Data Collection",
                description: "Capture behavioral data effortlessly with smart forms, voice input, and automated graphing for quick insights."
              },
              {
                icon: Shield,
                title: "Fidelity Monitoring",
                description: "Track intervention implementation with built-in fidelity checks, staff training modules, and compliance reports."
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Coordinate with teachers, paraprofessionals, and administrators through shared dashboards and real-time updates."
              },
              {
                icon: Clock,
                title: "Time-Saving Automation",
                description: "Generate reports, schedule observations, and send progress updates automatically to save hours each week."
              }
            ].map((feature) => (
              <div key={feature.title} className="relative group">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-400/5 text-emerald-700">
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
              Why School BCBAs Choose BehaviorPilot
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Designed for Educational Settings</h3>
                <p className="mt-1 text-slate-600">
                  Built specifically for school-based BCBAs, with features that align with IEP requirements, IDEA compliance, and district protocols.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Evidence-Based Interventions</h3>
                <p className="mt-1 text-slate-600">
                  Access a library of research-backed strategies and interventions proven effective in classroom environments.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Seamless Integration</h3>
                <p className="mt-1 text-slate-600">
                  Works with your existing systems and workflows, from student information systems to IEP management platforms.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Professional Development Included</h3>
                <p className="mt-1 text-slate-600">
                  Ongoing training and support to ensure your team maximizes the platform's capabilities and stays current with best practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Ready to Transform Your BCBA Practice?
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Join forward-thinking BCBAs who are streamlining their workflows and improving student outcomes with BehaviorPilot.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-12 px-8 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
              <a href="/subscribe">
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base font-semibold rounded-xl">
              <a href="/contact">
                Schedule a Demo
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
          name: "BehaviorPilot",
          applicationCategory: "EducationApplication",
          operatingSystem: "Web",
          description: "All-in-one school-based BCBA platform to create functional behavior assessments (FBAs), build behavior intervention plans (BIPs), and track progress with AI-powered data collection and fidelity monitoring.",
          url: `${SITE_URL}/behaviorpilot`,
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
              name: "BehaviorPilot",
              item: `${SITE_URL}/behaviorpilot`,
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