import type { Metadata } from "next";
import Link from "next/link";
import { SeoArticlePage } from "@/components/seo/SeoArticlePage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { behaviorStudyToolsAppHref } from "@/lib/behavior-study-tools/links";

const canonical = "https://behaviorschool.com/bcba-exam-weak-areas";

export const metadata: Metadata = buildPageMetadata({
  title: "BCBA Exam Weak Areas | Find What to Study Next",
  description:
    "Find BCBA exam weak areas from readiness checks, practice questions, mock exams, and score patterns. Build the next focused study block.",
  canonical,
  type: "article",
});

const appWeakAreasHref = behaviorStudyToolsAppHref("/onboarding/bcba", {
  intent: "bcba_exam_weak_areas",
  utm_content: "bcba_exam_weak_areas_page",
});

export default function BcbaExamWeakAreasPage() {
  return (
    <SeoArticlePage
      title="BCBA Exam Weak Areas"
      description="When practice scores stall, the next move is to identify the weak area behind the miss: concept knowledge, discrimination, timing, endurance, or study planning."
      eyebrow="BCBA score review"
      breadcrumbLabel="BCBA Exam Weak Areas"
      canonical={canonical}
      heroVisual
      primaryCta={{ label: "Find weak areas in the app", href: appWeakAreasHref }}
      secondaryLinks={[
        { label: "BCBA readiness check", href: "/bcba-readiness-quiz" },
        { label: "6th Edition practice questions", href: "/bcba-6th-edition-practice-questions" },
        { label: "Failed BCBA exam help", href: "/failed-bcba-exam-help" },
        { label: "BCBA study schedule", href: "/bcba-study-schedule" },
        { label: "Free BCBA mock exam", href: "/free-bcba-mock-exam" },
      ]}
      sections={[
        {
          heading: "Do not treat every miss the same way",
          body: "Two missed questions can require different study responses. One may show a missing concept. Another may show that you understood the concept but chose a distractor under time pressure.",
          bullets: [
            "Concept misses need domain review.",
            "Distractor misses need rationale comparison.",
            "Slow correct answers need fluency practice.",
          ],
        },
        {
          heading: "Use your weak areas to choose the next block",
          body: "A focused study block should be small enough to complete and specific enough to retest. Pick one pattern, study it, then answer new questions that test the same skill.",
          bullets: [
            "Review one domain or subskill at a time.",
            "Use new questions after review instead of memorizing repeats.",
            "Track whether accuracy and speed both improve.",
          ],
        },
        {
          heading: "Know when to retake a mock exam",
          body: "Take another mock exam when you have repaired the weak area you found. If the same pattern repeats, return to rationales and domain practice before burning another full mock.",
        },
      ]}
      faqs={[
        {
          question: "How do I know my BCBA exam weak areas?",
          answer:
            "Use a readiness check, practice question results, mock exam patterns, and rationale review. Look for repeated misses by domain, concept, distractor type, or timing.",
        },
        {
          question: "What should I do after identifying a weak area?",
          answer:
            "Build a short focused study block, answer new practice questions in that area, and retest only after the pattern improves.",
        },
      ]}
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Weak-area decision table</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-3 pr-4 font-semibold">Pattern</th>
                <th className="py-3 pr-4 font-semibold">Likely weak area</th>
                <th className="py-3 font-semibold">Next study action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Repeated misses in one domain</td>
                <td className="py-4 pr-4">Concept knowledge or domain fluency</td>
                <td className="py-4">Study that domain, then answer new domain-specific questions.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Choosing attractive distractors</td>
                <td className="py-4 pr-4">Discrimination between similar concepts</td>
                <td className="py-4">Compare rationales and write the deciding detail from the stem.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Correct answers taking too long</td>
                <td className="py-4 pr-4">Fluency and pacing</td>
                <td className="py-4">Use timed short sets before returning to a full mock exam.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Score drops late in the session</td>
                <td className="py-4 pr-4">Endurance</td>
                <td className="py-4">Build longer mixed sets gradually and review late-session misses separately.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7">
        <h2 className="text-2xl font-bold text-emerald-950">Use weak areas as a route, not a verdict</h2>
        <p className="mt-3 leading-relaxed text-emerald-900">
          Behavior Study Tools is the practical next step when you need repeated practice, timing, and rationales in one place. Start there after you have a weak-area label.
        </p>
        <Link
          href={appWeakAreasHref}
          className="mt-5 inline-flex rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
        >
          Practice weak areas
        </Link>
      </section>
    </SeoArticlePage>
  );
}
