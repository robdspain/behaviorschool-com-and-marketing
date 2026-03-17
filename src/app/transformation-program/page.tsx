'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Target, CheckCircle, Calendar, FileCheck, BookOpen, ClipboardList, BarChart3, AlertCircle, Zap } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import { ProgramApplication } from '@/components/ProgramApplication';

const EARLY_BIRD_DEADLINE = new Date('2026-03-21T00:00:00-07:00');
const isEarlyBird = new Date() < EARLY_BIRD_DEADLINE;

const FULL_PAY_LINK = isEarlyBird
  ? 'https://buy.stripe.com/14AaEWdmIekU2Mc1OK6Vq01'
  : 'https://buy.stripe.com/eVqbJ05UgdgQ0E46506Vq03';
const FULL_PAY_PRICE = isEarlyBird ? '$2,499' : '$2,997';
const INSTALLMENT_LINK = 'https://buy.stripe.com/00w5kCaawdgQ72sdxs6Vq02';
const CALENDLY_LINK = 'https://calendly.com/robspain/behavior-school-transformation-system-phone-call';

// Update this number manually as spots are confirmed
const TOTAL_SPOTS = 20;
const SPOTS_TAKEN = 3; // increment as people register
const SPOTS_REMAINING = TOTAL_SPOTS - SPOTS_TAKEN;

const weeklyModules = [
  {
    week: 1,
    title: "Assessment Architecture",
    pain: '"I have 12 students needing FBAs and no system."',
    build: "A tiered assessment framework — plus a scalable intake process that filters behavioral concerns by severity level to route each student to the appropriate level of assessment — without burning you out.",
    deliverable: "Your personal assessment decision tree, intake form, and referral routing guide.",
    icon: ClipboardList,
  },
  {
    week: 2,
    title: "Data Collection Systems",
    pain: '"My data sheets are all different and RBTs don\'t use them."',
    build: "A standardized data collection toolkit built for your specific caseload — formats RBTs will actually use consistently.",
    deliverable: "Master data sheet library covering frequency, duration, interval, and ABC recording.",
    icon: BarChart3,
  },
  {
    week: 3,
    title: "FBA to Hypothesis",
    pain: '"I write FBAs but I\'m not confident my function is right."',
    build: "A hypothesis generation process with function verification steps you can defend in any IEP meeting.",
    deliverable: "Your own FBA narrative template with built-in quality checks.",
    icon: Target,
  },
  {
    week: 4,
    title: "BIP Design by Function",
    pain: '"My BIPs all look the same regardless of function."',
    build: "Function-matched intervention menus for attention, escape, tangible, and automatic reinforcement.",
    deliverable: "BIP template library organized by behavioral function.",
    icon: FileCheck,
  },
  {
    week: 5,
    title: "Implementation and Staff Training",
    pain: '"I write great BIPs but staff don\'t implement them correctly."',
    build: "A 1-page implementation guide and fidelity checklist for each BIP — so everyone on your team knows exactly what to do.",
    deliverable: "Staff training protocol template you can use for every new plan.",
    icon: Users,
  },
  {
    week: 6,
    title: "Progress Monitoring and Caseload Management",
    pain: '"I don\'t know if my interventions are working until it\'s too late."',
    build: "A progress monitoring dashboard with decision rules for data-based changes across your full caseload.",
    deliverable: "Complete caseload management system with a built-in review schedule.",
    icon: BookOpen,
  },
];

function AnimatedSpots({ remaining }: { remaining: number }) {
  const [displayed, setDisplayed] = useState(remaining + 3);
  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(remaining), 600);
    return () => clearTimeout(timer);
  }, [remaining]);
  return (
    <motion.span
      key={displayed}
      initial={{ scale: 1.3, color: '#e4b63d' }}
      animate={{ scale: 1, color: '#fde68a' }}
      transition={{ duration: 0.4 }}
      className="font-black text-2xl tabular-nums"
    >
      {displayed}
    </motion.span>
  );
}

export default function TransformationProgramPage() {
  return (
    <div className="min-h-screen bg-white relative pt-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs items={[{ label: "Transformation Program" }]} />
      </div>

      {/* Hero Section */}
      <section className="relative pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            You Became a BCBA<br className="hidden sm:block" /> to Help Kids.
            <br className="hidden sm:block" />
            <span className="text-[#1f4d3f]">Not to Drown in Paperwork.</span>
          </motion.h1>
          <motion.p
            className="text-xl text-slate-600 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            By the end of this program, you'll leave work at contract time — with systems that actually run without you.
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {['Live cohort', '6 weeks', 'BCBAs only', 'School-based'].map((item) => (
              <span key={item} className="px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                {item}
              </span>
            ))}
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <a
              href="#curriculum"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1f4d3f] hover:bg-[#123628] text-white font-bold text-base px-8 py-4 min-h-[44px] transition shadow-lg"
            >
              See What You&apos;ll Build <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={CALENDLY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-300 bg-white hover:border-[#1f4d3f] text-slate-700 font-semibold text-base px-8 py-4 min-h-[44px] transition"
            >
              Book a 15-min Call First
            </a>
          </motion.div>
        </div>

        {/* Cohort dates callout with animated spots */}
        <div className="max-w-2xl mx-auto px-4 mt-14">
          <div className="rounded-2xl bg-[#1f4d3f] p-6 shadow-xl border-2 border-[#e4b63d]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-[#e4b63d] flex-shrink-0" />
                  <span className="text-[#e4b63d] font-black text-xs uppercase tracking-widest">Next Cohort — March 2026</span>
                </div>
                <p className="text-white font-semibold text-sm mb-1">Thursdays &middot; 6:00&ndash;8:00 PM PT</p>
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {['Mar 26', 'Apr 9', 'Apr 16', 'Apr 23', 'Apr 30', 'May 7'].map((d) => (
                    <span key={d} className="text-[#e4b63d] font-bold text-sm">{d}</span>
                  ))}
                </div>
                <p className="text-emerald-300 text-xs mt-2 italic">Easter week (Apr 2) off</p>
              </div>
              {/* Spots remaining — animated */}
              <div className="flex-shrink-0 text-center bg-white/10 rounded-xl px-5 py-3 border border-[#e4b63d]/40">
                <AnimatedSpots remaining={SPOTS_REMAINING} />
                <p className="text-emerald-200 text-xs font-semibold uppercase tracking-widest mt-0.5">spots left</p>
                <p className="text-emerald-300 text-xs mt-1">of {TOTAL_SPOTS} total</p>
              </div>
            </div>
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
              { quote: "I'm writing FBAs and BIPs at 10 PM every night.", sub: "Paperwork is eating your evenings and your weekends." },
              { quote: "I have 15 students on my caseload and no real system.", sub: "Every case feels like starting from scratch." },
              { quote: "My data collection is inconsistent across students and staff.", sub: "RBTs aren't using the sheets, and you can't blame them." },
              { quote: "I'm not confident my FBA hypotheses are right.", sub: "Functional analysis in a school setting is complicated." },
              { quote: "My BIPs don't get implemented the way I wrote them.", sub: "There's a gap between what you plan and what happens in the classroom." },
              { quote: "The district wants me to do things that conflict with my ethics.", sub: "You're being pulled between fidelity to practice and keeping your job." },
              { quote: "I can't remember the last time I left at contract time.", sub: "The work expands to fill every evening and weekend you give it." },
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4">What You&apos;ll Build Each Week</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Each session is mapped to a specific pain point and ends with a deliverable you can use immediately.</p>
          </div>

          <div className="space-y-8">
            {weeklyModules.map((mod) => (
              <motion.div
                key={mod.week}
                className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="bg-[#1f4d3f] text-white flex items-center justify-center md:flex-col gap-2 md:gap-1 px-6 py-4 md:py-8 md:w-24 flex-shrink-0">
                    <span className="text-xs text-emerald-300 uppercase font-semibold tracking-widest">Week</span>
                    <span className="text-4xl font-black leading-none">{mod.week}</span>
                  </div>
                  <div className="p-6 md:p-8 flex-1 min-w-0">
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
            <p className="text-emerald-300 text-lg mb-6">Leave work at contract time. Stop writing FBAs at 10 PM. Have staff implement plans correctly the first time.</p>
            <p className="text-slate-400 text-base">Concrete deliverables and real systems — not just new ideas.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "A tiered assessment framework for every student on your caseload",
              "A scalable referral system that routes concerns by severity to the right assessment level",
              "FBA templates with built-in quality checks you can stand behind in any IEP meeting",
              "Function-matched BIP templates organized by behavioral function",
              "A staff training protocol that ensures consistent plan implementation",
              "A progress monitoring dashboard with clear decision rules across your full caseload",
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

      {/* About Rob */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#1f4d3f] font-bold uppercase tracking-widest text-sm mb-4">Your Instructor</p>
          <h2 className="text-3xl font-black text-slate-900 mb-6">Rob Spain, BCBA, IBA</h2>
          <div className="text-left space-y-3 text-slate-600 text-base leading-relaxed">
            <p>Rob has spent 25+ years as a behavior analyst in school settings — district-level practice, graduate teaching, and clinical work. He knows what it actually takes to run a caseload ethically in an environment that doesn&apos;t always make it easy.</p>
            <p>He&apos;s a CalABA invited speaker, President of the BAE SIG, and the person BCBAs call when they&apos;re stuck on a hard case. This program is built from the systems he&apos;s actually used — not from theory.</p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {['25+ Years School-Based Practice', 'CalABA Invited Speaker', 'BCBA · IBA Certified', 'BAE SIG President'].map((item) => (
              <span key={item} className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-16 text-slate-900">Frequently Asked Questions</h2>
          <FAQAccordion items={[
            { question: "When does the next cohort start?", answer: "March 26, 2026. Sessions run Thursdays 6–8 PM PT, ending May 7. Easter week (Apr 2) is off. Maximum 20 participants." },
            { question: "What if I miss a live session?", answer: "All sessions are recorded and available in your student portal within 24 hours." },
            { question: "Can my district pay for this?", answer: "Yes. This program qualifies as professional development. We accept purchase orders and can provide a formal invoice for your business office. Email rob@behaviorschool.com to request district paperwork." },
            { question: "Is a W-9 available?", answer: "Yes, available on request. Email rob@behaviorschool.com and we'll send it same day." },
            { question: "Do you offer bulk enrollment for districts?", answer: "Yes. Contact us via Calendly or email rob@behaviorschool.com to discuss district group pricing." },
            { question: "Is this program approved for CEUs?", answer: "CEU applicability is being evaluated. Contact us for the most current information." },
          ]} />
        </div>
      </section>

      {/* Enroll — price appears here for the first time */}
      <section id="enroll" className="py-24 bg-slate-900 text-white scroll-mt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#e4b63d] font-bold uppercase tracking-widest text-sm mb-3">Enrollment</p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Join the March 26 Cohort</h2>
          <p className="text-slate-300 text-xl mb-3 max-w-xl mx-auto">
            6 weeks. 20 seats max. School-based BCBAs only.
          </p>
          <p className="text-[#e4b63d] font-black text-2xl mb-8">
            {FULL_PAY_PRICE} {isEarlyBird && <span className="text-emerald-300 text-base font-semibold ml-2">Early bird — saves $498</span>}
          </p>

          <a
            href={FULL_PAY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-2xl bg-[#e4b63d] hover:bg-amber-400 text-[#123628] font-black text-xl py-5 px-8 text-center transition shadow-xl mb-4"
          >
            Join the March 26 Cohort
          </a>

          {isEarlyBird && (
            <p className="text-emerald-300 text-sm font-semibold mb-2">
              Early bird pricing ends Friday, March 20
            </p>
          )}
          {isEarlyBird && (
            <p className="text-slate-400 text-xs mb-6">
              After Friday, price goes to $2,997. If you've been thinking about it, this is the week.
            </p>
          )}

          <p className="text-slate-400 text-sm mb-2">
            Prefer to pay monthly?{' '}
            <a href={INSTALLMENT_LINK} target="_blank" rel="noopener noreferrer" className="text-[#e4b63d] font-semibold underline underline-offset-2">
              3 installments of $833/month →
            </a>
          </p>

          <p className="text-slate-500 text-xs mb-12">
            Questions before enrolling?{' '}
            <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="text-[#e4b63d] font-semibold underline underline-offset-2">
              Book a 15-minute call
            </a>
          </p>

          <details className="text-left bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <summary className="cursor-pointer px-6 py-4 font-semibold text-slate-300 text-sm flex items-center justify-between list-none">
              <span>Getting district approval? We can help.</span>
              <span className="text-slate-500 text-xs">tap to expand</span>
            </summary>
            <div className="px-6 pb-6 border-t border-white/10 pt-4 space-y-4">
              <p className="text-sm text-slate-400 leading-relaxed">
                Many BCBAs have their district cover this as professional development. Here&apos;s what you need:
              </p>
              <a
                href="/transformation-program-pd-packet.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:border-[#e4b63d] transition text-sm font-semibold text-[#e4b63d]"
              >
                <FileCheck className="w-4 h-4 flex-shrink-0" />
                Download PD Documentation Packet (program description, invoice template, credentials)
              </a>
              <p className="text-xs text-slate-500">
                Need a W-9 or want to pay by purchase order?{' '}
                <a href="mailto:rob@behaviorschool.com?subject=District%20Enrollment%20%E2%80%94%20Transformation%20Program" className="text-[#e4b63d] font-semibold underline underline-offset-2">
                  Email rob@behaviorschool.com
                </a>{' '}
                — we&apos;ll send everything same day.
              </p>
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Copy and forward to your supervisor</p>
                <div className="bg-slate-900 border border-white/10 rounded-lg p-4 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line select-all">{`Subject: PD Approval Request — School BCBA Transformation Program

I'd like to attend a 6-week PD cohort for school-based BCBAs led by Rob Spain, BCBA (25+ years in school settings, CalABA invited speaker).

This program addresses three problems directly:
1. Assessment & FBA quality — builds a replicable, legally defensible process I can apply across my caseload.
2. Staff implementation — structured training that reduces re-intervention time and improves consistency.
3. Caseload sustainability — systems that prevent the burnout that leads to BCBA turnover ($40–60K to replace).

6 sessions, Thursdays 6–8 PM PT, March 26 – May 7, 2026. Cost: $2,499.
Details: behaviorschool.com/transformation-program`}</div>
              </div>
            </div>
          </details>
        </div>
      </section>

      <ProgramApplication />

    </div>
  );
}
