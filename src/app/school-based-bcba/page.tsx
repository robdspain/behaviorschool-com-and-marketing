import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  BookOpen, 
  Award, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Target, 
  Shield, 
  FileText,
  Brain,
  MessageCircle,
  Settings,
  PlayCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "School-Based BCBA Operating System: From Crisis Manager to Systems Leader",
  description: "School behavior doesn't have to feel overwhelming. Transform from crisis manager to systems leader with practical, ethical tools built for real classrooms. 8-week program + AI tools.",
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
  keywords: [
    "school based BCBA",
    "school-based behavior analyst",
    "BCBA in schools",
    "school behavior systems",
    "PBIS implementation",
    "MTSS behavior support",
    "IEP behavior goals",
    "school BIP writing",
    "FBA in schools",
    "school BCBA training",
    "behavior intervention plans schools",
    "school behavior analyst certification"
  ],
  openGraph: {
    title: "School-Based BCBA Operating System: From Crisis Manager to Systems Leader",
    description: "School behavior doesn't have to feel overwhelming. Transform from crisis manager to systems leader with practical, ethical tools built for real classrooms.",
    url: "https://behaviorschool.com/school-based-bcba",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "School-Based BCBA Operating System",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "School-Based BCBA Operating System: From Crisis Manager to Systems Leader",
    description: "School behavior doesn't have to feel overwhelming. Transform from crisis manager to systems leader with practical, ethical tools built for real classrooms.",
    images: ["/optimized/og-image.webp"],
  },
  alternates: {
    canonical: "https://behaviorschool.com/school-based-bcba",
  }
};

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "School-Based BCBA", href: "/school-based-bcba" }
];

export default function SchoolBasedBCBAPage() {
  return (
    <main className="min-h-screen bg-bs-background">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 pt-24 pb-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            School-Based BCBA Operating System: <span className="text-blue-600">From Crisis Manager to Systems Leader</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            School behavior doesn&apos;t have to feel overwhelming. As a school-based BCBA, you need practical, ethical systems built for real classrooms.
          </p>

          {/* Quick Wins */}
          <div className="grid md:grid-cols-2 gap-4 mb-10 text-left max-w-3xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700 font-medium">AI-powered IEP Goal Generator & Behavior Plan Writer</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700 font-medium">8-week Transformation Program for School-Based BCBAs</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700 font-medium">Fieldwork & Supervision Tools to Reduce Burnout</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700 font-medium">Evidence-Based Systems Aligned with MTSS & PBIS</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/transformation-program">
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Your Transformation Program
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/school-bcba">Explore the School BCBA Hub</Link>
          </Button>
          </div>
        </div>
      </section>

      {/* What Is a School-Based BCBA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              What Is a School-Based BCBA?
            </h2>
            
            <div className="text-lg text-gray-700 mb-8 space-y-4">
              <p>
                A school-based BCBA is a Board Certified Behavior Analyst who applies ABA in K–12 schools. Unlike clinic-based practitioners, school BCBAs target behaviors that affect learning, engagement, and IEP compliance.
              </p>
              
              <p className="font-semibold">They serve a dual role:</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Target className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Student-focused</h3>
                </div>
                <p className="text-gray-700">
                  Conducting FBAs, writing BIPs, and supporting IEP teams with measurable, achievable goals.
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Settings className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Systems-focused</h3>
                </div>
                <p className="text-gray-700">
                  Training staff, embedding interventions, and aligning supports with district-wide frameworks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Responsibilities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Core Responsibilities
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* FBA */}
              <div className="bg-white p-8 rounded-xl shadow-sm border">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  1. Conduct Functional Behavior Assessments (FBAs)
                </h3>
                <p className="text-gray-600 mb-4">
                  Identify the root causes of challenging behaviors and design context-fit interventions.
                </p>
              </div>

              {/* BIP */}
              <div className="bg-white p-8 rounded-xl shadow-sm border">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  2. Develop Behavior Intervention Plans (BIPs)
                </h3>
                <p className="text-gray-600 mb-4">
                  Plans that teachers can actually follow: prevention, skill replacement, reinforcement, and progress monitoring.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/behavior-plans">
                    Try our Behavior Plan Writer Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* IEP */}
              <div className="bg-white p-8 rounded-xl shadow-sm border">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  3. Collaborate on IEP Teams
                </h3>
                <p className="text-gray-600 mb-4">
                  Craft measurable, IDEA-compliant goals that improve student outcomes.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/iep-goals">
                    Try our IEP Goal Generator
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* MTSS/PBIS */}
              <div className="bg-white p-8 rounded-xl shadow-sm border">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  4. Align With Tiered Systems (MTSS/PBIS)
                </h3>
                <p className="text-gray-600 mb-4">
                  Embed ABA strategies across Tier 1, Tier 2, and Tier 3 for school-wide consistency.
                </p>
              </div>

              {/* Training */}
              <div className="bg-white p-8 rounded-xl shadow-sm border md:col-span-2">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <MessageCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  5. Train & Coach School Staff
                </h3>
                <p className="text-gray-600 mb-4">
                  Provide practical coaching that boosts teacher confidence and ensures fidelity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Schools Need BCBAs */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Why Schools Need BCBAs
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-left">
                <div className="flex items-start space-x-3 mb-6">
                  <Shield className="w-8 h-8 text-blue-200 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Legal Compliance</h3>
                    <p className="text-blue-100">Help districts meet federal/state mandates.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 mb-6">
                  <Target className="w-8 h-8 text-blue-200 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Better Outcomes</h3>
                    <p className="text-blue-100">Function-based interventions reduce disruption and increase engagement.</p>
                  </div>
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-start space-x-3 mb-6">
                  <Users className="w-8 h-8 text-blue-200 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Staff Confidence</h3>
                    <p className="text-blue-100">Teachers succeed when supported with coaching and usable strategies.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 mb-6">
                  <Settings className="w-8 h-8 text-blue-200 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Sustainable Systems</h3>
                    <p className="text-blue-100">Embedding BCBAs reduces burnout and ensures fidelity.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Program */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Our Transformation Program
            </h2>
            
            <p className="text-xl text-gray-600 mb-12">
              <strong>8 Weeks to Shift From Overwhelm to Ethical Leadership</strong>
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">You&apos;ll gain:</h3>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Leadership tools for working with administrators</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Strategies to scale PBIS/MTSS across schools</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">ACT-based resilience skills for stress & burnout</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Systems for supervision, coaching, and fidelity</span>
                </div>
              </div>
            </div>

            <Button size="lg" className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700" asChild>
              <Link href="/transformation-program">
                Learn More About the Transformation Program
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Tools for Everyday Success
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">IEP Goal Generator</h3>
                <p className="text-gray-600 mb-4">Create SMART goals in seconds.</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/iep-goals">Try Now</Link>
                </Button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Behavior Plan Writer</h3>
                <p className="text-gray-600 mb-4">Build practical, teacher-ready plans.</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/behavior-plans">Try Now</Link>
                </Button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Supervision Tracker</h3>
                <p className="text-gray-600 mb-4">Monitor fieldwork with precision.</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/supervisors">Try Now</Link>
                </Button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Study Tools</h3>
                <p className="text-gray-600 mb-4">Support for future BCBAs prepping for exams.</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/behavior-study-tools">Try Now</Link>
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/resources">
                  Explore All Tools
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Ready to lead behavior systems with confidence?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-6" 
                asChild
              >
                <Link href="/transformation-program">
                  Join the 8-Week Transformation Program
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-6" 
                asChild
              >
                <Link href="/iep-goals">
                  Access the Free IEP Goal Generator
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-purple-600 font-semibold py-6" 
                asChild
              >
                <Link href="/community">
                  Connect with Our Community
                </Link>
              </Button>
            </div>

            <p className="text-xl text-blue-100">
              Join hundreds of school-based BCBAs transforming behavior systems nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-8">
              <div className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  What does a school-based BCBA do?
                </h3>
                <p className="text-gray-700">
                  They design and implement school-wide systems, conduct FBAs, write BIPs, join IEP teams, and coach staff.
                </p>
              </div>

              <div className="border-l-4 border-green-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  How are they different from clinic BCBAs?
                </h3>
                <p className="text-gray-700">
                  Clinic BCBAs focus on 1:1 therapy. School BCBAs balance individual supports + systems leadership.
                </p>
              </div>

              <div className="border-l-4 border-purple-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  What challenges do school BCBAs face?
                </h3>
                <p className="text-gray-700">
                  High caseloads, under-trained staff, limited direct time, and crisis-driven burnout.
                </p>
              </div>

              <div className="border-l-4 border-orange-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  How does the Transformation Program help?
                </h3>
                <p className="text-gray-700">
                  It provides tools, leadership strategies, and stress resilience skills for sustainable school impact.
                </p>
              </div>

              <div className="border-l-4 border-red-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  What tools are available daily?
                </h3>
                <p className="text-gray-700">
                  The IEP Goal Generator, Behavior Plan Writer, Supervision Tracker, and more.
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Who should join the Behavior School community?
                </h3>
                <p className="text-gray-700">
                  BCBAs, RBTs, and educators in K–12 who want ready-to-use school systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "School-Based BCBA Operating System",
            "description": "School behavior doesn't have to feel overwhelming. Transform from crisis manager to systems leader with practical, ethical tools built for real classrooms.",
            "url": "https://behaviorschool.com/school-based-bcba",
            "mainEntity": {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What does a school-based BCBA do?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "They design and implement school-wide systems, conduct FBAs, write BIPs, join IEP teams, and coach staff."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How are they different from clinic BCBAs?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Clinic BCBAs focus on 1:1 therapy. School BCBAs balance individual supports + systems leadership."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What challenges do school BCBAs face?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "High caseloads, under-trained staff, limited direct time, and crisis-driven burnout."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does the Transformation Program help?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It provides tools, leadership strategies, and stress resilience skills for sustainable school impact."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What tools are available daily?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The IEP Goal Generator, Behavior Plan Writer, Supervision Tracker, and more."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Who should join the Behavior School community?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "BCBAs, RBTs, and educators in K–12 who want ready-to-use school systems."
                  }
                }
              ]
            },
            "provider": {
              "@type": "Organization",
              "name": "Behavior School",
              "url": "https://behaviorschool.com"
            }
          }),
        }}
      />
    </main>
  );
}
