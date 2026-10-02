'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Users, Target, CheckCircle, ChevronDown, FileCheck, FlaskConical, ClipboardList, BarChart3, AlertCircle } from 'lucide-react';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import { ProgramApplication } from '@/components/ProgramApplication';
import { getFounderEducationYears, FOUNDER_EDUCATION_START_LABEL } from '@/lib/founder-tenure';
import { cohortScheduleEntries, TRANSFORMATION_PAYMENT_PLAN_SENTENCE, TRANSFORMATION_PROGRAM } from '@/lib/transformation-program';

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
    title: "Assessment Architecture",
    pain: 'Managing FBA referrals without a clear triage system.',
    build: "A tiered assessment framework, plus a scalable intake process that filters behavioral concerns by severity level to route each student to the appropriate level of assessment, without burning you out.",
    deliverable: "Your personal assessment decision tree, intake form, and referral routing guide.",
    objectives: ["Design a tiered assessment routing process for a school caseload.", "Apply decision rules to select assessment intensity using referral data.", "Evaluate an assessment intake workflow for feasibility and ethical fit in a school system."],
    icon: ClipboardList,
  },
  {
    week: 2,
    title: "Data Collection Systems",
    pain: 'Data systems that do not consistently support decisions across staff and students.',
    build: "A standardized data collection toolkit built for your specific caseload, in formats RBTs will actually use consistently.",
    deliverable: "Master data sheet library covering frequency, duration, interval, and ABC recording.",
    objectives: ["Select data systems that match behavior dimensions and decision needs.", "Design implementation supports that improve staff data fidelity.", "Evaluate a data toolkit for reliability, usability, and decision utility."],
    icon: BarChart3,
  },
  {
    week: 3,
    title: "FBA to Hypothesis",
    pain: 'Functional hypotheses that are difficult to defend or test in a school setting.',
    build: "A hypothesis generation process with function verification steps you can defend in any IEP meeting.",
    deliverable: "Your own FBA narrative template with built-in quality checks.",
    objectives: ["Synthesize indirect and direct assessment data into testable hypotheses.", "Apply function-verification decision rules to ambiguous school cases.", "Critique an FBA narrative for evidentiary sufficiency and contextual fit."],
    icon: Target,
  },
  {
    week: 4,
    title: "BIP Design by Function",
    pain: 'Intervention plans that do not clearly follow from assessment findings.',
    build: "Function-matched intervention menus for attention, escape, tangible, and automatic reinforcement.",
    deliverable: "BIP template library organized by behavioral function.",
    objectives: ["Design function-matched intervention components from assessment findings.", "Differentiate intervention selections across common behavioral functions.", "Evaluate a behavior intervention plan for functional coherence and implementability."],
    icon: FileCheck,
  },
  {
    week: 5,
    title: "Implementation and Staff Training",
    pain: 'A gap between a written plan and consistent staff implementation.',
    build: "A 1-page implementation guide and fidelity checklist for each BIP, so everyone on your team knows exactly what to do.",
    deliverable: "Staff communication plans.",
    objectives: ["Design a staff implementation protocol for a function-based behavior plan.", "Apply performance-feedback procedures to improve treatment integrity.", "Evaluate fidelity data to determine whether a plan or implementation support needs revision."],
    icon: Users,
  },
  {
    week: 6,
    title: "School-Based Functional Analysis",
    pain: "Teams write BIPs from ABC notes alone, then the plan fails when staff run it without you.",
    build: "A classroom FA decision path across research-supported formats, with printable data sheets and a multielement graph workflow so you confirm the EO before the team invests in a plan.",
    deliverable: "One de-identified school-safe FA (or realistic simulation): data sheet, multielement graph, and a two-sentence interpretation.",
    objectives: [
      "Explain why descriptive ABC assessment alone can misidentify function, and when an experimental analysis is warranted.",
      "Select a classroom-appropriate FA format based on risk, setting, and schedule.",
      "Record FA data on a printable data sheet, graph it as a multielement design, and state whether responding is differentiated.",
    ],
    icon: FlaskConical,
  },
];

const primaryCtaClass =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#e4b63d] px-6 py-3 text-base font-semibold text-[#171f1d] transition-colors hover:bg-[#d9a92f] hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]';
const textLinkClass =
  'inline-flex min-h-11 items-center text-base font-semibold text-[#1f4d3f] underline underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]';

function joinDayList(days: string[]) {
  if (days.length <= 1) return days.join('');
  return `${days.slice(0, -1).join(', ')}, and ${days[days.length - 1]}`;
}

function cohortDatePhrase() {
  const jan = TRANSFORMATION_PROGRAM.cohort.sessionDates
    .filter((date) => date.startsWith('Jan '))
    .map((date) => date.slice(4));
  const feb = TRANSFORMATION_PROGRAM.cohort.sessionDates
    .filter((date) => date.startsWith('Feb '))
    .map((date) => date.slice(4));
  return `Jan ${joinDayList(jan)}, then Feb ${joinDayList(feb)}`;
}

function CohortCard() {
  return (
    <div className="rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] p-6 text-[#171f1d]">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#1f4d3f]">
        Next cohort: {COHORT_LABEL}
      </p>
      <p className="mt-3 text-[1.375rem] font-semibold leading-snug sm:text-2xl">{COHORT_SUMMARY}</p>
      <p className="mt-1 text-base leading-snug sm:text-lg">{COHORT_SUMMARY_DETAIL}</p>
      <ol className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-7">
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
      <div className="mt-4 grid grid-cols-1 gap-4 border-t border-[#d9cdb8] pt-4 sm:grid-cols-3">
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
          <p className="text-base font-semibold">{APPLICATIONS_CLOSE_SHORT}</p>
          <p className="text-sm text-[#365548]">(earlier if seats fill)</p>
        </div>
      </div>
      <a href="#apply" className={`${primaryCtaClass} mt-5 w-full`}>
        Apply for the January cohort <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
      <a href="#fit-call" className={`${textLinkClass} mt-1`}>
        Already applied? Book a fit call
      </a>
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
              {['Live online', '6 sessions', 'School BCBAs', COHORT_START_BADGE].map((item) => (
                <span key={item} className="rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] px-3 py-1.5 text-sm font-semibold uppercase tracking-wide text-[#1f4d3f]">
                  {item}
                </span>
              ))}
            </motion.div>
            <motion.h1
              className="order-1 mb-4 max-w-[18ch] text-balance text-[32px] font-semibold leading-[1.15] text-[#171f1d] sm:text-5xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {PROGRAM_NAME}
            </motion.h1>
            <motion.div className="order-2 mt-2 lg:order-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
              <CohortCard />
            </motion.div>
            <motion.p
              className="order-3 mt-6 text-lg font-semibold leading-snug text-[#171f1d] lg:order-2 lg:mt-0"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              You became a BCBA to help kids. Not to drown in paperwork.
            </motion.p>
            <motion.p
              className="order-4 mt-3 max-w-2xl text-base leading-relaxed text-[#365548] lg:order-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              Build a practical assessment-to-intervention system for the school caseload you manage now. Apply first. After we review your application, we schedule a fit call.
            </motion.p>
          </div>
          <div className="relative mt-8 overflow-hidden rounded-lg border border-[#d9cdb8]">
            <Image
              src="/optimized/Hero/11D67BC4-55A4-4549-A776-84E87EDED35F.webp"
              alt="School BCBA systems in action"
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
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#171f1d] mb-4">Sound Familiar?</h2>
          <p className="text-[#365548] text-center mb-14 text-lg leading-relaxed max-w-2xl mx-auto">These are the real problems school BCBAs bring to this program.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { pain: "High-volume referral decisions", sub: "Use a tiered routing process before committing to a full assessment." },
              { pain: "Inconsistent data systems", sub: "Match measurement to the decision and make the process workable for staff." },
              { pain: "Unclear functional hypotheses", sub: "Organize indirect and direct assessment data into testable decisions." },
              { pain: "Plans that do not generalize to implementation", sub: "Connect assessment findings to practical, function-matched supports." },
              { pain: "Limited staff implementation support", sub: "Build protocols, training, and fidelity checks around the plan." },
              { pain: "BIPs built on unverified function", sub: "Confirm the EO with a classroom FA before the team invests in a plan." },
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
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#171f1d] mb-4">Who This Program Is For</h2>
          <p className="text-center text-[#365548] mb-12 text-lg leading-relaxed">
            {COHORT_SCHEDULE_SENTENCE} for practicing school BCBAs with a current caseload or systems problem and capacity to attend Thursday evenings.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              "You are a certified BCBA working in a K-12 school or district role",
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
              Who it is not for: RBTs, BCaBAs who are not yet certified, general-ed staff, and clinic-only BCBAs without a school role.
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
            <h2 className="text-3xl sm:text-4xl font-bold text-[#171f1d] mb-4">What You&apos;ll Build Each Session</h2>
            <p className="text-[#365548] text-lg max-w-2xl mx-auto leading-relaxed">Each session is mapped to a specific pain point and ends with a deliverable you can use immediately.</p>
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
          <p className="text-sm font-semibold uppercase tracking-widest text-[#1f4d3f] text-center mb-3">Learning CE Information</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#171f1d] mb-8">What Each Live Session Includes</h2>
          <div className="space-y-4 text-[#171f1d] text-base leading-relaxed">
            <p>Each live online session is scheduled for {COHORT_SESSION_TIME} and includes 75 documented instructional minutes. It is structured for 1.5 Learning CEUs after verified attendance and active participation.</p>
            <p><strong>Instructor:</strong> Rob Spain, BCBA, IBA. <strong>Affiliation disclosure:</strong> No relevant financial affiliation or conflict of interest to disclose.</p>
            <p><strong>Provider listing:</strong> Behavior School, Provider OP-26-12729. The BACB does not endorse or approve individual events. Learning CE documentation is issued only after provider authorization is independently confirmed in the BACB registry.</p>
            <p><strong>Online event description published:</strong> {ONLINE_EVENT_DESCRIPTION_PUBLISHED}. Feedback is offered after each session, and CE documentation is issued no later than 45 days after verified completion.</p>
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
              "FBA templates with built-in quality checks you can stand behind in any IEP meeting",
              "Function-matched BIP templates organized by behavioral function",
              "Staff communication plans",
              "A classroom FA workflow across research-supported formats: printable data sheet and multielement graph",
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

      {/* Who This Is For */}
      <section className="py-20 sm:py-28 bg-[#fbfaf6]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#1f4d3f] mb-3">Who This Is For</p>
            <p className="text-[#171f1d] text-lg leading-relaxed">
              The {PROGRAM_NAME} is for school BCBAs who want a clearer way to connect assessment, intervention, staff implementation, and research approaches to functional behavior assessment in the classroom. Participants bring real work to apply between sessions and share progress in later sessions.
            </p>
          </div>
        </div>
      </section>

      {/* About Rob */}
      <section className="py-20 sm:py-28 bg-[#f4efe5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#1f4d3f] mb-3">Your Instructor</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#171f1d] mb-8">Rob Spain, BCBA, IBA</h2>
          <div className="text-left space-y-4 text-[#365548] text-base leading-relaxed">
            <p>Rob Spain is a BCBA and IBA with {founderEducationYears} years in education since {FOUNDER_EDUCATION_START_LABEL}. Learning CE documentation will not be issued until the instructor qualification and expertise record has been verified for the event.</p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['BCBA', 'IBA', 'School Practice'].map((item) => (
              <span key={item} className="inline-flex min-h-11 items-center px-4 rounded-lg bg-[#fbfaf6] border border-[#d9cdb8] text-[#1f4d3f] text-sm font-semibold">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-28 bg-[#fbfaf6] scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#1f4d3f] text-center mb-3">Common Questions</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#171f1d] mb-14">Frequently Asked Questions</h2>
          <FAQAccordion items={[
            { question: "When does the next cohort start?", answer: `The ${COHORT_LABEL} meets live online on six Thursdays from ${COHORT_SESSION_TIME}: ${cohortDatePhrase()}. There is no session on Feb 4. Apply by ${APPLICATIONS_CLOSE_LABEL}.` },
            { question: "How many seats are available?", answer: `There are ${COHORT_SEAT_CAP} seats in this cohort. Apply by ${APPLICATIONS_CLOSE_LABEL}. Applications may close earlier if all ${COHORT_SEAT_CAP} seats fill.` },
            { question: "What is the order of operations to enroll?", answer: "Apply first using the application form on this page. After we review your application, we schedule a fit call. Acceptance requires that call; we may decline applicants who are not ready or not a fit. Fit Call booking is for applicants already in review." },
            { question: "Who is this program for?", answer: "Practicing school BCBAs with a current caseload or systems problem and capacity to attend Thursday evenings from 6 to 8 PM Pacific Time. It is not for RBTs, BCaBAs who are not yet certified, general-ed staff, or clinic-only BCBAs without a school role." },
            { question: "What participation is expected between sessions?", answer: "Bring real work from your school setting to apply between sessions. Later sessions include share-outs on the systems you are rebuilding." },
            { question: "What if I miss a live session?", answer: "Use the Learning dashboard for the posted session materials and participation requirements. Contact support if you cannot attend so the available completion options can be reviewed." },
            { question: "What is the refund window?", answer: "You have a five-day refund window after payment. Contact us within five calendar days of payment to request a refund. After that window, cohort seats are considered committed and are not refundable except where required by law." },
            { question: "Can my district pay for this?", answer: "Yes. This program qualifies as professional development. District purchase orders and invoice payments are accepted. Seats are held after a signed purchase order or written district payment approval is received, and invoices are due on the invoice terms shown. Contact us to request district paperwork." },
            { question: "Is a W-9 available?", answer: "Yes, available on request. Contact us and we'll send it same day." },
            { question: "Do you offer bulk enrollment for districts?", answer: "Yes. Contact us via the fit call link after applying, or through the contact form, to discuss district group pricing." },
            { question: "How are Learning CEUs documented?", answer: "Each session is structured for 1.5 Learning CEUs after verified attendance and active participation. Provider registry status is confirmed before documentation is issued, and documentation is issued within 45 days of verified completion." },
          ]} />
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
            District PO or invoice needed?{' '}
            <a href={DISTRICT_EMAIL_LINK} className="font-semibold text-[#1f4d3f] underline underline-offset-4">
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
                <a href={DISTRICT_EMAIL_LINK} className="font-semibold text-[#1f4d3f] underline underline-offset-4">
                  Contact us
                </a>{' '}
                and we will send the paperwork. Seats are held once a signed PO or written district payment approval is received.
              </p>
              <div className="rounded-lg border border-[#d9cdb8] bg-[#f4efe5] p-4">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#365548]">Copy and forward to your supervisor</p>
                <div className="select-all whitespace-pre-line rounded-lg border border-[#d9cdb8] bg-[#fbfaf6] p-4 font-mono text-sm leading-relaxed text-[#171f1d]">{`Subject: PD Approval Request, ${PROGRAM_NAME}

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
