"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Users,
  Shield,
  CheckCircle,
  Zap,
  ClipboardList,
  Target,
  BookOpen,
  Brain,
  GraduationCap,
  BarChart3,
  Calendar,
  FileCheck,
  Star,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ShimmerButton from "@/components/magicui/shimmer-button";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";

const PRO_TOOLS = [
  {
    title: "FBA-to-BIP Generator",
    description:
      "Upload FBA data and get a comprehensive, legally-defensible Behavior Intervention Plan in minutes.",
    icon: ClipboardList,
    href: "/fba-to-bip",
  },
  {
    title: "IEP Goal Generator",
    description:
      "AI-powered measurable IEP goals aligned to state standards. SMART, specific, and classroom-ready.",
    icon: Target,
    href: "/iep-goal-generator",
  },
  {
    title: "IEP Goal Bank",
    description:
      "Searchable library of 1,000+ pre-written behavior and academic goals. Filter by domain, grade, and need.",
    icon: BookOpen,
    href: "/iep-goal-bank",
  },
  {
    title: "ACT Module",
    description:
      "Acceptance and Commitment Training tools designed for school-based behavioral support teams.",
    icon: Brain,
    href: "/act-matrix",
  },
];

const TRUST_ITEMS = [
  { icon: Shield, label: "FERPA Compliant", sub: "Student data never stored" },
  { icon: CheckCircle, label: "Evidence-Based", sub: "Grounded in ABA research" },
  { icon: Users, label: "Built for Schools", sub: "By BCBAs, for school teams" },
  { icon: Zap, label: "AI-Powered", sub: "Save hours every week" },
];

const STUDY_FEATURES = [
  { icon: Brain, label: "Adaptive Practice", description: "Questions that adapt to your weak areas so you study smarter, not longer." },
  { icon: BarChart3, label: "Performance Analytics", description: "See exactly where you stand across all BCBA task list domains." },
  { icon: CheckCircle, label: "500+ Vetted Questions", description: "Written and reviewed by practicing BCBAs — no low-quality filler." },
];

const SUPERVISE_FEATURES = [
  { icon: FileCheck, label: "BACB-Aligned Tracking", description: "Log and track supervised hours with tools built around BACB requirements." },
  { icon: ClipboardList, label: "Supervision Logs", description: "Structured documentation templates for individual and group supervision." },
  { icon: Users, label: "Supervisee Resources", description: "Materials to support your supervisees through the credentialing process." },
];

const TRANSFORMATION_OUTCOMES = [
  "Map your caseload and stakeholder ecosystem",
  "Build a streamlined referral system that filters non-behavioral issues",
  "Strengthen buy-in with teams and identify early adopters",
  "Select the right assessment for the right context every time",
  "Create BIPs that staff can actually implement",
  "Develop a sustainable, school-wide behavior support practice",
];

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 pt-32 pb-20 sm:pt-36 sm:pb-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedGradientText className="mb-6">
              <Star className="h-4 w-4 mr-2" />
              <span className="text-emerald-900 dark:text-white font-semibold">For School-Based BCBAs</span>
            </AnimatedGradientText>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
          >
            <span className="text-white">The Operating System</span>
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent animate-gradient">
              for School-Based BCBAs
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-emerald-100 mb-10 leading-relaxed"
          >
            Tools to work faster. Courses to level up. Community to grow together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="#tools">
              <ShimmerButton
                className="h-14 px-8 text-lg font-bold rounded-xl w-full sm:w-auto"
                background="linear-gradient(135deg, #E3B23C 0%, #d4a12d 100%)"
                shimmerColor="#ffffff"
              >
                <span className="text-emerald-900">Explore Tools</span>
                <ArrowRight className="ml-2 h-5 w-5 text-emerald-900" />
              </ShimmerButton>
            </Link>
            <Link href="/free-study-plan">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg font-bold border-2 border-[#e4b63d]/60 text-[#e4b63d] hover:bg-[#e4b63d]/10 rounded-xl w-full sm:w-auto"
                >
                  Start Free Study Plan
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── WHO ARE YOU? ROUTING ──────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Who are you?</h2>
              <p className="text-slate-600">Find the right tools for where you are in your career.</p>
            </div>
          </FadeInSection>
          <div className="grid sm:grid-cols-3 gap-6">
            {/* RBT */}
            <FadeInSection delay={0.05}>
              <div className="border-2 border-emerald-700 rounded-2xl bg-white p-6 flex flex-col h-full">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Studying for the RBT Exam</h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-grow">
                  Practice questions, task list review, and mock exams designed for the Registered Behavior Technician credential.
                </p>
                <a
                  href="https://rbtstudy.behaviorschool.com"
                  className="mt-5 inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors w-fit"
                >
                  Start RBT Prep
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </FadeInSection>

            {/* BCBA */}
            <FadeInSection delay={0.1}>
              <div className="border-2 border-emerald-700 rounded-2xl bg-white p-6 flex flex-col h-full">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Studying for the BCBA Exam</h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-grow">
                  Full-length mock exams, domain-specific practice, performance analytics, and error analysis — built around the BACB Task List.
                </p>
                <a
                  href="https://study.behaviorschool.com"
                  className="mt-5 inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors w-fit"
                >
                  Start BCBA Prep
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </FadeInSection>

            {/* Licensed BCBA */}
            <FadeInSection delay={0.15}>
              <div className="border-2 border-emerald-700 rounded-2xl bg-white p-6 flex flex-col h-full">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Licensed BCBA</h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-grow">
                  Track supervision hours, manage your caseload, and access AI-powered tools designed for practicing BCBAs.
                </p>
                <a
                  href="https://supervision.behaviorschool.com"
                  className="mt-5 inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors w-fit"
                >
                  Supervision Tools
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ─── SECTION 1: TOOLS ──────────────────────────────────────────── */}
      <section id="tools" className="py-16 sm:py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                AI-Powered Tools for School Behavior Teams
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Everything school behavior teams need — built by BCBAs, compliant with FERPA, and designed for the real pace of school work.
              </p>
            </div>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRO_TOOLS.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <FadeInSection key={tool.title} delay={i * 0.1}>
                  <Link href={tool.href} className="group block h-full">
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl p-6 h-full transition-all duration-200 hover:shadow-xl"
                    >
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-emerald-700" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{tool.description}</p>
                    </motion.div>
                  </Link>
                </FadeInSection>
              );
            })}
          </div>

          {/* Trust bar inline */}
          <FadeInSection delay={0.3}>
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-slate-100 pt-10">
              {TRUST_ITEMS.map((item, i) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{item.label}</p>
                    <p className="text-slate-500 text-xs">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>

          <FadeInSection delay={0.4}>
            <div className="text-center mt-10">
              <Link href="/pro">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="h-12 px-8 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                  >
                    See All Pro Features
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ─── SECTION 2: STUDY ──────────────────────────────────────────── */}
      <section id="study" className="py-16 sm:py-20 bg-gradient-to-br from-emerald-50 to-teal-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInSection>
              <div className="space-y-6">
                <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">BCBA Exam Prep</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  BCBA Exam Prep That Actually Works
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Adaptive practice tests that identify your weak spots, smart analytics that show exactly what to study next, and 500+ vetted questions — all free.
                </p>

                <div className="space-y-4">
                  {STUDY_FEATURES.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.label} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-emerald-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{f.label}</p>
                          <p className="text-sm text-slate-600">{f.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="https://study.behaviorschool.com" target="_blank" rel="noopener noreferrer">
                    <ShimmerButton
                      className="h-12 px-6 text-base font-bold rounded-xl w-full sm:w-auto"
                      background="linear-gradient(135deg, #1f4d3f 0%, #2d6b55 100%)"
                      shimmerColor="#e4b63d"
                    >
                      <span className="text-white">Start Free Mock Exam</span>
                      <ArrowRight className="ml-2 h-5 w-5 text-white" />
                    </ShimmerButton>
                  </Link>
                  <Link href="/free-study-plan">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 px-6 text-base font-semibold border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl w-full sm:w-auto"
                    >
                      Get Free Study Plan
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
                <div className="bg-[#1f4d3f] px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">Practice Question</p>
                    <p className="text-emerald-200 text-sm">Behavior Measurement — Question 12 of 40</p>
                  </div>
                  <span className="bg-[#e4b63d]/20 text-[#e4b63d] text-xs font-semibold px-2.5 py-1 rounded-full">Adaptive</span>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-slate-800 font-medium text-sm leading-relaxed">
                    A behavior analyst records the number of times a student raises their hand during a 30-minute class period. This is an example of which measurement dimension?
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: "A. Duration", correct: false },
                      { label: "B. Latency", correct: false },
                      { label: "C. Frequency", correct: true },
                      { label: "D. Magnitude", correct: false },
                    ].map((opt) => (
                      <div
                        key={opt.label}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm ${
                          opt.correct
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold"
                            : "border-slate-200 text-slate-700"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {opt.correct && <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                    <span>Domain: Behavior Measurement</span>
                    <span className="text-emerald-600 font-semibold">Correct</span>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: SUPERVISE ──────────────────────────────────────── */}
      <section id="supervise" className="py-16 sm:py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInSection delay={0.2}>
              <div className="order-last lg:order-first bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-[#1f4d3f] px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">Supervision Log</p>
                    <p className="text-emerald-200 text-sm">Week of Feb 24, 2026</p>
                  </div>
                  <span className="bg-[#e4b63d]/20 text-[#e4b63d] text-xs font-semibold px-2.5 py-1 rounded-full">BACB Aligned</span>
                </div>
                <div className="p-6 space-y-3">
                  {[
                    { supervisee: "Jordan M., RBT Trainee", type: "Individual", hours: "1.5 hrs", topic: "Skill acquisition programming", date: "Mon, Feb 24" },
                    { supervisee: "Alex T., RBT Trainee", type: "Group", hours: "1.0 hr", topic: "Data collection & graphing", date: "Tue, Feb 25" },
                    { supervisee: "Sam R., RBT Trainee", type: "Individual", hours: "2.0 hrs", topic: "Behavior intervention plan review", date: "Thu, Feb 27" },
                  ].map((entry) => (
                    <div key={entry.supervisee} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mt-0.5">
                        <FileCheck className="h-4 w-4 text-emerald-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="font-semibold text-slate-900 text-xs truncate">{entry.supervisee}</p>
                          <span className="flex-shrink-0 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 font-medium">{entry.type}</span>
                        </div>
                        <p className="text-slate-500 text-xs">{entry.topic}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                          <span>{entry.date}</span>
                          <span className="font-semibold text-emerald-600">{entry.hours}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <span>Total hours logged: <span className="font-semibold text-slate-700">4.5 / 5.0</span> this week</span>
                    <span className="text-[#e4b63d] font-semibold">On Track</span>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="space-y-6">
                <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">For Licensed BCBAs</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  Supervision Tools Built for the Real World
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Supervision is one of the most important — and most under-supported — parts of being a BCBA. These tools make the administrative side of supervision manageable so you can focus on actually developing your supervisees.
                </p>

                <div className="space-y-3">
                  {SUPERVISE_FEATURES.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.label} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-emerald-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{f.label}</p>
                          <p className="text-sm text-slate-600">{f.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link href="/supervisors">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="h-12 px-8 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl mt-2"
                    >
                      Explore Supervision Tools
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: TRANSFORMATION ─────────────────────────────────── */}
      <section id="transformation" className="py-16 sm:py-20 relative overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <FadeInSection>
              <div className="space-y-6">
                <p className="text-sm font-semibold text-amber-300 uppercase tracking-wide">6-Week Cohort Program</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                  The School BCBA Transformation Program
                </h2>
                <p className="text-lg text-emerald-100 leading-relaxed">
                  A structured, cohort-based program that takes you from overwhelmed to operating as the go-to behavior expert in your school. Six focused weeks. Real deliverables. Permanent change.
                </p>

                <Link href="/transformation-program">
                  <ShimmerButton
                    className="h-12 px-8 text-base font-bold rounded-xl"
                    background="linear-gradient(135deg, #E3B23C 0%, #d4a12d 100%)"
                    shimmerColor="#ffffff"
                  >
                    <span className="text-emerald-900">Apply to the Program</span>
                    <ArrowRight className="ml-2 h-5 w-5 text-emerald-900" />
                  </ShimmerButton>
                </Link>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-amber-300 font-semibold text-sm">Cohort Schedule</p>
                    <p className="text-emerald-200 text-xs">Spring 2026 — 6-Week Program</p>
                  </div>
                  <span className="bg-amber-300/20 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full">6 Seats Left</span>
                </div>
                <div className="p-6 space-y-3">
                  {[
                    { week: "Week 1", label: "Map Your Caseload", date: "Mar 3", status: "upcoming" },
                    { week: "Week 2", label: "Build Your Referral System", date: "Mar 10", status: "upcoming" },
                    { week: "Week 3", label: "Stakeholder Buy-In", date: "Mar 17", status: "upcoming" },
                    { week: "Week 4", label: "Assessment Selection", date: "Mar 24", status: "upcoming" },
                    { week: "Week 5", label: "BIP Development", date: "Mar 31", status: "upcoming" },
                    { week: "Week 6", label: "Sustainable Practice", date: "Apr 7", status: "upcoming" },
                  ].map((item, i) => (
                    <div key={item.week} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-16 text-right">
                        <span className="text-[#e4b63d] text-xs font-bold">{item.week}</span>
                      </div>
                      <div className="flex-shrink-0 w-px h-8 bg-white/20" />
                      <div className="flex-1 flex items-center justify-between">
                        <p className="text-emerald-100 text-sm">{item.label}</p>
                        <span className="text-emerald-300 text-xs flex-shrink-0">{item.date}</span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                    <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-[#e4b63d] rounded-full" />
                    </div>
                    <span className="text-emerald-300 text-xs">Cohort starts Mar 3</span>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: COMMUNITY ──────────────────────────────────────── */}
      <section id="community" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <FadeInSection>
              <div className="space-y-6 lg:space-y-8">
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Join the Network</p>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                    School BCBA Community That Drives Change
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-slate-700">
                    We are not just a resource hub — we are a network of school-based BCBAs, educators, and leaders committed to building better school-wide behavior support systems.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="https://community.behaviorschool.com">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl w-full sm:w-auto min-w-[200px]"
                      >
                        Join the School BCBA Community
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="relative order-first lg:order-last">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src="/Community/comein-coffee-people-optimized.webp"
                    alt="Community collaboration"
                    className="w-full h-auto object-cover"
                    width={584}
                    height={389}
                  />
                </motion.div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      <div className="sr-only">
        <h2>About Behavior School</h2>
        <p>
          Behavior School is an online community and toolkit for school-based BCBAs, behavior analysts in schools, and education professionals. We provide BCBA exam prep, BCBA practice exams, supervision tools, IEP goal writing, and behavior intervention plan templates.
        </p>
      </div>
    </div>
  );
}
