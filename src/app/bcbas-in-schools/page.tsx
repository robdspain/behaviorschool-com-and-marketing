import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Users,
  Target,
  TrendingUp,
  Shield,
  FileText,
  Brain,
  Lightbulb,
  ArrowRight,
  AlertTriangle,
  Award
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'BCBAs in Schools: Roles, Challenges & Solutions for School-Based Behavior Analysts',
  description: 'Complete guide to BCBAs in schools. Discover roles, responsibilities, common challenges, and proven solutions for school-based behavior analysts working in K-12 education.',
  keywords: 'BCBAs in schools, school BCBA, BCBAs in schools roles, school behavior analyst, BCBAs in education, school-based BCBA challenges, BCBAs in schools training, school BCBA job description',
  alternates: {
    canonical: 'https://behaviorschool.com/bcbas-in-schools'
  },
  openGraph: {
    title: 'BCBAs in Schools: Complete Guide for School-Based Success',
    description: 'Everything you need to know about BCBAs in schools - from roles and challenges to evidence-based solutions.',
    type: 'article',
    url: 'https://behaviorschool.com/bcbas-in-schools',
    siteName: 'Behavior School',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BCBAs in Schools: Complete Guide for School-Based Success',
    description: 'Everything you need to know about BCBAs in schools - from roles and challenges to evidence-based solutions.',
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "BCBAs in Schools: Complete Guide for School-Based Success",
      "description": "Complete guide to BCBAs in schools. Discover roles, responsibilities, common challenges, and proven solutions for school-based behavior analysts working in K-12 education.",
      "author": {
        "@type": "Person",
        "name": "Rob Spain",
        "url": "https://behaviorschool.com/about",
        "sameAs": [
          "https://www.linkedin.com/in/robspain/",
          "https://twitter.com/robspain"
        ]
      },
      "publisher": {
        "@type": "Organization",
        "name": "Behavior School",
        "url": "https://behaviorschool.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://behaviorschool.com/logo.png"
        }
      },
      "datePublished": "2025-01-15",
      "dateModified": "2025-01-15",
      "mainEntityOfPage": "https://behaviorschool.com/bcbas-in-schools"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What do BCBAs in schools do?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "BCBAs in schools conduct functional behavior assessments, develop behavior intervention plans, collaborate on IEP teams, train school staff, implement PBIS/MTSS systems, and provide consultation for students with challenging behaviors."
          }
        },
        {
          "@type": "Question",
          "name": "How many BCBAs work in schools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "According to BAESIG data, thousands of BCBAs now work in school settings across the US, with typical caseloads ranging from 10-50 students. About 50% of school BCBAs also support students in general education."
          }
        },
        {
          "@type": "Question",
          "name": "What challenges do BCBAs face in schools?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The biggest challenges for BCBAs in schools include lack of time, high caseloads, limited resources, undertrained staff, crisis-driven approaches, and balancing individual vs. systems-level work."
          }
        }
      ]
    }
  ]
}

export default function BCBAsInSchoolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-bs-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
                2025 Complete Guide
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                BCBAs in Schools: Transforming K-12 Education
              </h1>
              <p className="mt-6 text-xl leading-8 text-green-100 max-w-3xl mx-auto">
                Discover how BCBAs in schools are revolutionizing student support through evidence-based behavior analysis, systems implementation, and collaborative partnerships.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/transformation-program">
                  <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 text-lg px-8 py-4">
                    Join School BCBA Program
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                The Rise of BCBAs in Schools
              </h2>
              <div className="prose prose-lg max-w-none text-slate-700">
                <p className="text-xl leading-8 mb-6">
                  BCBAs in schools represent one of the fastest-growing areas in applied behavior analysis. As schools recognize the need for evidence-based behavior support, more districts are hiring BCBAs to implement comprehensive behavior systems.
                </p>
                
                <div className="bg-green-50 rounded-lg p-8 shadow-sm border border-green-200 mb-8">
                  <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2" />
                    Current State of BCBAs in Schools
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-3">By the Numbers:</h4>
                      <ul className="space-y-2 text-green-700">
                        <li>• Average caseload: 15 students (range 0-50)</li>
                        <li>• 50% support general education students</li>
                        <li>• Primary challenge: Lack of time</li>
                        <li>• Growing presence in all 50 states</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-3">Common Roles:</h4>
                      <ul className="space-y-2 text-green-700">
                        <li>• Special education consultants</li>
                        <li>• PBIS/MTSS coordinators</li>
                        <li>• Behavior support specialists</li>
                        <li>• Systems implementation leaders</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mt-4 italic">
                    *Data from BAESIG (Behavior Analysts in Education Special Interest Group) 2023 survey
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Functions */}
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">
                What BCBAs in Schools Actually Do
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Five core functions that define the school-based BCBA role
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Individual Level */}
              <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <Target className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-xl">Individual Student Support</CardTitle>
                  <CardDescription>Direct services for high-need students</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Conduct comprehensive FBAs</li>
                    <li>• Develop function-based BIPs</li>
                    <li>• Write measurable IEP goals</li>
                    <li>• Provide crisis intervention</li>
                    <li>• Monitor progress and fidelity</li>
                  </ul>
                  <Link href="/behavior-plans" className="mt-4 block">
                    <Button variant="outline" size="sm" className="w-full">
                      Try BIP Writer Tool
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Group Level */}
              <Card className="border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <Users className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle className="text-xl">Group Interventions</CardTitle>
                  <CardDescription>Targeted support for at-risk students</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Design Tier 2 interventions</li>
                    <li>• Facilitate social skills groups</li>
                    <li>• Implement Check-In/Check-Out</li>
                    <li>• Coordinate mentoring programs</li>
                    <li>• Analyze group data trends</li>
                  </ul>
                  <Link href="/supervisors" className="mt-4 block">
                    <Button variant="outline" size="sm" className="w-full">
                      View Supervision Tools
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Systems Level */}
              <Card className="border-purple-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <Shield className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle className="text-xl">Systems Leadership</CardTitle>
                  <CardDescription>School-wide behavior frameworks</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Implement PBIS/MTSS systems</li>
                    <li>• Train and coach staff</li>
                    <li>• Analyze discipline data</li>
                    <li>• Develop policy recommendations</li>
                    <li>• Lead behavior committees</li>
                  </ul>
                  <Link href="/transformation-program" className="mt-4 block">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn Systems Leadership
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Challenges Section */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">
                Common Challenges BCBAs Face in Schools
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Understanding the barriers helps us build better solutions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-red-200">
                <CardHeader className="bg-red-50">
                  <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
                  <CardTitle className="text-xl text-red-900">Top Challenges</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Lack of Time</h4>
                        <p className="text-sm text-slate-600">High caseloads and competing priorities limit intervention time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Undertrained Staff</h4>
                        <p className="text-sm text-slate-600">Paraprofessionals and teachers need ongoing coaching</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Crisis-Driven Culture</h4>
                        <p className="text-sm text-slate-600">Reactive approaches prevent proactive systems building</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Limited Resources</h4>
                        <p className="text-sm text-slate-600">Budget constraints affect tool availability and training</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50">
                  <Lightbulb className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-xl text-blue-900">Evidence-Based Solutions</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-slate-900">Efficient Systems</h4>
                        <p className="text-sm text-slate-600">Streamlined assessment and documentation processes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-slate-900">Staff Training Programs</h4>
                        <p className="text-sm text-slate-600">Systematic professional development with performance feedback</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-slate-900">Preventive Frameworks</h4>
                        <p className="text-sm text-slate-600">PBIS/MTSS implementation with data-driven decision making</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-slate-900">Technology Integration</h4>
                        <p className="text-sm text-slate-600">AI-powered tools for assessment, planning, and progress monitoring</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 bg-green-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">
                Success Stories: BCBAs Making a Difference
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Real examples of how BCBAs in schools create lasting change
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="bg-white border-green-200">
                <CardHeader>
                  <Award className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle className="text-lg">Special Education Consultant</CardTitle>
                  <CardDescription>Tier 3 Individual Support</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    &quot;Megan works as a BCBA in special education, providing consultation and assessment at the Tier 3 level. She trains special education teachers and instructional assistants working with students supported by IEPs.&quot;
                  </p>
                  <div className="bg-green-100 p-3 rounded">
                    <p className="text-xs text-green-800">
                      <strong>Result:</strong> 75% reduction in classroom disruptions, improved staff confidence
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-blue-200">
                <CardHeader>
                  <Users className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">PBIS Coordinator</CardTitle>
                  <CardDescription>Systems Implementation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    &quot;Rob leads district-wide PBIS implementation, training administrators and teachers in evidence-based behavior support while maintaining individual consultation services.&quot;
                  </p>
                  <div className="bg-blue-100 p-3 rounded">
                    <p className="text-xs text-blue-800">
                      <strong>Result:</strong> 40% decrease in office referrals district-wide
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-purple-200">
                <CardHeader>
                  <Target className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle className="text-lg">Behavior Specialist</CardTitle>
                  <CardDescription>Multi-Tier Support</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    &quot;Holly provides services across all three tiers - from school-wide systems to intensive individual interventions, with a focus on training and sustainability.&quot;
                  </p>
                  <div className="bg-purple-100 p-3 rounded">
                    <p className="text-xs text-purple-800">
                      <strong>Result:</strong> Sustainable systems with reduced BCBA burnout
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Training Section */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                Ready to Excel as a BCBA in Schools?
              </h2>
              <p className="text-xl text-slate-600 mb-12">
                Join our comprehensive training program designed specifically for BCBAs in schools
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="text-left border-blue-200">
                  <CardHeader>
                    <Brain className="h-8 w-8 text-blue-600 mb-2" />
                    <CardTitle>8-Week School BCBA Transformation System</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-slate-600 mb-4">
                      <li>• Leadership skills for working with administrators</li>
                      <li>• Systems implementation strategies</li>
                      <li>• Staff training and coaching methods</li>
                      <li>• Burnout prevention and resilience</li>
                    </ul>
                    <Link href="/transformation-program">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Join the Program
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="text-left border-green-200">
                  <CardHeader>
                    <FileText className="h-8 w-8 text-green-600 mb-2" />
                    <CardTitle>Free Practice Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-slate-600 mb-4">
                      <li>• AI-powered IEP Goal Generator</li>
                      <li>• Behavior Plan Writer</li>
                      <li>• FBA templates and checklists</li>
                      <li>• Staff training materials</li>
                    </ul>
                    <div className="space-y-2">
                      <Link href="/iep-goals">
                        <Button variant="outline" size="sm" className="w-full">
                          Try IEP Goal Generator
                        </Button>
                      </Link>
                      <Link href="/behavior-plans">
                        <Button variant="outline" size="sm" className="w-full">
                          Try BIP Writer
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Join the School BCBA Community</h3>
                <p className="text-green-100 mb-6">
                  Connect with thousands of BCBAs in schools sharing strategies, resources, and support
                </p>
                <Link href="/community">
                  <Button size="lg" className="bg-white text-green-700 hover:bg-green-50">
                    Join Free Community
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                Frequently Asked Questions About BCBAs in Schools
              </h2>
              
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    What do BCBAs in schools do?
                  </h3>
                  <p className="text-slate-700">
                    BCBAs in schools conduct functional behavior assessments, develop behavior intervention plans, collaborate on IEP teams, train school staff, implement PBIS/MTSS systems, and provide consultation for students with challenging behaviors. They work across individual, group, and systems levels.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    How many BCBAs work in schools?
                  </h3>
                  <p className="text-slate-700">
                    According to BAESIG data, thousands of BCBAs now work in school settings across the US, with typical caseloads ranging from 10-50 students. About 50% of school BCBAs also support students in general education, not just special education.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    What challenges do BCBAs face in schools?
                  </h3>
                  <p className="text-slate-700">
                    The biggest challenges for BCBAs in schools include lack of time, high caseloads, limited resources, undertrained staff, crisis-driven approaches, and balancing individual student needs with systems-level work. Many also struggle with administrative support and unclear role definitions.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    How are BCBAs in schools different from clinic BCBAs?
                  </h3>
                  <p className="text-slate-700">
                    BCBAs in schools focus on educational goals, collaborate with multidisciplinary teams, work within classroom constraints, and implement systems-level interventions. Clinic BCBAs typically provide more intensive 1:1 services and have different regulatory requirements and funding structures.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    What training do BCBAs need for school settings?
                  </h3>
                  <p className="text-slate-700">
                    Beyond basic BCBA certification, school-based BCBAs benefit from training in special education law, IEP processes, PBIS/MTSS frameworks, classroom management, staff training techniques, and systems-level implementation. Many also pursue additional credentials in education.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    How can BCBAs in schools prevent burnout?
                  </h3>
                  <p className="text-slate-700">
                    Effective strategies include developing efficient systems, building strong relationships with administrators, focusing on staff training for sustainability, using technology tools for documentation, maintaining clear boundaries, and developing stress tolerance through approaches like ACT.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Impact as a BCBA in Schools?
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                Join thousands of BCBAs in schools using our evidence-based tools and training to create lasting change in education.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/transformation-program">
                  <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 text-lg px-8 py-4">
                    Start Your Transformation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
                    Join Our Community
                  </Button>
                </Link>
                <Link href="/school-bcba">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
                    Explore School BCBA Hub
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
