import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
  description:
    "Special education software to plan lessons, track IEP goals, and generate progress reports with ease. AI-powered for teachers and case managers.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
    description:
      "Special education software to plan lessons, track IEP goals, and generate progress reports with ease. AI-powered for teachers and case managers.",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClassroomPilot - Special Education Teacher Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
    description:
      "Special education software to plan lessons, track IEP goals, and generate progress reports with ease. AI-powered for teachers and case managers.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, BarChart3, FileText, Users } from "lucide-react";
import Footer from "@/components/ui/Footer";
import { Hero } from "@/components/ui/hero";
 

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      <Hero
        variant="brand"
        eyebrow="ClassroomPilot"
        title="IEP Goal Tracking &"
        highlight="Progress Monitoring Software"
        subtitle="Special education software to plan lessons, track IEP goals, and generate progress reports with ease. AI-powered for teachers and case managers."
        primaryCta={{ href: "/subscribe", label: "Start Free Trial" }}
      />

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">How It Works</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Streamlined IEP data collection and special education planning from goal setting to progress reporting
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 text-white shadow-lg mb-4">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Import IEP Goals</h3>
              <p className="text-slate-600">Upload existing IEP goals or create new ones with our goal bank and IDEA compliance templates</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-lg mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Plan Lessons</h3>
              <p className="text-slate-600">Generate lesson plans aligned to IEP goals with accommodations tracking and assistive technology integration</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 text-white shadow-lg mb-4">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Track Progress</h3>
              <p className="text-slate-600">Real-time progress monitoring with data collection tools designed for special education classrooms</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 text-white shadow-lg mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Generate Reports</h3>
              <p className="text-slate-600">Automated IEP progress reports with parent communication tools and data visualization</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Built for Special Education Teachers</h2>
          </div>
          <div className="mx-auto max-w-3xl text-slate-700 space-y-6">
            <p>
              ClassroomPilot is designed specifically for special education professionals who need:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>IEP data collection</strong> that's fast and accurate</li>
              <li><strong>Progress monitoring app</strong> with real-time insights</li>
              <li><strong>Accommodations tracking tool</strong> for IDEA compliance</li>
              <li><strong>Special education planning software</strong> that saves time</li>
              <li><strong>Parent communication tools</strong> for transparency</li>
            </ul>
            <p>
              Every feature is built to reduce paperwork and help you focus on what matters most&mdash;student success.
            </p>
          </div>
        </div>
      </section>

      {/* Lead Magnet Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Free IEP Data Tracking Checklist
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Download our &ldquo;Top 10 IEP Data Tracking Tips&rdquo; checklist and discover proven strategies to streamline your special education data collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="h-12 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                <a href="/resources/iep-checklist">
                  Download Free Checklist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <p className="text-sm text-slate-500">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Ready to Transform Your Special Education Workflow?</h2>
          </div>
          <div className="mx-auto max-w-3xl text-slate-700 space-y-6">
            <p>
              Join thousands of special education teachers who use ClassroomPilot to track IEP goals, monitor progress, and generate compliant reports&mdash;all in one platform.
            </p>
            <div className="pt-2 text-center">
              <Button asChild size="lg" className="h-12 px-6 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                <a href="/subscribe">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Structured data (WebPage + Breadcrumbs) */}
      {(() => {
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://classroompilot.com";
        const webPageJsonLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
          url: SITE_URL,
          description:
            "Special education software to plan lessons, track IEP goals, and generate progress reports with ease. AI-powered for teachers and case managers.",
          isPartOf: { "@type": "WebSite", url: SITE_URL, name: "ClassroomPilot" },
          about: {
            "@type": "SoftwareApplication",
            name: "ClassroomPilot",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web-based",
            description: "IEP goal tracking and progress monitoring software for special education teachers",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: "Free trial available"
            }
          }
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
          ],
        } as const;
        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
          </>
        );
      })()}

      <Footer />
    </div>
  );
}