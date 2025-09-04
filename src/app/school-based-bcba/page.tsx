import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, BookOpen, Award, ThumbsUp, ThumbsDown } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Become a School-Based BCBA: A Complete Guide",
  description: "Learn how to become a school-based BCBA with our complete guide. Find out about the responsibilities, requirements, salary, and career outlook for school-based behavior analysts.",
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
    "how to become a school bcba",
    "school based bcba",
    "bcba in schools",
    "behavior analyst education",
    "school behavior support",
    "bcba training",
    "educational behavior analysis",
    "school bcba salary",
    "school bcba job description"
  ],
  openGraph: {
    title: "How to Become a School-Based BCBA: A Complete Guide",
    description: "Learn how to become a school-based BCBA with our complete guide. Find out about the responsibilities, requirements, salary, and career outlook for school-based behavior analysts.",
    url: "https://behaviorschool.com/school-based-bcba",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "How to Become a School-Based BCBA",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Become a School-Based BCBA: A Complete Guide",
    description: "Learn how to become a school-based BCBA with our complete guide. Find out about the responsibilities, requirements, salary, and career outlook for school-based behavior analysts.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function SchoolBasedBCBAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "BCBA Resources", href: "/bcba-exam-prep" },
            { label: "How to Become a School-Based BCBA" }
          ]}
        />
        
        {/* Related Pages Navigation */}
        <div className="mb-8">
          <div className="bg-slate-100 rounded-lg p-4 border border-emerald-800">
            <p className="text-sm text-emerald-800 font-medium mb-2">Related BCBA Resources:</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/bcba-study-fluency" className="text-xs bg-white px-3 py-1 rounded-full text-emerald-800 hover:bg-emerald-800 hover:text-white transition-colors border border-emerald-700">
                Study Fluency Guide
              </Link>
              <Link href="/bcba-mock-practice-test" className="text-xs bg-white px-3 py-1 rounded-full text-emerald-800 hover:bg-emerald-800 hover:text-white transition-colors border border-emerald-700">
                Free Practice Tests
              </Link>
              <Link href="/behavior-study-tools" className="text-xs bg-white px-3 py-1 rounded-full text-emerald-800 hover:bg-emerald-800 hover:text-white transition-colors border border-emerald-700">
                Study Tools
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-6">
              How to Become a School-Based BCBA: A Complete Guide
            </h1>
            <p className="text-xl text-emerald-700 mb-8 max-w-3xl mx-auto">
              A comprehensive guide for aspiring behavior analysts who want to make a difference in the lives of students.
            </p>
          </div>

          {/* What is a School-Based BCBA? */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              What is a School-Based BCBA?
            </h2>
            <div className="prose prose-lg text-slate-600 max-w-none">
              <p className="text-lg mb-6">
                A school-based Board Certified Behavior Analyst (BCBA) is a licensed professional who applies the science of Applied Behavior Analysis (ABA) within educational settings. These specialists work directly in schools, supporting students with diverse behavioral and learning needs while collaborating with educators, families, and multidisciplinary teams.
              </p>
              <p className="text-lg mb-6">
                Unlike clinical BCBAs who primarily work in therapeutic settings, school-based BCBAs operate within the unique context of educational environments. They must understand not only behavior analysis principles but also educational law, IEP processes, classroom dynamics, and the complex social structures that exist in schools.
              </p>
              <p className="text-lg mb-8">
                The role has evolved significantly over the past decade as schools have increasingly recognized the value of behavior analysis in supporting student success. Today&apos;s school-based BCBAs serve students across the entire spectrum - from those with autism and developmental disabilities to students in general education who need behavioral support to access their education effectively.
              </p>
            </div>
          </div>

          {/* What Does a School-Based BCBA Do? */}
          <div className="py-12 bg-white rounded-lg shadow-sm border">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              What Does a School-Based BCBA Do?
            </h2>
            
            {/* Core Responsibilities */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">Core Responsibilities</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Functional Behavior Assessments (FBAs)</h4>
                      <p className="text-slate-600 mt-1">Conduct comprehensive assessments to identify the function and environmental factors contributing to challenging behaviors. This involves direct observation, data collection, interviews with stakeholders, and environmental analysis.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Behavior Intervention Plans (BIPs)</h4>
                      <p className="text-slate-600 mt-1">Design evidence-based intervention strategies that teach replacement behaviors while reducing problematic ones. Our <Link href="/behavior-plans" className="text-emerald-600 hover:text-emerald-700 font-medium">behavior intervention plan templates</Link> and <Link href="/iep-goals" className="text-emerald-600 hover:text-emerald-700 font-medium">IEP goal writing tools</Link> can streamline this process. Plans must be practical for school implementation and aligned with educational goals.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Staff Training and Consultation</h4>
                      <p className="text-slate-600 mt-1">Provide ongoing training to teachers, paraprofessionals, and support staff on behavior management strategies, data collection procedures, and implementation of behavior plans.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Data Collection and Analysis</h4>
                      <p className="text-slate-600 mt-1">Systematically collect and analyze behavioral data to monitor progress, make data-driven decisions, and modify interventions as needed. This includes training others on data collection procedures.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900">IEP Team Participation</h4>
                      <p className="text-slate-600 mt-1">Actively participate in IEP meetings, contribute to the development of behavioral goals and objectives, and ensure behavior plans align with educational programming.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Crisis Management</h4>
                      <p className="text-slate-600 mt-1">Develop crisis intervention protocols, train staff on de-escalation techniques, and provide support during behavioral emergencies while ensuring student and staff safety.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Responsibilities */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">A Typical Day</h3>
              <div className="bg-slate-50 rounded-lg p-6">
                <p className="text-slate-700 mb-4">
                  <strong>7:30 AM - 8:30 AM:</strong> Review daily schedule, check emails from teachers about student concerns, and prepare materials for classroom observations and meetings.
                </p>
                <p className="text-slate-700 mb-4">
                  <strong>8:30 AM - 10:00 AM:</strong> Conduct classroom observations for ongoing FBAs, collecting ABC (Antecedent-Behavior-Consequence) data and environmental information.
                </p>
                <p className="text-slate-700 mb-4">
                  <strong>10:00 AM - 11:30 AM:</strong> Meet with teaching team to discuss implementation of behavior plans, review data, and problem-solve challenges.
                </p>
                <p className="text-slate-700 mb-4">
                  <strong>11:30 AM - 12:30 PM:</strong> Lunch break and informal consultation with staff members who have questions about student behaviors.
                </p>
                <p className="text-slate-700 mb-4">
                  <strong>12:30 PM - 2:00 PM:</strong> Attend IEP meeting, present behavioral assessment results, and collaborate on goal development.
                </p>
                <p className="text-slate-700 mb-4">
                  <strong>2:00 PM - 3:00 PM:</strong> Provide direct support to a student during a challenging transition period, coaching staff on intervention implementation.
                </p>
                <p className="text-slate-700">
                  <strong>3:00 PM - 4:00 PM:</strong> Data analysis, report writing, and planning for tomorrow&apos;s activities. Return parent calls and respond to team communications.
                </p>
              </div>
            </div>
          </div>

          {/* Early CTA */}
          <div className="py-8 text-center">
            <div className="bg-gradient-to-r from-emerald-50 to-yellow-50 rounded-xl p-6 border-2 border-emerald-800">
              <h2 className="text-xl font-bold text-emerald-900 mb-3">Ready to Start Your BCBA Journey?</h2>
              <p className="text-emerald-700 mb-4">Get the tools and training you need to become a successful school-based BCBA.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-emerald-900 font-semibold shadow-lg">
                  <Link href="/transformation-program">
                    <Award className="mr-2 h-4 w-4" />
                    Explore Training Programs
                  </Link>
                </Button>
                <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-emerald-900 font-semibold shadow-lg">
                  <Link href="/behavior-study-tools">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Start BCBA Exam Prep
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* How to Become a School-Based BCBA */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              How to Become a School-Based BCBA: Step-by-Step Pathway
            </h2>
            
            <div className="mb-12">
              <p className="text-lg text-slate-600 text-center max-w-3xl mx-auto">
                Becoming a school-based BCBA requires dedication, education, and practical experience. The pathway typically takes 4-6 years beyond your bachelor&apos;s degree, but the investment leads to a rewarding career helping students succeed.
              </p>
            </div>

            <div className="space-y-12">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-emerald-800 text-yellow-400 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">1</div>
                <div className="ml-8">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">Earn a Master&apos;s Degree</h3>
                  <p className="text-slate-600 mb-4">
                    The foundation of your BCBA career begins with a master&apos;s degree from an accredited university. While degrees in Applied Behavior Analysis (ABA) are ideal, many successful school-based BCBAs come from diverse academic backgrounds including:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                    <li>Applied Behavior Analysis (most direct path)</li>
                    <li>Psychology or Educational Psychology</li>
                    <li>Special Education</li>
                    <li>Rehabilitation Sciences</li>
                    <li>School Psychology</li>
                  </ul>
                  <p className="text-slate-600">
                    <strong>Timeline:</strong> 2-3 years | <strong>Cost:</strong> $20,000-$60,000 depending on program and state
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-emerald-800 text-yellow-400 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">2</div>
                <div className="ml-8">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">Complete BACB-Approved Coursework</h3>
                  <p className="text-slate-600 mb-4">
                    You must complete specific graduate-level coursework that covers the BACB Task List. This includes courses in behavior analysis principles, measurement, and intervention techniques. Our <Link href="/behavior-study-tools" className="text-emerald-600 hover:text-emerald-700 font-medium">BCBA study tools</Link> can help you master this content:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <ul className="list-disc pl-6 text-slate-600 space-y-1">
                      <li>Principles of Behavior Analysis</li>
                      <li>Behavioral Assessment</li>
                      <li>Experimental Design</li>
                      <li>Behavior Change Procedures</li>
                    </ul>
                    <ul className="list-disc pl-6 text-slate-600 space-y-1">
                      <li>Ethics and Professional Conduct</li>
                      <li>Research Methods</li>
                      <li>Applications of Behavior Analysis</li>
                      <li>Supervision and Management</li>
                    </ul>
                  </div>
                  <p className="text-slate-600">
                    Many master&apos;s programs include this coursework, but if yours doesn&apos;t, you can complete a Verified Course Sequence (VCS) through approved providers.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-emerald-800 text-yellow-400 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">3</div>
                <div className="ml-8">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">Complete Supervised Experience</h3>
                  <p className="text-slate-600 mb-4">
                    This is where theory meets practice. You need to complete either:
                  </p>
                  <div className="bg-slate-50 rounded-lg p-6 mb-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Concentrated Experience</h4>
                        <p className="text-slate-600 mb-2">1,500 hours over minimum 12 months</p>
                        <ul className="list-disc pl-4 text-slate-600 text-sm space-y-1">
                          <li>More intensive supervision</li>
                          <li>Faster completion</li>
                          <li>Better for career changers</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Supervised Independent Experience</h4>
                        <p className="text-slate-600 mb-2">2,000 hours over minimum 24 months</p>
                        <ul className="list-disc pl-4 text-slate-600 text-sm space-y-1">
                          <li>More flexible schedule</li>
                          <li>Can work while completing</li>
                          <li>Better for current educators</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600">
                    <strong>Pro Tip:</strong> Try to complete your fieldwork in a school setting if possible. This experience will be invaluable when applying for school-based positions.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-emerald-800 text-yellow-400 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">4</div>
                <div className="ml-8">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">Pass the BCBA Certification Exam</h3>
                  <p className="text-slate-600 mb-4">
                    The BCBA exam is a comprehensive test of your knowledge across all areas of behavior analysis. The exam consists of:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                    <li>185 multiple-choice questions</li>
                    <li>160 scored questions + 25 pilot questions</li>
                    <li>4-hour time limit</li>
                    <li>Computer-based testing at Pearson VUE centers</li>
                  </ul>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800">
                      <strong>Success Rates:</strong> The first-time pass rate varies by year and preparation quality. Check current BACB data for the most recent statistics. Thorough preparation is essential for success.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-emerald-800 text-yellow-400 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">5</div>
                <div className="ml-8">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">Meet State and District Requirements</h3>
                  <p className="text-slate-600 mb-4">
                    Beyond BCBA certification, school-based positions often require additional credentials that vary by state and district:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Common Additional Requirements:</h4>
                      <ul className="list-disc pl-4 text-slate-600 space-y-1">
                        <li>State professional license</li>
                        <li>Teaching certificate or credentials</li>
                        <li>Special education endorsement</li>
                        <li>Background checks and fingerprinting</li>
                        <li>Continuing education requirements</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Preferred Qualifications:</h4>
                      <ul className="list-disc pl-4 text-slate-600 space-y-1">
                        <li>Experience in educational settings</li>
                        <li>Knowledge of special education law</li>
                        <li>Training in specific interventions</li>
                        <li>Bilingual capabilities</li>
                        <li>Crisis intervention certification</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Salary and Career Outlook */}
          <div className="py-12 bg-white rounded-lg shadow-sm border">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Salary and Career Outlook for School-Based BCBAs
            </h2>
            
            {/* Salary Information */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6 text-center">Compensation Overview</h3>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">$60K-70K</div>
                  <div className="text-slate-600 font-semibold">Starting Range</div>
                  <div className="text-sm text-slate-500">New BCBAs, 0-2 years experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">$70K-85K</div>
                  <div className="text-slate-600 font-semibold">Mid-Career Range</div>
                  <div className="text-sm text-slate-500">3-7 years experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">$85K+</div>
                  <div className="text-slate-600 font-semibold">Senior Level</div>
                  <div className="text-sm text-slate-500">8+ years, leadership roles</div>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Salary Factors</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-slate-900 mb-2">Geographic Location:</h5>
                    <ul className="text-slate-600 space-y-1 text-sm">
                      <li>• High-cost states (CA, NY, etc.): $80K-$120K+</li>
                      <li>• Mid-range states: $65K-$90K</li>
                      <li>• Rural areas: Generally lower ranges</li>
                      <li>• Urban districts: Typically offer higher compensation</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-900 mb-2">Additional Factors:</h5>
                    <ul className="text-slate-600 space-y-1 text-sm">
                      <li>• Advanced degrees: Additional compensation</li>
                      <li>• Teaching certification: May increase salary</li>
                      <li>• Years of experience in education</li>
                      <li>• Summer work opportunities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Package */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6 text-center">Comprehensive Benefits</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-emerald-100 rounded-lg p-6 border border-emerald-800">
                  <h4 className="font-semibold text-emerald-900 mb-3">Health & Wellness</h4>
                  <ul className="text-emerald-800 space-y-1 text-sm">
                    <li>• Medical, dental, vision insurance</li>
                    <li>• Mental health support</li>
                    <li>• Employee assistance programs</li>
                    <li>• Wellness stipends</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-3">Time Off & Schedule</h4>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>• Summer breaks (8-10 weeks)</li>
                    <li>• Winter and spring breaks</li>
                    <li>• Sick leave and personal days</li>
                    <li>• Professional development time</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <h4 className="font-semibold text-purple-800 mb-3">Retirement & Growth</h4>
                  <ul className="text-purple-700 space-y-1 text-sm">
                    <li>• Teacher retirement system (TRS)</li>
                    <li>• 403(b) retirement plans</li>
                    <li>• Professional development funds</li>
                    <li>• Tuition reimbursement</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Job Market and Growth */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6 text-center">Market Demand and Growth</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Job Market Trends</h4>
                  <ul className="text-slate-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Strong projected growth in behavior analysis positions through 2032 (much faster than average occupations)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Increasing recognition of ABA in educational settings</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Growing autism prevalence driving demand (1 in 36 children)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>IDEA and special education mandates creating positions</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Career Advancement Paths</h4>
                  <ul className="text-slate-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Lead BCBA or Behavior Specialist Coordinator</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Special Education Director or Administrator</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <span>University faculty or researcher positions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Private practice or consulting opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Pros and Cons of Being a School-Based BCBA
            </h2>
            
            <div className="mb-8 text-center">
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Like any career path, working as a school-based BCBA comes with unique advantages and challenges. Understanding both sides will help you make an informed decision about whether this career aligns with your professional goals and personal values.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-6 flex items-center"><ThumbsUp className="h-6 w-6 text-green-600 mr-2" /> Advantages of School-Based Work</h3>
                <div className="space-y-4 text-slate-700">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Meaningful Impact on Education</h4>
                      <p className="text-sm">Help students succeed academically and socially, creating lasting changes that affect their entire educational journey.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Work-Life Balance</h4>
                      <p className="text-sm">School schedules typically offer evenings, weekends, holidays, and summer breaks off, providing excellent work-life balance.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Collaborative Environment</h4>
                      <p className="text-sm">Work alongside teachers, school psychologists, social workers, and other professionals as part of a supportive team.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Diverse Case Experience</h4>
                      <p className="text-sm">Work with students across age ranges and disability categories, from early childhood through high school transition planning.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Job Security and Benefits</h4>
                      <p className="text-sm">Public school employment often provides excellent benefits, retirement plans, and strong job security with union protections.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Professional Growth Opportunities</h4>
                      <p className="text-sm">Many districts provide continuing education support, conference attendance, and clear pathways to leadership roles.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-red-800 mb-6 flex items-center"><ThumbsDown className="h-6 w-6 text-red-600 mr-2" /> Challenges to Consider</h3>
                <div className="space-y-4 text-slate-700">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">High Caseloads</h4>
                      <p className="text-sm">Many school BCBAs serve 20-40+ students across multiple schools, making time management and prioritization crucial skills.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Bureaucratic Constraints</h4>
                      <p className="text-sm">Navigate IEP timelines, special education law, district policies, and administrative requirements that can slow intervention implementation.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Crisis Management Stress</h4>
                      <p className="text-sm">Handle behavioral emergencies, safety concerns, and high-stress situations that require immediate intervention and decision-making.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Varied Implementation Fidelity</h4>
                      <p className="text-sm">Interventions depend on teacher and staff implementation, which can be inconsistent due to training, time, or resource limitations.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Potential Salary Limitations</h4>
                      <p className="text-sm">School district budgets may limit salary growth compared to private practice or clinical settings, though benefits often compensate.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Multi-Site Travel</h4>
                      <p className="text-sm">Many positions require travel between multiple school buildings, limiting time for direct service and increasing logistical complexity.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-emerald-50 rounded-lg p-6 border border-emerald-800">
              <h3 className="text-lg font-semibold text-emerald-900 mb-4">Is School-Based BCBA Work Right for You?</h3>
              <p className="text-emerald-800 mb-4">
                This career path tends to be most fulfilling for professionals who thrive in collaborative environments, enjoy variety in their daily work, and are passionate about educational equity and student success. You&apos;ll need strong communication skills, patience with system-level change, and the ability to work independently while maintaining team relationships.
              </p>
              <p className="text-emerald-800">
                Consider shadowing a school-based BCBA or volunteering in special education classrooms to get firsthand experience before committing to this career path. Many successful school-based BCBAs report that despite the challenges, the opportunity to create positive change in students&apos; lives makes the work incredibly rewarding.
              </p>
            </div>
          </div>

          {/* How Behavior School Can Help */}
          <div className="py-12 text-center bg-emerald-800 rounded-lg text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 text-emerald-100">
              Behavior School provides the training, tools, and support you need to become a successful school-based BCBA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-emerald-900 font-bold shadow-lg">
                <Link href="/transformation-program">
                  <Award className="mr-2 h-5 w-5" />
                  Explore Our Training Programs
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-emerald-900 font-bold shadow-lg">
                <Link href="/behavior-study-tools">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Prepare for the BCBA Exam
                </Link>
              </Button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Do I need a teaching certificate to be a school-based BCBA?</h3>
                <p className="text-slate-600 mb-3">
                  Requirements vary significantly by state and school district. Some districts require a teaching certificate or educational credentials, while others accept BCBA certification alone. States like California and Texas often require additional educational endorsements, while others focus primarily on the BCBA credential and relevant experience.
                </p>
                <p className="text-slate-600">
                  Before applying, research your target districts&apos; specific requirements. Many positions prefer candidates with teaching experience or special education backgrounds, even when not formally required.
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Can I complete my supervised fieldwork in a school setting?</h3>
                <p className="text-slate-600 mb-3">
                  Absolutely! Completing your supervised fieldwork in schools is one of the best career investments you can make. School-based fieldwork gives you direct experience with IEP processes, classroom management, collaboration with educators, and the unique challenges of educational settings.
                </p>
                <p className="text-slate-600">
                  Look for supervised independent fieldwork opportunities in special education programs, autism support classrooms, or behavioral support roles in public schools. Our <Link href="/supervisors" className="text-emerald-600 hover:text-emerald-700 font-medium">supervision tools</Link> can help track your fieldwork progress. This experience makes you significantly more competitive for school-based positions after certification.
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">What&apos;s the difference between a school-based BCBA and a clinical BCBA?</h3>
                <p className="text-slate-600 mb-3">
                  School-based BCBAs work within educational systems, focusing on helping students access their education through behavioral support. They collaborate with teachers, participate in IEP meetings, and design interventions that work within classroom environments. Clinical BCBAs typically work in therapy centers or homes, providing intensive one-on-one ABA therapy.
                </p>
                <p className="text-slate-600">
                  School-based work requires strong consultation and collaboration skills, understanding of special education law, and ability to design practical interventions for group settings. Clinical work often involves more direct therapy provision and intensive behavior modification programs.
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">How many students does a typical school-based BCBA serve?</h3>
                <p className="text-slate-600 mb-3">
                  Caseloads vary widely depending on district size, funding, and service delivery model. Most school-based BCBAs serve 15-40 students across multiple grade levels and schools. Some focus on intensive support for fewer students (10-15), while others provide consultation for larger caseloads (40-60 students).
                </p>
                <p className="text-slate-600">
                  Large districts may assign BCBAs to specific schools or regions, while smaller districts might have BCBAs traveling between multiple buildings. Ask about caseload expectations during interviews to ensure the role aligns with your service delivery preferences.
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">What continuing education is required for school-based BCBAs?</h3>
                <p className="text-slate-600 mb-3">
                  BCBAs must complete 32 Continuing Education Units (CEUs) every two years to maintain certification. School-based BCBAs benefit from training in areas like crisis intervention, trauma-informed practices, cultural responsiveness, and specific interventions for educational settings.
                </p>
                <p className="text-slate-600">
                  Many school districts provide professional development funding and time for conference attendance. Popular conferences include ABAI, CALABA, state behavior analysis associations, and special education conferences that offer BCBA-relevant training.
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Can I work as a school-based BCBA part-time?</h3>
                <p className="text-slate-600 mb-3">
                  Part-time opportunities exist but are less common than full-time positions. Some districts offer part-time contracts or shared positions between schools. Private companies that contract with schools may offer more flexible arrangements.
                </p>
                <p className="text-slate-600">
                  Part-time work might involve consulting on specific cases, conducting assessments, or providing training rather than ongoing direct service. Consider freelance consultation or contracting with multiple districts if seeking part-time work.
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">What&apos;s the job outlook for school-based BCBAs?</h3>
                <p className="text-slate-600 mb-3">
                  The job outlook is excellent. The Bureau of Labor Statistics projects strong growth in behavior analysis positions through 2032, with particular demand in educational settings. Increasing awareness of behavioral support needs, growing recognition of ABA effectiveness, and special education requirements continue driving demand for school-based behavior analysts.
                </p>
                <p className="text-slate-600">
                  Rural and underserved areas often have the highest demand and may offer loan forgiveness programs or other incentives. Urban districts are increasingly creating BCBA positions as they recognize the value of behavior analysis in supporting diverse student populations.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
