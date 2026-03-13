'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Target, CheckCircle, Award, Shield, Zap, Calendar, FileCheck, Lightbulb, Trophy, Clock, Building2, BookOpen, ClipboardList, BarChart3, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import { ProgramApplication } from '@/components/ProgramApplication';

const STRIPE_LINK = process.env.NEXT_PUBLIC_TRANSFORMATION_STRIPE_LINK || "https://buy.stripe.com/bJe00i82o6Ss72seBw6Vq00";
const ENROLL_HREF = STRIPE_LINK;
const CALENDLY_LINK = "https://calendly.com/robspain/behavior-school-transformation-system-phone-call";
const DISTRICT_CALENDLY = "https://calendly.com/robspain/behavior-school-transformation-system-phone-call";

const weeklyModules = [
  {
    week: 1,
    title: "Assessment Architecture",
    pain: "\"I have 12 students needing FBAs and no system.\"",
    build: "A tiered assessment framework — Tier 1 screening, Tier 2 indirect, Tier 3 full FBA — so every student gets the right level of assessment without burning you out.",
    deliverable: "Your personal assessment decision tree and intake form template.",
    icon: ClipboardList,
  },
  {
    week: 2,
    title: "Data Collection Systems",
    pain: "\"My data sheets are all different and RBTs don't use them.\"",
    build: "A standardized data collection toolkit built for your specific caseload — formats RBTs will actually use.",
    deliverable: "Master data sheet library covering frequency, duration, interval, and ABC recording.",
    icon: BarChart3,
  },
  {
    week: 3,
    title: "FBA to Hypothesis",
    pain: "\"I write FBAs but I'm not confident my function is right.\"",
    build: "A hypothesis generation process with function verification steps you can defend in any IEP meeting.",
    deliverable: "Your own FBA narrative template with built-in quality checks.",
    icon: Target,
  },
  {
    week: 4,
    title: "BIP Design by Function",
    pain: "\"My BIPs all look the same regardless of function.\"",
    build: "Function-matched intervention menus for attention, escape, tangible, and automatic reinforcement.",
    deliverable: "BIP template library organized by behavioral function.",
    icon: FileCheck,
  },
  {
    week: 5,
    title: "Implementation and RBT Training",
    pain: "\"I write great BIPs but RBTs don't implement them correctly.\"",
    build: "A 1-page implementation guide and fidelity checklist for each BIP — so RBTs know exactly what to do.",
    deliverable: "RBT training protocol template you can use for every new plan.",
    icon: Users,
  },
  {
    week: 6,
    title: "Progress Monitoring and Caseload Management",
    pain: "\"I don't know if my interventions are working until it's too late.\"",
    build: "A progress monitoring dashboard with decision rules for data-based changes across your full caseload.",
    deliverable: "Complete caseload management system with a built-in review schedule.",
    icon: BookOpen,
  },
];

export default function TransformationProgramPage() {
  return (
    <div className="min-h-screen bg-white relative pt-28">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs items={[{ label: "Transformation Program" }]} />
      </div>

      {/* Hero Section — pain-point led */}
      <section className="relative pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {["Live cohort", "6 weeks", "BCBAs only", "School-based"].map((item) => (
              <span key={item} className="px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                {item}
              </span>
            ))}
          </div>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Stop Writing FBAs<br className="hidden sm:block" /> at 10 PM
          </motion.h1>
          <motion.p
            className="text-xl text-slate-600 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            A 6-week live cohort that gives school-based BCBAs the systems, tools, and frameworks to run their caseload — instead of drowning in it.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <a
              href="#enroll"
              className="inline-flex items-center justify-center rounded-2xl bg-[#1f4d3f] hover:bg-[#123628] text-white font-bold text-base px-8 py-4 min-h-[44px] transition shadow-lg"
            >
              See Enrollment Details
            </a>
            <a
              href={CALENDLY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-300 bg-white hover:border-[#1f4d3f] text-slate-700 font-semibold text-base px-8 py-4 min-h-[44px] transition"
            >
              Book a Call First
            </a>
          </motion.div>
        </div>

        {/* Cohort dates callout */}
        <div className="max-w-2xl mx-auto px-4 mt-14">
          <div className="rounded-2xl bg-[#1f4d3f] p-6 shadow-xl border-2 border-[#e4b63d] text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-[#e4b63d]" />
              <span className="text-[#e4b63d] font-black text-sm uppercase tracking-widest">Next Cohort — March 2026</span>
            </div>
            <p className="text-white font-semibold mb-1">Thursdays &middot; 6:00&ndash;8:00 PM PT</p>
            <p className="text-[#e4b63d] font-black text-lg leading-relaxed">
              Mar 26 &middot; Apr 9 &middot; Apr 16 &middot; Apr 23 &middot; Apr 30 &middot; May 7
            </p>
            <p className="text-emerald-300 text-xs mt-2 italic">Easter week (Apr 2) off &middot; Maximum 20 participants</p>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4">Sound familiar?</h2>
          <p className="text-slate-400 text-center mb-14 text-lg">These are the real problems school-based BCBAs bring to this program.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote: "I'm writing FBAs and BIPs at 10 PM every night.",
                sub: "Paperwork is eating your evenings and your weekends."
              },
              {
                quote: "I have 15 students on my caseload and no real system.",
                sub: "Every case feels like starting from scratch."
              },
              {
                quote: "My data collection is inconsistent across students and staff.",
                sub: "RBTs aren't using the sheets, and you can't blame them."
              },
              {
                quote: "I'm not confident my FBA hypotheses are right.",
                sub: "Functional analysis in a school setting is complicated."
              },
              {
                quote: "My BIPs don't get implemented the way I wrote them.",
                sub: "There's a gap between what you plan and what happens in the classroom."
              },
              {
                quote: "The district wants me to do things that conflict with my ethics.",
                sub: "You're being pulled between fidelity to practice and keeping your job."
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="rounded-2xl bg-white/5 border border-white/10 p-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="flex gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-[#e4b63d] flex-shrink-0 mt-0.5" />
                  <p className="text-white font-bold leading-snug">{item.quote}</p>
                </div>
                <p className="text-slate-400 text-sm">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-center text-slate-900 mb-4">Who this program is for</h2>
          <p className="text-center text-slate-600 mb-12 text-lg">This cohort is for school-based BCBAs who are serious about building systems that last.</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              "You hold a BCBA certification and work in a K–12 school or district",
              "Your caseload feels overwhelming and you want a real system for it",
              "You're tired of rewriting the same documents with no template to start from",
              "You want to lead your team effectively, not just complete compliance tasks",
              "You're ready to do the work — not just watch videos and get a certificate",
              "You want tools you can use the next day, not theory you'll forget in a week",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50">
                <CheckCircle className="w-5 h-5 text-[#1f4d3f] flex-shrink-0 mt-0.5" />
                <p className="text-slate-700 font-medium text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-amber-900 text-sm font-semibold text-center">
              This is not for RBTs, pre-certification BCaBAs, or general education professionals. It is designed specifically for certified BCBAs working in school settings.
            </p>
          </div>
        </div>
      </section>

      {/* Weekly Breakdown */}
      <section id="curriculum" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#1f4d3f] font-bold uppercase tracking-widest text-sm mb-3">The 6-Week Curriculum</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4">What You'll Build Each Week</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Each session is mapped to a specific pain point and ends with a deliverable you can use immediately.</p>
          </div>

          <div className="space-y-8">
            {weeklyModules.map((mod) => (
              <motion.div
                key={mod.week}
                className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Week number sidebar */}
                  <div className="bg-[#1f4d3f] text-white flex items-center justify-center md:flex-col gap-2 md:gap-1 px-6 py-4 md:py-8 md:w-24 flex-shrink-0">
                    <span className="text-xs text-emerald-300 uppercase font-semibold tracking-widest">Week</span>
                    <span className="text-4xl font-black leading-none">{mod.week}</span>
                  </div>
                  {/* Content */}
                  <div className="p-6 md:p-8 flex-1">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-emerald-50 rounded-xl flex-shrink-0 mt-0.5">
                        <mod.icon className="w-5 h-5 text-[#1f4d3f]" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 leading-tight">{mod.title}</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                      <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                        <p className="text-xs font-black text-amber-700 uppercase tracking-widest mb-2">The Pain</p>
                        <p className="text-amber-900 text-sm font-semibold leading-relaxed">{mod.pain}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">What You Build</p>
                        <p className="text-slate-700 text-sm leading-relaxed">{mod.build}</p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                        <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">Your Deliverable</p>
                        <p className="text-emerald-900 text-sm font-semibold leading-relaxed">{mod.deliverable}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section id="outcomes" className="py-24 bg-[#123628] text-white scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">By week 6, you will have</h2>
            <p className="text-emerald-300 text-lg">Concrete deliverables and real systems — not just new ideas.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "A tiered assessment framework for every student on your caseload",
              "A standardized data collection system your RBTs will actually use",
              "FBA templates with built-in quality checks you can stand behind",
              "Function-matched BIP templates organized by behavioral function",
              "An RBT training protocol that ensures proper plan implementation",
              "A progress monitoring dashboard with clear decision rules",
            ].map((outcome, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-5"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <CheckCircle className="w-5 h-5 text-[#e4b63d] flex-shrink-0 mt-0.5" />
                <p className="text-white font-semibold text-sm leading-relaxed">{outcome}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-16 text-slate-900">Frequently Asked Questions</h2>
          <FAQAccordion items={[
            {
              question: "When does the next cohort start?",
              answer: "March 26, 2026. Sessions run Thursdays 6–8 PM PT, ending May 7. Easter week (Apr 2) is off. Maximum 20 participants."
            },
            {
              question: "What if I miss a live session?",
              answer: "All sessions are recorded and available in your student portal within 24 hours."
            },
            {
              question: "Can my district pay for this?",
              answer: "Yes. This program qualifies as professional development. We accept purchase orders from school districts and can provide an invoice for your business office. Email rob@behaviorschool.com to request district paperwork."
            },
            {
              question: "Is a W-9 available?",
              answer: "Yes, a W-9 is available on request. Email support@behaviorschool.com."
            },
            {
              question: "Do you offer bulk or group enrollment for districts?",
              answer: "Yes. We offer district pricing for multiple enrollees. Contact us via Calendly or email rob@behaviorschool.com to discuss options."
            },
            {
              question: "Is this program approved for CEUs?",
              answer: "CEU applicability is being evaluated. Contact us for the most current information."
            },
          ]} />
        </div>
      </section>

      {/* Pricing — END of page */}
      <section id="enroll" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#1f4d3f] font-bold uppercase tracking-widest text-sm mb-3">Enrollment</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Join the March 26 Cohort</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              A 6-week live cohort for school-based BCBAs. Maximum 20 participants.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Individual enrollment */}
            <div className="relative rounded-3xl bg-[#1f4d3f] p-8 shadow-2xl border-2 border-[#e4b63d] text-white">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#e4b63d] text-[#1f4d3f] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap">
                Early Bird — Ends March 21
              </div>
              <div className="mt-4">
                <p className="text-emerald-300 text-sm font-semibold uppercase tracking-widest mb-2">Individual Enrollment</p>
                <div className="flex items-end gap-3 mb-1">
                  <p className="text-5xl font-black text-white">$2,499</p>
                  <p className="text-emerald-300 text-lg line-through mb-1">$2,997</p>
                </div>
                <p className="text-emerald-300 text-sm mb-6">Save $498 — available through March 21</p>
                <ul className="space-y-3 mb-8">
                  {[
                    "6 live Thursday sessions (Mar 26 – May 7)",
                    "All tools, templates, and frameworks",
                    "Peer cohort of school-based BCBAs",
                    "Session recordings in student portal",
                    "90-day implementation roadmap",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-emerald-100">
                      <CheckCircle className="w-4 h-4 text-[#e4b63d] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={ENROLL_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-2xl bg-[#e4b63d] hover:bg-yellow-400 text-[#1f4d3f] font-black text-base py-4 px-6 text-center transition shadow-xl min-h-[44px]"
                >
                  Reserve Your Spot — $2,499
                </a>
                <p className="text-center text-emerald-400 text-xs mt-3">20 spots maximum — <span className="text-[#e4b63d] font-bold">limited availability</span></p>
                <a
                  href={CALENDLY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full mt-3 rounded-2xl border-2 border-emerald-500 text-emerald-200 hover:bg-emerald-800 font-semibold text-sm py-3 px-6 text-center transition min-h-[44px] flex items-center justify-center"
                >
                  Have questions? Book a 15-minute call
                </a>
              </div>
            </div>

            {/* School Districts */}
            <div className="rounded-3xl bg-white p-8 shadow-xl border-2 border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <Building2 className="w-6 h-6 text-[#1f4d3f]" />
                  </div>
                  <p className="text-slate-700 text-sm font-black uppercase tracking-widest">School Districts</p>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">District and Group Enrollment</h3>
                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  We accept purchase orders from school districts. Contact us for district pricing and bulk enrollment options for multiple staff members.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "Purchase orders accepted from school districts",
                    "District and bulk pricing available",
                    "Invoicing for business offices",
                    "W-9 available on request",
                    "Qualifies as professional development",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-[#1f4d3f] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <a
                  href={DISTRICT_CALENDLY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-2xl bg-[#1f4d3f] hover:bg-[#123628] text-white font-bold text-sm py-4 px-6 text-center transition min-h-[44px] flex items-center justify-center"
                >
                  Schedule a District Inquiry Call
                </a>
                <a
                  href="mailto:rob@behaviorschool.com?subject=District%20Enrollment%20Inquiry%20%E2%80%94%20Transformation%20Program"
                  className="block w-full rounded-2xl border-2 border-slate-200 hover:border-[#1f4d3f] text-slate-700 font-semibold text-sm py-4 px-6 text-center transition min-h-[44px] flex items-center justify-center"
                >
                  Email for District Pricing
                </a>
              </div>
            </div>
          </div>

          {/* Regular price note */}
          <div className="rounded-2xl bg-white border border-slate-200 px-6 py-5 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <p className="text-amber-800 text-sm font-semibold">
                After March 21, enrollment is $2,997 — if spots are still available.
              </p>
            </div>
            <p className="text-slate-500 text-xs">
              Questions? <a href="mailto:rob@behaviorschool.com" className="text-[#1f4d3f] font-semibold hover:underline">Email rob@behaviorschool.com</a>
            </p>
          </div>
        </div>
      </section>

      {/* Application / Waitlist Form */}
      <ProgramApplication />

    </div>
  );
}
