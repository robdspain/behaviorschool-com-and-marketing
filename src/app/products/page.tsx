"use client";
import Link from "next/link";
import { Target, BarChart3, FileText, Users, CheckCircle, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductsPage() {
  return (
    <div className="relative overflow-hidden">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 select-none">
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
      </div>

      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">ClassroomPilot Features</h1>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
            Comprehensive special education teacher software for IEP goal tracking, progress monitoring, and data collection. Designed for special education professionals.
          </p>
        </div>

        <motion.div
          className="grid gap-8 md:grid-cols-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          {/* IEP Goal Tracking card */}
          <Link href="/features/iep-tracking" className="group rounded-2xl">
            <motion.div
              className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] transition-all duration-300"
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 text-white shadow-md group-hover:scale-105 transition-transform">
                  <Target className="h-5 w-5" />
                </span>
                <h2 className="text-2xl font-semibold text-slate-900">IEP Goal Tracking Tool</h2>
              </div>
              <p className="mt-3 text-slate-600">Streamlined IEP data collection with goal bank templates, IDEA compliance tracking, and automated progress monitoring for special education teachers.</p>
              <div className="mt-5 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white group-hover:bg-blue-700 transition-colors">
                Learn more
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H5a1 1 0 110-2h8.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/></svg>
              </div>
              </div>
            </motion.div>
          </Link>

          {/* Progress Monitoring card */}
          <Link href="/features/progress-monitoring" className="group rounded-2xl">
            <motion.div
              className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] transition-all duration-300"
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-md group-hover:scale-105 transition-transform">
                  <BarChart3 className="h-5 w-5" />
                </span>
                <h2 className="text-2xl font-semibold text-slate-900">Progress Monitoring App</h2>
              </div>
              <p className="mt-3 text-slate-600">Real-time progress monitoring with data visualization, accommodations tracking, and automated IEP progress report generation for special ed classrooms.</p>
              <div className="mt-5 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white group-hover:bg-emerald-700 transition-colors">
                Learn more
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H5a1 1 0 110-2h8.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/></svg>
              </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Features showcase */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Why Special Education Teachers Choose ClassroomPilot</h2>
          <p className="mt-3 text-slate-600 max-w-3xl mx-auto">Specialized tools for IEP data collection, special education planning, and IDEA compliance—designed for real classrooms.</p>
        </div>
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          {[
            { icon: Target, title: "IEP Data Collection", desc: "Streamlined data collection with customizable forms and automatic progress tracking for all IEP goals." },
            { icon: BarChart3, title: "Progress Monitoring", desc: "Real-time insights into student progress with visual charts and automated report generation." },
            { icon: CheckCircle, title: "IDEA Compliance", desc: "Built-in compliance checks and documentation to ensure all IEP requirements are met." },
            { icon: FileText, title: "Accommodations Tracking", desc: "Track and document all student accommodations with easy-to-use digital forms." },
            { icon: Users, title: "Parent Communication", desc: "Automated progress updates and communication tools to keep parents informed and engaged." },
            { icon: BookOpen, title: "Special Education Planning", desc: "Lesson planning tools aligned to IEP goals with assistive technology integration." },
          ].map((f) => (
            <motion.div
              key={f.title}
              className="group relative rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(0,0,0,0.35)]"
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -6, scale: 1.015 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-400/5 text-emerald-700">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1 text-slate-600">{f.desc}</p>
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(120% 60% at 50% 0%, rgba(16,185,129,0.10) 0%, transparent 60%)" }} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}


