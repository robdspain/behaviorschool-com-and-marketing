"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Users,
  Shield,
  CheckCircle,
  ClipboardList,
  Target,
  BookOpen,
  Brain,
  BarChart3,
  FileCheck,
  MessageSquare,
  Clock,
  Layers,
  GraduationCap,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ShimmerButton from "@/components/magicui/shimmer-button";

const PAIN_POINTS = [
  {
    icon: Clock,
    title: "Drowning in paperwork",
    description:
      "FBAs, BIPs, IEP goals, progress reports. The documentation never stops. Most school BCBAs spend more time writing than working with students.",
  },
  {
    icon: Layers,
    title: "Fragmented tools",
    description:
      "Word docs for BIPs. Spreadsheets for data. A different app for CEUs. Another for supervision logs. None of it talks to each other.",
  },
  {
    icon: Users,
    title: "No peer support",
    description:
      "School BCBAs are often the only one in the building. There is no one to consult, no one who understands the pace, and no community built for this role.",
  },
];

const TOOLS = [
  {
    title: "FBA Builder",
    description:
      "Structure your functional behavior assessment with guided prompts, hypothesis development, and a complete report draft — ready for your clinical review.",
    icon: Brain,
    href: "https://plan.behaviorschool.com/register",
  },
  {
    title: "BIP Generator",
    description:
      "Build a complete Behavior Intervention Plan from your FBA. Section-by-section guidance, IDEA-aligned language, and PDF export.",
    icon: ClipboardList,
    href: "https://plan.behaviorschool.com/register",
  },
  {
    title: "IEP Goal Writer",
    description:
      "Generate measurable, SMART behavior goals aligned to IEP meeting timelines. Pull from a goal bank or build from scratch.",
    icon: Target,
    href: "https://plan.behaviorschool.com/register",
  },
  {
    title: "ABC Data",
    description:
      "Log antecedent-behavior-consequence data directly in the platform. View patterns, export for reports, and link data to BIP targets.",
    icon: BarChart3,
    href: "https://plan.behaviorschool.com/register",
  },
  {
    title: "CEU Tracker",
    description:
      "Track your continuing education credits against BACB renewal requirements. Get reminders before your cycle deadline.",
    icon: GraduationCap,
    href: "https://plan.behaviorschool.com/register",
  },
  {
    title: "Supervision Hours",
    description:
      "Log individual and group supervision hours in a BACB-aligned format. Generate structured supervision logs for your supervisees.",
    icon: FileCheck,
    href: "https://plan.behaviorschool.com/register",
  },
];

const TRUST_ITEMS = [
  { icon: Shield, label: "FERPA Compliant", sub: "Student data never stored" },
  { icon: CheckCircle, label: "Evidence-Based", sub: "Grounded in ABA research" },
  { icon: BookOpen, label: "Built by BCBAs", sub: "For school-based practice" },
  { icon: Users, label: "School-Ready", sub: "District and IEP aligned" },
];

const STUDY_FEATURES = [
  { icon: Brain, label: "Adaptive Practice", description: "Questions that adapt to your weak areas so you study smarter, not longer." },
  { icon: BarChart3, label: "Performance Analytics", description: "See exactly where you stand across all BCBA task list domains." },
  { icon: CheckCircle, label: "500+ Vetted Questions", description: "Written and reviewed by practicing BCBAs." },
];

const SUPERVISE_FEATURES = [
  { icon: FileCheck, label: "BACB-Aligned Tracking", description: "Log and track supervised hours with tools built around BACB requirements." },
  { icon: ClipboardList, label: "Supervision Logs", description: "Structured documentation templates for individual and group supervision." },
  { icon: Users, label: "Supervisee Resources", description: "Materials to support your supervisees through the credentialing process." },
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
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-white"
          >
            The Complete Platform for{" "}
            <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
              School-Based Behavior Analysts
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-emerald-100 mb-10 leading-relaxed"
          >
            FBA, BIP, IEP goals, data collection, CEU tracking, and supervision logs — built for school BCBAs who spend too much time on documentation and not enough time with students.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="https://plan.behaviorschool.com/register">
              <ShimmerButton
                className="h-14 px-10 text-lg font-bold rounded-xl w-full sm:w-auto"
                background="linear-gradient(135deg, #E3B23C 0%, #d4a12d 100%)"
                shimmerColor="#f0c040"
              >
                <span className="text-emerald-900">Start Free</span>
                <ArrowRight className="ml-2 h-5 w-5 text-emerald-900" />
              </ShimmerButton>
            </a>
            <a href="#tools">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg font-bold border-2 border-[#e4b63d]/60 text-[#e4b63d] hover:bg-[#e4b63d]/10 rounded-xl w-full sm:w-auto"
                >
                  See the tools
                </Button>
              </motion.div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── PAIN POINTS ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                You became a BCBA to help students — not to manage paperwork
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto">
                School-based behavior analysts face a specific set of problems. BehaviorSchool was built to solve them.
              </p>
            </div>
          </FadeInSection>

          <div className="grid sm:grid-cols-3 gap-8">
            {PAIN_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <FadeInSection key={point.title} delay={i * 0.1}>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 h-full">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-emerald-700" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{point.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{point.description}</p>
                  </div>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TOOLS SHOWCASE ────────────────────────────────────────────── */}
      <section id="tools" className="py-16 sm:py-20 bg-gradient-to-br from-emerald-50 to-teal-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Every tool a school BCBA actually needs
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Built around the real workflow of school-based practice — from the first FBA to annual IEP review.
              </p>
            </div>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <FadeInSection key={tool.title} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-6 h-full transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-emerald-700" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{tool.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{tool.description}</p>
                  </motion.div>
                </FadeInSection>
              );
            })}
          </div>

          <FadeInSection delay={0.4}>
            <div className="text-center mt-10">
              <a href="https://plan.behaviorschool.com/register">
                <ShimmerButton
                  className="h-12 px-8 text-base font-bold rounded-xl"
                  background="linear-gradient(135deg, #1f4d3f 0%, #2d6b55 100%)"
                  shimmerColor="#e4b63d"
                >
                  <span className="text-white">Start Free — No credit card required</span>
                  <ArrowRight className="ml-2 h-5 w-5 text-white" />
                </ShimmerButton>
              </a>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ─── TRUST BAR ─────────────────────────────────────────────────── */}
      <section className="py-10 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((item) => (
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
        </div>
      </section>

      {/* ─── SOCIAL PROOF ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                What school BCBAs are saying
              </h2>
              <p className="text-slate-500">Reviews from verified practitioners</p>
            </div>
          </FadeInSection>

          <div className="grid sm:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full flex flex-col items-center justify-center min-h-[180px]">
                  <MessageSquare className="h-8 w-8 text-slate-300 mb-3" />
                  <p className="text-slate-400 text-sm text-center italic">
                    Be the first to share your experience
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STUDY SECTION ─────────────────────────────────────────────── */}
      <section id="study" className="py-16 sm:py-20 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInSection>
              <div className="space-y-6">
                <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">BCBA Exam Prep</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  Exam prep built around how BCBAs actually learn
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Adaptive practice tests that identify your weak spots, analytics that show exactly what to study next, and 500+ vetted questions written by practicing BCBAs.
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
                  <a href="https://study.behaviorschool.com" target="_blank" rel="noopener noreferrer">
                    <ShimmerButton
                      className="h-12 px-6 text-base font-bold rounded-xl w-full sm:w-auto"
                      background="linear-gradient(135deg, #1f4d3f 0%, #2d6b55 100%)"
                      shimmerColor="#e4b63d"
                    >
                      <span className="text-white">Start Free Mock Exam</span>
                      <ArrowRight className="ml-2 h-5 w-5 text-white" />
                    </ShimmerButton>
                  </a>
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

      {/* ─── SUPERVISE SECTION ─────────────────────────────────────────── */}
      <section id="supervise" className="py-16 sm:py-20 bg-gradient-to-br from-emerald-50 to-teal-50 scroll-mt-16">
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
                    { supervisee: "Alex T., RBT Trainee", type: "Group", hours: "1.0 hr", topic: "Data collection and graphing", date: "Tue, Feb 25" },
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
                <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">For BCBAs</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  Supervision tools built for the real world
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Supervision is one of the most important — and most under-supported — parts of being a BCBA. These tools make the administrative side manageable so you can focus on developing your supervisees.
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

                <a href="https://supervision.behaviorschool.com">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block mt-2">
                    <Button
                      size="lg"
                      className="h-12 px-8 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                    >
                      Explore Supervision Tools
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </a>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInSection>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              Spend less time on paperwork. Spend more time with students.
            </h2>
            <p className="text-emerald-100 text-lg mb-10 leading-relaxed">
              Start free. No credit card required. Access the FBA Builder, BIP Generator, and IEP Goal Writer today.
            </p>
            <a href="https://plan.behaviorschool.com/register">
              <ShimmerButton
                className="h-14 px-10 text-lg font-bold rounded-xl"
                background="linear-gradient(135deg, #E3B23C 0%, #d4a12d 100%)"
                shimmerColor="#f0c040"
              >
                <span className="text-emerald-900">Start Free</span>
                <ArrowRight className="ml-2 h-5 w-5 text-emerald-900" />
              </ShimmerButton>
            </a>
          </FadeInSection>
        </div>
      </section>

      {/* ─── COMMUNITY ─────────────────────────────────────────────────── */}
      <section id="community" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <FadeInSection>
              <div className="space-y-6 lg:space-y-8">
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Join the Network</p>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                    A community built for school-based practice
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-slate-700">
                    Connect with other school BCBAs, share resources, and get support from people who understand the specific challenges of school-based behavior work.
                  </p>
                </div>
                <div className="pt-2">
                  <a href="https://community.behaviorschool.com">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                      <Button
                        size="lg"
                        className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl w-full sm:w-auto min-w-[200px]"
                      >
                        Join the Community
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </a>
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
                    alt="School BCBA community"
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
          Behavior School is the complete platform for school-based BCBAs and behavior analysts. We provide FBA builders, BIP generators, IEP goal writers, ABC data collection, CEU tracking, supervision hour logging, BCBA exam prep, and a peer community — all built for school-based practice.
        </p>
      </div>
    </div>
  );
}
