import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
  description:
    "Special education software for teachers to plan IEP-aligned lessons, track student progress, document accommodations, and generate compliant reports quickly — all in one AI-driven workspace.",
  alternates: { canonical: "/classroompilot" },
  openGraph: {
    type: "website",
    title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
    description:
      "Special education software for teachers to plan IEP-aligned lessons, track student progress, document accommodations, and generate compliant reports quickly — all in one AI-driven workspace.",
    url: "/classroompilot",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClassroomPilot - Special Education Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
    description:
      "Special education software for teachers to plan IEP-aligned lessons, track student progress, document accommodations, and generate compliant reports quickly — all in one AI-driven workspace.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Target, FileCheck, Users, Zap, BookOpen, PieChart } from "lucide-react";
import Footer from "@/components/ui/Footer";
import { Hero } from "@/components/ui/hero";

export default function ClassroomPilotPage() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      <Hero
        variant="product"
        eyebrow="ClassroomPilot"
        title="ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software"
        subtitle="Special education software for teachers to plan IEP-aligned lessons, track student progress, document accommodations, and generate compliant reports quickly — all in one AI-driven workspace."
        primaryCta={{ href: "/subscribe", label: "Get Early Access" }}
        secondaryCta={{ href: "#features", label: "Learn More" }}
      />

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Special Education Software Built for Real Classrooms
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Everything special education teachers need to track IEP goals, monitor progress, and ensure compliance — without the paperwork overwhelm.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "IEP Goal Tracking",
                description: "Track multiple IEP goals per student with visual progress indicators, mastery criteria, and automated alerts for review dates."
              },
              {
                icon: PieChart,
                title: "Progress Monitoring",
                description: "Collect data quickly during instruction with customizable rubrics, quick-entry forms, and real-time graphing of student progress."
              },
              {
                icon: FileCheck,
                title: "Accommodation Documentation",
                description: "Document accommodations and modifications with one-click logging, implementation tracking, and effectiveness reports."
              },
              {
                icon: BookOpen,
                title: "Lesson Planning Integration",
                description: "Create IEP-aligned lesson plans with differentiated activities, embedded accommodations, and progress checkpoints."
              },
              {
                icon: Zap,
                title: "Compliant Report Generation",
                description: "Generate IEP progress reports, parent communications, and district reports automatically with your data — formatted and ready to share."
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Share student progress with related service providers, paraprofessionals, and administrators through secure, role-based access."
              }
            ].map((feature) => (
              <div key={feature.title} className="relative group">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500/15 to-amber-400/5 text-yellow-700">
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
              Why Special Education Teachers Love ClassroomPilot
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Save Hours Every Week</h3>
                <p className="mt-1 text-slate-600">
                  Reduce documentation time by 70% with smart data entry, automated reports, and streamlined workflows designed for special education.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Stay Compliant Effortlessly</h3>
                <p className="mt-1 text-slate-600">
                  Built-in compliance checks, deadline reminders, and audit-ready documentation ensure you meet all IEP and district requirements.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Make Data-Driven Decisions</h3>
                <p className="mt-1 text-slate-600">
                  Visual dashboards and trend analysis help you identify what's working, adjust strategies quickly, and demonstrate student growth clearly.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Designed by Special Educators</h3>
                <p className="mt-1 text-slate-600">
                  Created in partnership with experienced special education teachers who understand the unique challenges and requirements of your role.
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
            Ready to Simplify Your Special Education Workflow?
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Join thousands of special education teachers who are spending less time on paperwork and more time supporting their students.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-12 px-8 text-base font-semibold bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl">
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
          name: "ClassroomPilot",
          applicationCategory: "EducationApplication",
          operatingSystem: "Web",
          description: "Special education software for teachers to plan IEP-aligned lessons, track student progress, document accommodations, and generate compliant reports quickly — all in one AI-driven workspace.",
          url: `${SITE_URL}/classroompilot`,
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
              name: "ClassroomPilot",
              item: `${SITE_URL}/classroompilot`,
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