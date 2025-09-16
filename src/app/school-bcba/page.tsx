import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Users, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Shield, 
  Clock,
  FileText,
  Brain,
  Lightbulb,
  Download,
  ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'BCBAs in Schools: Complete Guide for School-Based Behavior Analysts (2025)',
  description: 'Complete guide for BCBAs in schools. Learn how school-based BCBAs conduct FBAs, write BIPs, implement MTSS/PBIS, train staff, and prevent burnout in K-12 education.',
  keywords: 'BCBAs in schools, school BCBA, school-based BCBA, BCBA in schools role, school behavior analyst, FBA in schools, BIP school settings, MTSS BCBA, PBIS behavior analyst, school BCBA training',
  alternates: {
    canonical: 'https://behaviorschool.com/school-bcba'
  },
  openGraph: {
    title: 'School-Based BCBA: Complete Guide for Success in Schools',
    description: 'From crisis manager to systems leader - practical tools and strategies for school-based BCBAs working in K-12 education.',
    type: 'article',
    url: 'https://behaviorschool.com/school-bcba',
    siteName: 'Behavior School',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School-Based BCBA: Complete Guide for Success in Schools',
    description: 'Practical tools and strategies for school-based BCBAs working in K-12 education.',
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "School-Based BCBA: Complete Guide for Success in Schools",
      "description": "Complete guide to succeeding as a school-based BCBA. Learn roles, responsibilities, MTSS/PBIS alignment, FBAs, BIPs, staff training, and ethical systems for K-12 schools.",
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
      "mainEntityOfPage": "https://behaviorschool.com/school-bcba"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What does a school-based BCBA do?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A school-based BCBA conducts functional behavior assessments (FBAs), develops behavior intervention plans (BIPs), collaborates on IEP teams, trains school staff, and implements school-wide behavior support systems aligned with MTSS/PBIS frameworks."
          }
        },
        {
          "@type": "Question",
          "name": "How is a school-based BCBA different from a clinic-based BCBA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "School-based BCBAs focus on educational settings and systems-level interventions, while clinic BCBAs typically provide intensive 1:1 therapy. School BCBAs must navigate IEP compliance, work within classroom constraints, and train multiple staff members."
          }
        },
        {
          "@type": "Question",
          "name": "What are the biggest challenges for school-based BCBAs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Common challenges include high caseloads (often 20+ students), limited direct intervention time, undertrained paraprofessionals, crisis-driven reactive approaches, and balancing individual student needs with school-wide systems."
          }
        },
        {
          "@type": "Question",
          "name": "How do school-based BCBAs work with MTSS and PBIS?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "School-based BCBAs align their interventions across all three tiers: Tier 1 (school-wide prevention), Tier 2 (targeted group interventions), and Tier 3 (intensive individual supports). They help embed ABA principles into existing PBIS frameworks."
          }
        },
        {
          "@type": "Question",
          "name": "What training is needed to become a school-based BCBA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Requirements include BCBA certification, understanding of special education law (IDEA), IEP processes, classroom management, staff training techniques, and systems-level thinking for school-wide implementation."
          }
        },
        {
          "@type": "Question",
          "name": "How can school-based BCBAs prevent burnout?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Effective strategies include developing efficient systems, using technology tools for documentation, building strong relationships with administrators, focusing on staff training for sustainability, and maintaining clear professional boundaries."
          }
        }
      ]
    }
  ]
}

export default function SchoolBCBAPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
                Complete 2025 Guide
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                BCBAs in Schools: Complete Guide for School-Based Success
              </h1>
              <p className="mt-6 text-xl leading-8 text-blue-100 max-w-3xl mx-auto">
                Transform from crisis manager to systems leader. Master practical, ethical systems built for real classrooms with evidence-based tools that actually work.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/transformation-program">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-4">
                    Start Your Transformation Program
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Wins Section */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-slate-900">
                Quick Wins for School-Based BCBAs
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Immediate tools and resources to streamline your daily work
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <FileText className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">AI-Powered IEP Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">Generate SMART, measurable IEP goals in seconds</p>
                  <Link href="/iep-goal-writer">
                    <Button variant="outline" size="sm" className="w-full">
                      Try Goal Writer
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-green-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <Target className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle className="text-lg">Behavior Plan Writer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">Create teacher-ready BIPs with built-in fidelity checks</p>
                  <Link href="/behavior-plan-writer">
                    <Button variant="outline" size="sm" className="w-full">
                      Create BIP
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <Users className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle className="text-lg">8-Week Transformation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">Systematic program for systems leadership</p>
                  <Link href="/transformation-program">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-orange-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <BookOpen className="h-8 w-8 text-orange-600 mb-2" />
                  <CardTitle className="text-lg">Study Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">Support future BCBAs with precision tracking</p>
                  <Link href="/bcba-study-fluency">
                    <Button variant="outline" size="sm" className="w-full">
                      Explore Tools
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What Is Section */}
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                What Is a School-Based BCBA?
              </h2>
              <div className="prose prose-lg max-w-none text-slate-700">
                <p className="text-xl leading-8 mb-6">
                  A school-based BCBA is a Board Certified Behavior Analyst who applies ABA principles in K-12 educational settings. Unlike clinic-based practitioners, school BCBAs target behaviors that directly affect learning, classroom engagement, and IEP compliance.
                </p>
                <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">They serve a dual role:</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-3 flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Student-Focused
                      </h4>
                      <ul className="space-y-2 text-slate-600">
                        <li>• Conducting comprehensive FBAs</li>
                        <li>• Writing implementable BIPs</li>
                        <li>• Supporting IEP teams with data</li>
                        <li>• Direct intervention when needed</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Systems-Focused
                      </h4>
                      <ul className="space-y-2 text-slate-600">
                        <li>• Training paraprofessionals and teachers</li>
                        <li>• Embedding interventions school-wide</li>
                        <li>• Aligning with MTSS/PBIS frameworks</li>
                        <li>• Building sustainable systems</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Responsibilities */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">
                Core Responsibilities of School-Based BCBAs
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Six essential functions that define success in school settings
              </p>
            </div>

            <div className="space-y-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-4 bg-blue-100 text-blue-800">Assessment</Badge>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    1. Conduct Functional Behavior Assessments (FBAs)
                  </h3>
                  <p className="text-lg text-slate-700 mb-6">
                    Identify the root causes of challenging behaviors through systematic observation, interviews, and data collection. School FBAs must consider classroom constraints, peer dynamics, and instructional contexts.
                  </p>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Indirect assessments with teachers and parents
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Direct classroom observations across settings
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Functional analysis when appropriate and safe
                    </li>
                  </ul>
                </div>
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <CardContent className="p-0">
                    <h4 className="font-semibold text-blue-900 mb-3">FBA School Checklist</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Teacher interview (FACTS form)</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Multiple setting observations</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Review of academic data</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Hypothesis development</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Summary for IEP team</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Full Checklist
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <Card className="p-6 bg-green-50 border-green-200 lg:order-1">
                  <CardContent className="p-0">
                    <h4 className="font-semibold text-green-900 mb-3">BIP Implementation Success</h4>
                    <div className="space-y-3 text-sm text-green-800">
                      <div className="bg-white rounded p-3">
                        <strong>Prevention:</strong> Clear antecedent strategies
                      </div>
                      <div className="bg-white rounded p-3">
                        <strong>Teaching:</strong> Replacement skill instruction
                      </div>
                      <div className="bg-white rounded p-3">
                        <strong>Response:</strong> Consistent consequence procedures
                      </div>
                      <div className="bg-white rounded p-3">
                        <strong>Data:</strong> Simple progress monitoring
                      </div>
                    </div>
                    <Link href="/behavior-plan-writer">
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        Try BIP Writer Tool
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                <div className="lg:order-0">
                  <Badge className="mb-4 bg-green-100 text-green-800">Intervention</Badge>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    2. Develop Behavior Intervention Plans (BIPs)
                  </h3>
                  <p className="text-lg text-slate-700 mb-6">
                    Create practical, teacher-friendly plans that address function while fitting classroom realities. Effective school BIPs include clear prevention strategies, replacement skill teaching, and simple data collection.
                  </p>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Function-based intervention strategies
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Teacher-implementable procedures
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Built-in fidelity and progress monitoring
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-4 bg-purple-100 text-purple-800">Collaboration</Badge>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    3. Collaborate on IEP Teams
                  </h3>
                  <p className="text-lg text-slate-700 mb-6">
                    Contribute behavioral expertise to IEP development, ensuring goals are measurable, achievable, and aligned with educational outcomes. Translate complex behavioral concepts for multidisciplinary teams.
                  </p>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      SMART behavioral goals and objectives
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Present levels of performance
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Transition planning and post-secondary goals
                    </li>
                  </ul>
                </div>
                <Card className="p-6 bg-purple-50 border-purple-200">
                  <CardContent className="p-0">
                    <h4 className="font-semibold text-purple-900 mb-3">IEP Goal Examples</h4>
                    <div className="space-y-3 text-sm text-purple-800">
                      <div className="bg-white rounded p-3">
                        <strong>Replacement Behavior:</strong><br />
                        &quot;When frustrated, [Student] will request a break using appropriate words in 8/10 opportunities.&quot;
                      </div>
                      <div className="bg-white rounded p-3">
                        <strong>Social Skills:</strong><br />
                        &quot;[Student] will initiate appropriate peer interactions during structured activities in 3/4 trials.&quot;
                      </div>
                    </div>
                    <Link href="/iep-goal-writer">
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        Generate IEP Goals
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <Card className="p-6 bg-orange-50 border-orange-200 lg:order-1">
                  <CardContent className="p-0">
                    <h4 className="font-semibold text-orange-900 mb-3">MTSS/PBIS Alignment</h4>
                    <div className="space-y-3 text-sm text-orange-800">
                      <div className="flex items-center justify-between bg-white rounded p-3">
                        <strong>Tier 1:</strong> School-wide prevention
                      </div>
                      <div className="flex items-center justify-between bg-white rounded p-3">
                        <strong>Tier 2:</strong> Targeted group supports
                      </div>
                      <div className="flex items-center justify-between bg-white rounded p-3">
                        <strong>Tier 3:</strong> Intensive individual plans
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded">
                      <p className="text-xs text-orange-700">
                        <strong>Pro Tip:</strong> Embed ABA strategies across all tiers for maximum consistency and impact.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <div className="lg:order-0">
                  <Badge className="mb-4 bg-orange-100 text-orange-800">Systems</Badge>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    4. Align With Tiered Systems (MTSS/PBIS)
                  </h3>
                  <p className="text-lg text-slate-700 mb-6">
                    Integrate ABA strategies across Tier 1 (universal), Tier 2 (targeted), and Tier 3 (intensive) supports. Help schools build coherent, evidence-based behavioral frameworks that serve all students.
                  </p>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Universal screening and progress monitoring
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Data-based decision making protocols
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Fidelity monitoring across all tiers
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-4 bg-red-100 text-red-800">Training</Badge>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    5. Train & Coach School Staff
                  </h3>
                  <p className="text-lg text-slate-700 mb-6">
                    Provide ongoing professional development that builds teacher and paraprofessional competence. Focus on practical strategies that improve classroom management and student outcomes.
                  </p>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Paraprofessional skill-building workshops
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Teacher coaching in natural settings
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Performance feedback and support
                    </li>
                  </ul>
                </div>
                <Card className="p-6 bg-red-50 border-red-200">
                  <CardContent className="p-0">
                    <h4 className="font-semibold text-red-900 mb-3">Training Topics</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-red-800">
                      <div className="bg-white rounded p-2">Reinforcement basics</div>
                      <div className="bg-white rounded p-2">Prompting strategies</div>
                      <div className="bg-white rounded p-2">Data collection</div>
                      <div className="bg-white rounded p-2">Crisis prevention</div>
                      <div className="bg-white rounded p-2">Task analysis</div>
                      <div className="bg-white rounded p-2">Fidelity checks</div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Training Templates
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <Card className="p-6 bg-teal-50 border-teal-200 lg:order-1">
                  <CardContent className="p-0">
                    <h4 className="font-semibold text-teal-900 mb-3">Ethical Considerations</h4>
                    <div className="space-y-3 text-sm text-teal-800">
                      <div className="bg-white rounded p-3">
                        <strong>Competence:</strong> Work within your scope
                      </div>
                      <div className="bg-white rounded p-3">
                        <strong>Consent:</strong> Clear parent/student agreements
                      </div>
                      <div className="bg-white rounded p-3">
                        <strong>Confidentiality:</strong> FERPA and privacy rights
                      </div>
                      <div className="bg-white rounded p-3">
                        <strong>Collaboration:</strong> Respect for other professionals
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded">
                      <p className="text-xs text-teal-700">
                        Remember: School settings require navigating multiple ethical codes (BACB, state education, district policies).
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <div className="lg:order-0">
                  <Badge className="mb-4 bg-teal-100 text-teal-800">Ethics</Badge>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    6. Navigate Ethics in School Constraints
                  </h3>
                  <p className="text-lg text-slate-700 mb-6">
                    Balance BACB ethical guidelines with school realities, legal requirements, and team dynamics. Advocate for evidence-based practices while working within institutional limitations.
                  </p>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Informed consent in educational settings
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Competence boundaries and referrals
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      Professional relationships and advocacy
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Schools Need BCBAs */}
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                Why Schools Need BCBAs
              </h2>
              <p className="text-lg text-slate-600 mb-12">
                School-based BCBAs address critical needs in modern education
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center border-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">Legal Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Help districts meet federal and state mandates for students with disabilities, including IDEA requirements for behavioral supports.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-green-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">Better Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Function-based interventions reduce classroom disruption by an average of 75% and increase student engagement significantly.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">Staff Confidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Teachers report 80% greater confidence in managing challenging behaviors when supported by trained BCBAs.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-orange-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">Sustainable Systems</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Well-designed systems reduce BCBA burnout, improve staff retention, and ensure intervention fidelity long-term.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Transformation Program CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your School-Based Practice?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join our 8-week Transformation Program and shift from overwhelmed crisis manager to confident systems leader.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
                <div className="bg-white/10 rounded-lg p-6">
                  <Brain className="h-8 w-8 text-blue-200 mb-3" />
                  <h3 className="font-semibold mb-2">Leadership Tools</h3>
                  <p className="text-sm text-blue-100">Strategies for working effectively with administrators and building buy-in</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <TrendingUp className="h-8 w-8 text-blue-200 mb-3" />
                  <h3 className="font-semibold mb-2">Systems Scaling</h3>
                  <p className="text-sm text-blue-100">Implement PBIS/MTSS frameworks that actually work in real schools</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <Lightbulb className="h-8 w-8 text-blue-200 mb-3" />
                  <h3 className="font-semibold mb-2">ACT-Based Resilience</h3>
                  <p className="text-sm text-blue-100">Build stress tolerance and prevent burnout using acceptance strategies</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/transformation-program">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-4">
                    Learn About the Program
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/iep-goal-writer">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
                    Try Free Tools First
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    What does a school-based BCBA do?
                  </h3>
                  <p className="text-slate-700">
                    A school-based BCBA conducts functional behavior assessments (FBAs), develops behavior intervention plans (BIPs), collaborates on IEP teams, trains school staff, and implements school-wide behavior support systems aligned with MTSS/PBIS frameworks. They work across individual, small group, and systems levels.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    How is a school-based BCBA different from a clinic-based BCBA?
                  </h3>
                  <p className="text-slate-700">
                    School-based BCBAs focus on educational settings and systems-level interventions, while clinic BCBAs typically provide intensive 1:1 therapy. School BCBAs must navigate IEP compliance, work within classroom constraints, collaborate with multidisciplinary teams, and train multiple staff members to implement interventions.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    What are the biggest challenges for school-based BCBAs?
                  </h3>
                  <p className="text-slate-700">
                    Common challenges include high caseloads (often 20+ students), limited direct intervention time, working with undertrained paraprofessionals, crisis-driven reactive approaches, and balancing individual student needs with school-wide systems. Many also struggle with administrative support and resource constraints.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    How do school-based BCBAs work with MTSS and PBIS?
                  </h3>
                  <p className="text-slate-700">
                    School-based BCBAs align their interventions across all three tiers: Tier 1 (universal school-wide prevention), Tier 2 (targeted group interventions for at-risk students), and Tier 3 (intensive individual supports). They help embed ABA principles into existing PBIS frameworks and ensure data-driven decision making at all levels.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    What training is needed to become a school-based BCBA?
                  </h3>
                  <p className="text-slate-700">
                    Requirements include BCBA certification, understanding of special education law (IDEA), familiarity with IEP processes, knowledge of classroom management strategies, staff training and coaching techniques, and systems-level thinking for school-wide implementation. Many also benefit from additional training in educational frameworks like PBIS and MTSS.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    How can school-based BCBAs prevent burnout?
                  </h3>
                  <p className="text-slate-700">
                    Effective burnout prevention strategies include developing efficient documentation systems, using technology tools for data collection, building strong relationships with administrators, focusing on staff training for long-term sustainability, maintaining clear professional boundaries, and developing stress tolerance skills through approaches like ACT (Acceptance and Commitment Therapy).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Start Building Better School Systems Today
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Join thousands of school-based BCBAs using our tools and training to create lasting change in education.
              </p>
              
              <div className="space-y-4">
                <Link href="/transformation-program">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 w-full sm:w-auto">
                    Join the 8-Week Transformation Program
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <div className="text-sm text-slate-500">
                  or start with our{" "}
                  <Link href="/iep-goal-writer" className="text-blue-600 hover:underline">
                    free IEP Goal Generator
                  </Link>
                  {" "}and{" "}
                  <Link href="/behavior-plan-writer" className="text-blue-600 hover:underline">
                    Behavior Plan Writer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}