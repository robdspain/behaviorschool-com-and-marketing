import type { Metadata } from "next";
import Link from "next/link";
import { OnThisPageTOC } from "@/components/OnThisPageTOC";
import { ArrowRight, Briefcase, FileText, Target, Users, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "School BCBA Job Guide: Role, Artifacts, Interview Prep",
  description:
    "What districts expect from School BCBAs—MTSS/PBIS alignment, FBA→BIP, IEP goals, coaching, fidelity—and the artifacts that prove systems-level impact.",
  alternates: { canonical: "https://behaviorschool.com/school-bcba/job-guide" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <section className="container mx-auto px-6 pt-24 pb-6">
        <nav className="text-sm text-slate-500">
          <Link className="hover:text-emerald-700 transition-colors" href="/school-bcba">School BCBA</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">Job Guide</span>
        </nav>
      </section>

      {/* Hero */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold mb-6">
            <Briefcase className="h-4 w-4 mr-2" />
            2025 Job Search Strategy
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            School BCBA Job Guide
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
            What districts expect, how to stand out, and the exact artifacts that prove systems-level impact in schools.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <article className="lg:col-span-2 space-y-12">

            {/* Role Expectations */}
            <div id="role-expectations" className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Role Expectations (what districts look for)</h2>
                  <p className="text-slate-600">What districts expect from School BCBAs—rooted in current guidance</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    Lead FBAs and implement feasible, function-matched BIPs that fit classroom routines.
                    {" "}
                    <a className="text-emerald-700 underline" href="#ref-used-fba">(U.S. ED, 2024)</a>{" "}
                    <a className="text-emerald-700 underline" href="#ref-pbis-what">(Center on PBIS, n.d.)</a>{" "}
                    <a className="text-emerald-700 underline" href="#ref-wwc">(WWC/IES, 2024)</a>
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    Work inside an MTSS/PBIS framework with tiered supports (universal → targeted → intensive) and leadership teams.
                    {" "}
                    <a className="text-emerald-700 underline" href="#ref-pbis-what">(Center on PBIS, n.d.)</a>
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    Coach teachers and paraprofessionals via observation, modeling, practice, and performance-based feedback to improve fidelity.
                    {" "}
                    <a className="text-emerald-700 underline" href="#ref-kretlow">(Kretlow &amp; Bartholomew, 2010)</a>{" "}
                    <a className="text-emerald-700 underline" href="#ref-johnson">(Johnson et al., 2018)</a>
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    Write measurable IEP behavior goals and monitor progress with data-based decisions.
                    {" "}
                    <a className="text-emerald-700 underline" href="#ref-idea">(34 C.F.R. § 300.320)</a>{" "}
                    <a className="text-emerald-700 underline" href="#ref-hlps">(CEC/CEEDAR HLPs)</a>
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    Protect fidelity and document it; treatment integrity is tied to outcomes.
                    {" "}
                    <a className="text-emerald-700 underline" href="#ref-mcintyre">(McIntyre et al., 2007)</a>{" "}
                    <a className="text-emerald-700 underline" href="#ref-fiske">(Fiske et al., 2008)</a>
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    Align systems work with ethics and inclusive-education guidance emphasizing supportive, non-exclusionary practices.
                    {" "}
                    <a className="text-emerald-700 underline" href="#ref-bacb">(BACB, 2022)</a>{" "}
                    <a className="text-emerald-700 underline" href="#ref-dcl-2025">(U.S. ED, 2025)</a>
                  </span>
                </div>
              </div>
            </div>

            {/* Portfolio Artifacts */}
            <div id="portfolio-artifacts" className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border-2 border-emerald-200 scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-emerald-900 mb-2">Portfolio Artifacts to Bring</h2>
                  <p className="text-emerald-800">Stand out with district-ready, evidence-based materials</p>
                </div>
              </div>

              <ul className="space-y-4 text-emerald-900">
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-3">1.</span>
                  <div>
                    <strong className="font-bold">90-Day Systems Plan:</strong> Tiered supports map, PD cadence, decision rules, fidelity checks, weekly leadership agenda.
                    {" "}
                    <a className="text-emerald-700 underline" href="#ref-pbis-what">(Center on PBIS, n.d.)</a>{" "}
                    <a className="text-emerald-700 underline" href="#ref-dcl-2025">(U.S. ED, 2025)</a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-3">2.</span>
                  <div>
                    <strong className="font-bold">Sample BIP tied to an FBA:</strong> Function statement, antecedent strategies, replacement-skill instruction, consequence plan, data sheet, safety/crisis linkage.
                    {" "}
                    <a className="text-emerald-700 underline" href="#ref-used-fba">(U.S. ED, 2024)</a>{" "}
                    <a className="text-emerald-700 underline" href="#ref-pbis-function">(Center on PBIS, n.d.)</a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-3">3.</span>
                  <div>
                    <strong className="font-bold">IEP Goal Samples + Progress Monitoring:</strong> Measurable criteria (level, latency/rate, conditions), review schedule, graphed trends with decision rules.
                    {" "}
                    <a className="text-emerald-700 underline" href="#ref-idea">(34 C.F.R. § 300.320)</a>{" "}
                    <a className="text-emerald-700 underline" href="#ref-hlps">(HLPs)</a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-3">4.</span>
                  <div>
                    <strong className="font-bold">Coaching Cycle Template:</strong> Goal → model → guided practice → performance feedback → fidelity probe → next steps.
                    {" "}
                    <a className="text-emerald-700 underline" href="#ref-kretlow">(Kretlow &amp; Bartholomew, 2010)</a>{" "}
                    <a className="text-emerald-700 underline" href="#ref-johnson">(Johnson et al., 2018)</a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-3">5.</span>
                  <div>
                    <strong className="font-bold">Progress Dashboard:</strong> Goal status, trend, fidelity score, barriers, and next decision date.
                    {" "}
                    <a className="text-emerald-700 underline" href="#ref-hlps">(HLPs)</a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Systems-Level Impact */}
            <div id="systems-impact" className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">How to Demonstrate Systems-Level Impact</h2>
              <p className="text-slate-600 mb-6">Quick, credible signals hiring panels understand</p>
              <ul className="space-y-3 text-slate-800">
                <li>
                  <strong>Tier coverage map:</strong> % of schools with T1 expectations taught, T2 CICO running with fidelity, T3 FBA→BIP timelines met.
                  {" "}
                  <a className="text-emerald-700 underline" href="#ref-pbis-what">(Center on PBIS)</a>
                </li>
                <li>
                  <strong>Fidelity run-chart:</strong> Monthly average treatment-integrity scores per intervention vs. outcome trend.
                  {" "}
                  <a className="text-emerald-700 underline" href="#ref-mcintyre">(McIntyre et al., 2007)</a>{" "}
                  <a className="text-emerald-700 underline" href="#ref-fiske">(Fiske et al., 2008)</a>
                </li>
                <li>
                  <strong>IEP goal attainment:</strong> % of behavior goals on-track by quarter with data-based adjustments documented.
                  {" "}
                  <a className="text-emerald-700 underline" href="#ref-idea">(34 C.F.R. § 300.320)</a>
                </li>
                <li>
                  <strong>Crisis alignment:</strong> Evidence BIPs reference schoolwide crisis plan and post-incident routines.
                  {" "}
                  <a className="text-emerald-700 underline" href="#ref-used-fba">(U.S. ED FBA Guidance)</a>
                </li>
              </ul>
            </div>

            {/* Interview Questions */}
            <div id="interview-questions" className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Interview Questions (and what panels want to hear)</h2>
              <div className="space-y-6">
                {[
                  {
                    q: "Walk us through a complex FBA → feasible BIP.",
                    hit: "Informant + ABC data, testable function hypotheses, function-matched teaching plan, classroom fit, and integrity plan.",
                    refs: ["#ref-used-fba", "#ref-wwc"]
                  },
                  {
                    q: "How do you align with PBIS/MTSS without diluting function-based support?",
                    hit: "Tier alignment, decision rules, teaming structure, and how FBA-derived plans plug into Tier 3 while reinforcing T1/T2.",
                    refs: ["#ref-pbis-what", "#ref-pbis-function"]
                  },
                  {
                    q: "Show how you coach a new teacher.",
                    hit: "Model → practice → feedback → fidelity probe; cite coaching research.",
                    refs: ["#ref-kretlow", "#ref-johnson"]
                  },
                  {
                    q: "How do you write and monitor measurable IEP goals?",
                    hit: "Goal components per IDEA + monitoring schedule + decision rules.",
                    refs: ["#ref-idea", "#ref-hlps"]
                  },
                  {
                    q: "What does your 90-day plan look like?",
                    hit: "Leadership cadence, PD calendar, fidelity audits, and a simple dashboard.",
                    refs: ["#ref-pbis-what"]
                  }
                ].map((item, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="font-semibold text-slate-900 mb-1">&ldquo;{item.q}&rdquo;</p>
                    <p className="text-sm text-slate-700">Hit: {item.hit}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.refs.map((href, i) => (
                        <a key={i} href={href} className="text-emerald-700 underline mr-2">[ref]</a>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Keywords */}
            <div id="resume-keywords" className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border-2 border-purple-200 scroll-mt-24">
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Resume Keywords That Work</h2>
              <p className="text-purple-800 mb-6">Add these naturally throughout your resume and portfolio:</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-purple-900 mb-3">Core Competencies:</h3>
                  <div className="flex flex-wrap gap-2">
                    {["MTSS", "PBIS", "IEP Goals", "Progress Monitoring", "FBA/BIP", "Staff Coaching"].map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-purple-900 mb-3">Additional Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Fidelity", "Data Systems", "De-escalation", "Classroom Routines", "Social Validity"].map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Practical Prep */}
            <div id="practical-prep" className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Practical Prep (fast)</h2>
                </div>
              </div>

              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full font-bold mr-4 flex-shrink-0">1</span>
                  <div>
                    <strong className="text-slate-900">Use your goal-writing tool:</strong> Create measurable behavior goals and export a one-page progress view (align to {" "}
                    <a className="text-emerald-700 underline" href="#ref-idea">34 C.F.R. § 300.320</a>). Use the {" "}
                    <Link href="/iep-goals" className="text-emerald-700 underline hover:text-emerald-800">IEP Goal Writer</Link>.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full font-bold mr-4 flex-shrink-0">2</span>
                  <div>
                    <strong className="text-slate-900">Quality check:</strong> Run drafts against a goal-quality checklist (measurement dimensions + monitoring cadence per HLPs). {" "}
                    <Link href="/iep-goal-qualitychecker" className="text-emerald-700 underline hover:text-emerald-800">Goal Quality Checker</Link>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full font-bold mr-4 flex-shrink-0">3</span>
                  <div>
                    <strong className="text-slate-900">Create Your One-Pager:</strong> Philosophy + systems map + 90-day plan highlights
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full font-bold mr-4 flex-shrink-0">4</span>
                  <div>
                    <strong className="text-slate-900">Practice Scenarios:</strong> Prepare specific examples from your experience
                  </div>
                </li>
              </ol>
            </div>

            {/* Optional Advanced Talking Point */}
            <div id="advanced-talking-point" className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Optional advanced talking point</h2>
              <p className="text-slate-700">
                When intensive behavior is present, explain how you ensure dignity, skill development, and generalization in plans. Reference contemporary functional assessment and skill-based treatment literature to show fluency with modern approaches used in many districts.
                {" "}
                <a className="text-emerald-700 underline" href="#ref-hanley">(Hanley et al., 2014)</a>
              </p>
            </div>

            {/* References */}
            <div id="references" className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 scroll-mt-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">References (APA)</h2>
              <ol className="list-decimal pl-6 space-y-3 text-slate-700">
                <li id="ref-bacb">
                  Behavior Analyst Certification Board. (2022). Ethics Code for Behavior Analysts (updated PDF).
                  {" "}
                  <a className="text-emerald-700 underline" href="https://www.bacb.com/wp-content/uploads/2022/01/Ethics-Code-for-Behavior-Analysts-240830-a.pdf" target="_blank" rel="noopener noreferrer">PDF</a>
                </li>
                <li id="ref-pbis-what">
                  Center on PBIS. (n.d.). What is PBIS?
                  {" "}
                  <a className="text-emerald-700 underline" href="https://www.pbis.org/pbis/what-is-pbis" target="_blank" rel="noopener noreferrer">Link</a>
                </li>
                <li id="ref-pbis-function">
                  Center on PBIS. (n.d.). Function-Based Support Throughout the Continuum (Basic FBA to BSP).
                  {" "}
                  <a className="text-emerald-700 underline" href="https://www.pbis.org/current/function-based-support-throughout-the-continuum" target="_blank" rel="noopener noreferrer">Link</a>
                </li>
                <li id="ref-hlps">
                  Council for Exceptional Children &amp; CEEDAR Center. (2024). High-Leverage Practices for Students with Disabilities (updated).
                  {" "}
                  <a className="text-emerald-700 underline" href="https://highleveragepractices.org" target="_blank" rel="noopener noreferrer">Link</a>
                </li>
                <li id="ref-fiske">
                  Fiske, K. E., et al. (2008). Treatment integrity of school-based behavior analytic interventions and student outcomes. Behavior Modification, 32(1), 153–179.
                  {" "}
                  <a className="text-emerald-700 underline" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2846589/" target="_blank" rel="noopener noreferrer">PMC</a>
                </li>
                <li id="ref-hanley">
                  Hanley, G. P., Jin, C. S., Vanselow, N. R., &amp; Hanratty, L. A. (2014). Producing meaningful improvements via synthesized analyses and treatments. Journal of Applied Behavior Analysis, 47, 16–36.
                  {" "}
                  <a className="text-emerald-700 underline" href="https://www.gvsu.edu/autismcenter/start-connecting-practical-functional-assessment-and-skill-based-333.htm" target="_blank" rel="noopener noreferrer">Summary</a>
                </li>
                <li id="ref-johnson">
                  Johnson, S. R., et al. (2018). The mediating role of the coach–teacher relationship. Implementation Science, 13, 14.
                  {" "}
                  <a className="text-emerald-700 underline" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5878968/" target="_blank" rel="noopener noreferrer">PMC</a>
                </li>
                <li id="ref-kretlow">
                  Kretlow, A. G., &amp; Bartholomew, C. C. (2010). Using coaching to improve fidelity of evidence-based practices: A review. Teacher Education and Special Education, 33(4), 279–299.
                  {" "}
                  <a className="text-emerald-700 underline" href="https://ies.ed.gov/sites/default/files/migrated/rel/infographics/pdf/REL_PA_Improving_Teacher_Performance_Through_Instructional_Coaching.pdf" target="_blank" rel="noopener noreferrer">REL/IES summary</a>
                </li>
                <li id="ref-mcintyre">
                  McIntyre, L. L., Gresham, F. M., DiGennaro, F. D., &amp; Reed, D. D. (2007). Treatment integrity of school-based interventions with children. Journal of Applied Behavior Analysis, 40(4), 659–672.
                  {" "}
                  <a className="text-emerald-700 underline" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2078573/" target="_blank" rel="noopener noreferrer">PMC</a>
                </li>
                <li id="ref-used-fba">
                  U.S. Department of Education. (2024, Nov. 20). Using Functional Behavioral Assessments to Create Supportive Learning Environments.
                  {" "}
                  <a className="text-emerald-700 underline" href="https://sites.ed.gov/idea/files/Functional-Behavioral-Assessments-11-19-2024.pdf" target="_blank" rel="noopener noreferrer">PDF</a>
                </li>
                <li id="ref-dcl-2025">
                  U.S. Department of Education. (2025, Jan. 16). Dear Colleague Letter on Inclusive Educational Practices.
                  {" "}
                  <a className="text-emerald-700 underline" href="https://www.ed.gov/media/document/dear-colleague-letter-inclusive-educational-practices-january-16-2025-109435.pdf" target="_blank" rel="noopener noreferrer">PDF</a>
                </li>
                <li id="ref-wwc">
                  U.S. Department of Education, Institute of Education Sciences (WWC). (2024). Teacher-Delivered Behavioral Interventions in Grades K–5: Practice Guide.
                  {" "}
                  <a className="text-emerald-700 underline" href="https://ies.ed.gov/ncee/wwc/docs/practiceguide/behavioral-interventions-practice-guide_v3a_508a.pdf" target="_blank" rel="noopener noreferrer">PDF</a>
                </li>
                <li id="ref-idea">
                  U.S. Department of Education, Office of Special Education and Rehabilitative Services. (n.d.). IDEA Regulations—34 C.F.R. § 300.320.
                  {" "}
                  <a className="text-emerald-700 underline" href="https://www.ecfr.gov/current/title-34/subtitle-B/chapter-III/part-300/subpart-D/section-300.320" target="_blank" rel="noopener noreferrer">Link</a>
                </li>
                <li>
                  (Optional state example) Maryland State Department of Education. (2024). Progress Monitoring &amp; Data Collection Training.
                  {" "}
                  <a className="text-emerald-700 underline" href="https://marylandpublicschools.org/programs/Documents/Special-Ed/Training/Progress-Monitoring-and-Data-Collection-PL-Materials-A.pdf" target="_blank" rel="noopener noreferrer">PDF</a>
                </li>
              </ol>
            </div>

          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* On this page (TOC with active highlighting) */}
              <OnThisPageTOC
                items={[
                  { id: "role-expectations", label: "Role expectations" },
                  { id: "portfolio-artifacts", label: "Portfolio artifacts" },
                  { id: "systems-impact", label: "Systems-level impact" },
                  { id: "interview-questions", label: "Interview questions" },
                  { id: "resume-keywords", label: "Resume keywords" },
                  { id: "practical-prep", label: "Practical prep" },
                  { id: "advanced-talking-point", label: "Advanced talking point" },
                  { id: "references", label: "References" },
                ]}
              />
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Tools for Candidates</h3>
                <ul className="space-y-3">
                  <li><Link className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center group" href="/iep-goals">
                    IEP Goal Writer <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link></li>
                  <li><Link className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center group" href="/iep-goal-qualitychecker">
                    Goal Quality Checker <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link></li>
                  <li><Link className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center group" href="/behavior-plans">
                    Behavior Plan Writer <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link></li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200">
                <h3 className="font-bold text-lg text-emerald-900 mb-4">Related Guides</h3>
                <ul className="space-y-3 text-emerald-900">
                  <li><Link className="hover:text-emerald-700 font-medium flex items-center group" href="/school-bcba/salary-by-state">
                    💰 Salary by State <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link></li>
                  <li><Link className="hover:text-emerald-700 font-medium flex items-center group" href="/school-bcba/how-to-become">
                    🎓 How to Become <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link></li>
                  <li><Link className="hover:text-emerald-700 font-medium flex items-center group" href="/school-bcba">
                    🏠 School BCBA Hub <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link></li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="font-bold text-lg mb-2">Get Interview Ready</h3>
                <p className="text-blue-100 text-sm mb-4">8-week program for school BCBAs</p>
                <Link href="/transformation-program" className="block w-full bg-white text-blue-700 hover:bg-blue-50 py-3 px-4 rounded-xl font-semibold text-center transition-colors">
                  View Training →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* HowTo Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "School BCBA Job Guide",
        description: "What districts expect, how to stand out, and the artifacts that prove systems-level impact.",
        totalTime: "PT10M",
        step: [
          { "@type": "HowToStep", name: "Assemble artifacts", text: "90-day plan, FBA→BIP, IEP goals + monitoring, coaching cycle, dashboard." },
          { "@type": "HowToStep", name: "Align to MTSS/PBIS", text: "Map supports across tiers and leadership cadence." },
          { "@type": "HowToStep", name: "Document fidelity", text: "Include integrity checklists and run-charts." },
          { "@type": "HowToStep", name: "Prep interviews", text: "Rehearse FBA→BIP translation, coaching flow, and measurable goals." }
        ]
      })}}/>

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What should a school BCBA bring to an interview?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bring a 90-day systems plan, sample BIP with function-based interventions, IEP goal examples with progress monitoring data, coaching cycle template, and a progress dashboard showing data trends."
            }
          },
          {
            "@type": "Question",
            name: "What interview questions do districts ask school BCBAs?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Common questions include: describing complex FBAs and BIPs, explaining MTSS/PBIS alignment, demonstrating teacher coaching approaches, showing measurable IEP goal examples, and presenting a 90-day implementation plan."
            }
          },
          {
            "@type": "Question",
            name: "What resume keywords matter for school BCBA roles?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Essential keywords include: MTSS, PBIS, IEP goals, progress monitoring, FBA/BIP, staff coaching, fidelity, data systems, de-escalation, classroom routines, and social validity."
            }
          }
        ]
      })}} />
    </main>
  );
}
