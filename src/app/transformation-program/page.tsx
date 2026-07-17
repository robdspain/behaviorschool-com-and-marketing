'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  CalendarDays,
  Check,
  ClipboardCheck,
  FileCheck,
  Network,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import { ProgramApplication } from '@/components/ProgramApplication';

const OFFER_PRICE = '$1,997';
const PAYMENT_PLAN = '3 payments of $697';
const CALENDLY_LINK = 'https://calendly.com/robspain/behavior-school-transformation-system-phone-call';
const DISTRICT_EMAIL_LINK = '/contact';
const COHORT_DATE_RANGE = 'August 12 to September 16, 2026';

const practiceGaps = [
  {
    icon: SearchCheck,
    title: 'Assessment confidence',
    copy: 'Decide when indirect and descriptive data are sufficient, when more assessment is warranted, and what question the next step must answer.',
  },
  {
    icon: ShieldCheck,
    title: 'School feasibility',
    copy: 'Adapt assessment methods to schedules, staffing, space, safety, consent, and the responsibilities of your role.',
  },
  {
    icon: BrainCircuit,
    title: 'Intervention fit',
    copy: 'Connect assessment evidence to plans that account for function, context, student skills, and the people responsible for implementation.',
  },
  {
    icon: Network,
    title: 'Systems leadership',
    copy: 'Lead the decisions, communication, training, and review routines that turn a written plan into coordinated school practice.',
  },
];

const assessmentContinuum = [
  { label: 'Indirect', detail: 'Interviews and records' },
  { label: 'Descriptive', detail: 'Direct observation' },
  { label: 'Ecological', detail: 'Context and systems' },
  { label: 'Adapted FA', detail: 'Focused experimental tests' },
  { label: 'Formal FA', detail: 'Controlled analysis' },
];

const faFormats = [
  ['Brief FA', 'Focused experimental comparisons when time and access are constrained.'],
  ['School-friendly or precursor functional analysis', 'Earlier, observable responses can provide a safer and more workable analysis target when appropriate.'],
  ['Latency FA', 'Latency as the dependent measure when repeated responding is unnecessary or impractical.'],
  ['Synthesized approaches', 'IISCA-informed assessment concepts, boundaries, and decisions relevant to school practice.'],
  ['Analog and formal FA', 'When a more controlled analysis is justified and feasible within competence and local requirements.'],
];

const weeklyModules = [
  {
    week: '01',
    title: 'From referral to assessment decision',
    focus: 'Build a repeatable way to clarify the concern, review context, and select an assessment path proportionate to the case.',
    applied: 'Apply the decision process to a current student, team, or referral system.',
    artifact: 'Assessment decision framework and referral map',
  },
  {
    week: '02',
    title: 'Building confidence in behavioral function',
    focus: 'Integrate interview, record review, direct observation, ecological variables, and competing hypotheses without overstating certainty.',
    applied: 'Audit the evidence and confidence level in a current functional hypothesis.',
    artifact: 'Hypothesis confidence rubric and evidence map',
  },
  {
    week: '03',
    title: 'School-adapted functional analysis',
    focus: 'Study research-supported FA formats and plan practical adaptations around school constraints, safety, assent, and authorization.',
    applied: 'Draft an analysis plan or a decision memo explaining why an FA is or is not indicated.',
    artifact: 'Adapted FA planning and safety guide',
  },
  {
    week: '04',
    title: 'ACT-informed functional assessment',
    focus: 'Examine values, private events, rigid rules, avoidance, precursors, and context when observable contingencies do not fully answer the question.',
    applied: 'Use an ACT-informed interview or mapping process where it fits your role and case.',
    artifact: 'ACT-informed assessment pathway',
  },
  {
    week: '05',
    title: 'From assessment evidence to intervention',
    focus: 'Translate what the team knows into feasible prevention, teaching, reinforcement, response, and progress-monitoring decisions.',
    applied: 'Review or revise one current plan against its assessment evidence.',
    artifact: 'Evidence-to-intervention alignment check',
  },
  {
    week: '06',
    title: 'Leading implementation through teams',
    focus: 'Build the communication, training, fidelity, review, and escalation routines needed to lead behavior support through other people.',
    applied: 'Run or prepare a staff implementation cycle in your current setting.',
    artifact: 'Team implementation system and 90-day plan',
  },
];

const deliverables = [
  'Assessment decision framework',
  'Ecological and systems review',
  'Hypothesis confidence rubric',
  'Adapted FA planning guide',
  'ACT-informed assessment pathway',
  'Evidence-to-intervention check',
  'Staff training and fidelity routine',
  'Caseload review and escalation system',
  '90-day implementation plan',
];

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={`${className} motion-reduce:!transform-none motion-reduce:!opacity-100 motion-reduce:!blur-none`}
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionIntro({ label, title, copy }: { label: string; title: string; copy?: string }) {
  return (
    <Reveal className="max-w-3xl">
      <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#1f4d3f]">
        <span className="h-0.5 w-8 bg-[#d3a52f]" aria-hidden="true" />
        {label}
      </p>
      <h2 className="text-balance text-3xl font-bold leading-tight tracking-normal text-gray-900 sm:text-5xl">
        {title}
      </h2>
      {copy && <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52605b]">{copy}</p>}
    </Reveal>
  );
}

export default function TransformationProgramPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="overflow-hidden bg-white text-gray-900">
      <section className="relative overflow-hidden bg-[#0a1512] text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-[12%] -top-[35%] h-[70%] w-[55%] rounded-full bg-emerald-600/15 blur-[120px]" />
          <div className="absolute -bottom-[35%] -right-[10%] h-[75%] w-[55%] rounded-full bg-blue-600/10 blur-[140px]" />
          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-20 lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <motion.h1
              className="text-balance text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl"
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              Move from crisis responder to systems leader.
            </motion.h1>
            <motion.p
              className="mt-7 max-w-2xl text-pretty text-lg font-light leading-8 text-slate-300 sm:text-xl"
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              Build the assessment judgment, school-adapted functional-analysis skills, ACT-informed tools, and implementation systems needed to lead behavior support across classrooms and teams.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col gap-3 sm:flex-row"
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <a
                href={CALENDLY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-slate-900 shadow-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Book a fit call <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#curriculum"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-sm transition-[transform,background-color,border-color] duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Explore the curriculum <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </motion.div>
          </div>

          <motion.div
            className="relative mx-auto w-full max-w-[600px] lg:ml-auto"
            initial={reduceMotion ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 48, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute -inset-4 rounded-[2.5rem] bg-emerald-500/20 blur-[42px]" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-xl sm:p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/optimized/Hero/Hero-group1-optimized.webp"
                  alt="School-based behavior professionals collaborating"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative border-t border-white/10 bg-white/[0.035] backdrop-blur-md">
          <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
            {[
              ['Dates', 'Aug 12–Sep 16'],
              ['Format', '6 live sessions'],
              ['Cohort', '12 participants'],
              ['Tuition', OFFER_PRICE],
            ].map(([label, value], index) => (
              <div key={label} className={`py-5 ${index % 2 ? 'pl-5' : 'pr-5'} ${index > 0 ? 'lg:border-l lg:border-white/15 lg:pl-7' : ''}`}>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">{label}</p>
                <p className="mt-1 text-sm font-semibold text-white sm:text-base">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#f5f7f6] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionIntro
            label="The shift"
            title="School practice asks for more than a standard FBA workflow."
            copy="The work is not only completing an assessment or writing a plan. It is choosing the right level of assessment, adapting evidence-based methods to school reality, and leading people through implementation."
          />
          <div className="mt-16 border-y border-black/10">
            {practiceGaps.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="grid gap-5 border-b border-black/10 py-8 last:border-b-0 sm:grid-cols-[64px_220px_1fr] sm:items-center">
                  <item.icon className="h-8 w-8 text-[#1f4d3f]" strokeWidth={1.6} aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-[#173f35]">{item.title}</h3>
                  <p className="max-w-2xl leading-7 text-[#52605b]">{item.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionIntro
            label="One connected practice"
            title="Assessment, intervention, and implementation belong in the same system."
            copy="The program connects decisions that are often taught separately, then places systems leadership underneath the entire process."
          />
          <div className="relative mt-16 grid gap-5 lg:grid-cols-3">
            <motion.div
              className="absolute left-[13%] right-[13%] top-7 hidden h-px origin-left bg-[#d3a52f] lg:block"
              initial={{ scaleX: reduceMotion ? 1 : 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            />
            {[
              ['01', 'Assessment', 'Clarify the question, select the level of assessment, and judge confidence in function.'],
              ['02', 'Intervention', 'Translate evidence into feasible prevention, teaching, reinforcement, and response decisions.'],
              ['03', 'Implementation', 'Train, monitor, review, and adjust with the people who carry the plan into daily practice.'],
            ].map(([number, title, copy], index) => (
              <Reveal key={title} delay={index * 0.12} className="relative bg-white pt-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#1f4d3f] bg-white text-sm font-bold text-[#1f4d3f] shadow-[0_0_0_8px_white]">
                  {number}
                </div>
                <h3 className="mt-7 text-2xl font-semibold">{title}</h3>
                <p className="mt-3 max-w-sm leading-7 text-[#52605b]">{copy}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 border-l-2 border-[#d3a52f] bg-[#12372e] px-7 py-8 text-white sm:px-10">
            <div className="grid gap-5 sm:grid-cols-[220px_1fr] sm:items-center">
              <p className="text-xl font-semibold">Systems leadership</p>
              <p className="max-w-3xl leading-7 text-white/75">Lead the communication, decision rules, staff development, and review routines that keep the process coherent across cases and teams.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#112f28] py-24 text-white sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Reveal className="max-w-4xl">
            <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#d9bd70]">
              <span className="h-0.5 w-8 bg-[#d3a52f]" aria-hidden="true" /> Assessment judgment
            </p>
            <h2 className="text-balance text-3xl font-semibold leading-[1.08] sm:text-5xl">Not every student needs a functional analysis. More cases may benefit from one than you currently recognize.</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">Learn to move through an assessment continuum deliberately, stopping when the evidence is sufficient and moving further when the question, confidence, risk, and feasibility justify it.</p>
          </Reveal>

          <div className="relative mt-16">
            <div className="absolute left-5 top-0 h-full w-px bg-white/15 sm:left-0 sm:right-0 sm:top-5 sm:h-px sm:w-auto" aria-hidden="true" />
            <motion.div
              className="absolute left-5 top-0 w-px origin-top bg-[#d3a52f] sm:left-0 sm:right-auto sm:top-5 sm:h-px sm:w-full sm:origin-left"
              initial={{ scaleY: reduceMotion ? 1 : 0, scaleX: reduceMotion ? 1 : 0 }}
              whileInView={{ scaleY: 1, scaleX: 1 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            />
            <div className="grid gap-8 sm:grid-cols-5 sm:gap-4">
              {assessmentContinuum.map((item, index) => (
                <Reveal key={item.label} delay={index * 0.09} className="relative pl-14 sm:pl-0 sm:pt-12">
                  <span className="absolute left-3 top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#d3a52f] bg-[#112f28] sm:left-0 sm:top-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d3a52f]" />
                  </span>
                  <p className="font-semibold">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-white/55">{item.detail}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <p className="mt-12 max-w-3xl border-l border-[#d3a52f] pl-5 text-sm leading-6 text-white/60">Any functional analysis must fit the practitioner’s competence, role, authorization, safety planning, assent practices, and local requirements.</p>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12">
          <SectionIntro
            label="Functional analysis"
            title="Bring established methods into school reality."
            copy="Study formats found in the research literature but still difficult to translate into everyday school practice. The goal is not to run the same analysis for every case; it is to select and adapt methods with sound judgment."
          />
          <div className="border-t border-black/10">
            {faFormats.map(([title, copy], index) => (
              <Reveal key={title} delay={index * 0.05}>
                <div className="grid gap-2 border-b border-black/10 py-6 sm:grid-cols-[180px_1fr]">
                  <h3 className="font-semibold text-[#173f35]">{title}</h3>
                  <p className="leading-7 text-[#52605b]">{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#eef2f0] py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-start lg:px-12">
          <div>
            <SectionIntro
              label="ACT-informed assessment"
              title="When observable contingencies do not tell the whole story."
              copy="ACT-informed tools can help organize assessment when language, rules, avoidance, private events, and values appear relevant to the student’s behavior and context."
            />
            <Reveal className="mt-8">
              <p className="max-w-2xl leading-7 text-[#52605b]">The program focuses on using these concepts within behavior-analytic assessment and school practice, then connecting what you learn to observable goals, environmental supports, and team action.</p>
            </Reveal>
          </div>
          <Reveal className="border-l-2 border-[#d3a52f] bg-white p-7 shadow-[0_18px_50px_rgba(19,45,37,.08)] sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1f4d3f]">Questions you will practice</p>
            <ul className="mt-7 space-y-5">
              {[
                'What does the student say or do when difficult private events show up?',
                'Are rigid rules or avoidance patterns narrowing workable behavior?',
                'What values and meaningful directions can inform goals and supports?',
                'How can interview and mapping tools guide observable assessment and action?',
              ].map((item) => (
                <li key={item} className="flex gap-3 leading-7 text-[#394641]">
                  <Sparkles className="mt-1 h-5 w-5 shrink-0 text-[#b78813]" strokeWidth={1.7} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionIntro
            label="Designed for school BCBAs"
            title="For the BCBA who knows the basics and needs a stronger school practice."
            copy="Your years in the field matter less than the work in front of you. This cohort is built for certified BCBAs responsible for behavior support in a K–12 school or district."
          />
          <div className="mt-14 grid gap-x-12 gap-y-0 border-y border-black/10 md:grid-cols-2">
            {[
              'You make assessment and intervention decisions for current school cases.',
              'You want practical experience selecting and adapting functional-analysis methods.',
              'You train staff and need implementation to extend beyond your direct involvement.',
              'You encounter behavior involving avoidance, language, rules, or complex context.',
              'You are entering school practice and want a strong operating system from the start.',
              'You are ready to apply the work to a student, staff member, team, or system each week.',
            ].map((item, index) => (
              <Reveal key={item} delay={(index % 2) * 0.05}>
                <div className="flex min-h-28 items-start gap-4 border-b border-black/10 py-7 md:last:border-b-0">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#1f4d3f]" strokeWidth={2.2} aria-hidden="true" />
                  <p className="max-w-lg leading-7 text-[#394641]">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-7 max-w-3xl text-sm leading-6 text-[#6b746f]">This is an applied professional-development cohort for certified BCBAs. It is not exam preparation or a passive template library.</p>
        </div>
      </section>

      <section id="curriculum" className="scroll-mt-20 bg-[#f5f7f6] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionIntro
            label="Six-week curriculum"
            title="Practice the decisions a systems leader has to make."
            copy="Each week connects instruction to applied work in your current setting, to the best of your ability and within your role, competence, permissions, and local requirements."
          />
          <div className="mt-16 border-t border-black/10">
            {weeklyModules.map((module, index) => (
              <Reveal key={module.week} delay={index * 0.04}>
                <article className="grid gap-6 border-b border-black/10 py-9 lg:grid-cols-[72px_1.05fr_1fr] lg:gap-10">
                  <p className="text-3xl font-semibold text-[#b78813]">{module.week}</p>
                  <div>
                    <h3 className="text-2xl font-semibold text-[#173f35]">{module.title}</h3>
                    <p className="mt-4 leading-7 text-[#52605b]">{module.focus}</p>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#68746f]">Applied work</p>
                      <p className="mt-2 text-sm leading-6 text-[#394641]">{module.applied}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#68746f]">Working artifact</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#173f35]">{module.artifact}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#173f35] py-24 text-white sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12">
          <Reveal>
            <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#d9bd70]">
              <span className="h-0.5 w-8 bg-[#d3a52f]" aria-hidden="true" /> Applied resources
            </p>
            <h2 className="text-balance text-3xl font-semibold leading-[1.08] sm:text-5xl">What you build and practice.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">These working resources support the applied activities across the cohort. They are tools for judgment and implementation, not substitutes for individualized assessment.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2">
            {deliverables.map((item, index) => (
              <Reveal key={item} delay={(index % 3) * 0.05}>
                <div className="flex min-h-20 items-center gap-3 border-b border-white/15 py-5 sm:pr-6">
                  <ClipboardCheck className="h-5 w-5 shrink-0 text-[#d9bd70]" strokeWidth={1.8} aria-hidden="true" />
                  <p className="font-medium text-white/90">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[360px_1fr] lg:items-center lg:px-12">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#eef2f0]">
            <Image src="/optimized/profile-Rob.webp" alt="Rob Spain" fill loading="eager" sizes="(min-width: 1024px) 360px, 100vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#1f4d3f]">
              <span className="h-0.5 w-8 bg-[#d3a52f]" aria-hidden="true" /> Your instructor
            </p>
            <h2 className="text-4xl font-semibold sm:text-5xl">Rob Spain, BCBA, IBA</h2>
            <div className="mt-7 max-w-2xl space-y-5 text-lg leading-8 text-[#52605b]">
              <p>Rob brings more than 25 years of behavior-analytic work across school, district, teaching, and clinical settings.</p>
              <p>He developed this cohort around the decisions school BCBAs face in practice: choosing an appropriate assessment path, adapting functional analysis to school constraints, connecting evidence to intervention, and leading implementation through teams.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 border-y border-black/10 bg-[#f5f7f6] py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <SectionIntro label="Questions" title="Program details, without the fine-print maze." />
          <FAQAccordion
            className="mt-12"
            items={[
              { question: 'When does the next cohort start?', answer: 'The next cohort runs August 12 through September 16, 2026. Six live sessions meet Wednesdays from 6:00 to 8:00 PM Pacific. Cohort capacity is 12 participants.' },
              { question: 'What if I miss a live session?', answer: 'Sessions are recorded and made available in the student portal within 24 hours.' },
              { question: 'Are CEUs included?', answer: 'Yes. CEUs are included with the program. Completion and participation requirements will be provided with enrollment materials.' },
              { question: 'What applied work is expected between sessions?', answer: 'To the best of your ability, apply each week’s work directly to a student, staff member, team, or system in your current setting. All application must remain within your role, competence, permissions, safety procedures, and local requirements.' },
              { question: 'Does every student need a functional analysis?', answer: 'No. Every case requires thoughtful functional assessment, but not every case requires an experimental functional analysis. You will practice deciding when existing evidence is sufficient and when an adapted FA may add useful confidence.' },
              { question: 'What types of functional analysis does the program address?', answer: 'The program addresses research-supported formats that are practical or adaptable for school sites, including brief, latency, precursor, synthesized or IISCA-informed, and analog functional analyses. Selection depends on the case, setting, competence, safety, authorization, and feasibility.' },
              { question: 'Is this an IISCA or Skill-Based Treatment certification?', answer: <>No. The Transformation Program discusses synthesized functional analysis and Skill-Based Treatment where relevant, but it is not an IISCA, PFA, or SBT certification. Specialized training is available through <a className="font-semibold text-[#1f4d3f] underline decoration-[#d3a52f] underline-offset-4" href="https://ftfbc.com" target="_blank" rel="noopener noreferrer">FTF Behavioral Consulting</a>.</> },
              { question: 'Is the program appropriate for a BCBA entering schools?', answer: 'Yes. A BCBA entering schools can use the cohort to build a strong school-specific operating system from the start. The program assumes BCBA-level knowledge and focuses on applying that knowledge in school contexts.' },
              { question: 'Can my district pay?', answer: 'Yes. District purchase orders and invoice payments are accepted. Seats are held after a signed purchase order or written district payment approval is received. A W-9 and program documentation are available on request.' },
              { question: 'What is the refund window?', answer: 'You may request a refund within five calendar days of payment. After that window, cohort seats are committed and are not refundable except where required by law.' },
            ]}
          />
        </div>
      </section>

      <section id="enroll" className="scroll-mt-20 bg-[#0e2b24] py-24 text-white sm:py-32">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d9bd70]">August 2026 cohort</p>
            <h2 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.04] sm:text-6xl">Build a stronger practice for the school system you are already leading.</h2>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/70">Six live sessions from August 12 to September 16. Cohort capacity is 12 certified BCBAs.</p>
          </Reveal>
          <Reveal delay={0.08} className="mx-auto mt-12 max-w-3xl border-y border-white/15 py-9">
            <div className="grid gap-7 sm:grid-cols-2 sm:divide-x sm:divide-white/15">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Pay in full</p>
                <p className="mt-2 text-4xl font-semibold text-white">{OFFER_PRICE}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Payment plan</p>
                <p className="mt-2 text-3xl font-semibold text-white">{PAYMENT_PLAN}</p>
                <p className="mt-2 text-sm text-white/55">Billed automatically once per month for three months.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.14} className="mx-auto mt-9 max-w-xl">
            <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#d3a52f] px-7 py-4 text-lg font-bold text-[#102e27] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#e2ba4c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              Book a fit call <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
            <p className="mt-5 text-sm leading-6 text-white/55">District purchase order or invoice needed? <a href={DISTRICT_EMAIL_LINK} className="font-semibold text-[#d9bd70] underline underline-offset-4">Contact us for the paperwork.</a></p>
          </Reveal>

          <details className="mx-auto mt-12 max-w-3xl border border-white/15 text-left">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              District professional-development request
              <FileCheck className="h-5 w-5 shrink-0 text-[#d9bd70]" aria-hidden="true" />
            </summary>
            <div className="border-t border-white/15 px-6 py-6 text-sm leading-7 text-white/65">
              <p>Use the program documentation packet to share the cohort’s dates, curriculum, instructor credentials, and tuition with your supervisor or purchasing office.</p>
              <a href="/transformation-program-pd-packet.pdf" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/25 px-4 py-2 font-semibold text-white transition-colors hover:border-[#d9bd70] hover:text-[#d9bd70]">
                <BookOpenCheck className="h-4 w-4" aria-hidden="true" /> View the documentation packet
              </a>
            </div>
          </details>
        </div>
      </section>

      <ProgramApplication />
    </main>
  );
}
