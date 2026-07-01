import type { Metadata } from "next";
import Link from "next/link";
import { SeoArticlePage } from "@/components/seo/SeoArticlePage";
import { buildPageMetadata } from "@/lib/seo/metadata";

const canonical = "https://behaviorschool.com/bcba-exam-practice-questions";

export const metadata: Metadata = buildPageMetadata({
  title: "BCBA Exam Practice Questions | Free Rationales + Study Path",
  description:
    "Practice BCBA exam questions with rationales, domain review, and a clear next step into timed mock exams. Start free with no credit card.",
  canonical,
  type: "article",
});

export default function Page() {
  return (
    <SeoArticlePage
      title="BCBA Exam Practice Questions with Rationales and a Study Path"
      description="BCBA exam practice questions are most effective when they are reviewed by concept, timing, and rationale. Start with free questions, then use your score pattern to choose domain practice or a timed mock exam."
      eyebrow="6th Edition study"
      breadcrumbLabel="BCBA Exam Practice Questions"
      canonical={canonical}
      heroVisual
      primaryCta={{ label: "Start free practice", href: "/free-bcba-practice-exam" }}
      secondaryLinks={[
        { label: "BCBA test questions", href: "/bcba-test-questions" },
        { label: "Free BCBA mock exam", href: "/free-bcba-mock-exam" },
        { label: "Free BCBA practice exam", href: "/free-bcba-practice-exam" },
        { label: "BCBA practice exam", href: "/bcba-practice-exam" },
        { label: "BCBA study app", href: "/bcba-study-app-school-based-bcbas" },
      ]}
      sections={[
        {
          heading: "Use practice questions by domain",
          body: "Group practice by the content area you are trying to strengthen. Mixed sets are useful later, but early study is more efficient when the domain is clear.",
          bullets: [
            "Start with a targeted domain set.",
            "Review explanations immediately after answering.",
            "Move to mixed practice when accuracy is stable.",
          ],
        },
        {
          heading: "Build fluency after accuracy",
          body: "Do not rush timing before you understand the concept. Accuracy comes first, then response speed, then endurance across longer sets.",
          bullets: [
            "Review slow correct answers, not only wrong answers.",
            "Track concepts that take too long to identify.",
            "Use longer sessions after shorter sets are consistent.",
          ],
        },
        {
          heading: "Connect questions to applied examples",
          body: "For school-based candidates, practice is stronger when concepts are tied to classroom data, FBA/BIP decisions, IEP goals, supervision, and ethics.",
        },
      ]}
      faqs={[
        {
          question: "Are practice questions enough to pass the BCBA exam?",
          answer: "Practice questions are useful, but they should be paired with concept review, task list study, and careful rationale analysis.",
        },
        {
          question: "Should I repeat the same questions?",
          answer: "Some review is useful, but relying only on repeated questions can inflate confidence. New scenarios are better for checking generalization.",
        },
      ]}
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">BCBA exam practice questions by search intent</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              heading: "BCBA exam practice questions",
              body: "Use this phrase when you want applied scenarios with answer rationales, not isolated flashcards. Start with a small set, review the decision rule, then repeat with a new scenario.",
              href: "/bcba-test-questions",
              label: "Review test questions",
            },
            {
              heading: "Sample BCBA exam questions",
              body: "Sample questions are best for checking whether you can recognize the concept, rule out distractors, and explain why one answer is stronger than another.",
              href: "/bcba-test-questions#sample-bcba-exam-questions",
              label: "See sample questions",
            },
            {
              heading: "BCBA mock exam free",
              body: "Use a mock exam when you need timing, stamina, and domain-level readiness data. Use practice questions first when you still need concept review.",
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

      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Turn your practice score into the next study action</h2>
        <p className="mt-3 leading-relaxed text-slate-700">
          The useful question is not just whether you got an item right. The useful question is what your answer pattern says to do next.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-3 pr-4 font-semibold">Practice pattern</th>
                <th className="py-3 pr-4 font-semibold">What it usually means</th>
                <th className="py-3 font-semibold">Best next step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Correct but slow</td>
                <td className="py-4 pr-4">You may understand the concept but still need fluency.</td>
                <td className="py-4">Repeat the domain with a timer and review items that took longer than 90 seconds.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Wrong after choosing a plausible distractor</td>
                <td className="py-4 pr-4">The issue is often discrimination, not memorization.</td>
                <td className="py-4">Write why the distractor was tempting and what detail in the stem ruled it out.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">Wrong across several domains</td>
                <td className="py-4 pr-4">Mixed practice may be too early.</td>
                <td className="py-4">Return to domain practice before taking another mock exam.</td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-semibold text-slate-950">High accuracy in short sets</td>
                <td className="py-4 pr-4">You are ready to test endurance and pacing.</td>
                <td className="py-4">Move into a longer timed mock and review performance by domain afterward.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </SeoArticlePage>
  );
}
