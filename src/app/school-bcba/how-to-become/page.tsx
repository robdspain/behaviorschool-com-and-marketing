import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  ClipboardCheck,
  Award,
  Target,
  Users,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  TrendingUp,
  Briefcase,
  BookOpen,
  Clock
} from "lucide-react";

export const metadata: Metadata = {
  title: "How to Become a School BCBA: Complete 2025 Pathway Guide",
  description:
    "Step-by-step pathway to becoming a School BCBA with district-ready competencies, essential artifacts, timeline planner, and credential requirements. Complete qualification guide for K-12 behavior analysts.",
  alternates: { canonical: "https://behaviorschool.com/school-bcba/how-to-become" },
  robots: { index: true, follow: true },
  keywords: "how to become school BCBA, school BCBA requirements, BCBA certification pathway, school behavior analyst training, BCBA fieldwork, school BCBA qualifications",
  openGraph: {
    title: "How to Become a School BCBA: Complete Pathway Guide",
    description: "Step-by-step guide with timelines, artifacts, and district-specific competencies for becoming a School BCBA.",
    type: "article",
    url: "https://behaviorschool.com/school-bcba/how-to-become",
    siteName: "Behavior School",
    locale: "en_US",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior School",
      },
    ],
  }
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <section className="container mx-auto px-6 pt-24 pb-4">
        <nav className="flex items-center text-sm text-slate-600" aria-label="Breadcrumb">
          <Link className="hover:text-emerald-600 transition-colors" href="/school-bcba">
            School BCBA
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-slate-900 font-medium">How to Become</span>
        </nav>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full mb-6">
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-semibold text-emerald-700">Complete Qualification Pathway</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            How to Become a School BCBA
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
            A comprehensive, step-by-step pathway from coursework to certification—tailored to district expectations, IEP compliance, and MTSS/PBIS alignment. Build the competencies that school districts actually hire.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {/* Main Content Area */}
          <article className="lg:col-span-2 space-y-8">

            {/* Step-by-Step Pathway */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">7-Step Pathway to School BCBA</h2>
                  <p className="text-sm text-slate-600">District-ready competencies from day one</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="relative pl-12 border-l-4 border-emerald-500 pb-6">
                  <div className="absolute -left-6 top-0 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">1</span>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <BookOpen className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Complete BACB-Required Coursework</h3>
                        <p className="text-slate-700 text-sm leading-relaxed mb-3">
                          Fulfill all BACB graduate coursework requirements through an approved VCS or university program. Focus on courses that translate to school settings: assessment, intervention design, measurement systems, and ethical practice.
                        </p>
                        <div className="bg-white rounded-lg p-4 border border-emerald-200">
                          <p className="text-sm font-semibold text-slate-900 mb-2">School-Specific Electives (Highly Recommended):</p>
                          <ul className="text-sm text-slate-700 space-y-1">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>Special education law and IEP processes</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>Classroom management and instructional design</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>School systems and organizational behavior</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>PBIS/MTSS frameworks and implementation</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-12 border-l-4 border-blue-500 pb-6">
                  <div className="absolute -left-6 top-0 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">2</span>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Secure School-Based Supervised Experience</h3>
                        <p className="text-slate-700 text-sm leading-relaxed mb-3">
                          Complete your BACB-required fieldwork hours (1500 or 2000) in K–12 settings whenever possible. Prioritize experiences that build district-valued competencies and create portfolio-ready artifacts.
                        </p>
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-semibold text-slate-900 mb-2">Essential School-Based Experiences:</p>
                          <ul className="text-sm text-slate-700 space-y-1">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span>Conduct FBAs with school teams (not just individual assessments)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span>Develop classroom-feasible BIPs with teacher input</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span>Participate in IEP meetings and write behavior goals</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span>Train and coach teachers, paraprofessionals, or related staff</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span>Support MTSS/PBIS implementation at Tier 1, 2, or 3</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span>Learn crisis de-escalation and district safety protocols</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-12 border-l-4 border-purple-500 pb-6">
                  <div className="absolute -left-6 top-0 w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">3</span>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Award className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Pass the BCBA Certification Exam</h3>
                        <p className="text-slate-700 text-sm leading-relaxed mb-3">
                          Once coursework and supervised hours are complete, sit for the BCBA exam. Prioritize exam prep that includes school-specific scenarios: IEP compliance, classroom modifications, staff collaboration, and systems-level thinking.
                        </p>
                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                          <p className="text-sm font-semibold text-slate-900 mb-2">School-Focused Exam Prep Tips:</p>
                          <ul className="text-sm text-slate-700 space-y-1">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                              <span>Study with school case examples (not just clinic scenarios)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                              <span>Master concepts around consultation, staff training, and indirect services</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                              <span>Understand ethical considerations in educational settings (FERPA, IEP confidentiality)</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-12 border-l-4 border-emerald-500 pb-6">
                  <div className="absolute -left-6 top-0 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">4</span>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <ClipboardCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Build School-Specific Competencies</h3>
                        <p className="text-slate-700 text-sm leading-relaxed mb-3">
                          Beyond basic BCBA certification, develop competencies that school districts actively seek. These skills differentiate you from clinic-trained candidates and demonstrate immediate readiness.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg p-4 border border-emerald-200">
                            <p className="text-sm font-semibold text-slate-900 mb-2">IEP & Legal Competencies:</p>
                            <ul className="text-xs text-slate-700 space-y-1">
                              <li>• Write measurable IEP behavior goals (90-100% mastery)</li>
                              <li>• Understand manifestation determinations</li>
                              <li>• Navigate IDEA, Section 504, and FERPA</li>
                              <li>• Present at IEP meetings professionally</li>
                            </ul>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-emerald-200">
                            <p className="text-sm font-semibold text-slate-900 mb-2">Systems & Collaboration:</p>
                            <ul className="text-xs text-slate-700 space-y-1">
                              <li>• Implement PBIS/MTSS frameworks</li>
                              <li>• Collaborate with multidisciplinary teams</li>
                              <li>• Design data workflows and progress monitoring</li>
                              <li>• Communicate with administrators effectively</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative pl-12 border-l-4 border-blue-500 pb-6">
                  <div className="absolute -left-6 top-0 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">5</span>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Assemble Your Portfolio of Artifacts</h3>
                        <p className="text-slate-700 text-sm leading-relaxed mb-3">
                          Create a professional portfolio that showcases your readiness for school-based practice. Districts want to see evidence of systems thinking and practical application—not just clinic experience.
                        </p>
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-semibold text-slate-900 mb-3">Essential Portfolio Artifacts:</p>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 text-xs font-bold">1</span>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">90-Day Systems Implementation Plan</p>
                                <p className="text-xs text-slate-600">Show how you'll ramp up in a new district: assessments, staff training, data systems</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 text-xs font-bold">2</span>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">Sample BIP with Function & Classroom Strategies</p>
                                <p className="text-xs text-slate-600">Use <Link href="/behavior-plans" className="text-blue-700 underline">Behavior Plan Writer</Link> to create a polished, professional example</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 text-xs font-bold">3</span>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">IEP Goal Set (Validated Quality)</p>
                                <p className="text-xs text-slate-600">Validate with <Link href="/iep-goal-qualitychecker" className="text-blue-700 underline">Goal Quality Checker</Link> to ensure measurability</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 text-xs font-bold">4</span>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">Staff Coaching Cycle with Fidelity Data</p>
                                <p className="text-xs text-slate-600">Document your process: baseline, training, feedback sessions, outcome data</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 text-xs font-bold">5</span>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">Progress Monitoring Template with Charted Examples</p>
                                <p className="text-xs text-slate-600">Show visual data that teachers, parents, and IEP teams can understand</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="relative pl-12 border-l-4 border-purple-500 pb-6">
                  <div className="absolute -left-6 top-0 w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">6</span>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Briefcase className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Apply with District-Focused Materials</h3>
                        <p className="text-slate-700 text-sm leading-relaxed mb-3">
                          Tailor your resume, cover letter, and portfolio to school district language. Use keywords that HR and hiring committees recognize: FBA/BIP, MTSS, PBIS, progress monitoring, IEP compliance, staff training, fidelity.
                        </p>
                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                          <p className="text-sm font-semibold text-slate-900 mb-2">Application Best Practices:</p>
                          <ul className="text-sm text-slate-700 space-y-1">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                              <span>Create a one-page systems overview highlighting your MTSS/PBIS experience</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                              <span>Link to digital portfolio or Google Drive folder with artifacts</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                              <span>Emphasize collaboration skills and systems-level thinking (not just 1:1 work)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                              <span>Use <Link href="/school-bcba/job-guide-2025" className="text-purple-700 underline">Job Guide 2025</Link> for resume templates and cover letter examples</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 7 */}
                <div className="relative pl-12 border-l-4 border-emerald-500">
                  <div className="absolute -left-6 top-0 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">7</span>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Target className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Interview with Systems-Level Confidence</h3>
                        <p className="text-slate-700 text-sm leading-relaxed mb-3">
                          School BCBA interviews focus on collaboration, systems thinking, and sustainability. Lead with how you implement supports that teachers can maintain without you present. Avoid clinic jargon; speak the language of education.
                        </p>
                        <div className="bg-white rounded-lg p-4 border border-emerald-200">
                          <p className="text-sm font-semibold text-slate-900 mb-2">Common Interview Questions to Prepare For:</p>
                          <ul className="text-sm text-slate-700 space-y-2">
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-emerald-600 text-xs font-bold">Q</span>
                              </div>
                              <span>"How would you support a teacher struggling with a student's disruptive behavior?"</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-emerald-600 text-xs font-bold">Q</span>
                              </div>
                              <span>"Describe your approach to implementing PBIS or MTSS frameworks."</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-emerald-600 text-xs font-bold">Q</span>
                              </div>
                              <span>"How do you balance individual student needs with district-wide systems work?"</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-emerald-600 text-xs font-bold">Q</span>
                              </div>
                              <span>"Walk us through your process for conducting an FBA and developing a BIP in a school setting."</span>
                            </li>
                          </ul>
                          <p className="text-xs text-slate-600 mt-3 italic">
                            Pro Tip: Bring your portfolio artifacts to the interview. Reference specific examples when answering questions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Planner */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Timeline Planner (Typical Path)</h2>
                  <p className="text-sm text-slate-600">Plan your journey from start to first School BCBA role</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      0-6
                    </div>
                    <div className="flex-1 w-1 bg-gradient-to-b from-emerald-500 to-blue-500 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <h3 className="font-bold text-slate-900 mb-1">Months 0–6: Coursework + Initial Practicum</h3>
                    <p className="text-sm text-slate-700 mb-3">Complete first half of graduate coursework and begin supervised fieldwork. Seek school placements early—don't wait until final semester.</p>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-slate-900 mb-2">Focus Areas:</p>
                      <ul className="text-xs text-slate-700 space-y-1">
                        <li>• Secure school practicum site (district, charter, private school)</li>
                        <li>• Shadow experienced School BCBAs to understand the role</li>
                        <li>• Begin logging fieldwork hours in K-12 settings</li>
                        <li>• Observe IEP meetings and behavior support processes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      6-12
                    </div>
                    <div className="flex-1 w-1 bg-gradient-to-b from-blue-500 to-purple-500 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <h3 className="font-bold text-slate-900 mb-1">Months 6–12: Advanced School Hours + Portfolio Building</h3>
                    <p className="text-sm text-slate-700 mb-3">Complete remaining coursework while accumulating school-specific fieldwork experiences. Begin creating portfolio artifacts that demonstrate competency.</p>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-slate-900 mb-2">Focus Areas:</p>
                      <ul className="list-disc list-inside text-left text-xs text-slate-700 space-y-1">
                        <li>Lead FBAs and BIP development (aim for 5-10 complete cases)</li>
                        <li>Participate actively in IEP meetings and write behavior goals</li>
                        <li>Conduct staff training sessions (document with fidelity data)</li>
                        <li>Build progress monitoring systems and data workflows</li>
                        <li>Create your first portfolio artifacts (BIP examples, IEP goals, coaching plans)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      12-15
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">Months 12–15: Exam Prep + Job Applications</h3>
                    <p className="text-sm text-slate-700 mb-3">Complete all requirements, pass BCBA exam, finalize portfolio, and begin targeted job search. Many candidates land offers before or shortly after passing the exam.</p>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-slate-900 mb-2">Focus Areas:</p>
                      <ul className="list-disc list-inside text-left text-xs text-slate-700 space-y-1">
                        <li>Intensive BCBA exam prep (prioritize school-based scenarios)</li>
                        <li>Finalize portfolio with 90-day plan, BIP, IEP goals, coaching cycle</li>
                        <li>Validate artifacts with free tools (Goal Quality Checker, BIP Writer)</li>
                        <li>Apply to school districts (start 3-6 months before desired start date)</li>
                        <li>Prepare for interviews with systems-level talking points</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-l-4 border-blue-500">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Timeline Variations</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <strong>Part-time students:</strong> Extend to 18-24 months. <strong>Accelerated programs:</strong> Some complete in 10-12 months with intensive summer coursework. <strong>Career changers:</strong> If you already have a Master's in education or psychology, you may qualify for streamlined pathways.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Free Tools Section */}
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl shadow-lg border border-emerald-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-emerald-900">Free Tools to Accelerate Your Path</h2>
                  <p className="text-sm text-emerald-700">Build portfolio-ready artifacts today</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-emerald-200">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    IEP Goal Writer
                  </h3>
                  <p className="text-sm text-slate-700 mb-4">
                    Generate measurable, function-based behavior goals that meet IEP compliance standards. Perfect for building your portfolio or studying goal writing.
                  </p>
                  <Link href="/iep-behavior-goals">
                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                      Try IEP Goal Writer
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>

                <div className="bg-white rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-blue-600" />
                    Behavior Plan Writer
                  </h3>
                  <p className="text-sm text-slate-700 mb-4">
                    Create professional BIPs with clear function statements, replacement behaviors, and classroom-feasible strategies. Essential portfolio artifact.
                  </p>
                  <Link href="/behavior-plans">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                      Try Behavior Plan Writer
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>

                <div className="bg-white rounded-xl p-6 border border-purple-200">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    IEP Goal Quality Checker
                  </h3>
                  <p className="text-sm text-slate-700 mb-4">
                    Validate your IEP goals against best practice criteria: measurability, baseline data, conditions, criteria. Ensure 90-100% quality before interviews.
                  </p>
                  <Link href="/iep-goal-qualitychecker">
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                      Try Goal Quality Checker
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>

                <div className="bg-white rounded-xl p-6 border border-emerald-200">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Complete Portfolio Guide
                  </h3>
                  <p className="text-sm text-slate-700 mb-4">
                    Download our comprehensive portfolio checklist with examples, templates, and step-by-step instructions for every required artifact.
                  </p>
                  <Link href="/school-bcba/job-guide-2025">
                    <button className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                      View Job Guide 2025
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* Related Guides */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  Related Guides
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link className="group flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors" href="/school-bcba/job-guide-2025">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">School BCBA Job Guide 2025</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="group flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors" href="/school-bcba/salary-by-state">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">Salary by State</span>
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

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-lg p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Path at a Glance
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Typical Timeline</p>
                    <p className="text-2xl font-bold text-blue-600">12-15 months</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Required Fieldwork Hours</p>
                    <p className="text-2xl font-bold text-purple-600">1,500-2,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Essential Portfolio Artifacts</p>
                    <p className="text-2xl font-bold text-emerald-600">5+</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-xl mb-3">Accelerate Your Journey</h3>
                <p className="text-emerald-100 text-sm mb-4 leading-relaxed">
                  Join our 8-week School BCBA Transformation System to master systems leadership, staff training, and district readiness.
                </p>
                <Link href="/transformation-program">
                  <button className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    View Program
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

            </div>
          </aside>

        </div>
      </section>

      {/* HowTo structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Become a School BCBA",
            description: "Complete step-by-step pathway to becoming a School BCBA with district-ready competencies, portfolio artifacts, and timeline planner.",
            totalTime: "P12M",
            supply: [
              { "@type": "HowToSupply", name: "Graduate coursework (BACB-approved)" },
              { "@type": "HowToSupply", name: "Supervised fieldwork (1500-2000 hours)" },
              { "@type": "HowToSupply", name: "Portfolio artifacts (BIP, IEP goals, coaching plans)" }
            ],
            step: [
              { "@type": "HowToStep", name: "Complete BACB-required coursework with school-specific electives", text: "Fulfill all BACB graduate coursework requirements. Add electives in special education law, classroom management, and school systems." },
              { "@type": "HowToStep", name: "Secure school-based supervised experience", text: "Complete 1500-2000 fieldwork hours in K-12 settings. Prioritize FBAs, BIPs, IEP meetings, staff coaching, and MTSS integration." },
              { "@type": "HowToStep", name: "Pass BCBA certification exam", text: "Sit for BCBA exam with focus on school-specific scenarios and ethical considerations in educational settings." },
              { "@type": "HowToStep", name: "Build school-specific competencies", text: "Master IEP writing, progress monitoring, PBIS/MTSS implementation, and multidisciplinary collaboration." },
              { "@type": "HowToStep", name: "Assemble professional portfolio", text: "Create 90-day plan, sample BIP, validated IEP goals, coaching cycle documentation, and progress monitoring templates." },
              { "@type": "HowToStep", name: "Apply with district-focused materials", text: "Tailor resume and cover letter with school keywords: FBA/BIP, MTSS, PBIS, IEP compliance, staff training, fidelity." },
              { "@type": "HowToStep", name: "Interview with systems-level confidence", text: "Lead with collaboration, systems thinking, and sustainability. Show how you implement supports teachers can maintain." }
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How long does it take to become a School BCBA?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The typical pathway takes 12-15 months: 6-12 months for coursework and initial fieldwork, 6-12 months for advanced school hours and portfolio building, and 1-3 months for exam prep and job applications. Part-time students may need 18-24 months."
                }
              },
              {
                "@type": "Question",
                "name": "What artifacts do I need in my School BCBA portfolio?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Essential portfolio artifacts include: 90-day systems implementation plan, sample BIP with function and classroom strategies, validated IEP goal set, staff coaching cycle with fidelity data, and progress monitoring templates with charted examples. These demonstrate district readiness and systems-level thinking."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need school-specific coursework to become a School BCBA?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "While not required by BACB, highly recommended electives include: special education law and IEP processes, classroom management and instructional design, school systems and organizational behavior, and PBIS/MTSS frameworks. These courses significantly improve your competitiveness for school positions."
                }
              },
              {
                "@type": "Question",
                "name": "Can I complete my BCBA fieldwork hours in schools?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, and it's highly recommended. Complete your 1500-2000 BACB fieldwork hours in K-12 settings whenever possible. Prioritize experiences conducting FBAs/BIPs, participating in IEP meetings, training staff, and supporting MTSS/PBIS implementation. This builds district-valued competencies and portfolio artifacts."
                }
              }
            ]
          })
        }}
      />
    </main>
  );
}
