"use client";

import { useState, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollNav } from "@/components/ui/scroll-nav";
import {
  ClipboardList,
  BarChart3,
  Settings,
  Users,
  GraduationCap,
  CheckCircle,
  ExternalLink,
  Clock,
  FileCheck,
  Shield,
  Star,
  PlayCircle,
  ArrowRight
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export default function SupervisorsPage() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-bs-background">

      {/* Breadcrumbs */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/products" },
            { label: "BCBA Supervision" }
          ]}
        />
      </div>

      <ScrollNav 
        items={[
          { id: "platform", label: "Progress Monitoring" },
          { id: "features", label: "Premium Features" },
          { id: "faq", label: "FAQ" }
        ]}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-700 mb-4">BCBA Supervision</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
              Supervision Hour Tracker
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              BACB-compliant supervision tracking — no ads, no clutter. Built for BCBAs and RBTs in school and clinical settings.
            </p>
          </motion.div>

          {/* Two-column cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {/* Supervisor card */}
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-8 flex flex-col gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">I am a Supervisor</p>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Track your supervisees</h2>
                <p className="text-sm text-slate-600">
                  Log hours, monitor competency progress, generate BACB verification forms, and oversee your entire caseload in one place.
                </p>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✓</span> BACB monthly &amp; final verification forms</li>
                <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✓</span> Real-time supervisee hour totals</li>
                <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✓</span> Competency tracking &amp; notes</li>
                <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✓</span> Digital signature workflow</li>
              </ul>
              <a
                href="https://supervision.behaviorschool.com"
                className="mt-auto inline-flex items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-800 transition-colors"
              >
                Create supervisor account
              </a>
            </div>

            {/* Supervisee card */}
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-8 flex flex-col gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">I am a Supervisee</p>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Log &amp; verify your hours</h2>
                <p className="text-sm text-slate-600">
                  Track your BCBA or RBT fieldwork hours, submit for supervisor review, and prepare for your exam — all in one tool.
                </p>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><span className="text-slate-500 font-bold">✓</span> Log restricted &amp; unrestricted hours</li>
                <li className="flex items-center gap-2"><span className="text-slate-500 font-bold">✓</span> BCBA &amp; RBT pathways supported</li>
                <li className="flex items-center gap-2"><span className="text-slate-500 font-bold">✓</span> Downloadable verification forms</li>
                <li className="flex items-center gap-2"><span className="text-slate-500 font-bold">✓</span> Pair with exam prep at <a href="https://study.behaviorschool.com" className="underline text-emerald-700">study.behaviorschool.com</a></li>
              </ul>
              <a
                href="https://supervision.behaviorschool.com"
                className="mt-auto inline-flex items-center justify-center rounded-xl bg-slate-800 px-6 py-3 text-sm font-bold text-white hover:bg-slate-900 transition-colors"
              >
                Start tracking my hours
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Section */}
      <section id="platform" className="py-20 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/30 relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-lg font-medium mb-8">
              <FileCheck className="w-5 h-5 mr-2" />
              Available Now
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
              Supervisee Progress Monitoring Platform
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Monitor your supervisees&#39; BCBA exam preparation and competency development with real-time analytics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.15 }}
            className="bg-white rounded-3xl p-12 md:p-16 shadow-2xl border border-emerald-100/50 backdrop-blur-sm relative"
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900">Real-Time Analytics</h3>
                    <p className="text-emerald-600 font-semibold text-lg">Comprehensive supervisee insights</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    "View detailed study analytics and progress trends",
                    "Monitor BCBA exam preparation milestones",
                    "Track competency development across Task List domains",
                    "Generate professional development reports"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href="https://study.behaviorschool.com"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 transition-all duration-300"
                  >
                    Try Progress Monitoring Free
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>

              <div className="relative">
                <motion.div
                  className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="text-xl font-bold mb-6">Supervisee Dashboard</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/15 rounded-xl backdrop-blur-sm">
                      <span className="text-emerald-100 font-medium">Study Streak</span>
                      <span className="font-bold text-xl">21 days</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/15 rounded-xl backdrop-blur-sm">
                      <span className="text-emerald-100 font-medium">Practice Accuracy</span>
                      <span className="font-bold text-xl">87%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/15 rounded-xl backdrop-blur-sm">
                      <span className="text-emerald-100 font-medium">Hours This Week</span>
                      <span className="font-bold text-xl">15.5h</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Features */}
      <section id="features" className="py-20 bg-slate-900 relative overflow-hidden scroll-mt-24">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 rounded-full text-lg font-medium mb-8 backdrop-blur-sm border border-emerald-500/30">
              <Star className="w-5 h-5 mr-2" />
              Premium Features
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
              Complete Supervision Management System
            </h2>
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto">
              Advanced tools with digital documentation, automated workflows, and comprehensive compliance tracking.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              {
                icon: ClipboardList,
                title: 'Digital Competency Matrix',
                desc: 'Interactive competency tracking with evidence attachment, progress visualization, and automated verification workflows.',
                gradient: 'from-emerald-500 to-emerald-400'
              },
              {
                icon: CheckCircle,
                title: 'Smart Hours Tracking',
                desc: 'Automated time logging with restricted/unrestricted classification, digital signatures, and BACB-compliant export formats.',
                gradient: 'from-blue-500 to-blue-400'
              },
              {
                icon: Users,
                title: 'Session Management',
                desc: 'Customizable supervision templates, goal setting frameworks, and structured feedback systems for consistent quality.',
                gradient: 'from-purple-500 to-purple-400'
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                desc: 'Comprehensive insights into supervision effectiveness, competency progression, and compliance risk indicators.',
                gradient: 'from-orange-500 to-orange-400'
              },
              {
                icon: Settings,
                title: 'Workflow Automation',
                desc: 'Intelligent reminders, document generation, and task management to eliminate administrative overhead.',
                gradient: 'from-cyan-500 to-cyan-400'
              },
              {
                icon: GraduationCap,
                title: 'Professional Development',
                desc: 'Integrated career planning, continuing education tracking, and specialization pathway guidance.',
                gradient: 'from-pink-500 to-pink-400'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-3xl p-8 shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300 group"
                variants={itemVariants}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="leading-relaxed text-lg text-slate-300">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gradient-to-br from-white to-slate-50 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 text-center mb-16">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-6">
            {[
              {
                q: "When will enhanced supervision tools be available?",
                a: "We are opening early access in waves starting early 2026. Current study platform users get priority access. Join the waitlist to secure your spot."
              },
              {
                q: "What supervision features are available right now?",
                a: "Currently, you can monitor supervisee progress through our study platform, including study analytics, practice exam scores, and competency development tracking."
              },
              {
                q: "Can I import existing hours or competency records?",
                a: "Yes. The enhanced platform will support CSV import and bulk evidence uploads for fast migration of existing supervision records."
              },
              {
                q: "Are the exported supervision records BACB audit-ready?",
                a: "Yes. All supervision documentation will include detailed timestamps, digital signatures, and compliance documentation specifically designed for BACB audits."
              }
            ].map((item, index) => (
              <AccordionItem key={index} value={`q${index + 1}`} className="bg-white rounded-2xl border-0 px-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <AccordionTrigger className="text-left hover:no-underline py-8 text-lg font-bold text-slate-900">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-8 text-slate-600 text-lg leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <div className="h-20 md:hidden"></div>
    </div>
  );
}
