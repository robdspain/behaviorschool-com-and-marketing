import type { Metadata } from "next";
import Link from "next/link";
import { SeoArticlePage } from "@/components/seo/SeoArticlePage";
import { buildPageMetadata } from "@/lib/seo/metadata";

const canonical = "https://behaviorschool.com/how-many-questions-on-bcba-exam";
const BACB_EXAM = "https://www.bacb.com/examination-information/";
const BACB_TCO = "https://www.bacb.com/wp-content/uploads/2022/01/BCBA-6th-Edition-Test-Content-Outline-240903-a.pdf";
const BACB_TRANSITION = "https://www.bacb.com/wp-content/uploads/2025/06/BCBA-2027-Requirements-Transition-260130-a.pdf";
const BACB_REQUIREMENTS = "https://www.bacb.com/wp-content/uploads/2025/03/2027-BCBA-Requirements_260127-a.pdf";
const BACB_NEWSLETTER = "https://www.bacb.com/wp-content/uploads/2025/11/BACB_December2025_Newsletter-251124-2-a.pdf";
const EFFECTIVE_AT = Date.parse("2027-01-01T00:00:00-07:00");
const isPost2027 = Date.now() >= EFFECTIVE_AT;
const currentYear = new Date().getFullYear();
const dateModified = isPost2027 ? "2027-01-01" : "2026-09-25";
const yearQuestion = `How many questions is the BCBA exam in ${currentYear}?`;

const metaDescription = "The BCBA exam has 185 questions: 175 scored and 10 unscored, in 4 hours. See the 6th edition domain breakdown, pacing math, and a free 9-question check.";

export const metadata: Metadata = buildPageMetadata({
  title: `How Many Questions Are on the BCBA Exam? (${currentYear} Guide)`,
  description: metaDescription,
  canonical,
  type: "article",
});

const faqBase = [
  {
    question: yearQuestion,
    answer: "185 multiple-choice questions. 175 are scored and 10 are unscored pilot questions.",
  },
  {
    question: "How long is the BCBA exam?",
    answer: "4 hours. That time also covers the terms and conditions, the navigation tutorial, and any review at the end, and the clock keeps running if you take a break. Spread evenly, that's about 1 minute and 18 seconds per question.",
  },
  {
    question: "How many questions do you need to get right to pass the BCBA exam?",
    answer: "There is no fixed public number. The BACB sets the passing score with the modified Angoff method, a criterion-referenced process where BACB-certified subject matter experts decide what an entry-level behavior analyst should know. Each exam form is statistically equated, so the number of correct answers needed can vary a little from form to form. That's why the BACB reports a pass/fail result and scaled scores instead of your raw number correct.",
  },
  {
    question: "Do I have to pass every domain?",
    answer: "No. Your result is based on your overall performance on the exam, not your performance in each content area.",
  },
  {
    question: "Did the 6th edition change the number of BCBA exam questions?",
    answer: "Not the scored count. The 5th edition blueprint also had 175 scored questions. The 6th edition, in effect since January 1, 2025, changed how those questions are spread out. For example, Behavior-Change Procedures dropped from 35 to 25 questions, while Behavior Assessment rose from 18 to 23 and Ethical and Professional Issues rose from 18 to 22.",
  },
  {
    question: "Is the BCBA exam changing in 2027?",
    answer: isPost2027
      ? "No. New BCBA eligibility, coursework, and fieldwork rules took effect January 1, 2027, but the exam stayed the same. It's still based on the 6th edition test content outline: 185 questions, 175 scored, 4 hours."
      : "No. New BCBA eligibility, coursework, and fieldwork rules take effect January 1, 2027, but the BACB says there are no upcoming changes to the BCBA exam or its test content outline. 2027 applicants still test on the 6th edition outline: 185 questions, 175 scored, 4 hours.",
  },
];

export default function HowManyQuestionsOnBcbaExamPage() {
  return (
    <SeoArticlePage
      title="How Many Questions Are on the BCBA Exam?"
      description="According to the BACB, the BCBA exam has 185 multiple-choice questions, and you get 4 hours to finish. Only 175 of them count toward your result. The other 10 are unscored pilot questions the BACB is testing for future exams."
      eyebrow="BCBA exam facts"
      breadcrumbLabel="How Many Questions Are on the BCBA Exam?"
      canonical={canonical}
      dateModified={dateModified}
      primaryCta={{ label: "Take the free 9-question check", href: "https://study.behaviorschool.com/free-practice/" }}
      secondaryLinks={[
        { label: "Free 185-question mock", href: "https://study.behaviorschool.com/free-mock-exam/" },
        { label: "BCBA exam weak areas", href: "/bcba-exam-weak-areas" },
        { label: "BCBA study schedule", href: "/bcba-study-schedule" },
        { label: "BCBA 6th edition outline", href: "/blog/bcba-6th-edition-test-content-outline-breakdown" },
      ]}
      sections={[
        {
          heading: "Scored vs. unscored questions",
          body: <>The current BCBA exam is built on the <strong>BCBA Test Content Outline (6th ed.)</strong>, which the BACB put into effect on January 1, 2025. Under that outline, <Link className="font-semibold underline" href={BACB_TCO}>175 questions are scored</Link>, and 10 questions are unscored. The BACB calls them pilot questions. They are being tested for future forms of the exam.</>,
          bullets: [
            "The BACB doesn't publish which 10 are the pilot questions, so don't try to guess. Answer every question like it counts.",
            "Every scored question counts the same.",
          ],
        },
        {
          heading: "How much time you get per question",
          body: <>You have <strong>4 hours (240 minutes) for 185 questions</strong>. That&apos;s about <strong>1 minute and 18 seconds per question</strong> if you spread the time evenly. The <Link className="font-semibold underline" href={BACB_EXAM}>BCBA Handbook</Link> says the 4 hours also covers the terms and conditions, the navigation tutorial, and any time you spend reviewing answers at the end. The clock keeps running during breaks.</>,
          bullets: [
            "1 hour: You should be near question 46.",
            "2 hours: You should be near question 93.",
            "3 hours: You should be near question 139.",
            "4 hours: You should be at question 185, with review time if you banked any.",
          ],
        },
        {
          heading: "BCBA exam domain breakdown (6th edition)",
          body: <>The 175 scored questions are split across 9 content areas. These counts come straight from the BACB&apos;s <Link className="font-semibold underline" href={BACB_TCO}>6th edition Test Content Outline</Link>. Percentages are rounded, as in the BACB&apos;s own table.</>,
        },
        {
          heading: "What BCBA exam questions look like",
          body: <>According to the <Link className="font-semibold underline" href={BACB_EXAM}>BACB</Link>, every question is multiple choice, with 4 answer options and exactly 1 correct answer. The exam is computer-based, taken in person at a Pearson VUE testing center, and offered only in English. Pearson VUE has a free demo test so you can get used to the testing screen before exam day. The BCBA Handbook includes four retired sample questions that show the style. Three of the four are short scenarios: you read what a behavior analyst or trainee is facing, then pick the best answer.</>,
        },
        {
          heading: "How to practice for 185 questions",
          body: <>Knowing the number is step one. Sitting through 185 questions is a different skill. Find your weakest area first with the <Link className="font-semibold underline" href="https://study.behaviorschool.com/free-practice/">free 9-question BCBA diagnostic</Link> from Behavior Study Tools. It has one question from each 6th edition content area, takes about seven minutes, and you don&apos;t need to sign up. Then build stamina with the <Link className="font-semibold underline" href="https://study.behaviorschool.com/free-mock-exam/">free 185-question timed BCBA mock exam</Link>. It follows the 6th edition outline and requires a free account before you start. Your results are saved there.</>,
          bullets: [
            "Do the diagnostic this week.",
            "Save the full mock for a day you can protect a real 4-hour block.",
          ],
        },
        {
          heading: "What changes in 2027",
          body: isPost2027
            ? <>New BACB rules for BCBA applicants took effect January 1, 2027: 2 eligibility pathways, restructured pathway 2 coursework, and new fieldwork rules. <strong>The exam didn&apos;t change</strong>, so the question count above is still current. <em>Before January 1, 2027 (historical):</em> 4 eligibility pathways were available and fieldwork allowed up to 130 hours a month. Sources: <Link className="font-semibold underline" href={BACB_TRANSITION}>2027 Transition Guidance</Link>, <Link className="font-semibold underline" href={BACB_REQUIREMENTS}>2027 BCBA Requirements</Link>, and <Link className="font-semibold underline" href={BACB_NEWSLETTER}>BACB Newsletter Dec 2025</Link>.</>
            : <>On January 1, 2027, new BACB rules take effect for people applying for BCBA certification: only 2 eligibility pathways, restructured pathway 2 coursework, and new fieldwork rules. <strong>The exam isn&apos;t one of the changes.</strong> The BACB says there are no upcoming changes to the BCBA examination or the Test Content Outline, so the question count above still applies. Sources: <Link className="font-semibold underline" href={BACB_TRANSITION}>2027 Transition Guidance</Link>, <Link className="font-semibold underline" href={BACB_REQUIREMENTS}>2027 BCBA Requirements</Link>, and <Link className="font-semibold underline" href={BACB_NEWSLETTER}>BACB Newsletter Dec 2025</Link>.</>,
        },
      ]}
      faqs={faqBase}
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead><tr className="border-b border-slate-200 text-slate-600"><th className="py-3 pr-4 font-semibold">Content area</th><th className="py-3 pr-4 font-semibold">Scored questions</th><th className="py-3 font-semibold">Share of exam</th></tr></thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                ["A. Behaviorism and Philosophical Foundations", "8", "5%"],
                ["B. Concepts and Principles", "24", "14%"],
                ["C. Measurement, Data Display, and Interpretation", "21", "12%"],
                ["D. Experimental Design", "13", "7%"],
                ["E. Ethical and Professional Issues", "22", "13%"],
                ["F. Behavior Assessment", "23", "13%"],
                ["G. Behavior-Change Procedures", "25", "14%"],
                ["H. Selecting and Implementing Interventions", "20", "11%"],
                ["I. Personnel Supervision and Management", "19", "11%"],
                ["Total", "175", "100%"],
              ].map(([area, count, share]) => <tr key={area}><td className="py-3 pr-4 font-semibold text-slate-950">{area}</td><td className="py-3 pr-4">{count}</td><td className="py-3">{share}</td></tr>)}
            </tbody>
          </table>
        </div>
        <p className="mt-5 leading-relaxed text-slate-700"><strong>You pass or fail on your overall score, not on each content area.</strong> No area is small enough to skip. Six of the nine are worth 20 or more questions each.</p>
      </section>
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7">
        <h2 className="text-2xl font-bold text-emerald-950">Answer-first exam prep</h2>
        <p className="mt-3 leading-relaxed text-emerald-900">Behavior Study Tools gives you a short diagnostic before a longer timed session. The free 9-question diagnostic needs no signup. The free 185-question mock requires a free account before starting and no credit card.</p>
        <div className="mt-5 flex flex-wrap gap-3"><Link className="inline-flex rounded-lg bg-[#e4b63d] px-5 py-3 font-semibold text-[#171f1d]" href="https://study.behaviorschool.com/free-practice/">Start the free diagnostic</Link><Link className="inline-flex rounded-lg border border-emerald-800 px-5 py-3 font-semibold text-emerald-950" href="https://study.behaviorschool.com/free-mock-exam/">Take the free full mock</Link></div>
      </section>
    </SeoArticlePage>
  );
}
