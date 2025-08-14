import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Empowering Behavior Analysts in Education | Behavior School",
  description:
    "Tools, training, and community to help school-based BCBAs thrive — from functional assessments to supervision systems that work in real classrooms.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Empowering Behavior Analysts in Education | Behavior School",
    description:
      "Tools, training, and community to help school-based BCBAs thrive — from functional assessments to supervision systems that work in real classrooms.",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Empowering Behavior Analysts in Education | Behavior School",
    description:
      "Tools, training, and community to help school-based BCBAs thrive — from functional assessments to supervision systems that work in real classrooms.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Mail, Users, BookOpen } from "lucide-react";
import Footer from "@/components/ui/Footer";
import { Hero } from "@/components/ui/hero";
import { Card, CardContent } from "@/components/ui/card";


export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      <Hero
        variant="brand"
        eyebrow="Behavior School"
        title="Empowering"
        highlight="Behavior Analysts in Education"
        subtitle="Tools, training, and community to help school-based BCBAs thrive — from functional assessments to supervision systems that work in real classrooms."
        primaryCta={{ href: "/subscribe", label: "Join the Community" }}
      />

      {/* Early Access Sign-up Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <Mail className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Be the First to Know When We Launch
            </h2>
            <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
              Get exclusive early access to our tools, resources, and community. Join thousands of behavior analysts already on our waitlist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
              <Button 
                asChild 
                size="lg" 
                className="h-12 px-8 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex-1"
              >
                <a href="/subscribe">
                  Join Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>2,500+ Members</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Free to Join</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Expert Resources</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1 – What We Do */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Practical Solutions for Real School Challenges</h2>
          </div>
          <div className="mx-auto max-w-3xl text-slate-700 space-y-6">
            <p>
              Behavior School is built for the realities of working in education. We provide:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Research-backed intervention strategies</li>
              <li>Customizable behavior support tools</li>
              <li>Professional development designed for busy school teams</li>
            </ul>
            <p>
              Whether you&apos;re launching a new behavior program or improving an existing one, our resources are field-tested and ready to use.
            </p>
            <div className="pt-4 text-center">
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base font-semibold rounded-xl">
                <a href="/subscribe">
                  Get Early Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 – For BCBAs & Behavior Teams */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">From Assessment to Implementation</h2>
          </div>
          <div className="mx-auto max-w-3xl text-slate-700 space-y-6">
            <p>We focus on the entire process:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Functional Behavior Assessments tailored for school settings</li>
              <li>Step-by-step intervention planning</li>
              <li>Data collection systems that actually fit into the school day</li>
              <li>Ongoing support and coaching to maintain fidelity</li>
            </ul>
            <p>Every tool and training we offer is designed to save you time and improve student outcomes.</p>
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Coming Soon: Your Complete Toolkit</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We&apos;re building comprehensive solutions to address every aspect of behavior support in schools.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="bg-emerald-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Assessment Tools</h3>
                <p className="text-slate-600">Digital FBA templates, data collection forms, and analysis tools designed for school environments.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Team Collaboration</h3>
                <p className="text-slate-600">Shared workspaces, communication tools, and progress tracking for your entire behavior team.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Implementation Support</h3>
                <p className="text-slate-600">Step-by-step guides, training materials, and ongoing coaching to ensure successful outcomes.</p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg" className="h-12 px-8 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
              <a href="/subscribe">
                Get Notified When Available
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 3 – Join the Community */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Collaboration That Drives Change</h2>
          </div>
          <div className="mx-auto max-w-3xl text-slate-700 space-y-6">
            <p>
              We&apos;re not just a resource hub — we&apos;re a network of behavior analysts, educators, and leaders committed to building better systems of support in schools.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Connect with peers in our professional network</li>
              <li>Participate in collaborative problem-solving</li>
              <li>Share and access proven strategies</li>
            </ul>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-6 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                <a href="https://community.behaviorschool.com" target="_blank" rel="noopener noreferrer">
                  Join the Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base font-semibold rounded-xl">
                <a href="/subscribe">
                  Join Waitlist
                  <Mail className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Behavior Program?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join our community of behavior analysts who are already making a difference in schools across the country.
          </p>
          <Button asChild size="lg" className="h-14 px-8 text-lg font-semibold bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl">
            <a href="/subscribe">
              Get Started Today
              <ArrowRight className="ml-2 h-6 w-6" />
            </a>
          </Button>
          <p className="text-emerald-100 mt-4 text-sm">No credit card required • Free to join</p>
        </div>
      </section>

      {/* Light CTA simplified is integrated into Section 3 above */}
      
      {/* Structured data (WebPage + Breadcrumbs) */}
      {(() => {
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
        const webPageJsonLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Empowering Behavior Analysts in Education | Behavior School",
          url: SITE_URL,
          description:
            "Tools, training, and community to help school-based BCBAs thrive — from functional assessments to supervision systems that work in real classrooms.",
          isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Behavior School" },
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