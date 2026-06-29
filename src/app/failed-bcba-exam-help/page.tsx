import type { Metadata } from "next";
import Link from "next/link";
import { SeoArticlePage } from "@/components/seo/SeoArticlePage";

const canonical = "https://behaviorschool.com/failed-bcba-exam-help";

export const metadata: Metadata = {
  title: "Failed the BCBA Exam? Retake Strategy + Free Practice",
  description:
    "Failed the BCBA exam? Build a 30-day retake strategy with score report review, weak-domain practice, mock exam timing, and free BCBA practice questions.",
  alternates: { canonical },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Failed the BCBA Exam? Retake Strategy + Free Practice",
    description:
      "Turn a failed BCBA exam attempt into a focused retake plan using score report review, domain practice, and timed mock exams.",
    url: canonical,
    siteName: "Behavior School",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Failed the BCBA Exam? Retake Strategy + Free Practice",
    description:
      "Build a clearer BCBA retake strategy with domain practice, mock exams, and score report review.",
  },
};

export default function FailedBcbaExamHelpPage() {
  return (
    <SeoArticlePage
      title="Failed the BCBA Exam? Build a Retake Strategy That Uses Your Score Report"
      description="A failed BCBA exam attempt is painful, but it is also data. Use your score report, missed-question patterns, and timed practice to build a retake plan instead of repeating the same study routine."
      eyebrow="BCBA retake help"
      breadcrumbLabel="Failed BCBA Exam Help"
      canonical={canonical}
      heroVisual
      primaryCta={{ label: "Start free retake practice", href: "/free-bcba-practice-exam" }}
      secondaryLinks={[
        { label: "BCBA exam prep guide", href: "/bcba-exam-prep" },
        { label: "Free BCBA practice exam", href: "/free-bcba-practice-exam" },
        { label: "Free BCBA mock exam", href: "/free-bcba-mock-exam" },
        { label: "BCBA exam practice questions", href: "/bcba-exam-practice-questions" },
        { label: "BCBA test questions", href: "/bcba-test-questions" },
      ]}
      sections={[
        {
          heading: "First, separate emotion from data",
          body: "After a failed BCBA exam attempt, many candidates restart by reading everything again. That usually wastes the best information you have: the score report and the errors you can now name.",
          bullets: [
            "Write down the domains that were weakest before choosing new materials.",
            "List whether your misses came from concept gaps, distractors, timing, or endurance.",
            "Do not use one raw mock score as the whole plan; look for repeated patterns.",
          ],
        },
        {
          heading: "Build the retake plan around weak domains",
          body: "A retake strategy should spend less time on what already feels comfortable and more time on the domains that cost points. Short, focused question sets are usually better than another full content review.",
          bullets: [
            "Practice one weak domain at a time before returning to mixed exams.",
            "Review rationales immediately so the decision rule stays visible.",
            "Track slow correct answers because fluency matters under a four-hour exam clock.",
          ],
        },
        {
          heading: "Use timed practice only after concept review",
          body: "Timed mock exams are useful, but they are not the first fix for every retake candidate. If you are missing basic discriminations, timed pressure can hide the real issue.",
          bullets: [
            "Use untimed domain practice when the concept is still shaky.",
            "Move to timed mixed sets when accuracy is stable.",
            "Save full mock exams for pacing, endurance, and readiness checks.",
          ],
        },
      ]}
      faqs={[
        {
          question: "What should I do after failing the BCBA exam?",
          answer: "Start by reviewing your score report and identifying the domains and error patterns that cost points. Then use targeted practice before taking another full mock exam.",
        },
        {
          question: "How long should I study before retaking the BCBA exam?",
          answer: "The right timeline depends on your score pattern, but many candidates use the waiting period to focus on weak domains, rationales, and timed mixed practice instead of rereading all materials.",
        },
        {
          question: "Should I take another mock exam right away?",
          answer: "Only if you need a baseline. If your weak areas are already clear, start with targeted domain practice first, then use a mock exam to test pacing and endurance.",
        },
        {
          question: "Can free BCBA practice questions help after a failed attempt?",
          answer: "Yes, if you use them diagnostically. Free questions help most when you review the rationale, label the domain, and decide what to practice next.",
        },
      ]}
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">A 30-day BCBA retake study structure</h2>
        <p className="mt-3 leading-relaxed text-slate-700">
          This is not a guarantee or a substitute for your own eligibility timeline. It is a practical structure for turning the next month into decisions instead of panic.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-3 pr-4 font-semibold">Window</th>
                <th className="py-3 pr-4 font-semibold">Main job</th>
                <th className="py-3 font-semibold">Best practice format</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Days 1-3</td>
                <td className="py-4 pr-4">Review score report, write down weak domains, and identify timing issues.</td>
                <td className="py-4">Short diagnostic sets and rationale review.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Days 4-14</td>
                <td className="py-4 pr-4">Practice weak domains until the decision rules feel clearer.</td>
                <td className="py-4">Untimed domain practice, then timed mini sets.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Days 15-23</td>
                <td className="py-4 pr-4">Blend domains and check whether accuracy holds when item types are mixed.</td>
                <td className="py-4">Mixed practice questions and sample BCBA exam questions.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Days 24-30</td>
                <td className="py-4 pr-4">Test pacing, stamina, and final weak spots.</td>
                <td className="py-4">Timed mock exam plus targeted review.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">What to change before your next attempt</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              heading: "If you ran out of time",
              body: "Practice shorter timed sets first. Track questions that take longer than 90 seconds and review why they slowed you down.",
              href: "/free-bcba-mock-exam",
              label: "Plan timed mock practice",
            },
            {
              heading: "If distractors fooled you",
              body: "Do not just reread definitions. Write why the wrong answer was tempting and what detail in the stem ruled it out.",
              href: "/bcba-test-questions",
              label: "Review sample questions",
            },
            {
              heading: "If domains were uneven",
              body: "Use domain practice before mixed practice. Your goal is not more hours; it is better allocation of the hours you have.",
              href: "/bcba-exam-practice-questions",
              label: "Practice by domain",
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
