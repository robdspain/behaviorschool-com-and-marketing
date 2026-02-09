import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, Calendar, Users, BookOpen, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "BACB Authorized Continuing Education (ACE) Provider | Behavior School",
  description: "BACB Authorized Continuing Education (ACE) Provider OP-25-11420. Get BACB-approved CEUs for BCBA/BCaBA through training programs, webinars & professional development.",
  keywords: [
    "BACB ACE Provider",
    "BACB Authorized Continuing Education",
    "BCBA CEUs",
    "BCaBA continuing education",
    "BACB approved CEUs",
    "behavior analyst continuing education",
    "ACE Provider OP-25-11420",
    "BCBA professional development",
    "school BCBA CEUs",
    "behavior analysis training"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "BACB ACE Provider | Behavior School",
    description: "Get BACB-approved CEUs from Behavior School (Provider OP-25-11420). Professional development for BCBA and BCaBA certificants.",
    type: "website",
    url: "https://behaviorschool.com/bacb-ace-provider",
    images: [
      {
        url: "https://behaviorschool.com/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior School - BACB ACE Provider"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BACB ACE Provider | Behavior School",
    description: "Get BACB-approved CEUs from Behavior School (Provider OP-25-11420)",
    images: ["https://behaviorschool.com/optimized/og-image.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/bacb-ace-provider"
  }
};

// ACE Provider structured data
const aceProviderSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Behavior School",
  "description": "BACB Authorized Continuing Education (ACE) Provider offering professional development and CEUs for BCBA and BCaBA certificants",
  "url": "https://behaviorschool.com",
  "logo": "https://behaviorschool.com/optimized/Logos/logo-gold-transparent.webp",
  "accreditedBy": {
    "@type": "Organization",
    "name": "Behavior Analyst Certification Board (BACB)",
    "sameAs": "https://www.bacb.com/"
  },
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "name": "BACB Authorized Continuing Education (ACE) Provider",
    "credentialCategory": "Professional Accreditation",
    "recognizedBy": {
      "@type": "Organization",
      "name": "Behavior Analyst Certification Board (BACB)"
    },
    "identifier": "OP-25-11420"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "ACE Coordinator",
    "name": "Rob Spain, M.S., BCBA, IBA"
  }
};

export default function BACBACEProviderPage() {
  return (
    <div className="min-h-screen bg-bs-background">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aceProviderSchema) }}
      />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-2">
        <Breadcrumbs
          items={[
            { label: "All articles", href: "/blog" },
            { label: "BACB Accreditation" },
            { label: "BACB Authorized Continuing Education (ACE) Provider" }
          ]}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10 pb-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
              <Award className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              BACB Authorized Continuing Education (ACE) Provider
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              ACE providers have been authorized by the BACB to provide Learning CE events for BCBA and BCaBA certificants.
            </p>
          </div>

          <hr className="border-slate-200 my-12" />

          {/* About ACE Program */}
          <div className="prose prose-slate max-w-none mb-12">
            <p className="text-lg text-slate-700 leading-relaxed">
              The Authorized Continuing Education (ACE) program exists to make a wide array of continuing education (CE) events available to Behavior Analyst Certification Board® (BACB®) certificants.
            </p>
          </div>

          {/* ACE Badge */}
          <div className="flex justify-center my-12">
            <Image
              src="/BACB-ACE/BACB_ACE-Logo-New.webp"
              alt="BACB ACE Provider Logo - Behavior School"
              width={300}
              height={300}
              className="rounded-lg shadow-xl"
              priority
            />
          </div>

          {/* Provider Information */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-8 mb-12 border border-emerald-200">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Behavior School is an ACE Provider:
              </h2>

              <div className="bg-white rounded-lg p-6 shadow-md inline-block">
                <p className="text-xl font-bold text-slate-900 mb-2">
                  Behavior School | Provider # OP-25-11420
                </p>
                <p className="text-lg text-slate-700">
                  ACE Coordinator: <span className="font-semibold">Rob Spain, M.S., BCBA, IBA</span>
                </p>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>BACB Approved</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Provider Since 2025</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>School-Based Focus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Available CEU Opportunities */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Available CEU Opportunities
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* School BCBA Transformation System */}
              <div className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-emerald-500 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      School BCBA Transformation System
                    </h3>
                    <p className="text-slate-600 mb-3">
                      8-week intensive training program for school-based BCBAs
                    </p>
                    <div className="flex items-center gap-2 text-sm text-emerald-700 font-semibold">
                      <Award className="w-4 h-4" />
                      <span>CEUs Available</span>
                    </div>
                  </div>
                </div>
                <Link href="/transformation-program">
                  <Button variant="outline" className="w-full">
                    Learn More
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Webinars & Workshops */}
              <div className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-emerald-500 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Webinars & Workshops
                    </h3>
                    <p className="text-slate-600 mb-3">
                      Live and recorded sessions on MTSS, Functional Analysis, ACT, and more
                    </p>
                    <div className="flex items-center gap-2 text-sm text-emerald-700 font-semibold">
                      <Award className="w-4 h-4" />
                      <span>CEUs Available</span>
                    </div>
                  </div>
                </div>
                <Link href="/community">
                  <Button variant="outline" className="w-full">
                    View Schedule
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Professional Development */}
              <div className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-emerald-500 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Professional Development Courses
                    </h3>
                    <p className="text-slate-600 mb-3">
                      Self-paced courses on behavior intervention, IEP development, and ethics
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-semibold">
                      <Calendar className="w-4 h-4" />
                      <span>Coming Soon</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </div>

              {/* Supervision Training */}
              <div className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-emerald-500 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Supervision Training
                    </h3>
                    <p className="text-slate-600 mb-3">
                      BCBA supervision tools, strategies, and best practices for fieldwork
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-semibold">
                      <Calendar className="w-4 h-4" />
                      <span>Coming Soon</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>

          {/* About Our ACE Programming */}
          <div className="bg-slate-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              About Our BACB ACE Programming
            </h2>
            <div className="space-y-4 text-slate-700">
              <p className="leading-relaxed">
                As a BACB Authorized Continuing Education Provider, Behavior School offers high-quality professional development specifically designed for school-based behavior analysts. Our programming focuses on practical, evidence-based strategies that can be immediately applied in educational settings.
              </p>
              <p className="leading-relaxed">
                All CEU events are delivered by experienced BCBAs and align with the BACB Ethics Code and professional standards. We specialize in topics relevant to school practitioners including MTSS/PBIS implementation, functional behavior assessment, acceptance and commitment therapy (ACT), and collaborative consultation with educators.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>BACB-approved content and instructors</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>School-focused topics and examples</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Immediate certificate delivery</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Live and self-paced options</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated on CEU Opportunities
            </h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto text-lg">
              Join the Behavior School community to receive notifications about upcoming CEU events, webinars, and professional development opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-slate-100">
                <Link href="/community">
                  Join Community
                  <ExternalLink className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600">
                <Link href="/transformation-program">
                  View Programs
                  <ExternalLink className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-slate-500">
            <p>
              Behavior School is a BACB ACE Provider (OP-25-11420). See our{" "}
              <Link href="/about" className="text-emerald-600 hover:text-emerald-700 underline">
                ACE Coordinator
              </Link>{" "}
              for more information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
