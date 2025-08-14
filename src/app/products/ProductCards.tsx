"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function ProductCards() {
  return (
    <motion.div
      className="grid gap-8 md:grid-cols-2"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
    >
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
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-md group-hover:scale-105 transition-transform" 
                  aria-label="Behavior Study Tools icon">BS</span>
            <h2 className="text-2xl font-semibold text-slate-900">BCBA Exam Prep & Study Tools</h2>
          </div>
          <p className="mt-3 text-slate-600">
            AI-powered BCBA exam prep with adaptive practice tests, personalized study plans, and smart analytics 
            to master the certification exam with clarity and confidence.
          </p>
          <div className="mt-5 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white group-hover:bg-emerald-700 transition-colors">
            Explore BCBA Exam Prep
            <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H5a1 1 0 110-2h8.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/></svg>
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
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-400 text-white shadow-md group-hover:scale-105 transition-transform"
                  aria-label="Supervision Tools icon">SV</span>
            <h2 className="text-2xl font-semibold text-slate-900">BCBA Supervision Tools</h2>
          </div>
          <p className="mt-3 text-slate-600">
            Streamline BCBA supervision with automated documentation, RBT competency tracking, and BACB-compliant 
            workflows for meaningful, efficient supervision management.
          </p>
          <div className="mt-5 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white group-hover:bg-emerald-700 transition-colors">
            Explore Supervision Tools
            <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H5a1 1 0 110-2h8.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/></svg>
          </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}