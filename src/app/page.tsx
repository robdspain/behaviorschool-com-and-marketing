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
import { CheckCircle, ArrowRight } from "lucide-react";
import Footer from "@/components/ui/Footer";
import { Hero } from "@/components/ui/hero";
 

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
              Whether you’re launching a new behavior program or improving an existing one, our resources are field-tested and ready to use.
            </p>
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

      {/* Section 3 – Join the Community */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Collaboration That Drives Change</h2>
          </div>
          <div className="mx-auto max-w-3xl text-slate-700 space-y-6">
            <p>
              We’re not just a resource hub — we’re a network of behavior analysts, educators, and leaders committed to building better systems of support in schools.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Connect with peers in our professional network</li>
              <li>Participate in collaborative problem-solving</li>
              <li>Share and access proven strategies</li>
            </ul>
            <div className="pt-2">
              <Button asChild size="lg" className="h-12 px-6 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                <a href="https://community.behaviorschool.com" target="_blank" rel="noopener noreferrer">
                  Join the Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
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