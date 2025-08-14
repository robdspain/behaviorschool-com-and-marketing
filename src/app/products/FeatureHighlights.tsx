"use client";
import { Bolt, BarChart3, ShieldCheck, Clock, Layers, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function FeatureHighlights() {
  const features = [
    { 
      icon: Bolt, 
      title: "Quick Implementation", 
      desc: "Get started in minutes with intuitive interfaces and clear guidance designed for busy BCBAs." 
    },
    { 
      icon: BarChart3, 
      title: "Data-Driven Insights", 
      desc: "Track exam readiness, supervision progress, and competency gaps with intelligent analytics." 
    },
    { 
      icon: ShieldCheck, 
      title: "BACB Compliance Ready", 
      desc: "Defensible documentation with timestamps, signatures, and audit-ready export formats." 
    },
    { 
      icon: Clock, 
      title: "Time-Saving Automation", 
      desc: "Reduce administrative burden with automated workflows so BCBAs can focus on clinical work." 
    },
    { 
      icon: Layers, 
      title: "Scalable Solutions", 
      desc: "Works for individual BCBAs, small clinics, and large school districts with multiple sites." 
    },
    { 
      icon: BookOpen, 
      title: "Evidence-Based Design", 
      desc: "Grounded in behavior science research and field-tested by practicing school BCBAs." 
    },
  ];

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      {features.map((f) => (
        <motion.div
          key={f.title}
          className="group relative rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(0,0,0,0.35)]"
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ y: -6, scale: 1.015 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-400/5 text-emerald-700"
               aria-label={`${f.title} icon`}>
            <f.icon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
          <p className="mt-1 text-slate-600">{f.desc}</p>
          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(120% 60% at 50% 0%, rgba(16,185,129,0.10) 0%, transparent 60%)" }} />
        </motion.div>
      ))}
    </motion.div>
  );
}