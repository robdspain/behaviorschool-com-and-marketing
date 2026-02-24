'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Target, CheckCircle, Star, Award, Heart, Shield, Zap, Calendar, BookOpen, FileCheck, Lightbulb, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { ScrollNav } from '@/components/ui/scroll-nav';
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
      "“Explaining My Role” slide deck + scripting.",
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
      "Challenge: Share your school's bottlenecks — get feedback."
    ],
    icon: Zap,
    color: "blue"
  },
  {
    week: 3,
    topic: "Building Trust & Buy-In with Teams",
    objectives: [
      "Strengthen stakeholder relationships to increase follow-through.",
      "Identify “early adopters” in your school/district."
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
      "Know when to use what — and how to explain your decision to others."
    ],
    deliverables: [
      "Assessment Matrix (function, time, effort, setting).",
      "“From Assessment to Action” planner."
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
      "Coaching Corner: What to do when you can’t run an FA."
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
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white border-t-2 border-slate-100 shadow-2xl md:hidden">
        <Link 
          href="/signup" 
          className="flex items-center justify-center w-full px-6 py-3 text-lg font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all duration-200"
        >
          👉 SECURE YOUR SPOT NOW
        </Link>
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
                    The 47-point checklist used by high-impact BCBAs to build sustainable school behavior systems — plus your 7-day study plan.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 rounded-xl bg-[#1f4d3f] px-5 py-3 text-sm font-semibold text-white group-hover:bg-emerald-900 transition">
                    Get It Free →
                  </span>
                </Link>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button asChild size="lg" className="rounded-2xl px-8 h-14 text-lg font-bold bg-red-600 hover:bg-red-700 text-white shadow-xl">
                    <Link href="/signup">Enroll Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Link
                    href="#enroll"
                    className="inline-flex items-center justify-center rounded-2xl border-2 border-emerald-700 px-6 h-14 text-base font-semibold text-emerald-900 hover:bg-emerald-50 transition"
                  >
                    Apply for Next Cohort
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

      <ScrollNav 
        items={[
          { id: "curriculum", label: "6-Week Schedule" },
          { id: "outcomes", label: "Learning Goals" },
          { id: "enroll", label: "Join Cohort" },
        ]}
      />

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
            { question: "When does the next cohort start?", answer: "March 26 (Thursdays at 6–8 PM PT). Six live sessions ending May 7." },
            { question: "What if I miss a live call?", answer: "All sessions are recorded and made available in your student portal within 24 hours." },
            { question: "Can I pay with a Purchase Order (PO)?", answer: "Yes! We work with many school districts. Email support@behaviorschool.com to request an invoice." }
          ]} />
        </div>
      </section>

      <section id="enroll" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="mb-16">
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-6">Invest in Your Practice</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Get the complete operating system and join a cohort of leaders.</p>
          </div>
          
          <ValueStack 
            items={[
              { label: "6-Week Transformation Program", value: 5000 },
              { label: "Complete Behavior Systems Binder", value: 3000 },
              { label: "Digital Tool & Template Library", value: 4000 },
              { label: "90-Day Implementation Roadmap", value: 3000 },
            ]}
            totalValue={15000}
            price={2997}
            paymentPlan="3 payments of $1,097"
            ctaLink="/signup"
            ctaLabel="SECURE YOUR SPOT NOW"
          />

          <div className="mt-14 max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Join the School BCBA Accelerator Waitlist</h3>
            <p className="text-slate-600 mb-6">Get first access, pricing details, and cohort dates. No spam.</p>
            <form onSubmit={handleWaitlistSubmit} className="grid gap-4 text-left">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="name">Name</label>
                <input id="name" name="name" type="text" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900" placeholder="Your name" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900" placeholder="you@email.com" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="role">Role</label>
                <select id="role" name="role" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900">
                  <option value="">Select one</option>
                  <option value="School BCBA">School BCBA</option>
                  <option value="Behavior Specialist">Behavior Specialist</option>
                  <option value="BCBA Student">BCBA Student</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button type="submit" className="mt-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3">
                {formStatus === "loading" ? "Submitting..." : "Join Waitlist"}
              </button>
              {formStatus === "success" && (
                <p className="text-emerald-700 text-sm font-semibold">You are on the list. Check your inbox soon.</p>
              )}
              {formStatus === "error" && (
                <p className="text-red-600 text-sm font-semibold">Something went wrong. Try again in a moment.</p>
              )}
            </form>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
              <Link href="/contact" className="text-emerald-700 font-semibold hover:underline">Book a 15-minute call</Link>
              <span className="text-slate-400">|</span>
              <Link href="/calaba-2026" className="text-emerald-700 font-semibold hover:underline">See CalABA 2026 offer</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="h-20 md:hidden"></div>
    </div>
  );
}
