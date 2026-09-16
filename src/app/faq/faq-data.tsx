import Link from "next/link";
import type { ReactNode } from "react";
import { TRANSFORMATION_PROGRAM } from "@/lib/transformation-program";

export interface FAQItem {
  question: string;
  /** Rendered in the accordion. */
  answer: string | ReactNode;
  /** Plain-text version used for FAQPage JSON-LD. Required when `answer` is JSX. */
  plainAnswer?: string;
}

export interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const linkClass = "text-emerald-600 hover:text-emerald-700 underline";

const { cohort, pricing } = TRANSFORMATION_PROGRAM;

export const faqData: FAQCategory[] = [
  {
    title: "About the Transformation Program",
    items: [
      {
        question: "What is the School BCBA Transformation Program?",
        answer: (
          <>
            The <Link href="/transformation-program" className={linkClass}>School BCBA Transformation Program</Link> is a six-week live cohort for practicing school BCBAs. Over six Thursday-evening sessions you rebuild the systems that carry a school caseload: referral and FBA triage, function-based BIPs, staff training and fidelity, and caseload review. You apply each week&apos;s work to a real student, staff member, or school system.
          </>
        ),
        plainAnswer:
          "The School BCBA Transformation Program is a six-week live cohort for practicing school BCBAs. Over six Thursday-evening sessions you rebuild the systems that carry a school caseload: referral and FBA triage, function-based BIPs, staff training and fidelity, and caseload review. You apply each week's work to a real student, staff member, or school system.",
      },
      {
        question: "Who is the Transformation Program for?",
        answer:
          "Practicing school BCBAs with a current caseload or systems problem and capacity to attend Thursday evenings from 6 to 8 PM PT. It is not built for RBTs, BCaBAs who are not yet certified, general-ed staff, or clinic-only BCBAs without a school role.",
      },
      {
        question: "What makes this program different from other BCBA training?",
        answer:
          "It is limited to school-based practice and to a small group. Instead of general ABA content, each week covers one part of the school BCBA job (triage, FBA, BIP, staff implementation, progress monitoring, caseload systems) and you leave with a working version of that system for your own setting.",
      },
      {
        question: "What will I work on in the program?",
        answer:
          "Assessment decisions and referral triage, functional behavior assessment, function-based intervention design, staff training and fidelity, progress monitoring, and caseload review systems. Participants apply the material to a current student, staff member, or school system between sessions.",
      },
    ],
  },
  {
    title: "Program Details & Structure",
    items: [
      {
        question: "How long does the Transformation Program take?",
        answer: `Six weeks. The ${cohort.label} runs ${cohort.dateRange}, with one live two-hour session each Thursday from ${cohort.sessionTime}. Expect additional time between sessions to apply the work in your school.`,
      },
      {
        question: "What's included in the program?",
        answer: (
          <>
            The program includes:
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Six live two-hour sessions with a small cohort</li>
              <li>Working templates for referral triage, FBA, BIP, and staff fidelity</li>
              <li>Session materials and recordings in the Learning dashboard</li>
              <li>Feedback on the systems you are rebuilding during share-outs</li>
              <li>Learning CEUs after verified attendance and participation</li>
            </ul>
          </>
        ),
        plainAnswer:
          "Six live two-hour sessions with a small cohort; working templates for referral triage, FBA, BIP, and staff fidelity; session materials and recordings in the Learning dashboard; feedback on the systems you are rebuilding during share-outs; and Learning CEUs after verified attendance and participation.",
      },
      {
        question: "Is the program self-paced or scheduled?",
        answer:
          "Scheduled. The six live sessions run on set Thursday evenings, and the work between sessions is applied to your own caseload. Session materials are posted in the Learning dashboard so you can review them afterward.",
      },
      {
        question: "How much time do I need to commit each week?",
        answer:
          "Plan on the two-hour live session plus time between sessions to apply that week's system in your school. The between-session work is real work you already need to do, done with structure and feedback.",
      },
      {
        question: "Can I get CEUs for the program?",
        answer:
          "Each session is structured for 1.5 Learning CEUs after verified attendance and active participation. Provider registry status is confirmed before documentation is issued, and documentation is issued within 45 days of verified completion.",
      },
    ],
  },
  {
    title: "Enrollment & Pricing",
    items: [
      {
        question: "How much does the Transformation Program cost?",
        answer: (
          <>
            Tuition is {pricing.payInFull} paid in full, or {pricing.installmentCount} payments of {pricing.installment} ({pricing.installmentTotal}). District purchase orders and invoices are accepted. Details are on the <Link href="/transformation-program" className={linkClass}>program page</Link>.
          </>
        ),
        plainAnswer: `Tuition is ${pricing.payInFull} paid in full, or ${pricing.installmentCount} payments of ${pricing.installment} (${pricing.installmentTotal}). District purchase orders and invoices are accepted.`,
      },
      {
        question: "How do I enroll in the program?",
        answer: (
          <>
            Apply first through the <Link href="/signup" className={linkClass}>application form</Link>. After we review your application, we schedule a fit call before confirming your seat. Acceptance requires that call.
          </>
        ),
        plainAnswer:
          "Apply first through the application form. After we review your application, we schedule a fit call before confirming your seat. Acceptance requires that call.",
      },
      {
        question: "Do you offer payment plans?",
        answer: `Yes. You can pay ${pricing.payInFull} in full or choose ${pricing.installmentCount} payments of ${pricing.installment} (${pricing.installmentTotal}).`,
      },
      {
        question: "What is the refund policy?",
        answer:
          "You have a five-day refund window after payment. Contact us within five calendar days of payment to request a refund. After that window, cohort seats are considered committed and are not refundable except where required by law.",
      },
      {
        question: "When does the next cohort start?",
        answer: (
          <>
            The {cohort.label} starts {cohort.startFull.replace("Starts ", "")} and runs through {cohort.endFull}. There are {cohort.seatCap} seats, and applications close when seats fill or by {cohort.applicationsCloseLabel}. Current dates are always listed on the <Link href="/transformation-program" className={linkClass}>program page</Link>.
          </>
        ),
        plainAnswer: `The ${cohort.label} starts ${cohort.startFull.replace("Starts ", "")} and runs through ${cohort.endFull}. There are ${cohort.seatCap} seats, and applications close when seats fill or by ${cohort.applicationsCloseLabel}.`,
      },
    ],
  },
  {
    title: "Support & Community",
    items: [
      {
        question: "Will I get personalized support?",
        answer: `Yes. With a cohort capped at ${cohort.seatCap}, each live session includes time to work through your own cases and systems, and later weeks include share-outs with feedback on what you are rebuilding.`,
      },
      {
        question: "What if I can't attend a live session?",
        answer:
          "Session materials and participation requirements are posted in the Learning dashboard. Contact support if you cannot attend so the available completion options can be reviewed.",
      },
      {
        question: "Can my district pay for this?",
        answer:
          "Yes. The program qualifies as professional development, and district purchase orders and invoice payments are accepted. Seats are held after a signed purchase order or written district payment approval is received. A W-9 is available on request.",
      },
    ],
  },
  {
    title: "Other Questions",
    items: [
      {
        question: "What free resources does Behavior School offer?",
        answer: (
          <>
            Free tools and resources include:
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><Link href="/iep-goals" className={linkClass}>IEP Behavior Goal Writer</Link></li>
              <li><Link href="/behavior-plans" className={linkClass}>Behavior Plan (BIP) Writer</Link></li>
              <li><Link href="/free-tools" className={linkClass}>Free School Behavior Tools</Link></li>
              <li><Link href="https://study.behaviorschool.com/free-mock-exam/" className={linkClass}>Free BCBA Mock Exam</Link></li>
              <li><Link href="/blog" className={linkClass}>Blog articles</Link> and <Link href="/subscribe" className={linkClass}>The Weekly Research Brief</Link></li>
              <li><Link href="/act-matrix" className={linkClass}>ACT Matrix Resources</Link></li>
            </ul>
          </>
        ),
        plainAnswer:
          "Free tools and resources include the IEP Behavior Goal Writer, the Behavior Plan (BIP) Writer, free school behavior tools, a free BCBA mock exam on study.behaviorschool.com, blog articles, The Weekly Research Brief email, and ACT Matrix resources.",
      },
      {
        question: "How can I learn more or get in touch?",
        answer: (
          <>
            Use the <Link href="/contact" className={linkClass}>contact page</Link>. We answer questions about the Transformation Program, district paperwork, CEUs, and the free tools.
          </>
        ),
        plainAnswer:
          "Use the contact page at behaviorschool.com/contact. We answer questions about the Transformation Program, district paperwork, CEUs, and the free tools.",
      },
      {
        question: "Do you offer other training or services?",
        answer: (
          <>
            Yes. In addition to the Transformation Program, Behavior School offers <Link href="/ceus" className={linkClass}>BACB CEUs</Link>, <Link href="/supervisors" className={linkClass}>supervision tools</Link>, <Link href="https://study.behaviorschool.com/free-practice/" className={linkClass}>BCBA exam prep</Link>, and <Link href="/products" className={linkClass}>tools and training materials</Link> for school-based behavior analysts.
          </>
        ),
        plainAnswer:
          "Yes. In addition to the Transformation Program, Behavior School offers BACB CEUs, supervision tools, BCBA exam prep on study.behaviorschool.com, and tools and training materials for school-based behavior analysts.",
      },
    ],
  },
];

/** Flat list of question/answer pairs for FAQPage JSON-LD. */
export function getFaqSchemaItems(): Array<{ question: string; answer: string }> {
  return faqData.flatMap((category) =>
    category.items.map((item) => ({
      question: item.question,
      answer:
        item.plainAnswer ?? (typeof item.answer === "string" ? item.answer : ""),
    })),
  ).filter((item) => item.answer.length > 0);
}
