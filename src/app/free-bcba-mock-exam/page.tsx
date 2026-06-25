import type { Metadata } from "next";
import { SeoArticlePage } from "@/components/seo/SeoArticlePage";

const canonical = "https://behaviorschool.com/free-bcba-mock-exam";

export const metadata: Metadata = {
  title: "Free BCBA Mock Exam | 6th Edition Practice | Behavior School",
  description:
    "Take a free BCBA mock exam pathway with practice questions, rationales, readiness signals, and 6th Edition-aligned study support.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <SeoArticlePage
      title="Free BCBA Mock Exam"
      description="A free BCBA mock exam should do more than give a score. Use mock questions, rationales, timing practice, and readiness signals to decide what to study next."
      eyebrow="BCBA exam prep"
      breadcrumbLabel="Free BCBA Mock Exam"
      canonical={canonical}
      primaryCta={{ label: "Start the free practice exam", href: "/free-bcba-practice-exam" }}
      secondaryLinks={[
        { label: "BCBA practice exam", href: "/bcba-practice-exam" },
        { label: "BCBA mock exam 6th edition", href: "/bcba-mock-exam-6th-edition" },
        { label: "Free BCBA exam prep", href: "/bcba-exam-prep" },
      ]}
      sections={[
        {
          heading: "What a mock exam should measure",
          body: "A useful mock exam checks more than recall. It should show whether you can apply concepts under time pressure, sustain performance, and explain why an answer is correct.",
          bullets: [
            "Accuracy by content area, not just a total score.",
            "Rationales that connect each answer to the underlying concept.",
            "Timing and endurance signals that help you plan full-length practice.",
          ],
        },
        {
          heading: "How to use a free mock exam",
          body: "Start with a short practice set, review every rationale, then move to a longer mock only after you know which domains need attention.",
          bullets: [
            "Do one focused practice block before a full mock.",
            "Write down the concept behind every missed item.",
            "Retest after targeted review instead of repeating random questions.",
          ],
        },
        {
          heading: "Where this fits in your study plan",
          body: "Mock exams are best used as checkpoints. They help you decide whether to review concepts, build fluency, or practice endurance before exam day.",
        },
      ]}
      faqs={[
        {
          question: "Is the free BCBA mock exam the same as the real exam?",
          answer: "No. It is practice designed to build readiness and identify weak areas. It should not be treated as a prediction of your official exam score.",
        },
        {
          question: "Should I take a mock exam before I finish studying?",
          answer: "Yes, but use it diagnostically. Early mock performance can show which domains deserve the next study block.",
        },
      ]}
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Mock exam strategy by score pattern</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-3 pr-4 font-semibold">Mock result</th>
                <th className="py-3 pr-4 font-semibold">What it usually means</th>
                <th className="py-3 font-semibold">Next study action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">High accuracy, slow timing</td>
                <td className="py-4 pr-4">You understand the concepts but need fluency and endurance.</td>
                <td className="py-4">Use timed 10-question blocks and review only items that took too long.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Low accuracy in one domain</td>
                <td className="py-4 pr-4">A specific content area is limiting your total score.</td>
                <td className="py-4">Study that domain, then retest with new questions before another full mock.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Misses across many domains</td>
                <td className="py-4 pr-4">You may need concept review before heavy mock testing.</td>
                <td className="py-4">Return to core definitions, examples, and rationales before timed practice.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </SeoArticlePage>
  );
}
