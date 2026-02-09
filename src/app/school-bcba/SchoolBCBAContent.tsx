"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, DollarSign, GraduationCap, FileText, Users, BookOpen, ArrowRight, School, Brain, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustBar } from "@/components/ui/trust-bar";
import { ScrollNav } from "@/components/ui/scroll-nav";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function SchoolBCBAContent() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 opacity-95"></div>
        
        <div className="relative container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold border border-white/30">
              <GraduationCap className="h-4 w-4 mr-2" />
              Complete School BCBA Resource Hub
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Everything You Need to <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Excel as a School-Based BCBA
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-emerald-50 max-w-4xl mx-auto leading-relaxed">
              From getting your first school BCBA job to mastering systems-level impact—free tools, comprehensive guides, and proven frameworks.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6 shadow-xl">
                <Link href="/iep-behavior-goals">
                  Free IEP Goals Generator
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                <Link href="/transformation-program">
                  8-Week Training Program
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <ScrollNav 
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
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Your School BCBA Career Roadmap
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about becoming and excelling as a school-based behavior analyst.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card
              icon={<FileText className="h-8 w-8 text-blue-600" />}
              title="School BCBA vs School-Based BCBA"
              desc="Understand the terminology, position your role effectively, and use language that districts actually search for."
              href="/school-bcba/vs-school-based-bcba"
              badge="Start Here"
            />
            <Card
              icon={<Briefcase className="h-8 w-8 text-emerald-600" />}
              title="School BCBA Job Guide"
              desc="Complete job search strategy: roles, interview questions, resume keywords, and portfolio artifacts."
              href="/school-bcba/job-guide"
              badge="Popular"
            />
            <Card
              icon={<DollarSign className="h-8 w-8 text-green-600" />}
              title="School BCBA Salary by State"
              desc="Comprehensive salary data by state, cost-of-living adjustments, and negotiation strategies."
              href="/school-bcba/salary-by-state"
              badge="Essential"
            />
            <Card
              icon={<GraduationCap className="h-8 w-8 text-purple-600" />}
              title="How to Become a School BCBA"
              desc="Step-by-step pathway from coursework to certification: credentials, fieldwork, and competencies."
              href="/school-bcba/how-to-become"
            />
            <Card
              icon={<BookOpen className="h-8 w-8 text-indigo-600" />}
              title="ACT Matrix for School BCBAs"
              desc="Values-based framework that complements ABA for deeper student engagement and motivation."
              href="/the-act-matrix-a-framework-for-school-based-bcbas"
            />
            <Card
              icon={<Users className="h-8 w-8 text-orange-600" />}
              title="BCBAs in Schools"
              desc="Comprehensive guide to the school BCBA role: challenges, solutions, and systems-level strategies."
              href="/bcbas-in-schools"
            />
          </div>
        </div>
      </section>

      {/* Free Tools Section */}
      <section id="free-tools" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Free School BCBA Tools
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Professional-grade tools used by school-based behavior analysts across the country.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <LMCard
              title="IEP Behavior Goals Generator"
              desc="Generate high-quality, measurable, SMART behavior goals aligned with state standards. Save hours on IEP writing."
              href="/iep-behavior-goals"
              features={["SMART goal framework", "State standards aligned", "Progress monitoring built-in"]}
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
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -ml-48 -mt-48" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Transform Your School BCBA Practice?
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join our 6-week transformation program designed specifically to help school-based behavior analysts lead with confidence.
              </p>
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white text-lg px-10 py-7 font-bold rounded-2xl shadow-xl shadow-red-900/20 transition-all transform hover:scale-105">
                <Link href="/transformation-program">
                  See the Program Details
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
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
      <div className="h-full rounded-3xl border border-slate-200 bg-white p-8 hover:border-emerald-400 hover:shadow-2xl transition-all duration-500">
        {badge && (
          <div className="absolute -top-3 right-6">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
              {badge}
            </span>
          </div>
        )}
        {icon && <div className="mb-6 w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-50 transition-all duration-500">{icon}</div>}
        <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">{title}</h3>
        <p className="text-slate-600 leading-relaxed mb-6">{desc}</p>
        <div className="flex items-center text-emerald-700 font-bold group-hover:gap-2 transition-all">
          Explore Guide <ArrowRight className="ml-1 h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}

function LMCard({ title, desc, href, features }: { title: string; desc: string; href: string; features?: string[]; }) {
  return (
    <Link href={href} className="group block h-full">
      <div className="h-full rounded-[2.5rem] border-2 border-emerald-100 bg-white p-10 hover:border-emerald-400 hover:shadow-2xl transition-all duration-500">
        <h3 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">{title}</h3>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">{desc}</p>
        {features && (
          <ul className="space-y-3 mb-10">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-slate-700 font-medium">
                <div className="bg-emerald-100 p-1 rounded-full mr-3">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        )}
        <div className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold group-hover:bg-emerald-700 transition-all transform group-hover:scale-105">
          Access Tool <ArrowRight className="ml-2 h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}
