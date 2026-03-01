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
import { motion } from "framer-motion";

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

const FREE_TOOLS = [
  { title: "ABC Function Finder", desc: "Enter ABC observations, get a hypothesized behavior function with confidence scoring.", href: "/abc-function-finder" },
  { title: "ACT Matrix Builder", desc: "Build a complete ACT Matrix for any student, with grade-specific intervention strategies.", href: "/act-matrix-builder" },
  { title: "BCBA Caseload Analyzer", desc: "8-question caseload assessment with a health score and prioritized recommendations.", href: "/caseload-analyzer" },
  { title: "IEP Goal Writer", desc: "Generate three SMART behavior goals from student info and behavioral function.", href: "/iep-goal-writer" },
  { title: "RBT Hours Calculator", desc: "Calculate supervision hour progress and projected completion date.", href: "/rbt-hours" },
  { title: "ACT-FBA Builder", desc: "Full functional behavior assessment with ACT integration and treatment recommendations.", href: "/act-fba-bip" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="bg-[#1a4731] pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold leading-tight mb-4 text-white"
          >
            Write compliant FBAs and BIPs in 20 minutes.
          </motion.h1>

          <p className="text-lg text-emerald-100 mt-4 mb-3">
            Built for school BCBAs.
          </p>

          <p className="max-w-2xl mx-auto text-base text-emerald-200 mb-10 leading-relaxed">
            Stop losing hours to documentation. BehaviorSchool gives school-based BCBAs the tools to do their best clinical work — without the paperwork backlog.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/behavior-study-tools"
              className="inline-flex items-center justify-center h-12 px-8 bg-[#e4b63d] text-emerald-900 font-bold rounded-lg hover:bg-[#d4a72d] transition-colors"
            >
              Try the Free Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="https://plan.behaviorschool.com/register"
              className="inline-flex items-center justify-center h-12 px-8 border-2 border-[#e4b63d]/60 text-[#e4b63d] font-bold rounded-lg hover:bg-[#e4b63d]/10 transition-colors"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </section>

      {/* ─── FREE TOOLS ────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">No account required</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Free tools for school BCBAs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FREE_TOOLS.map((tool) => (
              <a key={tool.href} href={tool.href} className="block p-5 border border-slate-200 rounded-xl hover:border-[#1a4731] transition-colors group">
                <h3 className="font-semibold text-slate-900 group-hover:text-[#1a4731] transition-colors mb-1">{tool.title}</h3>
                <p className="text-sm text-slate-500">{tool.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PAIN POINTS ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              You became a BCBA to help students — not to manage paperwork
            </h2>
            <p className="text-base text-slate-600 max-w-xl mx-auto">
              School-based behavior analysts face a specific set of problems. BehaviorSchool was built to solve them.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {PAIN_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-emerald-700" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{point.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{point.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TOOLS SHOWCASE ────────────────────────────────────────────── */}
      <section id="tools" className="py-16 sm:py-20 bg-slate-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Every tool a school BCBA actually needs
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Built around the real workflow of school-based practice — from the first FBA to annual IEP review.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.title}
                  className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-6 h-full transition-colors duration-200"
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-emerald-700" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{tool.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{tool.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <a
              href="https://plan.behaviorschool.com/register"
              className="inline-flex items-center justify-center h-12 px-8 bg-[#1a4731] text-white font-bold rounded-lg hover:bg-[#153824] transition-colors"
            >
              Start Free — No credit card required
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
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

      {/* ─── STUDY SECTION ─────────────────────────────────────────────── */}
      <section id="study" className="py-16 sm:py-20 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">BCBA Exam Prep</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Exam prep built around how BCBAs actually learn
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
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

              <div className="pt-2">
                <a
                  href="https://study.behaviorschool.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-12 px-6 bg-[#1a4731] text-white font-bold rounded-lg hover:bg-[#153824] transition-colors"
                >
                  Start Free Mock Exam
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden">
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
          </div>
        </div>
      </section>

      {/* ─── SUPERVISE SECTION ─────────────────────────────────────────── */}
      <section id="supervise" className="py-16 sm:py-20 bg-slate-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-last lg:order-first bg-white rounded-2xl border border-slate-200 overflow-hidden">
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

            <div className="space-y-6">
              <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">For BCBAs</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Supervision tools built for the real world
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
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

              <a
                href="https://supervision.behaviorschool.com"
                className="inline-flex items-center justify-center h-12 px-8 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors mt-2"
              >
                Explore Supervision Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA / NEWSLETTER ────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-[#1a4731]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
            Spend less time on paperwork. Spend more time with students.
          </h2>
          <p className="text-emerald-100 text-base mb-10 leading-relaxed">
            Start free. No credit card required. Access the FBA Builder, BIP Generator, and IEP Goal Writer today.
          </p>
          <a
            href="https://plan.behaviorschool.com/register"
            className="inline-flex items-center justify-center h-12 px-10 bg-[#e4b63d] text-emerald-900 font-bold rounded-lg hover:bg-[#d4a72d] transition-colors"
          >
            Start Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
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
