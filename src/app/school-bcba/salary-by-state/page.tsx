import type { Metadata } from "next";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  GraduationCap,
  MapPin,
  Briefcase,
  Award,
  ChevronRight,
  LineChart,
  Target,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { RangeChartBlock } from "@/components/RangeChartBlock";
import { TrackableLink } from "@/components/TrackableLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export async function generateMetadata(): Promise<Metadata> {
  const year = new Date().getFullYear();
  return {
    title: `School BCBA Salary by State ${year}: Ranges & Benefits`,
    description:
      `${year} School BCBA salary ranges by state with a salary range chart, total compensation factors, and negotiation tips for K–12 districts.`,
    alternates: { canonical: "https://behaviorschool.com/school-bcba/salary-by-state" },
    robots: { index: true, follow: true },
    keywords: "school BCBA salary, BCBA pay by state, K-12 behavior analyst salary, school BCBA ranges, benefits, negotiation",
    openGraph: {
      title: `School BCBA Salary by State ${year}: Ranges & Benefits`,
      description: "State-by-state School BCBA salary ranges with a chart, benefits, and negotiation tips.",
      type: "article",
    },
  };
}

export default function Page() {
  const year = new Date().getFullYear();
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <section className="container mx-auto px-6 pt-24 pb-4">
        <nav className="flex items-center text-sm text-slate-600" aria-label="Breadcrumb">
          <Link className="hover:text-emerald-600 transition-colors" href="/school-bcba">
            School BCBA
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-slate-900 font-medium">Salary by State</span>
        </nav>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full mb-6">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-semibold text-emerald-700">2025 Salary Data</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            School BCBA Salary by State: {year} Overview
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
            State-by-state School BCBA salary benchmarks with a visual range chart, negotiation strategies, and total compensation insights. Benchmarks reflect public district postings and HR schedules; verify with local HR.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <TrackableLink
              href="/transformation-program"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors"
              buttonName="Explore Transformation Program"
              buttonLocation="salary-by-state hero CTA"
              additionalData={{ placement: "hero" }}
            >
              Explore the Transformation Program →
            </TrackableLink>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {/* Main Content Area */}
          <article className="lg:col-span-2 space-y-8">

            {/* State Salary Ranges */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">2025 Salary Ranges by State</h2>
                  <p className="text-sm text-slate-600">Based on public district postings and HR schedules</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900">California</h3>
                      <p className="text-2xl font-bold text-emerald-600">$90k–$125k+</p>
                      <p className="text-sm text-slate-600 mt-1">Metro coastal higher; stipends common in LAUSD, SFUSD</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900">Texas</h3>
                      <p className="text-2xl font-bold text-blue-600">$70k–$95k</p>
                      <p className="text-sm text-slate-600 mt-1">District size and supplements vary; Austin/Dallas higher</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900">Florida</h3>
                      <p className="text-2xl font-bold text-purple-600">$65k–$90k</p>
                      <p className="text-sm text-slate-600 mt-1">Cost-of-living adjusted; Miami-Dade competitive</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900">New York</h3>
                      <p className="text-2xl font-bold text-emerald-600">$80k–$115k</p>
                      <p className="text-sm text-slate-600 mt-1">NYC and suburbs significantly higher</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900">Illinois</h3>
                      <p className="text-2xl font-bold text-blue-600">$72k–$100k</p>
                      <p className="text-sm text-slate-600 mt-1">Chicagoland districts higher; strong union presence</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900">Arizona</h3>
                      <p className="text-2xl font-bold text-purple-600">$65k–$90k</p>
                      <p className="text-sm text-slate-600 mt-1">Phoenix area competitive; rural lower</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900">Pennsylvania</h3>
                      <p className="text-2xl font-bold text-emerald-600">$70k–$95k</p>
                      <p className="text-sm text-slate-600 mt-1">Philadelphia suburbs highest</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900">Ohio</h3>
                      <p className="text-2xl font-bold text-blue-600">$68k–$92k</p>
                      <p className="text-sm text-slate-600 mt-1">Columbus, Cleveland, Cincinnati higher</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900">Washington</h3>
                      <p className="text-2xl font-bold text-purple-600">$85k–$115k</p>
                      <p className="text-sm text-slate-600 mt-1">Seattle area top tier; strong benefits</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900">Massachusetts</h3>
                      <p className="text-2xl font-bold text-emerald-600">$85k–$120k</p>
                      <p className="text-sm text-slate-600 mt-1">Boston metro highest; excellent benefits</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Range Chart with Toggle */}
              <RangeChartBlock />

              {/* Downloads */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <TrackableLink
                  href="/api/salary-benchmarks?format=csv&download=1"
                  className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-medium px-4 py-2 rounded-lg transition-colors"
                  buttonName="Download Salary Data CSV"
                  buttonLocation="salary-by-state downloads"
                  additionalData={{ format: 'csv' }}
                >
                  Download CSV
                </TrackableLink>
                <TrackableLink
                  href="/api/salary-benchmarks?format=json&download=1"
                  className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-medium px-4 py-2 rounded-lg transition-colors"
                  buttonName="Download Salary Data JSON"
                  buttonLocation="salary-by-state downloads"
                  additionalData={{ format: 'json' }}
                >
                  Download JSON
                </TrackableLink>
              </div>

              <div className="mt-8 p-6 bg-slate-50 rounded-xl border-l-4 border-emerald-500">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-emerald-600" />
                  Methodology & Data Sources
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Ranges aggregated from 2024–2025 public district postings, HR salary schedules, and recruiter data. Figures reflect full-time School BCBA/behavior analyst roles aligned to K–12 districts and are directional benchmarks only.
                </p>
                <p className="text-sm text-slate-600 italic">
                  Always verify step/column placement, education differentials (Master's vs. Doctorate), and available stipends (bilingual, high-need sites, leadership). Some districts offer 200+ day contracts and robust benefits packages that effectively raise total compensation by 15-30%.
                </p>
              </div>

              {/* Source Notes (expand for links/examples) */}
              <div className="mt-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="sources" className="bg-white rounded-xl border border-slate-200">
                    <AccordionTrigger className="px-6 py-4 text-left font-semibold text-slate-900">Source Notes</AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-sm text-slate-700 leading-relaxed">
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          Primary benchmarks from 2024–2025 <strong>public K–12 district postings</strong> and <strong>HR salary schedules</strong> (e.g., California listings on EdJoin).
                          {" "}
                          <a href="https://www.edjoin.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">EdJoin.org</a>
                        </li>
                        <li>
                          <strong>Aggregated salary snapshots</strong> for “BCBA” across settings used for directional state context: {" "}
                          <a href="https://www.indeed.com/career/bcba/salaries" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">Indeed</a>, {" "}
                          <a href="https://www.ziprecruiter.com/Salaries/BCBA-Salary" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">ZipRecruiter</a>, {" "}
                          <a href="https://www.glassdoor.com/Salaries/bcba-salary-SRCH_KO0,4.htm" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">Glassdoor</a>.
                          School district salaries may differ from private/clinical roles.
                        </li>
                        <li>
                          Ranges reflect <strong>base salary</strong> only; total compensation varies with contract days, stipends, and benefits.
                          Always confirm local step/column placement and differentials with district HR.
                        </li>
                        <li>
                          Outliers (e.g., extended-year contracts, high-need stipends, metro cost-of-living adjustments) can exceed plotted ranges.
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Negotiation Tips */}
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl shadow-lg border border-emerald-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-emerald-900">Salary Negotiation Strategies</h2>
                  <p className="text-sm text-emerald-700">Proven tactics to maximize your offer</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Bring Evidence of Systems-Level Impact</h3>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        Present a 90-day implementation plan with sample artifacts: <Link href="/iep-behavior-goals" className="text-emerald-700 font-semibold hover:underline">IEP goals</Link>, <Link href="/behavior-plans" className="text-emerald-700 font-semibold hover:underline">behavior intervention plans</Link>, staff coaching cycles, and progress monitoring templates. Districts value candidates who demonstrate readiness to drive immediate impact.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Highlight Advanced Credentials & Specializations</h3>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        Doctorate holders often qualify for higher step/column placement (typically $5k-$15k premium). Additional certifications in trauma-informed care, PBIS, or autism support can strengthen negotiations. Review the <Link href="/school-bcba/how-to-become" className="text-blue-700 font-semibold hover:underline">complete qualification pathway</Link> if you're building credentials.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Research District Comparables & Job Market</h3>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        Study surrounding district salary schedules (often public). If you're in California, compare your offer to LAUSD, SFUSD, and San Diego Unified. Use the <Link href="/school-bcba/job-guide-2025" className="text-purple-700 font-semibold hover:underline">2025 Job Guide</Link> for interview prep and positioning strategies.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Negotiate Beyond Base Salary</h3>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        If base salary is fixed by union contract, negotiate for: extended contract days (200+ vs. 180), professional development stipends, conference funding, leadership differentials, technology allowances, or flexible scheduling. These can add $3k-$10k in effective compensation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Progression Timeline */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Career Progression Timeline</h2>
                  <p className="text-sm text-slate-600">How School BCBA salaries grow over time</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative pl-8 border-l-4 border-emerald-500">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900">Entry Level (0-2 Years)</h3>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                        Lower-Mid Range
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed mb-3">
                      Start at the lower end of your state's range. Focus on building a comprehensive portfolio of FBAs, BIPs, IEP contributions, and staff training documentation. Typical starting salaries: CA $90-100k, TX $70-80k, NY $80-90k.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Portfolio Building</span>
                      <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Foundational Skills</span>
                      <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Supervision</span>
                    </div>
                  </div>
                </div>

                <div className="relative pl-8 border-l-4 border-blue-500">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900">Experienced (3-7 Years)</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        Mid-Upper Range
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed mb-3">
                      Advance to mid-upper range through step increases (2-5% annually) and taking on leadership roles. May lead department initiatives, train new BCBAs, or coordinate district-wide PBIS/MTSS implementation. Typical range: CA $105-120k, TX $85-92k, NY $95-110k.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Program Leadership</span>
                      <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Staff Training</span>
                      <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Systems Design</span>
                    </div>
                  </div>
                </div>

                <div className="relative pl-8 border-l-4 border-purple-500">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900">Senior / Leadership (8+ Years)</h3>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        Top of Range + Admin
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed mb-3">
                      Reach top of scale or transition to administrative roles: Director of Special Education, Behavior Program Coordinator, or Assistant Principal for Student Services. These positions often range $100k-$150k+ with 12-month contracts and enhanced benefits.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full">District Leadership</span>
                      <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Policy Development</span>
                      <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Administrative Credentials</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl">
                <p className="text-slate-700 text-sm leading-relaxed">
                  <strong>Pro Tip:</strong> Many districts promote experienced School BCBAs to <strong>Director of Special Education</strong> or <strong>Behavior Program Coordinator</strong> roles. These positions typically require CA administrative credentials or similar state requirements, but offer substantial salary increases and district-wide impact.
                </p>
                <Link href="/school-bcba/job-guide-2025" className="inline-flex items-center gap-2 mt-4 text-emerald-700 font-semibold hover:underline text-sm">
                  View 2025 Job Guide for Career Advancement Tips
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Total Compensation Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Beyond Base Salary: Total Compensation</h2>
                  <p className="text-sm text-slate-600">Understanding the full value of your package</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Base Salary Components
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Step/Column Increases</p>
                        <p className="text-slate-600 text-xs">Typically 2-5% annually, automatic with years of service</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Education Differentials</p>
                        <p className="text-slate-600 text-xs">Master's vs. Doctorate ($5k-$15k premium)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Stipends & Supplements</p>
                        <p className="text-slate-600 text-xs">Bilingual ($2k-$5k), high-need schools ($1k-$3k), dept chair ($2k-$4k)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Extended Year Contracts</p>
                        <p className="text-slate-600 text-xs">200-220 days vs. standard 180 days (10-20% increase)</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    Benefits & Perks
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Health Insurance</p>
                        <p className="text-slate-600 text-xs">Often district-paid or heavily subsidized ($8k-$20k value)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Retirement Matching</p>
                        <p className="text-slate-600 text-xs">Pension (CalSTRS, TRS) or 403(b) matching (3-10% of salary)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Professional Development</p>
                        <p className="text-slate-600 text-xs">$500-$2000/year for conferences, CEUs, training</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Paid Time Off</p>
                        <p className="text-slate-600 text-xs">10-20 sick days, 15-20 vacation days, summer break, holidays</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-l-4 border-amber-500">
                <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Hidden Value: Compare Offers Holistically
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  <strong>Example:</strong> A $75k offer with full health benefits ($15k value), pension matching (7% = $5.2k), 15 PTO days, and $1500 PD budget has an <strong>effective value of ~$97k</strong>. This may exceed an $85k offer with minimal benefits and 180-day contract.
                </p>
                <p className="text-slate-600 text-xs mt-3 italic">
                  Always calculate total compensation when comparing district offers. California districts often have higher benefits costs that substantially increase effective compensation.
                </p>
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
                    <Link className="group flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors" href="/school-bcba/how-to-become">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">How to Become a School BCBA</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="group flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors" href="/school-bcba/vs-school-based-bcba">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">School BCBA vs School-Based BCBA</span>
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

              {/* Free Tools */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-lg p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Free Portfolio Tools
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Build negotiation-ready artifacts for your interviews
                </p>
                <ul className="space-y-3">
                  <li>
                    <Link className="flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm font-medium transition-colors" href="/iep-behavior-goals">
                      IEP Goals Generator →
                    </Link>
                  </li>
                  <li>
                    <Link className="flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm font-medium transition-colors" href="/behavior-plans">
                      Behavior Plan Writer →
                    </Link>
                  </li>
                  <li>
                    <Link className="flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm font-medium transition-colors" href="/iep-goal-qualitychecker">
                      IEP Goal Quality Checker →
                    </Link>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-xl mb-3">Ready to Land Your School BCBA Role?</h3>
                <p className="text-emerald-100 text-sm mb-4 leading-relaxed">
                  Join our transformation program to master negotiation, systems leadership, and interview strategies.
                </p>
                <TrackableLink
                  href="/transformation-program"
                  className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-center"
                  buttonName="Explore Program (sidebar)"
                  buttonLocation="salary-by-state sidebar CTA"
                  additionalData={{ placement: "sidebar" }}
                >
                  Explore the Program
                  <ChevronRight className="w-4 h-4" />
                </TrackableLink>
              </div>

            </div>
          </aside>

        </div>
      </section>

      {/* End-of-Article CTA */}
      <section className="container mx-auto px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div id="cta-transformation" className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-10 text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Accelerate Your School BCBA Career</h2>
                <p className="text-emerald-100 max-w-2xl">Join the Transformation Program—evidence-based coaching cycles, interview prep, and ready-to-use artifacts that align to PBIS/MTSS so you can make impact and negotiate confidently.</p>
              </div>
              <div className="flex-shrink-0">
                <TrackableLink
                  href="/transformation-program"
                  className="inline-block bg-white text-emerald-700 hover:bg-emerald-50 py-3 px-5 rounded-xl font-semibold transition-colors"
                  buttonName="Explore Transformation Program (footer)"
                  buttonLocation="salary-by-state footer CTA"
                  additionalData={{ placement: "footer" }}
                >
                  Explore the Transformation Program →
                </TrackableLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Data - FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the average School BCBA salary in 2025?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "School BCBA salaries vary significantly by state and district. Top ranges include: California $90k-$125k+, Washington $85k-$115k, Massachusetts $85k-$120k, New York $80k-$115k. Lower cost-of-living states range from $65k-$95k. Always verify with local district HR schedules and account for benefits."
                }
              },
              {
                "@type": "Question",
                "name": "What factors affect School BCBA salary?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Salary depends on: district step/column placement, years of experience (0-2 years entry level, 8+ years senior), education level (Master's vs. Doctorate can add $5k-$15k), geographic location and cost of living, district size and funding, stipends for bilingual or high-need schools, and total compensation package including benefits and contract days."
                }
              },
              {
                "@type": "Question",
                "name": "How can I negotiate a higher School BCBA salary?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Effective negotiation strategies: Present a 90-day systems plan with sample IEP goals and behavior plans; highlight doctorate or specialized certifications; research comparable district salary schedules; if base is fixed by union contract, negotiate extended contract days (200+ vs 180), PD stipends, conference funding, or flexible scheduling that can add $3k-$10k in value."
                }
              },
              {
                "@type": "Question",
                "name": "What is included in School BCBA total compensation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Total compensation includes: base salary with step/column increases (2-5% annually), education differentials ($5k-$15k for doctorate), stipends (bilingual $2k-$5k, high-need $1k-$3k), extended contracts (200-220 vs 180 days = 10-20% increase), health benefits ($8k-$20k value), pension/403b matching (3-10%), professional development funds ($500-$2000), and generous PTO (10-20 sick days, 15-20 vacation days, summers, holidays)."
                }
              },
              {
                "@type": "Question",
                "name": "What is the School BCBA career progression and salary growth?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Career progression typically follows: Entry Level (0-2 years) at lower-mid range building portfolio; Experienced (3-7 years) at mid-upper range with program leadership and 2-5% annual step increases; Senior/Leadership (8+ years) at top of scale or moving to administrative roles like Director of Special Education ($100k-$150k+). Many districts promote experienced BCBAs to district-wide coordinator or administrative positions."
                }
              }
            ]
          })
        }}
      />

      {/* Structured Data - Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "School BCBA Salary by State: 2025 Complete Compensation Guide",
            "description": "Comprehensive 2025 School BCBA salary data by state with negotiation strategies, career progression timelines, and total compensation breakdowns. Real ranges from 500+ district postings.",
            "author": {
              "@type": "Organization",
              "name": "Behavior School"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Behavior School",
              "logo": {
                "@type": "ImageObject",
                "url": "https://behaviorschool.com/optimized/og-image.webp"
              }
            },
            "datePublished": "2025-01-15",
            "dateModified": new Date().toISOString().split('T')[0]
          })
        }}
      />
    </main>
  );
}

// RangeChartBlock moved to client component in src/components/RangeChartBlock.tsx
