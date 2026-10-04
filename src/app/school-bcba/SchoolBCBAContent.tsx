"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, DollarSign, GraduationCap, FileText, Users, BookOpen, ArrowRight, School, Brain, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustBar } from "@/components/ui/trust-bar";
import { ScrollNav } from "@/components/ui/scroll-nav";
import { Hero } from "@/components/ui/hero";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function SchoolBCBAContent() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero
        eyebrow="Complete School BCBA Resource Hub"
        title="Everything You Need to"
        highlight="Excel as a School BCBA"
        subtitle="From getting your first school BCBA job to mastering systems-level impact: free tools, comprehensive guides, and proven frameworks."
        primaryCta={{ href: "/iep-goals", label: "Free IEP Goals Generator" }}
        variant="brand"
      />

      <ScrollNav
        className="border-[#d9cdb8]"
        linkClassName="inline-flex min-h-11 items-center"
        activeLinkClassName="text-[#1f4d3f] bg-[#e8efe9]"
        inactiveLinkClassName="text-[#365548] hover:text-[#171f1d] hover:bg-[#f4efe5]"
        progressClassName="bg-[#1f4d3f]"
        items={[
          { id: "career-roadmap", label: "Career Roadmap" },
          { id: "free-tools", label: "Free Tools" },
          { id: "transformation", label: "Transformation" }
        ]}
      />

      <TrustBar
        stats={[
          { icon: School, label: "School-Focused", subLabel: "Specifically for Education" },
          { icon: Brain, label: "Evidence-Based", subLabel: "Science-Driven Practice" },
          { icon: Users, label: "Community", subLabel: "Network of Professionals" },
          { icon: Download, label: "Practical Tools", subLabel: "Classroom-Ready Resources" },
        ]}
      />

      {/* Career Roadmap */}
      <section id="career-roadmap" className="py-24 scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#171f1d] mb-6">
              Your School BCBA Career Roadmap
            </h2>
            <p className="text-xl text-[#365548] max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about becoming and excelling as a school BCBA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card
              icon={<FileText className="h-8 w-8 text-[#1f4d3f]" />}
              title="Compare role terminology"
              desc="See how School BCBA and the longer job-title wording differ in job searches, profiles, and training materials, without changing the role itself."
              href="/school-bcba/vs-school-based-bcba"
              badge="Start Here"
            />
            <Card
              icon={<Briefcase className="h-8 w-8 text-[#1f4d3f]" />}
              title="School BCBA Job Guide"
              desc="Complete job search strategy: roles, interview questions, resume keywords, and portfolio artifacts."
              href="/school-bcba/job-guide"
              badge="Popular"
            />
            <Card
              icon={<FileText className="h-8 w-8 text-[#1f4d3f]" />}
              title="School BCBA Job Description"
              desc="Use this role breakdown to understand district expectations, daily responsibilities, and common school-based deliverables."
              href="/school-bcba/job-description"
            />
            <Card
              icon={<Users className="h-8 w-8 text-[#1f4d3f]" />}
              title="School BCBA Interview Questions"
              desc="Prepare for school BCBA interviews with sample questions, answer themes, and district-focused talking points."
              href="/school-bcba/interview-questions"
            />
            <Card
              icon={<DollarSign className="h-8 w-8 text-[#1f4d3f]" />}
              title="School BCBA Salary by State"
              desc="Comprehensive salary data by state, cost-of-living adjustments, and negotiation strategies."
              href="/school-bcba/salary-by-state"
              badge="Essential"
            />
            <Card
              icon={<GraduationCap className="h-8 w-8 text-[#1f4d3f]" />}
              title="How to Become a School BCBA"
              desc="Step-by-step pathway from coursework to certification: credentials, fieldwork, and competencies."
              href="/school-bcba/how-to-become"
            />
            <Card
              icon={<BookOpen className="h-8 w-8 text-[#1f4d3f]" />}
              title="ACT Matrix for School BCBAs"
              desc="Values-based framework that complements ABA for deeper student engagement and motivation."
              href="/act-matrix"
            />
            <Card
              icon={<Users className="h-8 w-8 text-[#1f4d3f]" />}
              title="BCBAs in Schools"
              desc="Comprehensive guide to the school BCBA role: challenges, solutions, and systems-level strategies."
              href="/school-bcba"
            />
          </div>
        </div>
      </section>

      {/* Free Guide CTA */}
      <section className="py-16 bg-[#1f4d3f]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-white">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                <Download className="w-4 h-4 mr-2" /> Free Guide
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                New to School Practice?
              </h2>
              <p className="text-[#f4efe5] text-lg mb-6">
                Get our complete First 90 Days survival guide: phase-by-phase roadmap, email templates, and pro tips from experienced school BCBAs.
              </p>
              <Button asChild size="lg" className="bg-white text-[#1f4d3f] hover:bg-[#f4efe5] hover:underline font-bold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#fbfaf6]">
                <Link href="/school-bcba/first-90-days">
                  Download Free Guide
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                <div className="text-6xl font-bold text-white mb-2">90</div>
                <div className="text-[#f4efe5] text-sm uppercase tracking-wide">Day Guide</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#d9cdb8] bg-[#f4efe5] p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-[#1f4d3f]">
              From Rob Spain&apos;s field notes
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[#171f1d] md:text-3xl">
              Read the school BCBA systems articles behind these tools.
            </h2>
            <p className="mt-3 max-w-3xl text-[#365548] leading-relaxed">
              BehaviorSchool gives you the tools. Robspain.com is where Rob writes about school BCBA role clarity, PBIS implementation, FBA/BIP triage, and the systems leadership model behind the School BCBA Systems Transformation Program.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <a className="inline-flex min-h-11 items-center rounded-xl border border-[#d9cdb8] bg-white p-4 font-semibold text-[#1f4d3f] hover:border-[#1f4d3f] hover:text-[#123628] hover:underline" href="https://robspain.com/bcba-in-schools/">
                BCBA in schools guide
              </a>
              <a className="inline-flex min-h-11 items-center rounded-xl border border-[#d9cdb8] bg-white p-4 font-semibold text-[#1f4d3f] hover:border-[#1f4d3f] hover:text-[#123628] hover:underline" href="https://robspain.com/blog/how-bcbas-support-pbis-without-becoming-tier-3-crisis/">
                How BCBAs support PBIS without becoming Tier 3
              </a>
              <a className="inline-flex min-h-11 items-center rounded-xl border border-[#d9cdb8] bg-white p-4 font-semibold text-[#1f4d3f] hover:border-[#1f4d3f] hover:text-[#123628] hover:underline" href="https://robspain.com/blog/school-bcba-fba-bip-requests/">
                Why FBA/BIP requests need a system
              </a>
              <a className="inline-flex min-h-11 items-center rounded-xl border border-[#d9cdb8] bg-white p-4 font-semibold text-[#1f4d3f] hover:border-[#1f4d3f] hover:text-[#123628] hover:underline" href="/transformation-program">
                School BCBA Systems Transformation Program
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Free Tools Section */}
      <section id="free-tools" className="py-24 bg-[#f4efe5] scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#171f1d] mb-6">
              Free School BCBA Tools
            </h2>
            <p className="text-xl text-[#365548] max-w-2xl mx-auto leading-relaxed">
              Professional-grade tools used by school BCBAs across the country.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <LMCard
              title="BehaviorSchool Goal Writing System"
              desc="Build an editable behavior goal draft from baseline, context, supports, and measurement decisions."
              href="/iep-goals"
              features={["Student-specific baseline", "Editable goal draft", "Measurement and objectives"]}
            />
            <LMCard
              title="Behavior Plan Writer"
              desc="Create function-based behavior intervention plans with evidence-based strategies and implementation guides."
              href="/behavior-plans"
              features={["Function-based strategies", "Data collection tools", "Implementation guides"]}
            />
          </div>
        </div>
      </section>

      {/* Transformation CTA */}
      <section id="transformation" className="py-24 scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="bg-[#1f4d3f] rounded-[3rem] p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#e4b63d]/10 rounded-full blur-3xl -ml-48 -mt-48" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Transform Your School BCBA Practice?
              </h2>
              <p className="text-xl text-[#f4efe5] mb-10 max-w-2xl mx-auto leading-relaxed">
                Join the School BCBA Systems Transformation Program: six live Thursday sessions over seven weeks (no session February 4), designed for school BCBAs.
              </p>
              <Link
                href="/transformation-program"
                className="inline-flex min-h-12 items-center justify-center rounded-[8px] bg-[#e4b63d] px-10 text-lg font-bold text-[#171f1d] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#fbfaf6]"
              >
                See the School BCBA Systems Transformation Program
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

function Card({ icon, title, desc, href, badge }: { icon?: React.ReactNode; title: string; desc: string; href: string; badge?: string; }) {
  return (
    <Link href={href} className="group block relative h-full">
      <div className="h-full rounded-3xl border border-[#d9cdb8] bg-white p-8 hover:border-[#1f4d3f] hover:shadow-2xl transition-all duration-500">
        {badge && (
          <div className="absolute -top-3 right-6">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-bold bg-[#e8efe9] text-[#1f4d3f] border border-[#d9cdb8] uppercase tracking-wider">
              {badge}
            </span>
          </div>
        )}
        {icon && <div className="mb-6 w-16 h-16 rounded-2xl bg-[#f4efe5] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#e8efe9] transition-all duration-500">{icon}</div>}
        <h3 className="text-2xl font-bold text-[#171f1d] mb-4 group-hover:text-[#123628] transition-colors">{title}</h3>
        <p className="text-[#365548] leading-relaxed mb-6">{desc}</p>
        <div className="flex items-center text-[#1f4d3f] font-bold group-hover:gap-2 transition-all">
          Explore Guide <ArrowRight className="ml-1 h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}

function LMCard({ title, desc, href, features }: { title: string; desc: string; href: string; features?: string[]; }) {
  return (
    <Link href={href} className="group block h-full">
      <div className="h-full rounded-[2.5rem] border-2 border-[#d9cdb8] bg-white p-10 hover:border-[#1f4d3f] hover:shadow-2xl transition-all duration-500">
        <h3 className="text-3xl font-bold text-[#171f1d] mb-4 group-hover:text-[#123628] transition-colors">{title}</h3>
        <p className="text-lg text-[#365548] mb-8 leading-relaxed">{desc}</p>
        {features && (
          <ul className="space-y-3 mb-10">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-[#171f1d] font-medium">
                <div className="bg-[#e8efe9] p-1 rounded-full mr-3">
                  <Check className="h-4 w-4 text-[#1f4d3f]" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        )}
        <div className="inline-flex min-h-12 items-center rounded-[8px] bg-[#1f4d3f] px-8 py-4 font-bold text-white group-hover:bg-[#123628] group-hover:underline">
          Access Tool <ArrowRight className="ml-2 h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}
