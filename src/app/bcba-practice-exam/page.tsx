import type { Metadata } from "next";
import Link from "next/link";
import { SeoArticlePage } from "@/components/seo/SeoArticlePage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SchoolBcbasTransformationCta } from "@/components/marketing/SchoolBcbasTransformationCta";

const canonical = "https://behaviorschool.com/bcba-practice-exam";

export const metadata: Metadata = buildPageMetadata({
  title: "BCBA Practice Exam | Free Questions, Mock Exams + Rationales",
  description:
    "Use a BCBA practice exam to check accuracy, timing, weak areas, and readiness. Start with free questions, review rationales, then choose the next study step.",
  canonical,
  type: "article",
});

export default function BCBAPracticeExamPage() {
  return (
    <SeoArticlePage
      title="BCBA Practice Exam: Free Questions, Mock Exams, and Rationales"
      description="A useful BCBA practice exam should do more than give you a score. It should show where your reasoning is strong, where distractors are pulling you off track, and what to study next before you spend another week guessing."
      eyebrow="BCBA exam prep"
      breadcrumbLabel="BCBA Practice Exam"
      canonical={canonical}
      heroVisual
      dateModified="2026-07-20"
      primaryCta={{ label: "Take the free practice exam", href: "/free-bcba-practice-exam" }}
      secondaryLinks={[
        { label: "Free BCBA practice exam", href: "/free-bcba-practice-exam" },
        { label: "Free BCBA mock exam", href: "/free-bcba-mock-exam" },
        { label: "BCBA test questions", href: "/bcba-test-questions" },
        { label: "BCBA exam practice questions", href: "/bcba-exam-practice-questions" },
        { label: "BCBA readiness quiz", href: "/bcba-readiness-quiz" },
        { label: "BCBA exam prep", href: "/bcba-exam-prep" },
      ]}
      sections={[
        {
          heading: "Start with the right practice format",
          body: "Short practice sets are best when you are still building concept accuracy. A longer mock exam is better when you need timing, endurance, and a realistic check of mixed-domain readiness.",
          bullets: [
            "Use a short free practice exam for quick feedback.",
            "Use domain practice when misses cluster around one concept area.",
            "Use a full mock exam when you need pacing and stamina data.",
          ],
        },
        {
          heading: "Review rationales before taking another exam",
          body: "The score matters, but the rationale review is where most learning happens. For every missed item, name the concept, identify the distractor you chose, and write the detail in the question stem that made the correct answer stronger.",
          bullets: [
            "Track slow correct answers, not only wrong answers.",
            "Separate concept errors from timing errors.",
            "Retest with new scenarios after reviewing a weak area.",
          ],
        },
        {
          heading: "Use school-based examples when they fit your work",
          body: "If you plan to work in schools, connect exam concepts to FBA decisions, BIP implementation, classroom data, IEP goals, supervision, and ethical collaboration. Practice feels less abstract when examples match the work you expect to do.",
        },
      ]}
      faqs={[
        {
          question: "What is the best way to use a BCBA practice exam?",
          answer:
            "Use a practice exam to identify weak areas, timing problems, and distractor patterns. Then review rationales before taking another exam.",
        },
        {
          question: "Should I start with a full mock exam or short practice questions?",
          answer:
            "Start with short practice questions if you need concept feedback. Move to a full mock exam when your accuracy is stable and you need to test timing and endurance.",
        },
        {
          question: "Are free BCBA practice exams useful?",
          answer:
            "Yes, if you use them as feedback rather than proof that you are ready. A short free exam can show which domains or study habits need attention before longer mock exams.",
        },
      ]}
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Choose your next practice step</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            {
              heading: "I want quick feedback",
              body: "Take a short free practice exam and review each rationale before you move on.",
              href: "/free-bcba-practice-exam",
              label: "Take the free exam",
            },
            {
              heading: "I need realistic timing",
              body: "Use a longer mock exam when you are ready to test stamina across mixed domains.",
              href: "/free-bcba-mock-exam",
              label: "Plan a mock exam",
            },
            {
              heading: "I keep missing similar questions",
              body: "Review the weak area and practice new examples before taking another mixed exam.",
              href: "/bcba-exam-weak-areas",
              label: "Review weak areas",
            },
            {
              heading: "I want sample question stems",
              body: "Study sample stems, distractors, answers, and rationales before timed practice.",
              href: "/bcba-test-questions",
              label: "Review test questions",
            },
          ].map((item) => (
            <Link
              key={item.heading}
              href={item.href}
              className="rounded-xl border border-slate-200 p-5 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <h3 className="font-semibold text-slate-950">{item.heading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.body}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-emerald-800">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">What to do with your practice score</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-3 pr-4 font-semibold">Pattern</th>
                <th className="py-3 pr-4 font-semibold">Likely issue</th>
                <th className="py-3 font-semibold">Next action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Correct but slow</td>
                <td className="py-4 pr-4">You may understand the concept but need more fluent responding.</td>
                <td className="py-4">Repeat the domain with a timer and review slow items.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Wrong after choosing a plausible distractor</td>
                <td className="py-4 pr-4">The issue is likely discrimination, not effort.</td>
                <td className="py-4">Write why the distractor was tempting and what detail ruled it out.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Misses spread across several domains</td>
                <td className="py-4 pr-4">Mixed practice may be too broad right now.</td>
                <td className="py-4">Return to targeted domain practice before another mock exam.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Strong short-set accuracy</td>
                <td className="py-4 pr-4">You may be ready to test pacing and endurance.</td>
                <td className="py-4">Move into a longer timed mock exam and review by domain.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <SchoolBcbasTransformationCta variant="compact" source="bcba_practice_exam" />
    </SeoArticlePage>
  );
}
