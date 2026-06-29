import type { Metadata } from "next";
import Link from "next/link";
import { SeoArticlePage } from "@/components/seo/SeoArticlePage";

const canonical = "https://behaviorschool.com/bcba-study-schedule";

export const metadata: Metadata = {
  title: "BCBA Study Schedule | 8, 12, and 16 Week Plans",
  description:
    "Build a BCBA study schedule for 8, 12, or 16 weeks. Includes weekly priorities, practice questions, mock exam timing, and retake adjustments.",
  alternates: { canonical },
  robots: { index: true, follow: true },
  openGraph: {
    title: "BCBA Study Schedule: 8, 12, and 16 Week Plans",
    description:
      "A practical BCBA study schedule with weekly priorities, domain practice, mock exam timing, and retake adjustments.",
    url: canonical,
    siteName: "Behavior School",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Study Schedule: 8, 12, and 16 Week Plans",
    description:
      "Plan your BCBA exam prep with weekly priorities, practice questions, and mock exam checkpoints.",
  },
};

export default function BCBAStudySchedulePage() {
  return (
    <SeoArticlePage
      title="BCBA Study Schedule: How to Plan 8, 12, or 16 Weeks of Exam Prep"
      description="A good BCBA study schedule does more than divide chapters across a calendar. It should map your time to the 6th Edition domains, build practice-question fluency, and schedule mock exams when they can actually change your next study block."
      eyebrow="BCBA exam planning"
      breadcrumbLabel="BCBA Study Schedule"
      canonical={canonical}
      heroVisual
      primaryCta={{ label: "Build a free pacing plan", href: "/bcba-pacing-planner" }}
      secondaryLinks={[
        { label: "Take the free practice exam", href: "/free-bcba-practice-exam" },
        { label: "BCBA exam prep guide", href: "/bcba-exam-prep" },
        { label: "Failed? Build a retake plan", href: "/failed-bcba-exam-help" },
        { label: "Free BCBA mock exam", href: "/free-bcba-mock-exam" },
        { label: "BCBA exam practice questions", href: "/bcba-exam-practice-questions" },
      ]}
      sections={[
        {
          heading: "Start with your exam date and baseline score",
          body: "The best study schedule depends on how much time you have and what your current practice data shows. Before choosing an 8, 12, or 16 week plan, take a short diagnostic set and identify the domains that need the most work.",
          bullets: [
            "Use a free BCBA practice exam to get a baseline before building the schedule.",
            "Rank domains by need instead of spending equal time everywhere.",
            "Reserve time for rationales, not only question volume.",
          ],
        },
        {
          heading: "Use weekly priorities instead of daily perfection",
          body: "Most candidates miss study days. A weekly structure is more durable because it lets you recover without abandoning the whole plan.",
          bullets: [
            "Set one primary domain focus each week.",
            "Add two to four mixed practice sessions for generalization.",
            "Use one review block for notes, rationales, and missed concepts.",
          ],
        },
        {
          heading: "Schedule mock exams after practice has direction",
          body: "Mock exams are most useful after you have practiced weak domains. Use them to check pacing, stamina, and whether your accuracy holds when content areas are mixed.",
          bullets: [
            "Take an early baseline if you have 12 to 16 weeks.",
            "Use a mid-plan mock to adjust weak-domain practice.",
            "Use a final mock to test timing and endurance, not to learn brand-new content.",
          ],
        },
      ]}
      faqs={[
        {
          question: "How many weeks should I study for the BCBA exam?",
          answer: "Many candidates use 8 to 16 weeks depending on baseline knowledge, work schedule, and exam date. If your baseline is low or your schedule is busy, choose a longer plan.",
        },
        {
          question: "How many hours per week should I study?",
          answer: "A common target is 8 to 12 focused hours per week, but quality matters more than raw time. Practice questions, rationales, and weak-domain review should be part of the schedule.",
        },
        {
          question: "When should I take a BCBA mock exam?",
          answer: "Use one baseline mock early if you have enough time, one midpoint mock to adjust the plan, and one final mock to check pacing and endurance.",
        },
        {
          question: "Should retake candidates use the same schedule?",
          answer: "Retake candidates should start with their score report and weak domains. They usually need a more targeted schedule than first-time candidates.",
        },
      ]}
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Choose the BCBA study schedule that matches your timeline</h2>
        <p className="mt-3 leading-relaxed text-slate-700">
          The schedule below is a starting point. Adjust the domain order based on your baseline results, especially if measurement, experimental design, ethics, or behavior-change procedures are weak.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-3 pr-4 font-semibold">Timeline</th>
                <th className="py-3 pr-4 font-semibold">Best fit</th>
                <th className="py-3 pr-4 font-semibold">Weekly structure</th>
                <th className="py-3 font-semibold">Mock exam timing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">8 weeks</td>
                <td className="py-4 pr-4">You have recent coursework and need a tighter review cycle.</td>
                <td className="py-4 pr-4">Two domain blocks, two mixed practice blocks, one rationale review block.</td>
                <td className="py-4">Weeks 1, 5, and 8.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">12 weeks</td>
                <td className="py-4 pr-4">You need structured review while working or completing fieldwork.</td>
                <td className="py-4 pr-4">One major domain focus, one secondary domain, mixed practice, and review.</td>
                <td className="py-4">Weeks 1, 6, and 11.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">16 weeks</td>
                <td className="py-4 pr-4">You are starting early or need to rebuild foundations.</td>
                <td className="py-4 pr-4">Foundations first, then applied domains, then mixed timed practice.</td>
                <td className="py-4">Weeks 2, 8, 13, and 16.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">30-day retake</td>
                <td className="py-4 pr-4">You already tested and have score-report data.</td>
                <td className="py-4 pr-4">Weak-domain practice, timed mini sets, and targeted rationale review.</td>
                <td className="py-4">One midpoint mock and one final pacing check.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">What each study week should include</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              heading: "Domain practice",
              body: "Choose one content area and practice until you can explain why the correct answer is best.",
              href: "/bcba-exam-practice-questions",
              label: "Practice exam questions",
            },
            {
              heading: "Rationale review",
              body: "Write down why distractors were tempting. This is where many candidates actually improve.",
              href: "/bcba-test-questions",
              label: "Review sample questions",
            },
            {
              heading: "Timing check",
              body: "Add timed sets after accuracy improves. Timing too early can hide concept gaps.",
              href: "/free-bcba-mock-exam",
              label: "Plan a mock exam",
            },
          ].map((item) => (
            <div key={item.heading} className="rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-950">{item.heading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.body}</p>
              <Link href={item.href} className="mt-4 inline-flex text-sm font-semibold text-emerald-800 hover:text-emerald-900">
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </SeoArticlePage>
  );
}
