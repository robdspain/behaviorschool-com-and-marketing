import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, BookOpen, Target, Award, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "School-Based BCBA Resources | Training & Tools for Behavior Analysts in Education",
  description: "Comprehensive resources for school-based BCBAs. Get training, tools, and support for behavior analysts working in educational settings.",
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
    "school based bcba",
    "bcba in schools",
    "behavior analyst education",
    "school behavior support",
    "bcba training",
    "educational behavior analysis"
  ],
  openGraph: {
    title: "School-Based BCBA Resources | Training & Tools for Behavior Analysts in Education",
    description: "Comprehensive resources for school-based BCBAs. Get training, tools, and support for behavior analysts working in educational settings.",
    url: "https://behaviorschool.com/school-based-bcba",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "School-Based BCBA Resources",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "School-Based BCBA Resources | Training & Tools for Behavior Analysts in Education",
    description: "Comprehensive resources for school-based BCBAs. Get training, tools, and support for behavior analysts working in educational settings.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function SchoolBasedBCBAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "School-Based BCBA Resources", href: "/school-based-bcba" }
          ]}
        />
        
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              School-Based BCBA Resources
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Comprehensive training, tools, and support for Board Certified Behavior Analysts working in educational settings. 
              Master the unique challenges of school-based practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/transformation-program">
                  <Users className="mr-2 h-5 w-5" />
                  Join BCBA Training Program
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/behavior-study-tools">
                  <BookOpen className="mr-2 h-5 w-5" />
                  BCBA Exam Prep
                </Link>
              </Button>
            </div>
          </div>

          {/* Key Challenges Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Unique Challenges for School-Based BCBAs
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">System-Level Change</h3>
                <p className="text-slate-600 mb-4">
                  Unlike clinical settings, school-based BCBAs must navigate complex educational systems, 
                  multiple stakeholders, and district-level policies.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    District-wide implementation strategies
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Multi-tiered systems of support (MTSS)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Policy and compliance requirements
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Stakeholder Collaboration</h3>
                <p className="text-slate-600 mb-4">
                  Success requires building relationships with teachers, administrators, parents, 
                  and support staff while maintaining professional boundaries.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Teacher training and support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Parent communication strategies
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Administrative buy-in and support
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Data-Driven Decision Making</h3>
                <p className="text-slate-600 mb-4">
                  School environments require robust data collection systems that work within 
                  existing educational frameworks and time constraints.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Efficient data collection methods
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Progress monitoring systems
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Outcome measurement and reporting
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Crisis Management</h3>
                <p className="text-slate-600 mb-4">
                  School-based BCBAs often face high-intensity situations requiring immediate 
                  intervention while maintaining safety and dignity.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    De-escalation techniques
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Safety planning and protocols
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Post-crisis support and debriefing
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Essential Resources for School-Based BCBAs
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">BCBA Exam Prep</h3>
                <p className="text-slate-600 mb-4">
                  AI-powered practice tests and study materials specifically designed for behavior analysts.
                </p>
                <Button asChild variant="outline">
                  <Link href="/behavior-study-tools">
                    Start Studying
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Transformation Program</h3>
                <p className="text-slate-600 mb-4">
                  8-week intensive training program for school-based BCBAs to master ethical leadership and systems change.
                </p>
                <Button asChild variant="outline">
                  <Link href="/transformation-program">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">IEP Goal Generator</h3>
                <p className="text-slate-600 mb-4">
                  Free tool for writing values-based IEP goals that students actually care about.
                </p>
                <Button asChild variant="outline">
                  <Link href="/iep-goals">
                    Try Free Tool
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-12 text-center bg-blue-600 rounded-lg text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Excel as a School-Based BCBA?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of behavior analysts who have transformed their school-based practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/transformation-program">
                  <Award className="mr-2 h-5 w-5" />
                  Start Your Transformation
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/community">
                  <Users className="mr-2 h-5 w-5" />
                  Join Our Community
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
