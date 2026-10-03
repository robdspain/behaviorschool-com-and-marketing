'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Users, Target, CheckCircle, ChevronDown, FileCheck, FlaskConical, ClipboardList, BarChart3, AlertCircle } from 'lucide-react';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import { ProgramApplication } from '@/components/ProgramApplication';
import { getFounderEducationYears, FOUNDER_EDUCATION_START_LABEL } from '@/lib/founder-tenure';
import { cohortScheduleEntries, keepMonthAndDayTogether, TRANSFORMATION_PAYMENT_PLAN_SENTENCE, TRANSFORMATION_PROGRAM, TRANSFORMATION_SESSION_TITLES, transformationProgramFaqItems } from '@/lib/transformation-program';

const OFFER_PRICE = TRANSFORMATION_PROGRAM.pricing.payInFull;
const PAYMENT_PLAN_SENTENCE = TRANSFORMATION_PAYMENT_PLAN_SENTENCE;
const CALENDLY_LINK = TRANSFORMATION_PROGRAM.calendlyUrl;
const DISTRICT_EMAIL_LINK = '/contact';

const PROGRAM_NAME = TRANSFORMATION_PROGRAM.name;
const COHORT_LABEL = TRANSFORMATION_PROGRAM.cohort.label;
const COHORT_START_BADGE = TRANSFORMATION_PROGRAM.cohort.startBadge;
const COHORT_DATE_RANGE = TRANSFORMATION_PROGRAM.cohort.dateRange;
const COHORT_SESSION_TIME = TRANSFORMATION_PROGRAM.cohort.sessionTime;
const COHORT_SUMMARY = TRANSFORMATION_PROGRAM.cohort.summaryHeadline;
const COHORT_SUMMARY_DETAIL = TRANSFORMATION_PROGRAM.cohort.summaryDetail;
const APPLICATIONS_CLOSE_SHORT = TRANSFORMATION_PROGRAM.cohort.applicationsCloseShort;
const SCHEDULE_ENTRIES = cohortScheduleEntries();
const SESSION_MODULES = SCHEDULE_ENTRIES.filter((entry) => !entry.skipped);
const COHORT_SCHEDULE = TRANSFORMATION_PROGRAM.cohort.scheduleLabel;
const COHORT_SCHEDULE_SENTENCE = `${COHORT_SCHEDULE.charAt(0).toUpperCase()}${COHORT_SCHEDULE.slice(1)}`;
const COHORT_SEAT_CAP = TRANSFORMATION_PROGRAM.cohort.seatCap;
const APPLICATIONS_CLOSE_LABEL = TRANSFORMATION_PROGRAM.cohort.applicationsCloseLabel;
const ONLINE_EVENT_DESCRIPTION_PUBLISHED = 'August 11, 2026';

const weeklyModules = [
  {
    week: 1,
    title: TRANSFORMATION_SESSION_TITLES[0],
    pain: 'Managing functional behavior assessment referrals without a clear triage system.',
    build: "A tiered assessment framework, plus a scalable intake process that filters behavioral concerns by severity level to route each student to the appropriate level of assessment, without burning you out.",
    deliverable: "Your personal assessment decision tree, intake form, and referral routing guide.",
    objectives: ["Design a tiered assessment routing process for a school caseload.", "Apply decision rules to select assessment intensity using referral data.", "Evaluate an assessment intake workflow for feasibility and ethical fit in a school system."],
    icon: ClipboardList,
  },
  {
    week: 2,
    title: TRANSFORMATION_SESSION_TITLES[1],
    pain: 'Data systems that do not consistently support decisions across staff and students.',
    build: "A standardized data collection toolkit built for your specific caseload, in formats Registered Behavior Technicians will actually use consistently.",
    deliverable: "Master data sheet library covering frequency, duration, interval, and antecedent-behavior-consequence recording.",
    objectives: ["Select data systems that match behavior dimensions and decision needs.", "Design implementation supports that improve staff data fidelity.", "Evaluate a data toolkit for reliability, usability, and decision utility."],
    icon: BarChart3,
  },
  {
    week: 3,
    title: TRANSFORMATION_SESSION_TITLES[2],
    pain: 'Functional hypotheses that are difficult to defend or test in a school setting.',
    build: "A hypothesis generation process with function verification steps you can defend in any Individualized Education Program meeting.",
    deliverable: "Your own functional behavior assessment narrative template with built-in quality checks.",
    objectives: ["Synthesize indirect and direct assessment data into testable hypotheses.", "Apply function-verification decision rules to ambiguous school cases.", "Critique a functional behavior assessment narrative for evidentiary sufficiency and contextual fit."],
    icon: Target,
  },
  {
    week: 4,
    title: TRANSFORMATION_SESSION_TITLES[3],
    pain: 'Intervention plans that do not clearly follow from assessment findings.',
    build: "Function-matched intervention menus for attention, escape, tangible, and automatic reinforcement.",
    deliverable: "Behavior intervention plan template library organized by behavioral function.",
    objectives: ["Design function-matched intervention components from assessment findings.", "Differentiate intervention selections across common behavioral functions.", "Evaluate a behavior intervention plan for functional coherence and implementability."],
    icon: FileCheck,
  },
  {
    week: 5,
    title: TRANSFORMATION_SESSION_TITLES[4],
    pain: 'A gap between a written plan and consistent staff implementation.',
    build: "A 1-page implementation guide and fidelity checklist for each behavior intervention plan, so everyone on your team knows exactly what to do.",
    deliverable: "Staff communication plans.",
    objectives: ["Design a staff implementation protocol for a function-based behavior plan.", "Apply performance-feedback procedures to improve treatment integrity.", "Evaluate fidelity data to determine whether a plan or implementation support needs revision."],
    icon: Users,
  },
  {
    week: 6,
    title: TRANSFORMATION_SESSION_TITLES[5],
    pain: "Teams write behavior intervention plans from antecedent-behavior-consequence notes alone, then the plan fails when staff run it without you.",
    build: "A classroom functional analysis decision path across research-supported formats, with printable data sheets and a multielement graph workflow so you confirm the establishing operation before the team invests in a plan.",
    deliverable: "One de-identified school-safe functional analysis (or realistic simulation): data sheet, multielement graph, and a two-sentence interpretation.",
    objectives: [
      "Explain why descriptive antecedent-behavior-consequence assessment alone can misidentify function, and when an experimental analysis is warranted.",
      "Select a classroom-appropriate functional analysis format based on risk, setting, and schedule.",
      "Record functional analysis data on a printable data sheet, graph it as a multielement design, and state whether responding is differentiated.",
    ],
    icon: FlaskConical,
  },
];

const primaryCtaClass =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#e4b63d] px-6 py-3 text-base font-semibold text-[#171f1d] transition-colors hover:bg-[#d9a92f] hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]';
const textLinkClass =
  'inline-flex min-h-11 items-center text-base font-semibold text-[#1f4d3f] underline underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]';

function CohortCard() {
  return (
    <div className="rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] p-6 text-[#171f1d]">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#1f4d3f]">Next cohort: {COHORT_LABEL.replace(/ cohort$/i, '')}</p>
      <p className="mt-3 text-[1.375rem] font-semibold leading-snug sm:text-2xl">{keepMonthAndDayTogether(COHORT_SUMMARY)}</p>
      <p className="mt-1 text-base leading-snug sm:text-lg">{COHORT_SUMMARY_DETAIL}</p>
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#d9cdb8] pt-4">
        <div>
          <p className="text-sm font-semibold text-[#365548]">Tuition</p>
          <p className="text-base font-semibold">{OFFER_PRICE}</p>
          <p className="text-sm text-[#365548]">or 3 monthly payments of {TRANSFORMATION_PROGRAM.pricing.installment}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#365548]">Seats</p>
          <p className="text-base font-semibold">{COHORT_SEAT_CAP} in this cohort</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#365548]">Apply by</p>
          <p className="text-base font-semibold">{keepMonthAndDayTogether(APPLICATIONS_CLOSE_SHORT)}</p>
          <p className="text-sm text-[#365548]">earlier if seats fill</p>
        </div>
      </div>
      <a href="#apply" className={`${primaryCtaClass} mt-4 w-full`}>
        Apply for the January cohort <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
      <a href="#fit-call" className={`${textLinkClass} mt-1`}>
        Already applied? Book a fit call
      </a>
      <ol className="mt-4 grid grid-cols-1 gap-2 min-[391px]:grid-cols-2 lg:grid-cols-7">
        {SCHEDULE_ENTRIES.map((entry) => (
          <li
            key={`${entry.shortDate}-${entry.label}`}
            aria-label={entry.ariaLabel}
            className={
              entry.skipped
                ? 'flex min-h-11 items-center justify-between gap-3 rounded-lg border border-dashed border-[#d9cdb8] bg-transparent px-3 py-2 text-sm text-[#365548] lg:block'
                : 'flex min-h-11 items-center justify-between gap-3 rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] px-3 py-2 text-sm lg:block'
            }
          >
            <span className={`font-semibold ${entry.skipped ? '' : 'text-[#1f4d3f]'}`}>Thu, {entry.shortDate}</span>
            <span className="lg:mt-1 lg:block">{entry.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function TransformationProgramPage() {
  const founderEducationYears = getFounderEducationYears();
  const [districtOpen, setDistrictOpen] = useState(false);
  return (
    <div className="transformation-program min-h-screen bg-[#fbfaf6] relative pt-0">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#f4efe5]">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">
          <div className="flex flex-col">
            <motion.div
              className="order-1 mb-4 hidden flex-wrap items-center gap-2 lg:flex"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {['Live online', '6 sessions', 'School BCBAs', keepMonthAndDayTogether(COHORT_START_BADGE)].map((item) => (
                <span key={item} className="rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] px-3 py-1.5 text-sm font-semibold uppercase tracking-wide text-[#1f4d3f]">
                  {item}
                </span>
              ))}
            </motion.div>
            <h1 className="order-1 mb-4 text-[32px] font-semibold leading-[1.15] text-[#171f1d] sm:text-5xl">
              <span className="block">School BCBA Systems</span>
              <span className="block">Transformation</span>
              <span className="block">Program</span>
            </h1>
            <motion.div className="order-2 mt-2 lg:order-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
              <CohortCard />
            </motion.div>
            <p className="order-3 mt-6 text-lg font-semibold leading-snug text-[#171f1d] lg:order-2 lg:mt-0">
              You became a BCBA to help kids. Not to drown in paperwork.
            </p>
            <p className="order-4 mt-3 max-w-2xl text-base leading-relaxed text-[#365548] lg:order-3">
              Live online training for school BCBAs in kindergarten through 12th grade schools and districts. Over six Thursday sessions, {keepMonthAndDayTogether(TRANSFORMATION_PROGRAM.cohort.dateRange)}, from {COHORT_SESSION_TIME}, you build the assessment, functional behavior assessment, behavior intervention plan, data, and staff training systems your caseload runs on.
            </p>
          </div>
          <div className="relative mt-8 overflow-hidden rounded-lg border border-[#d9cdb8]">
            <Image
              src="/optimized/Hero/11D67BC4-55A4-4549-A776-84E87EDED35F.webp"
              alt="Four educators reviewing a tablet and a laptop together at a table, with a chalkboard graph and the Behavior School wordmark"
              width={1200}
              height={480}
              className="h-48 w-full object-cover sm:h-64"
            />
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 sm:py-28 bg-[#fbfaf6]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#1f4d3f] text-center mb-3">The Reality</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#171f1d] mb-4">Problems school BCBAs bring to this program</h2>
          <p className="text-[#365548] text-center mb-14 text-lg leading-relaxed max-w-2xl mx-auto">These are the real problems school BCBAs bring to this program.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { pain: "High-volume referral decisions", sub: "Use a tiered routing process before committing to a full assessment." },
              { pain: "Inconsistent data systems", sub: "Match measurement to the decision and make the process workable for staff." },
              { pain: "Unclear functional hypotheses", sub: "Organize indirect and direct assessment data into testable decisions." },
              { pain: "Plans that do not generalize to implementation", sub: "Connect assessment findings to practical, function-matched supports." },
              { pain: "Limited staff implementation support", sub: "Build protocols, training, and fidelity checks around the plan." },
              { pain: "Behavior intervention plans built on unverified function", sub: "Confirm the establishing operation with a classroom functional analysis before the team invests in a plan." },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="rounded-lg bg-[#fbfaf6] border border-[#d9cdb8] p-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="flex gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-[#1f4d3f] flex-shrink-0 mt-0.5" />
                  <p className="text-[#171f1d] font-semibold leading-snug text-base">{item.pain}</p>
                </div>
                <p className="text-[#365548] text-base leading-relaxed">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 sm:py-28 bg-[#f4efe5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#1f4d3f] text-center mb-3">Eligibility</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#171f1d] mb-4">Who this school BCBA training is for</h2>
          <p className="text-center text-[#365548] mb-12 text-lg leading-relaxed">
            {COHORT_SCHEDULE_SENTENCE} for practicing school BCBAs with a current caseload or systems problem and capacity to attend Thursday evenings. It is for school BCBAs who want a clearer way to connect assessment, intervention, staff implementation, and research approaches to functional behavior assessment in the classroom.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              "You are a certified BCBA working in a kindergarten through 12th grade school or district role",
              "You have a current caseload or systems problem you want to rebuild",
              "You can attend live Thursday sessions from 6 to 8 PM Pacific Time",
              "You will bring real work to apply between sessions, including share-outs in later sessions",
              "You want tools you can use the next day, not theory you'll forget in a week",
              "You are ready to do the work, not just watch videos and get a certificate",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-5 rounded-lg bg-[#fbfaf6] border border-[#d9cdb8]">
                <CheckCircle className="w-5 h-5 text-[#1f4d3f] flex-shrink-0 mt-0.5" />
                <p className="text-[#171f1d] text-base leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] p-5 space-y-3">
            <p className="text-[#171f1d] text-base text-center leading-relaxed">
              Who it is not for: Registered Behavior Technicians, Board Certified Assistant Behavior Analysts who are not yet certified, general education staff, and clinic-only BCBAs without a school role.
            </p>
            <p className="text-[#171f1d] text-base text-center leading-relaxed">
              {COHORT_SEAT_CAP} seats in this cohort. Apply by {APPLICATIONS_CLOSE_LABEL}. Applications may close earlier if all {COHORT_SEAT_CAP} seats fill. Acceptance requires a fit call; we may decline applicants who are not ready or not a fit.
            </p>
          </div>
        </div>
      </section>

      {/* Weekly Breakdown */}
      <section id="curriculum" className="py-20 sm:py-28 bg-[#fbfaf6] scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#1f4d3f] mb-3">The six-session curriculum</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#171f1d] mb-4">Six live sessions: the school BCBA systems curriculum</h2>
            <p className="text-[#365548] text-lg max-w-2xl mx-auto leading-relaxed">
              Each session is mapped to a specific pain point and ends with a deliverable you can use immediately. The work covers{' '}
              <a href="/functional-behavior-assessment-guide" className="font-semibold text-[#1f4d3f] underline underline-offset-4">functional behavior assessment</a>
              {' '}and{' '}
              <a href="/behavior-intervention-plan-examples" className="font-semibold text-[#1f4d3f] underline underline-offset-4">behavior intervention plan</a>
              {' '}systems for a school caseload.
            </p>
          </div>

          <div className="space-y-6">
            {weeklyModules.map((mod, index) => (
              <motion.div
                key={mod.week}
                className="bg-[#fbfaf6] rounded-lg border border-[#d9cdb8] overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="bg-[#1f4d3f] text-[#fbfaf6] flex items-center px-6 py-4 md:w-56 flex-shrink-0">
                    <span className="text-base font-semibold">{SESSION_MODULES[index]?.curriculumLabel}</span>
                  </div>
                  <div className="p-6 md:p-8 flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-11 h-11 rounded-lg bg-[#1f4d3f]/10 flex items-center justify-center flex-shrink-0">
                        <mod.icon className="w-5 h-5 text-[#1f4d3f]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#171f1d] leading-tight mt-1.5">{mod.title}</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="rounded-lg bg-[#f4efe5] border border-[#d9cdb8] p-4">
                        <p className="text-sm font-semibold text-[#1f4d3f] uppercase tracking-widest mb-2">The Challenge</p>
                        <p className="text-[#171f1d] text-base leading-relaxed">{mod.pain}</p>
                      </div>
                      <div className="rounded-lg bg-[#f4efe5] border border-[#d9cdb8] p-4">
                        <p className="text-sm font-semibold text-[#365548] uppercase tracking-widest mb-2">What You Build</p>
                        <p className="text-[#171f1d] text-base leading-relaxed">{mod.build}</p>
                      </div>
                      <div className="rounded-lg bg-[#f4efe5] border border-[#d9cdb8] p-4">
                        <p className="text-sm font-semibold text-[#1f4d3f] uppercase tracking-widest mb-2">Your Deliverable</p>
                        <p className="text-[#171f1d] text-base leading-relaxed">{mod.deliverable}</p>
                      </div>
                    </div>
                    <div className="mt-5 border-t border-[#d9cdb8] pt-4">
                      <p className="text-sm font-semibold text-[#365548] uppercase tracking-widest mb-2">Learning Objectives</p>
                      <ul className="space-y-2 text-base leading-relaxed text-[#171f1d]">
                        {mod.objectives.map((objective) => <li key={objective} className="flex gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#1f4d3f]" />{objective}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-[#f4efe5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#1f4d3f] text-center mb-3">Learning Continuing Education Information</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#171f1d] mb-8">Live session format and learning continuing education units</h2>
          <div className="space-y-4 text-[#171f1d] text-base leading-relaxed">
            <p>Each live online session is scheduled for {COHORT_SESSION_TIME} and includes 75 documented instructional minutes. It is structured for 1.5 Learning continuing education units after verified attendance and active participation.</p>
            <p><strong>Instructor:</strong> Rob Spain, BCBA, International Behavior Analyst. <strong>Affiliation disclosure:</strong> No relevant financial affiliation or conflict of interest to disclose.</p>
            <p><strong>Provider listing:</strong> Behavior School, Provider OP-26-12729. The Behavior Analyst Certification Board does not endorse or approve individual events. Learning continuing education documentation is issued only after provider authorization is independently confirmed in the Behavior Analyst Certification Board registry.</p>
            <p><strong>Online event description published:</strong> {ONLINE_EVENT_DESCRIPTION_PUBLISHED}. Feedback is offered after each session, and continuing education documentation is issued no later than 45 days after verified completion.</p>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section id="outcomes" className="on-forest py-20 sm:py-28 bg-[#1f4d3f] text-[#fbfaf6] scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#f4efe5] mb-3">Outcomes</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#fbfaf6] mb-4">What You Will Build</h2>
            <p className="text-[#fbfaf6] text-lg mb-2 max-w-2xl mx-auto leading-relaxed">Build concrete assessment, implementation, and review tools during the six-session program.</p>
            <p className="text-[#fbfaf6] text-base">Applied tools and structured decision processes, not just new ideas.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "A tiered assessment framework for every student on your caseload",
              "Full referral system",
              "Functional behavior assessment templates with built-in quality checks you can stand behind in any Individualized Education Program meeting",
              "Function-matched behavior intervention plan templates organized by behavioral function",
              "Staff communication plans",
              "A classroom functional analysis workflow across research-supported formats: printable data sheet and multielement graph",
            ].map((outcome, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-5"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <CheckCircle className="w-5 h-5 text-[#e4b63d] flex-shrink-0 mt-0.5" />
                <p className="text-[#fbfaf6] text-base leading-relaxed">{outcome}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Rob */}
      <section className="py-20 sm:py-28 bg-[#f4efe5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#1f4d3f] mb-3">Your Instructor</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#171f1d] mb-8">Rob Spain, BCBA, International Behavior Analyst</h2>
          <div className="text-left space-y-4 text-[#365548] text-base leading-relaxed">
            <p>Rob Spain is a BCBA and International Behavior Analyst with {founderEducationYears} years in education since {FOUNDER_EDUCATION_START_LABEL}. Learning continuing education documentation will not be issued until the instructor qualification and expertise record has been verified for the event.</p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['BCBA', 'International Behavior Analyst', 'School Practice'].map((item) => (
              <span key={item} className="inline-flex min-h-11 items-center px-4 rounded-lg bg-[#fbfaf6] border border-[#d9cdb8] text-[#1f4d3f] text-sm font-semibold">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-28 bg-[#fbfaf6] scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#1f4d3f] text-center mb-3">Common Questions</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#171f1d] mb-14">School BCBA Systems Transformation Program FAQ</h2>
          <FAQAccordion items={transformationProgramFaqItems()} />
        </div>
      </section>

      {/* Enroll */}
      <section id="enroll" className="py-20 sm:py-28 bg-[#f4efe5] text-[#171f1d] scroll-mt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#1f4d3f] mb-3">Enrollment</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#171f1d] mb-4">Apply for the {COHORT_LABEL}</h2>
          <p className="text-[#365548] text-base mb-3">Six live Thursdays. School BCBAs only. {COHORT_SEAT_CAP} seats in this cohort. {OFFER_PRICE}.</p>
          <p className="text-[#171f1d] text-lg mb-3 max-w-xl mx-auto leading-relaxed">
            Apply first. Fit calls are scheduled after application review. Acceptance requires a fit call; we may decline applicants who are not ready or not a fit.
          </p>
          <p className="text-[#365548] text-base mb-6 max-w-xl mx-auto leading-relaxed">
            Apply by {APPLICATIONS_CLOSE_LABEL}. Applications may close earlier if all {COHORT_SEAT_CAP} seats fill.
          </p>
          <p className="text-[#171f1d] font-bold text-2xl mb-4">
            {OFFER_PRICE} tuition
          </p>
          <p className="text-[#365548] text-base mb-8">{PAYMENT_PLAN_SENTENCE}</p>

          <a href="#apply" className={`${primaryCtaClass} mb-4 w-full`}>
            Apply for the January cohort
          </a>

          <p id="fit-call" className="scroll-mt-24 mb-4">
            <a
              href={CALENDLY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={textLinkClass}
            >
              Already applied? Book a fit call
            </a>
          </p>

          <p className="text-[#365548] text-base mb-4">
            District purchase order or invoice needed?{' '}
            <a href={DISTRICT_EMAIL_LINK} className={textLinkClass}>
              Contact us
            </a>
          </p>
          <p className="text-[#365548] text-base mb-12">
            Refund policy: five calendar days from payment. After that, cohort seats are committed and non-refundable except where required by law.
          </p>

          <details
            className="text-left bg-[#fbfaf6] rounded-lg border border-[#d9cdb8] overflow-hidden"
            onToggle={(event) => setDistrictOpen(event.currentTarget.open)}
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-6 py-3 text-base font-semibold text-[#171f1d]">
              <span>Getting district approval? We can help.</span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#365548]">
                <ChevronDown className={`h-4 w-4 transition-transform ${districtOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                {districtOpen ? 'Hide' : 'Show'}
              </span>
            </summary>
            <div className="space-y-4 border-t border-[#d9cdb8] px-6 pb-6 pt-4">
              <p className="text-base leading-relaxed text-[#365548]">
                Many BCBAs have their district cover this as professional development. Here is what you need:
              </p>
              <p className="flex items-start gap-3 rounded-lg border border-[#d9cdb8] bg-[#f4efe5] p-3 text-base leading-relaxed text-[#171f1d]">
                <FileCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1f4d3f]" />
                Need current district paperwork? Contact us for the current program description, invoice, and payment documentation.
              </p>
              <p className="text-base text-[#365548]">
                Need a W-9, purchase order, or invoice?{' '}
                <a href={DISTRICT_EMAIL_LINK} className={textLinkClass}>
                  Contact us
                </a>{' '}
                and we will send the paperwork. Seats are held once a signed purchase order or written district payment approval is received.
              </p>
              <div className="rounded-lg border border-[#d9cdb8] bg-[#f4efe5] p-4">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#365548]">Copy and forward to your supervisor</p>
                <div className="select-all whitespace-pre-line rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] p-4 font-mono text-sm leading-relaxed text-[#171f1d]">{`Subject: Professional Development Approval Request, ${PROGRAM_NAME}

I'd like to attend the ${PROGRAM_NAME}, led by Rob Spain, BCBA.

6 live sessions on Thursdays, ${COHORT_SESSION_TIME}, ${COHORT_DATE_RANGE} (no session February 4). Cost: ${OFFER_PRICE}.
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
