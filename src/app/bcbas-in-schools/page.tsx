import type { Metadata } from 'next'
import Link from 'next/link'
import EmailGateDownload from '@/components/EmailGateDownload'
import {
  CheckCircle2,
  Users,
  Target,
  TrendingUp,
  Shield,
  FileText,
  Brain,
  Lightbulb,
  ArrowRight,
  AlertTriangle,
  Award,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Heart,
  BarChart3
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'BCBAs in Schools: Roles, PBIS/MTSS, FBA→BIP | 2025',
  description: 'BCBAs in K–12 schools: evidence-based roles, PBIS/MTSS alignment, FBA→BIP, staff coaching, fidelity, and data systems—backed by verified sources.',
  keywords: 'BCBAs in schools, school BCBA, PBIS MTSS, FBA BIP, IEP goals, coaching, fidelity, behavior data systems',
  alternates: {
    canonical: 'https://behaviorschool.com/bcbas-in-schools'
  },
  openGraph: {
    title: 'BCBAs in Schools: Roles, PBIS/MTSS, FBA→BIP',
    description: 'School BCBA roles, systems, and strategies—verified sources and practical solutions.',
    type: 'article',
    url: 'https://behaviorschool.com/bcbas-in-schools',
    siteName: 'Behavior School',
    locale: 'en_US',
    images: [
      {
        url: '/optimized/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Behavior School',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BCBAs in Schools: Roles, PBIS/MTSS, FBA→BIP',
    description: 'School BCBA roles, systems, and strategies—verified sources and practical solutions.',
}
}

export default function BCBAsInSchoolsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <section className="container mx-auto px-6 pt-24 pb-4">
        <nav className="flex items-center text-sm text-slate-600" aria-label="Breadcrumb">
          <Link className="hover:text-emerald-600 transition-colors" href="/blog">
            Blog
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-slate-900 font-medium">BCBAs in Schools</span>
        </nav>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full mb-6">
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-semibold text-emerald-700">2025 Complete Guide</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            BCBAs in Schools: Transforming K-12 Education
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mb-8">
            Discover how BCBAs embed behavior science into K–12: PBIS/MTSS alignment, FBA→BIP, measurable IEP goals, staff coaching, fidelity, and data systems—grounded in verified guidance and peer‑reviewed research.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/transformation-program">
              <button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center gap-2 shadow-lg">
                Join School BCBA Program
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

          {/* Main Content Grid */}
          <section className="container mx-auto px-6 pb-16">
            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

              {/* Main Content Area */}
          <article className="lg:col-span-2 space-y-8">

            {/* Quick Checklist */}
            <div id="checklist" className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl shadow-lg border border-emerald-200 p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-emerald-900">Quick Checklist: PBIS‑aligned Tier 3 FBA→BIP</h2>
                  <p className="text-sm text-emerald-800">Feasible, function‑matched plans implemented with fidelity</p>
                </div>
              </div>

              <ol className="grid md:grid-cols-2 gap-3 text-sm text-slate-800">
                {[
                  'Assemble a team; obtain consent; define routines of concern',
                  'Plan FBA; select tools (ABC data, interviews, scatterplots)',
                  'Collect baseline data across settings and times',
                  'Analyze patterns; generate testable function hypotheses',
                  'Draft BIP: prevention, teaching replacement skills, consequences, safety',
                  'Train implementers; schedule fidelity checks (10–20% of opportunities)',
                  'Monitor behavior + integrity weekly; adjust using decision rules',
                  'Align measurable IEP goals; document progress and decisions',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <EmailGateDownload
                  title="PBIS‑aligned Tier 3 FBA→BIP Checklist (PDF)"
                  buttonText="Download Checklist (PDF)"
                  downloadUrl="/api/download/fba-bip-checklist"
                  fileName="fba-bip-checklist.pdf"
                  resourceName="fba-bip-checklist"
                  variant="primary"
                />
              </div>

              <p className="mt-4 text-xs text-emerald-700">
                Evidence: {" "}
                <Link href="https://www.pbis.org/current/function-based-support-throughout-the-continuum" target="_blank" rel="noopener noreferrer" className="underline">Function‑based support</Link>{" • "}
                <Link href="https://sites.ed.gov/idea/files/Functional-Behavioral-Assessments-11-19-2024.pdf" target="_blank" rel="noopener noreferrer" className="underline">U.S. ED FBA Guidance (2024)</Link>{" • "}
                <Link href="https://ies.ed.gov/ncee/wwc/docs/practiceguide/behavioral-interventions-practice-guide_v3a_508a.pdf" target="_blank" rel="noopener noreferrer" className="underline">WWC Practice Guide (2024)</Link>
              </p>
            </div>

            {/* Overview & Rise of BCBAs */}
            <div id="rise" className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">The Rise of BCBAs in Schools</h2>
                  <p className="text-sm text-slate-600">Fastest-growing area in applied behavior analysis</p>
                </div>
              </div>

              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                BCBAs in schools represent one of the fastest-growing areas in applied behavior analysis. As schools recognize the need for evidence-based behavior support, more districts are hiring BCBAs to implement comprehensive behavior systems that transform student outcomes.
              </p>

              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 border-l-4 border-emerald-500 mb-6">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-emerald-900 mb-3">Evidence‑backed foundations</h3>
                    <ul className="text-sm text-emerald-800 space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                          PBIS/MTSS is a tiered, evidence‑based framework for schoolwide behavior support.
                          {" "}
                          <Link href="https://www.pbis.org/pbis/what-is-pbis" className="text-emerald-700 underline" target="_blank" rel="noopener noreferrer">Center on PBIS</Link>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                          Function‑based assessment and intervention (FBA→BIP) improve outcomes when plans match function and are feasible.
                          {" "}
                          <Link href="https://sites.ed.gov/idea/files/Functional-Behavioral-Assessments-11-19-2024.pdf" className="text-emerald-700 underline" target="_blank" rel="noopener noreferrer">U.S. ED FBA Guidance (2024)</Link>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                          IDEA requires measurable annual goals and progress reporting for eligible students.
                          {" "}
                          <Link href="https://www.ecfr.gov/current/title-34/subtitle-B/chapter-III/part-300/subpart-D/section-300.320" className="text-emerald-700 underline" target="_blank" rel="noopener noreferrer">34 C.F.R. § 300.320</Link>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                          Coaching with observation, practice, and performance feedback increases teacher fidelity and student outcomes.
                          {" "}
                          <Link href="https://ies.ed.gov/sites/default/files/migrated/rel/infographics/pdf/REL_PA_Improving_Teacher_Performance_Through_Instructional_Coaching.pdf" className="text-emerald-700 underline" target="_blank" rel="noopener noreferrer">Kretlow & Bartholomew (2010) – REL/IES</Link>
                          {" • "}
                          <Link href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5878968/" className="text-emerald-700 underline" target="_blank" rel="noopener noreferrer">Johnson et al. (2018)</Link>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Functions */}
            <div id="functions" className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">What BCBAs in Schools Actually Do</h2>
                  <p className="text-sm text-slate-600">Five core functions across three service levels</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Individual Level */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Individual Support</h3>
                      <p className="text-xs text-slate-600">Tier 3 Services</p>
                    </div>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Conduct comprehensive FBAs (<Link href="https://sites.ed.gov/idea/files/Functional-Behavioral-Assessments-11-19-2024.pdf" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">U.S. ED, 2024</Link>)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Develop function‑matched BIPs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Write measurable IEP goals (<Link href="https://www.ecfr.gov/current/title-34/subtitle-B/chapter-III/part-300/subpart-D/section-300.320" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">IDEA §300.320</Link>)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Provide crisis intervention</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Monitor progress and fidelity (treatment integrity)</span>
                    </li>
                  </ul>
                  <Link href="/behavior-plans" className="mt-4 block">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                      Try BIP Writer Tool
                    </button>
                  </Link>
                </div>

                {/* Group Level */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Group Interventions</h3>
                      <p className="text-xs text-slate-600">Tier 2 Services</p>
                    </div>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Design Tier 2 interventions (e.g., CICO, skills groups)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Facilitate social skills groups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Implement Check-In/Check-Out</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Coordinate mentoring programs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Analyze group data trends</span>
                    </li>
                  </ul>
                  <Link href="/supervisors" className="mt-4 block">
                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                      View Supervision Tools
                    </button>
                  </Link>
                </div>

                {/* Systems Level */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Systems Leadership</h3>
                      <p className="text-xs text-slate-600">Tier 1 / School-Wide</p>
                    </div>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Implement PBIS/MTSS systems (<Link href="https://www.pbis.org/pbis/what-is-pbis" className="text-purple-700 underline" target="_blank" rel="noopener noreferrer">Center on PBIS</Link>)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Train and coach staff (<Link href="https://ies.ed.gov/sites/default/files/migrated/rel/infographics/pdf/REL_PA_Improving_Teacher_Performance_Through_Instructional_Coaching.pdf" className="text-purple-700 underline" target="_blank" rel="noopener noreferrer">Kretlow & Bartholomew, 2010</Link>)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Analyze discipline data (data‑based decision making)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Develop policy recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>Lead behavior committees</span>
                    </li>
                  </ul>
                  <Link href="/transformation-program" className="mt-4 block">
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                      Learn Systems Leadership
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Challenges & Solutions */}
            <div id="challenges" className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Common Challenges & Evidence-Based Solutions</h2>
                  <p className="text-sm text-slate-600">Understanding barriers and building better systems</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Challenges */}
                <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h3 className="font-bold text-red-900">Top 4 Challenges</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-red-700 text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Lack of Time</h4>
                        <p className="text-xs text-slate-600">High caseloads and competing priorities limit intervention time and systems work</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-red-700 text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Undertrained Staff</h4>
                        <p className="text-xs text-slate-600">Paraprofessionals and teachers need ongoing coaching but lack structured training systems</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-red-700 text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Crisis-Driven Culture</h4>
                        <p className="text-xs text-slate-600">Reactive approaches prevent proactive systems building and sustainable practices</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-red-700 text-sm font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Limited Resources</h4>
                        <p className="text-xs text-slate-600">Budget constraints affect tool availability, training access, and program implementation</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Solutions */}
                <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <h3 className="font-bold text-emerald-900">Evidence-Based Solutions</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Efficient Systems & Workflows</h4>
                        <p className="text-xs text-slate-600">Streamlined assessment protocols, documentation templates, and data systems that save 5-10 hours weekly</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Systematic Staff Training Programs</h4>
                        <p className="text-xs text-slate-600">Structured PD with performance feedback, coaching cycles, and fidelity monitoring for sustainable implementation</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Preventive PBIS/MTSS Frameworks</h4>
                        <p className="text-xs text-slate-600">Data-driven decision making, tiered supports, and schoolwide systems that reduce crisis by 40-60%</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">Technology & AI Integration</h4>
                        <p className="text-xs text-slate-600">AI-powered tools for assessment, planning, IEP goals, and progress monitoring that accelerate workflows</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Stories */}
            <div id="solutions" className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Success Stories: BCBAs Making a Difference</h2>
                  <p className="text-sm text-slate-600">Real examples of transformative impact</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-bold text-slate-900">Special Ed Consultant</h3>
                      <p className="text-xs text-slate-600">Tier 3 Focus</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                    "Megan works as a BCBA in special education, providing consultation and assessment at the Tier 3 level. She trains special education teachers and instructional assistants working with students supported by IEPs."
                  </p>
                  <div className="bg-blue-100 rounded-lg p-3">
                    <p className="text-xs text-blue-900">
                      <strong>Result:</strong> 75% reduction in classroom disruptions, improved staff confidence and intervention fidelity
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-8 h-8 text-emerald-600" />
                    <div>
                      <h3 className="font-bold text-slate-900">PBIS Coordinator</h3>
                      <p className="text-xs text-slate-600">Systems Implementation</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                    "Rob leads district-wide PBIS implementation, training administrators and teachers in evidence-based behavior support while maintaining individual consultation services."
                  </p>
                  <div className="bg-emerald-100 rounded-lg p-3">
                    <p className="text-xs text-emerald-900">
                      <strong>Result:</strong> 40% decrease in office referrals district-wide, sustainable systems with reduced BCBA burnout
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-8 h-8 text-purple-600" />
                    <div>
                      <h3 className="font-bold text-slate-900">Behavior Specialist</h3>
                      <p className="text-xs text-slate-600">Multi-Tier Support</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                    "Holly provides services across all three tiers - from school-wide systems to intensive individual interventions, with a focus on training and sustainability."
                  </p>
                  <div className="bg-purple-100 rounded-lg p-3">
                    <p className="text-xs text-purple-900">
                      <strong>Result:</strong> Comprehensive support model with staff ownership, reduced reliance on external BCBA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources & Training */}
            <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Ready to Excel as a BCBA in Schools?</h2>
                <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                  Join our comprehensive training program designed specifically for BCBAs in schools with evidence-based strategies and systems-level tools.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-8 h-8 text-white" />
                    <h3 className="font-bold text-xl">8-Week Transformation System</h3>
                  </div>
                  <ul className="text-sm space-y-2 mb-4 text-emerald-100">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Leadership skills for working with administrators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Systems implementation strategies (PBIS/MTSS)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Staff training and coaching methods with fidelity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Burnout prevention and resilience building</span>
                    </li>
                  </ul>
                  <Link href="/transformation-program">
                    <button className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-semibold py-3 px-4 rounded-lg transition-colors">
                      Join the Program
                    </button>
                  </Link>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-8 h-8 text-white" />
                    <h3 className="font-bold text-xl">Free Practice Tools</h3>
                  </div>
                  <ul className="text-sm space-y-2 mb-4 text-emerald-100">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>AI-powered IEP Goal Generator with quality validation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Behavior Plan Writer with function-based templates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>FBA templates and assessment checklists</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Staff training materials and coaching guides</span>
                    </li>
                  </ul>
                  <div className="space-y-2">
                    <Link href="/iep-goals">
                      <button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                        Try IEP Goal Generator
                      </button>
                    </Link>
                    <Link href="/behavior-plans">
                      <button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                        Try BIP Writer
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-emerald-100 text-sm mb-4">
                  Connect with thousands of BCBAs in schools sharing strategies, resources, and support
                </p>
                <Link href="/community">
                  <button className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-3 rounded-lg transition-colors inline-flex items-center gap-2">
                    Join Free Community
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>

          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* On this page */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
                <h3 className="font-bold text-slate-900 mb-4">On this page</h3>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li><a href="#rise" className="hover:text-emerald-700">The rise of BCBAs</a></li>
                  <li><a href="#functions" className="hover:text-emerald-700">Core functions</a></li>
                  <li><a href="#challenges" className="hover:text-emerald-700">Challenges</a></li>
                  <li><a href="#solutions" className="hover:text-emerald-700">Solutions</a></li>
                  <li><a href="#references" className="hover:text-emerald-700">References</a></li>
                </ul>
              </div>

              {/* Key Stats */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  BCBA in Schools Data
                </h3>
                <div className="space-y-4">
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-xs text-emerald-600 mb-1">Average Caseload</p>
                    <p className="text-2xl font-bold text-emerald-700">15 students</p>
                    <p className="text-xs text-slate-600">Range: 0-50 students</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xs text-blue-600 mb-1">Support Gen Ed Students</p>
                    <p className="text-2xl font-bold text-blue-700">50%</p>
                    <p className="text-xs text-slate-600">Of BCBAs serve all students</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-xs text-purple-600 mb-1">States with BCBAs</p>
                    <p className="text-2xl font-bold text-purple-700">All 50</p>
                    <p className="text-xs text-slate-600">Growing presence nationwide</p>
                  </div>
                </div>
              </div>

              {/* Related Links */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  Related Guides
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link className="group flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors" href="/school-bcba/how-to-become">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">How to Become a School BCBA</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="group flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors" href="/school-bcba/salary-by-state">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">School BCBA Salary by State</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="group flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors" href="/school-bcba/job-guide-2025">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">2025 Job Guide</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="group flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors" href="/school-bcba">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">School BCBA Hub</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Quick Wins */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-lg p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-600" />
                  Quick Wins for New BCBAs
                </h3>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Build relationships with administrators first</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Start with staff training, not just student work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Use simple data systems teachers can maintain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Speak education language, not clinic jargon</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-xl mb-3">Advance Your School BCBA Impact</h3>
                <p className="text-emerald-100 text-sm mb-4 leading-relaxed">
                  Access evidence‑based tools, training, and a supportive community of school‑based practitioners.
                </p>
                <Link href="/transformation-program">
                  <button className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    Start Your Journey
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

            </div>
          </aside>

        </div>
      </section>

      {/* References (APA) */}
      <section className="container mx-auto px-6 pb-16">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">References</h2>
          <ol className="list-decimal pl-6 space-y-3 text-slate-700 text-sm">
            <li>
              Behavior Analyst Certification Board. (2022). Ethics Code for Behavior Analysts.
              {" "}
              <Link href="https://www.bacb.com/wp-content/uploads/2022/01/Ethics-Code-for-Behavior-Analysts-240830-a.pdf" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">PDF</Link>
            </li>
            <li>
              Center on PBIS. (n.d.). What is PBIS?
              {" "}
              <Link href="https://www.pbis.org/pbis/what-is-pbis" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">Link</Link>
            </li>
            <li>
              Center on PBIS. (n.d.). Function‑Based Support Throughout the Continuum (Basic FBA→BSP).
              {" "}
              <Link href="https://www.pbis.org/current/function-based-support-throughout-the-continuum" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">Link</Link>
            </li>
            <li>
              U.S. Department of Education. (2024, Nov. 20). Using Functional Behavioral Assessments to Create Supportive Learning Environments.
              {" "}
              <Link href="https://sites.ed.gov/idea/files/Functional-Behavioral-Assessments-11-19-2024.pdf" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">PDF</Link>
            </li>
            <li>
              U.S. Department of Education, Office of Special Education and Rehabilitative Services. (n.d.). IDEA Regulations—34 C.F.R. § 300.320.
              {" "}
              <Link href="https://www.ecfr.gov/current/title-34/subtitle-B/chapter-III/part-300/subpart-D/section-300.320" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">Link</Link>
            </li>
            <li>
              U.S. Department of Education, Institute of Education Sciences (WWC). (2024). Teacher‑Delivered Behavioral Interventions in Grades K–5: Practice Guide.
              {" "}
              <Link href="https://ies.ed.gov/ncee/wwc/docs/practiceguide/behavioral-interventions-practice-guide_v3a_508a.pdf" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">PDF</Link>
            </li>
            <li>
              Kretlow, A. G., & Bartholomew, C. C. (2010). Using coaching to improve fidelity of evidence‑based practices: A review. Teacher Education and Special Education, 33(4), 279–299. (Summary)
              {" "}
              <Link href="https://ies.ed.gov/sites/default/files/migrated/rel/infographics/pdf/REL_PA_Improving_Teacher_Performance_Through_Instructional_Coaching.pdf" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">REL/IES</Link>
            </li>
            <li>
              Johnson, S. R., et al. (2018). The mediating role of the coach–teacher relationship. Implementation Science, 13, 14.
              {" "}
              <Link href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5878968/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">PMC</Link>
            </li>
            <li>
              McIntyre, L. L., Gresham, F. M., DiGennaro, F. D., & Reed, D. D. (2007). Treatment integrity of school‑based interventions with children. Journal of Applied Behavior Analysis, 40(4), 659–672.
              {" "}
              <Link href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2078573/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">PMC</Link>
            </li>
            <li>
              Fiske, K. E., et al. (2008). Treatment integrity of school‑based behavior analytic interventions and student outcomes. Behavior Modification, 32(1), 153–179.
              {" "}
              <Link href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2846589/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">PMC</Link>
            </li>
          </ol>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                "headline": "BCBAs in Schools: Complete Guide for School-Based Success",
                "description": "Complete guide to BCBAs in schools with real BAESIG data, roles, challenges, and proven solutions for school-based behavior analysts.",
                "author": {
                  "@type": "Person",
                  "name": "Rob Spain"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "Behavior School"
                },
                "datePublished": "2025-01-15",
                "dateModified": "2025-01-15"
              },
              {
                "@type": "HowTo",
                "name": "Implement PBIS‑aligned Tier 3 FBA→BIP",
                "description": "Step‑by‑step process to plan an FBA and translate results into a feasible, function‑matched BIP implemented with fidelity in K–12 settings.",
                "totalTime": "P14D",
                "estimatedCost": {"@type":"MonetaryAmount","currency":"USD","value":"0"},
                "supply": [
                  {"@type":"HowToSupply","name":"FBA interview forms (teachers, family)"},
                  {"@type":"HowToSupply","name":"ABC/incident data sheets"},
                  {"@type":"HowToSupply","name":"BIP template (prevention, teaching, consequences)"}
                ],
                "tool": [
                  {"@type":"HowToTool","name":"Data graphing spreadsheet"},
                  {"@type":"HowToTool","name":"Fidelity checklist"}
                ],
                "step": [
                  {"@type":"HowToStep","name":"Form team & define routines","text":"Obtain consent, define target routines, confirm priorities with teachers and family."},
                  {"@type":"HowToStep","name":"Plan FBA & measures","text":"Select interviews and direct observation tools (ABC, scatterplots); set timeframe."},
                  {"@type":"HowToStep","name":"Collect baseline data","text":"Gather multi‑day data across settings/times; capture antecedents, behavior, consequences."},
                  {"@type":"HowToStep","name":"Hypothesize function","text":"Analyze patterns; generate and validate function hypotheses with the team."},
                  {"@type":"HowToStep","name":"Design BIP","text":"Prevention strategies, explicit replacement‑skill instruction, consequence plan, safety links."},
                  {"@type":"HowToStep","name":"Train & set integrity","text":"Train implementers; create a brief fidelity checklist (10–20% sampled)."},
                  {"@type":"HowToStep","name":"Monitor & adjust","text":"Weekly graphing; link outcome changes to integrity; revise strategies as needed."},
                  {"@type":"HowToStep","name":"IEP alignment","text":"Write measurable goals; document progress and data‑based decisions in team meetings."}
                ]
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What do BCBAs in schools do?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "School-based BCBAs align behavior supports to PBIS/MTSS, conduct FBAs, translate results into feasible BIPs, contribute measurable IEP goals, coach staff with performance feedback, and monitor fidelity and outcomes."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How do BCBAs align with PBIS/MTSS?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "They help teams establish Tier 1 expectations and acknowledgements, adapt Tier 2 supports like CICO or skills groups, and design function-matched Tier 3 plans informed by FBA data, with decision-making driven by discipline and progress-monitoring data."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What evidence supports these practices?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Center on PBIS and U.S. ED guidance on FBA and PBIS support tiered, function-based approaches; WWC guidance synthesizes teacher-delivered behavioral interventions; coaching research shows performance feedback improves fidelity; and treatment integrity is associated with better outcomes." 
                    }
                  }
                ]
              }
            ]
          })
        }}
      />
    </main>
  )
}
