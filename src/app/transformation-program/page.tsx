'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Target, CheckCircle, Star, Award, Heart, Shield, Zap, Calendar, BookOpen, FileCheck, Lightbulb, Trophy, Clock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import { ValueStack } from '@/components/ui/value-stack';
import { CurriculumProgress } from '@/components/ui/curriculum-progress';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const curriculumData = [
  {
    week: 1,
    topic: "Foundations for Influence: Shaping Your Role in Schools",
    objectives: [
      "Clarify your role in MTSS (Multi-Tiered System of Supports).",
      "Map your caseload and stakeholder ecosystem."
    ],
    deliverables: [
      "Caseload tracker template.",
      "\u201cExplaining My Role\u201d slide deck + scripting.",
      "Bonus: Admin/staff engagement email template."
    ],
    icon: Users,
    color: "emerald"
  },
  {
    week: 2,
    topic: "Referral Systems That Save Time & Increase Impact",
    objectives: [
      "Build a streamlined referral process that filters non-behavioral issues."
    ],
    deliverables: [
      "Google Form-based referral system.",
      "Referral decision tree & teacher checklist.",
      "Challenge: Share your school\u2019s bottlenecks \u2014 get feedback."
    ],
    icon: Zap,
    color: "blue"
  },
  {
    week: 3,
    topic: "Building Trust & Buy-In with Teams",
    objectives: [
      "Strengthen stakeholder relationships to increase follow-through.",
      "Identify \u201cearly adopters\u201d in your school/district."
    ],
    deliverables: [
      "Influence Map tool.",
      "Stakeholder Communication Plan template.",
      "ACT Component: Values + committed action worksheet for self."
    ],
    icon: Heart,
    color: "purple"
  },
  {
    week: 4,
    topic: "The RIGHT Assessment for the Right BIP",
    objectives: [
      "Select the most appropriate assessment for each context (MAS, QABF, FA interview, FAST, etc.).",
      "Know when to use what \u2014 and how to explain your decision to others."
    ],
    deliverables: [
      "Assessment Matrix (function, time, effort, setting).",
      "\u201cFrom Assessment to Action\u201d planner."
    ],
    icon: Target,
    color: "pink"
  },
  {
    week: 5,
    topic: "Functional Analysis That Fits in Schools",
    objectives: [
      "Adapt PFA/SBT and standard FA methods to real-world school settings.",
      "Address time, space, and buy-in limitations."
    ],
    deliverables: [
      "FA Planning & Consent Guide.",
      "Sample FA summary report with graph.",
      "Coaching Corner: What to do when you can\u2019t run an FA."
    ],
    icon: Shield,
    color: "orange"
  },
  {
    week: 6,
    topic: "Writing Meaningful & Measurable BIP Goals",
    objectives: [
      "Align goals with IEP needs and functional outcomes.",
      "Ensure goals are teachable, observable, and trackable."
    ],
    deliverables: [
      "SMART-F Goal Builder Template.",
      "Replacement Behavior Planning Grid."
    ],
    icon: FileCheck,
    color: "emerald"
  }
];



const STRIPE_LINK = process.env.NEXT_PUBLIC_TRANSFORMATION_STRIPE_LINK || "https://buy.stripe.com/bJe00i82o6Ss72seBw6Vq00";
const MAILTO_LINK = "mailto:rob@behaviorschool.com?subject=Transformation%20Program%20%E2%80%94%20Reserve%20My%20Spot&body=Hi%20Rob%2C%0A%0AI%27d%20like%20to%20reserve%20my%20spot%20at%20the%20early%20bird%20rate%20for%20the%20Transformation%20Program%20(March%2026%20cohort).%0A%0AName%3A%20%0AEmail%3A%20%0ARole%2FTitle%3A%20%0ASchool%2FDistrict%3A%20";
const ENROLL_HREF = STRIPE_LINK || MAILTO_LINK;
const CALENDLY_LINK = "https://calendly.com/robspain/behavior-school-transformation-system-phone-call";

export default function TransformationProgramPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleWaitlistSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      role: String(formData.get("role") || "").trim(),
    };

    setFormStatus("loading");
    try {
      const res = await fetch("/api/accelerator-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setFormStatus("success");
      form.reset();
    } catch (err) {
      setFormStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-white relative pt-28">
      {/* CalABA / Early Bird Banner */}
      <div className="bg-[#1f4d3f] text-white text-center py-3 px-4 text-sm font-semibold">
        Attending CalABA March 7? Early bird pricing (<span className="text-[#e4b63d] font-black">$2,499</span>) is available to all CalABA attendees through March 21.
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white border-t-2 border-slate-100 shadow-2xl md:hidden">
        <a
          href={ENROLL_HREF}
          target={STRIPE_LINK ? "_blank" : undefined}
          rel={STRIPE_LINK ? "noopener noreferrer" : undefined}
          className="flex items-center justify-center w-full px-6 py-3 text-lg font-bold bg-[#1f4d3f] hover:bg-emerald-900 text-white rounded-xl shadow-lg transition-all duration-200"
        >
          Reserve Your Spot — $2,499 Early Bird
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs items={[{ label: "Transformation Program" }]} />
      </div>

      {/* Hero Section */}
      <section className="relative pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-[1200px] px-4 md:px-6 mx-auto text-center lg:text-left">
          <div className="md:grid md:grid-cols-12 md:gap-12 items-center">
            <div className="md:col-span-7">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#e4b63d]">For School-Based BCBAs</p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1f4d3f] tracking-tight leading-[1.05]">
                  Transform How You Work in Schools
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-[58ch] leading-relaxed mx-auto lg:mx-0">
                  A 6-week live cohort that turns overwhelmed BCBAs into high-impact school behavior leaders.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  {["Live cohort", "6 weeks", "BCBAs only"].map((item) => (
                    <span key={item} className="px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                      {item}
                    </span>
                  ))}
                </div>

                {/* Cohort Dates Callout — prominently featured */}
                <div className="rounded-2xl bg-[#1f4d3f] p-6 shadow-2xl border-2 border-[#e4b63d] text-left">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-[#e4b63d]" />
                    <span className="text-[#e4b63d] font-black text-sm uppercase tracking-widest">Next Cohort — 6-Week Pilot</span>
                  </div>
                  <p className="text-white font-semibold mb-1">Thursdays &middot; 6:00&ndash;8:00 PM PT</p>
                  <p className="text-[#e4b63d] font-black text-lg md:text-xl leading-relaxed">
                    Mar 26 &middot; Apr 9 &middot; Apr 16 &middot; Apr 23 &middot; Apr 30 &middot; May 7
                  </p>
                  <p className="text-emerald-300 text-xs mt-2 italic">Easter week (Apr 2) off &middot; Maximum 20 participants</p>
                  <div className="mt-4 pt-4 border-t border-emerald-700 space-y-2">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-[#e4b63d] font-black text-xl">$2,499 <span className="text-sm font-semibold text-emerald-300 line-through">$2,997</span></p>
                        <p className="text-emerald-200 text-xs">Early bird — save $498. Ends March 21.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Clock className="w-4 h-4 text-[#e4b63d] flex-shrink-0" />
                      <span>20 spots maximum &mdash; <span className="font-black text-[#e4b63d]">20 remaining</span></span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/free-study-plan"
                  className="block rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg text-left hover:border-[#e4b63d] hover:shadow-xl transition group"
                >
                  <span className="inline-flex items-center rounded-full bg-[#e4b63d]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#8c6a11]">
                    Free Download
                  </span>
                  <h2 className="mt-4 text-xl md:text-2xl font-bold text-slate-900 group-hover:text-[#1f4d3f] transition-colors">
                    Free: BCBA School Systems Checklist
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    The 47-point checklist used by high-impact BCBAs to build sustainable school behavior systems &mdash; plus your 7-day study plan.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 rounded-xl bg-[#1f4d3f] px-5 py-3 text-sm font-semibold text-white group-hover:bg-emerald-900 transition">
                    Get It Free &rarr;
                  </span>
                </Link>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a
                    href={ENROLL_HREF}
                    target={STRIPE_LINK ? "_blank" : undefined}
                    rel={STRIPE_LINK ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center justify-center rounded-2xl px-8 h-14 text-lg font-bold bg-[#1f4d3f] hover:bg-emerald-900 text-white shadow-xl transition"
                  >
                    Reserve Your Spot — $2,499 <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                  <Link
                    href="#enroll"
                    className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-300 bg-white px-6 h-14 text-base font-semibold text-slate-700 hover:border-emerald-700 hover:text-emerald-800 transition"
                  >
                    See full details
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="md:col-span-5 mt-16 md:mt-0">
              <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100 space-y-5">
                <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">What&rsquo;s included</p>
                {[
                  { text: "6-week live cohort with weekly group sessions" },
                  { text: "Evidence-based curriculum built for school BCBAs" },
                  { text: "Hands-on tools, templates, and planning frameworks" },
                  { text: "Peer cohort of school-based practitioners" },
                  { text: "Data systems for tracking behavior and progress" },
                  { text: "FERPA-compliant, IEP-aligned throughout" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <p className="text-slate-700 text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="py-24 bg-slate-50 relative overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-24">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6">Class Schedule & Agenda</h2>
            <p className="text-lg text-emerald-700 font-bold tracking-widest uppercase">The Transformation Blueprint</p>
            <p className="mt-3 text-sm font-semibold text-slate-600">6-week live cohort with weekly deliverables.</p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            <CurriculumProgress />
            <div className="absolute left-6 md:left-[3.5rem] top-0 bottom-0 w-0.5 bg-slate-200 sm:block hidden" />
            
            <div className="space-y-16">
              {curriculumData.map((item) => (
                <motion.div 
                  key={item.week} 
                  data-week={item.week} 
                  className="relative flex flex-col md:flex-row gap-8 md:gap-12" 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="flex-shrink-0 flex items-center justify-start md:justify-center">
                    <div className="w-12 h-12 md:w-24 md:h-24 bg-white border-4 border-slate-50 rounded-full shadow-lg z-10 flex flex-col items-center justify-center font-bold text-slate-900 transition-transform hover:scale-110">
                      <span className="text-xs text-slate-400 uppercase">Week</span>
                      <span className="text-xl md:text-2xl">0{item.week}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <div className={`p-3 bg-${item.color}-100 rounded-2xl`}>
                        <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight flex-1">{item.topic}</h3>
                    </div>
                    
                    <div className="grid lg:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                          Objectives
                        </h4>
                        <ul className="space-y-4">
                          {item.objectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-600 leading-relaxed text-sm md:text-base">
                              <div className={`w-1.5 h-1.5 bg-${item.color}-500 rounded-full mt-2.5 flex-shrink-0`} />
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100">
                        <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                          Weekly Deliverables
                        </h4>
                        <div className="space-y-4">
                          {item.deliverables.map((del, i) => {
                            const isBonus = del.toLowerCase().includes('bonus');
                            const isChallenge = del.toLowerCase().includes('challenge');
                            return (
                              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${isBonus ? 'bg-orange-50 border-orange-100' : isChallenge ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-100'}`}>
                                {isBonus ? (
                                  <Zap className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                ) : isChallenge ? (
                                  <Trophy className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                )}
                                <span className={`text-sm ${isBonus ? 'text-orange-800 font-bold' : isChallenge ? 'text-blue-800 font-bold' : 'text-slate-700 font-medium'}`}>
                                  {del}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-emerald-900">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Bonus Resources Included</p>
              <p className="mt-2 text-sm">ACT toolkit + Sustainability roadmap (self-paced).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Learning Objectives Section */}
      <section id="outcomes" className="py-24 bg-slate-900 text-white overflow-hidden relative scroll-mt-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-48 -mb-48" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Simplified Learning Objectives</h2>
            <p className="text-xl text-slate-400">By the end of this 6-week cohort, participants will:</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              "Build a comprehensive, district-ready BCBA operating system.",
              "Confidently manage ethics conflicts while maintaining relationships.",
              "Establish structured referral, data, and supervision systems that survive turnover.",
              "Lead teams through collaboration, clarity, and compassion.",
              "Leave with a complete Transformation Playbook ready for implementation."
            ].map((outcome, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-all group"
              >
                <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/30 transition-colors">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-lg font-bold text-slate-100 leading-relaxed">
                  {outcome}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-16 text-slate-900">Frequently Asked Questions</h2>
          <FAQAccordion items={[
            { question: "When does the next cohort start?", answer: "March 26, 2026. Sessions run Thursdays 6\u20138 PM PT, ending May 7. Easter week (Apr 2) is off. Maximum 20 participants." },
            { question: "What does it cost?", answer: "Early bird pricing is $2,499, available through March 21. After that, enrollment is $2,997 \u2014 if spots remain. Maximum 20 seats total." },
            { question: "Can my district pay for this?", answer: "Yes. This program qualifies as professional development. Many districts reimburse directly or can pay via PO. Email rob@behaviorschool.com to request an invoice for your business office." },
            { question: "What if I miss a live call?", answer: "All sessions are recorded and made available in your student portal within 24 hours." },
            { question: "Can I pay with a Purchase Order (PO)?", answer: "Yes! We work with many school districts. Email support@behaviorschool.com to request an invoice." }
          ]} />
        </div>
      </section>

      <section id="enroll" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Enroll in the March 26 Cohort</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">A 6-week program for school-based BCBAs who are serious about leveling up.</p>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Early bird */}
            <div className="relative rounded-3xl bg-[#1f4d3f] p-8 shadow-2xl border-2 border-[#e4b63d] text-white">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#e4b63d] text-[#1f4d3f] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap">
                Early Bird — Ends March 21
              </div>
              <div className="mt-4">
                <p className="text-emerald-300 text-sm font-semibold uppercase tracking-widest mb-2">Early Bird Pricing</p>
                <p className="text-5xl font-black text-white mb-1">$2,499</p>
                <p className="text-emerald-300 text-sm mb-6">Save $498 &mdash; available through March 21</p>
                <ul className="space-y-3 mb-8">
                  {[
                    "6 live Thursday sessions (Mar 26 – May 7)",
                    "All tools, templates & frameworks",
                    "Peer cohort of school BCBAs",
                    "90-day implementation roadmap",
                    "Session recordings included",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-emerald-100">
                      <CheckCircle className="w-4 h-4 text-[#e4b63d] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={ENROLL_HREF}
                  target={STRIPE_LINK ? "_blank" : undefined}
                  rel={STRIPE_LINK ? "noopener noreferrer" : undefined}
                  className="block w-full rounded-2xl bg-[#e4b63d] hover:bg-yellow-400 text-[#1f4d3f] font-black text-base py-4 px-6 text-center transition shadow-xl"
                >
                  Reserve Your Spot — $2,499 Early Bird
                </a>
                {!STRIPE_LINK && (
                  <p className="text-center text-emerald-300 text-xs mt-2">You&rsquo;ll receive a payment link via email within 24 hours.</p>
                )}
                <p className="text-center text-emerald-400 text-xs mt-2">20 spots maximum &mdash; <span className="text-[#e4b63d] font-bold">20 remaining</span></p>
                <a
                  href={CALENDLY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full mt-3 rounded-2xl border-2 border-emerald-400 text-emerald-200 hover:bg-emerald-800 font-semibold text-sm py-3 px-6 text-center transition"
                >
                  Have questions? Book a 15-minute call
                </a>
              </div>
            </div>

            {/* Regular price info */}
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mb-2">After March 21</p>
                <p className="text-5xl font-black text-slate-400 mb-1">$2,997</p>
                <p className="text-slate-500 text-sm mb-6">If spots are still available</p>
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-800 text-sm font-semibold">Early bird pricing ends March 21 — two weeks after CalABA. After that, enrollment is $2,997 if spots remain.</p>
                  </div>
                </div>
                {/* District reimbursement */}
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-emerald-900 text-sm font-black mb-1">District Reimbursement</p>
                      <p className="text-emerald-800 text-sm">This program qualifies as professional development. Many school districts will reimburse or pay directly.</p>
                      <a href="mailto:rob@behaviorschool.com?subject=District%20Invoice%20Request%20%E2%80%94%20Transformation%20Program" className="inline-block mt-2 text-xs font-bold text-emerald-700 hover:underline">Request an invoice for your district &rarr;</a>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-xs mt-6 text-center">Questions? <a href="mailto:rob@behaviorschool.com" className="text-emerald-700 font-semibold hover:underline">Email rob@behaviorschool.com</a></p>
            </div>
          </div>

          {/* CalABA tie-in */}
          <div className="rounded-2xl bg-white border border-slate-200 px-8 py-6 text-center shadow-sm">
            <p className="text-slate-700 text-sm font-semibold">
              Attending CalABA March 7? Early bird pricing is available to all CalABA attendees through March 21.{" "}
              <a href="mailto:rob@behaviorschool.com?subject=CalABA%20Early%20Bird%20%E2%80%94%20Transformation%20Program" className="text-emerald-700 font-bold hover:underline">Reach out after the conference &rarr;</a>
            </p>
          </div>
        </div>
      </section>

      <div className="h-20 md:hidden"></div>
    </div>
  );
}
