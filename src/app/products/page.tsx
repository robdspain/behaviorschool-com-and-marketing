"use client";
import Link from "next/link";
import { Bolt, BarChart3, ShieldCheck, Clock, Layers, BookOpen } from "lucide-react";
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
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">Products</h1>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
            Explore Behavior School’s tools designed for school-based BCBAs and supervisors. Build structured systems for student success, streamline supervision, and grow with confidence.
          </p>
        </div>

        <motion.div
          className="grid gap-8 md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          {/* ClassroomPilot card - NEW */}
          <Link href="/products/classroom-pilot" className="group rounded-2xl">
            <motion.div
              className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] transition-all duration-300"
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 text-white shadow-md group-hover:scale-105 transition-transform">CP</span>
                <h2 className="text-2xl font-semibold text-slate-900">ClassroomPilot</h2>
              </div>
              <p className="mt-3 text-slate-600">IEP goal tracking & progress monitoring software for special education teachers. AI-powered data collection and IDEA compliance.</p>
              <div className="mt-5 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white group-hover:bg-emerald-700 transition-colors">
                Learn more
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H5a1 1 0 110-2h8.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/></svg>
              </div>
              </div>
            </motion.div>
          </Link>

          {/* Study card */}
          <Link href="/study" className="group rounded-2xl">
            <motion.div
              className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] transition-all duration-300"
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-md group-hover:scale-105 transition-transform">BS</span>
                <h2 className="text-2xl font-semibold text-slate-900">Behavior Study Tools</h2>
              </div>
              <p className="mt-3 text-slate-600">AI-powered prep and practice tools to master the BCBA exam with clarity and confidence.</p>
              <div className="mt-5 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white group-hover:bg-emerald-700 transition-colors">
                Learn more
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H5a1 1 0 110-2h8.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/></svg>
              </div>
              </div>
            </motion.div>
          </Link>

          {/* Supervisors card */}
          <Link href="/supervisors" className="group rounded-2xl">
            <motion.div
              className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] transition-all duration-300"
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-400 text-white shadow-md group-hover:scale-105 transition-transform">SV</span>
                <h2 className="text-2xl font-semibold text-slate-900">Supervision Tools</h2>
              </div>
              <p className="mt-3 text-slate-600">Simple, scalable workflows and resources to support meaningful, compassionate supervision.</p>
              <div className="mt-5 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white group-hover:bg-emerald-700 transition-colors">
                Learn more
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H5a1 1 0 110-2h8.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/></svg>
              </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Highlights similar to feature showcase */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Why teams choose Behavior School</h2>
          <p className="mt-3 text-slate-600 max-w-3xl mx-auto">Practical tools and workflows designed for real classrooms—fast to adopt, easy to love.</p>
        </div>
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          {[
            { icon: Bolt, title: "Fast setup", desc: "Get started in minutes with opinionated defaults and clear guidance." },
            { icon: BarChart3, title: "Actionable analytics", desc: "See mastery growth, risks, and next steps at a glance." },
            { icon: ShieldCheck, title: "Audit‑ready", desc: "Defensible documentation and signatures where it matters." },
            { icon: Clock, title: "Time‑saving", desc: "Automations reduce busywork so teams can focus on students." },
            { icon: Layers, title: "Flexible", desc: "Works across districts, programs, and caseload sizes." },
            { icon: BookOpen, title: "Evidence‑based", desc: "Grounded in behavioral science and field‑tested in schools." },
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


