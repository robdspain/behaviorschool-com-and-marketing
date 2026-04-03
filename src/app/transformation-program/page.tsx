'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Users, Target, CheckCircle, Calendar, FileCheck, BookOpen, ClipboardList, BarChart3, AlertCircle } from 'lucide-react';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import { ProgramApplication } from '@/components/ProgramApplication';

const FULL_PAY_LINK = 'https://buy.stripe.com/14AaEWdmIekU2Mc1OK6Vq01';
const FULL_PAY_PRICE = '$2,497';
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
    build: "A tiered assessment framework, plus a scalable intake process that filters behavioral concerns by severity level to route each student to the appropriate level of assessment, without burning you out.",
    deliverable: "Your personal assessment decision tree, intake form, and referral routing guide.",
    icon: ClipboardList,
  },
  {
    week: 2,
    title: "Data Collection Systems",
    pain: '"My data sheets are all different and RBTs don\'t use them."',
    build: "A standardized data collection toolkit built for your specific caseload, in formats RBTs will actually use consistently.",
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
    build: "A 1-page implementation guide and fidelity checklist for each BIP, so everyone on your team knows exactly what to do.",
    deliverable: "Staff communication plans.",
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
      animate={{ scale: 1, color: '#1f4d3f' }}
      transition={{ duration: 0.4 }}
      className="font-bold text-3xl tabular-nums"
    >
      {displayed}
    </motion.span>
  );
}

export default function TransformationProgramPage() {
  return (
    <div className="min-h-screen bg-white relative pt-0">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#f7f3ee]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#e4b63d22,transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f4d3f12_1px,transparent_1px),linear-gradient(to_bottom,#1f4d3f12_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-20 sm:pb-28">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center mt-8 sm:mt-10">
            <div className="text-center lg:text-left">
              <motion.div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {['Live cohort', '6 weeks', 'BCBAs only', 'School-based'].map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-full border border-[#1f4d3f]/20 bg-white text-xs font-semibold text-[#1f4d3f] uppercase tracking-wide">
                    {item}
                  </span>
                ))}
              </motion.div>
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1a1a1a] leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                You Became a BCBA to Help Kids.{' '}
                <span className="text-[#1f4d3f]">Not to Drown in Paperwork.</span>
              </motion.h1>
              <motion.p
                className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                By the end of this program, you will leave work at contract time, with systems that actually run without you.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <a
                  href="#curriculum"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f4d3f] hover:bg-[#123628] text-white font-semibold text-sm px-8 py-3 transition-colors"
                >
                  See What You&apos;ll Build <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={CALENDLY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-[#1f4d3f]/40 bg-white hover:bg-[#1f4d3f]/5 text-[#1f4d3f] font-semibold text-sm px-8 py-3 transition-colors"
                >
                  Book a 15-min Call First
                </a>
              </motion.div>
            </div>

            <motion.div
              className="relative max-w-[520px] mx-auto lg:ml-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-[1.75rem] p-3 bg-white border border-[#1f4d3f]/10 shadow-lg">
                <div className="relative rounded-[1.5rem] overflow-hidden aspect-[4/3] bg-[#f1f5f9]">
                  <Image
                    src="/optimized/Hero/11D67BC4-55A4-4549-A776-84E87EDED35F.webp"
                    alt="School-based BCBA systems in action"
                    width={640}
                    height={480}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Cohort dates callout */}
        <div className="max-w-2xl mx-auto px-4 mt-14">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#1f4d3f]/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-[#1f4d3f] flex-shrink-0" />
                  <span className="text-[#1f4d3f] font-semibold text-xs uppercase tracking-widest">Next Cohort, April 2026</span>
                </div>
                <p className="text-[#1a1a1a] font-semibold text-sm mb-1">Thursdays &middot; 6:00 to 8:00 PM PT</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {['Apr 9', 'Apr 16', 'Apr 23', 'Apr 30', 'May 7', 'May 14'].map((d) => (
                    <span key={d} className="text-[#1f4d3f] font-semibold text-sm">{d}</span>
                  ))}
                </div>
              </div>
              {/* Spots remaining */}
              <div className="flex-shrink-0 text-center bg-[#1f4d3f]/5 rounded-xl px-5 py-3 border border-[#1f4d3f]/10">
                <AnimatedSpots remaining={SPOTS_REMAINING} />
                <p className="text-[#1f4d3f] text-xs font-semibold uppercase tracking-widest mt-0.5">spots left</p>
                <p className="text-slate-500 text-xs mt-1">of {TOTAL_SPOTS} total</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f] text-center mb-3">The Reality</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1a1a1a] mb-4">Sound Familiar?</h2>
          <p className="text-slate-600 text-center mb-14 text-lg leading-relaxed max-w-2xl mx-auto">These are the real problems school-based BCBAs bring to this program.</p>
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
                className="rounded-xl bg-white border border-gray-200 p-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="flex gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-[#e4b63d] flex-shrink-0 mt-0.5" />
                  <p className="text-[#1a1a1a] font-semibold leading-snug text-sm">{item.quote}</p>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 sm:py-28 bg-[#f9f7f2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f] text-center mb-3">Eligibility</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1a1a1a] mb-4">Who This Program Is For</h2>
          <p className="text-center text-slate-600 mb-12 text-lg leading-relaxed">This cohort is for school-based BCBAs who are serious about building systems that last.</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              "You hold a BCBA certification and work in a K-12 school or district",
              "Your caseload feels overwhelming and you want a real system for it",
              "You're tired of rewriting the same documents with no template to start from",
              "You want to lead your team effectively, not just complete compliance tasks",
              "You're ready to do the work, not just watch videos and get a certificate",
              "You want tools you can use the next day, not theory you'll forget in a week",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-5 rounded-xl bg-white border border-gray-200">
                <CheckCircle className="w-5 h-5 text-[#1f4d3f] flex-shrink-0 mt-0.5" />
                <p className="text-slate-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-[#e4b63d]/30 bg-[#e4b63d]/5 p-5">
            <p className="text-[#1a1a1a] text-sm text-center leading-relaxed">
              This is not for RBTs, pre-certification BCaBAs, or general education professionals. It is designed specifically for certified BCBAs working in school settings.
            </p>
          </div>
        </div>
      </section>

      {/* Weekly Breakdown */}
      <section id="curriculum" className="py-20 sm:py-28 bg-white scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f] mb-3">The 6-Week Curriculum</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">What You&apos;ll Build Each Week</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">Each session is mapped to a specific pain point and ends with a deliverable you can use immediately.</p>
          </div>

          <div className="space-y-6">
            {weeklyModules.map((mod) => (
              <motion.div
                key={mod.week}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="bg-[#1f4d3f] text-white flex items-center justify-center md:flex-col gap-2 md:gap-1 px-6 py-4 md:py-8 md:w-24 flex-shrink-0">
                    <span className="text-xs text-white/70 uppercase font-semibold tracking-widest">Week</span>
                    <span className="text-3xl font-bold leading-none">{mod.week}</span>
                  </div>
                  <div className="p-6 md:p-8 flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-10 h-10 rounded-lg bg-[#1f4d3f]/10 flex items-center justify-center flex-shrink-0">
                        <mod.icon className="w-5 h-5 text-[#1f4d3f]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1a1a1a] leading-tight mt-1.5">{mod.title}</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="rounded-lg bg-[#e4b63d]/5 border border-[#e4b63d]/15 p-4">
                        <p className="text-xs font-semibold text-[#1f4d3f] uppercase tracking-widest mb-2">The Pain</p>
                        <p className="text-[#1a1a1a] text-sm leading-relaxed">{mod.pain}</p>
                      </div>
                      <div className="rounded-lg bg-[#f9f7f2] border border-gray-200 p-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">What You Build</p>
                        <p className="text-slate-700 text-sm leading-relaxed">{mod.build}</p>
                      </div>
                      <div className="rounded-lg bg-[#1f4d3f]/5 border border-[#1f4d3f]/10 p-4">
                        <p className="text-xs font-semibold text-[#1f4d3f] uppercase tracking-widest mb-2">Your Deliverable</p>
                        <p className="text-slate-700 text-sm leading-relaxed">{mod.deliverable}</p>
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
      <section id="outcomes" className="py-20 sm:py-28 bg-[#1f4d3f] text-white scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#e4b63d] mb-3">Outcomes</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">By Week 6, You Will Have</h2>
            <p className="text-white/70 text-lg mb-2 max-w-2xl mx-auto leading-relaxed">Leave work at contract time. Stop writing FBAs at 10 PM. Have staff implement plans correctly the first time.</p>
            <p className="text-white/50 text-base">Concrete deliverables and real systems, not just new ideas.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "A tiered assessment framework for every student on your caseload",
              "Full referral system",
              "FBA templates with built-in quality checks you can stand behind in any IEP meeting",
              "Function-matched BIP templates organized by behavioral function",
              "Staff communication plans",
              "A progress monitoring dashboard with clear decision rules across your full caseload",
            ].map((outcome, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-5"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <CheckCircle className="w-5 h-5 text-[#e4b63d] flex-shrink-0 mt-0.5" />
                <p className="text-white text-sm leading-relaxed">{outcome}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Rob */}
      <section className="py-20 sm:py-28 bg-[#f9f7f2]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f] mb-3">Your Instructor</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-8">Rob Spain, BCBA, IBA</h2>
          <div className="text-left space-y-4 text-slate-600 text-base leading-relaxed">
            <p>Rob has spent 25+ years as a behavior analyst in school settings, including district-level practice, graduate teaching, and clinical work. He knows what it actually takes to run a caseload ethically in an environment that doesn&apos;t always make it easy.</p>
            <p>He&apos;s a CalABA invited speaker, President of the BAE SIG, and the person BCBAs call when they&apos;re stuck on a hard case. This program is built from the systems he&apos;s actually used, not from theory.</p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['25+ Years School-Based Practice', 'CalABA Invited Speaker', 'BCBA / IBA Certified', 'BAE SIG President'].map((item) => (
              <span key={item} className="px-4 py-2 rounded-full bg-white border border-[#1f4d3f]/15 text-[#1f4d3f] text-sm font-semibold">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-28 bg-white scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f] text-center mb-3">Common Questions</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1a1a1a] mb-14">Frequently Asked Questions</h2>
          <FAQAccordion items={[
            { question: "When does the next cohort start?", answer: "April 9, 2026. Sessions run Thursdays 6 to 8 PM PT, ending May 14. Maximum 20 participants." },
            { question: "What if I miss a live session?", answer: "All sessions are recorded and available in your student portal within 24 hours." },
            { question: "Can my district pay for this?", answer: "Yes. This program qualifies as professional development. We accept purchase orders and can provide a formal invoice for your business office. Email rob@behaviorschool.com to request district paperwork." },
            { question: "Is a W-9 available?", answer: "Yes, available on request. Email rob@behaviorschool.com and we'll send it same day." },
            { question: "Do you offer bulk enrollment for districts?", answer: "Yes. Contact us via Calendly or email rob@behaviorschool.com to discuss district group pricing." },
            { question: "Is this program approved for CEUs?", answer: "CEU applicability is being evaluated. Contact us for the most current information." },
          ]} />
        </div>
      </section>

      {/* Enroll */}
      <section id="enroll" className="py-20 sm:py-28 bg-[#123628] text-white scroll-mt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#e4b63d] mb-3">Enrollment</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Join the April 9 Cohort</h2>
          <p className="text-white/70 text-lg mb-3 max-w-xl mx-auto leading-relaxed">
            6 weeks. 20 seats max. School-based BCBAs only.
          </p>
          <p className="text-[#e4b63d] font-bold text-2xl mb-8">
            {FULL_PAY_PRICE}
          </p>

          <a
            href={FULL_PAY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-full bg-[#e4b63d] hover:bg-[#d4a637] text-[#123628] font-bold text-lg py-4 px-8 text-center transition-colors mb-4"
          >
            Join the April 9 Cohort
          </a>

          <p className="text-white/50 text-sm mb-2">
            Prefer to pay monthly?{' '}
            <a href={INSTALLMENT_LINK} target="_blank" rel="noopener noreferrer" className="text-[#e4b63d] font-semibold underline underline-offset-2">
              3 installments of $833/month
            </a>
          </p>

          <p className="text-white/40 text-xs mb-12">
            Questions before enrolling?{' '}
            <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="text-[#e4b63d] font-semibold underline underline-offset-2">
              Book a 15-minute call
            </a>
          </p>

          <details className="text-left bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <summary className="cursor-pointer px-6 py-4 font-semibold text-white/70 text-sm flex items-center justify-between list-none">
              <span>Getting district approval? We can help.</span>
              <span className="text-white/40 text-xs">tap to expand</span>
            </summary>
            <div className="px-6 pb-6 border-t border-white/10 pt-4 space-y-4">
              <p className="text-sm text-white/60 leading-relaxed">
                Many BCBAs have their district cover this as professional development. Here&apos;s what you need:
              </p>
              <a
                href="/transformation-program-pd-packet.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-[#e4b63d] transition-colors text-sm font-semibold text-[#e4b63d]"
              >
                <FileCheck className="w-4 h-4 flex-shrink-0" />
                Download PD Documentation Packet (program description, invoice template, credentials)
              </a>
              <p className="text-xs text-white/40">
                Need a W-9 or want to pay by purchase order?{' '}
                <a href="mailto:rob@behaviorschool.com?subject=District%20Enrollment%20-%20Transformation%20Program" className="text-[#e4b63d] font-semibold underline underline-offset-2">
                  Email rob@behaviorschool.com
                </a>{' '}
                and we&apos;ll send everything same day.
              </p>
              <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Copy and forward to your supervisor</p>
                <div className="bg-[#0d1f17] border border-white/10 rounded-lg p-4 text-xs text-white/60 leading-relaxed font-mono whitespace-pre-line select-all">{`Subject: PD Approval Request, School BCBA Transformation Program

I'd like to attend a 6-week PD cohort for school-based BCBAs led by Rob Spain, BCBA (25+ years in school settings, CalABA invited speaker).

This program addresses three problems directly:
1. Assessment and FBA quality: builds a replicable, legally defensible process I can apply across my caseload.
2. Staff implementation: structured training that reduces re-intervention time and improves consistency.
3. Caseload sustainability: systems that prevent the burnout that leads to BCBA turnover ($40-60K to replace).

6 sessions, Thursdays 6 to 8 PM PT, April 9 to May 14, 2026. Cost: $2,497.
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
