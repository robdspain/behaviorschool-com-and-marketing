import type { Metadata } from "next";
import Link from "next/link";
import { SeoArticlePage } from "@/components/seo/SeoArticlePage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { behaviorStudyToolsAppHref } from "@/lib/behavior-study-tools/links";

const canonical = "https://behaviorschool.com/bcba-6th-edition-practice-questions";

export const metadata: Metadata = buildPageMetadata({
  title: "BCBA 6th Edition Practice Questions | Free Samples + Rationales",
  description:
    "Practice BCBA 6th Edition questions with sample scenarios, rationales, weak-area review, and next steps into mock exams or the study app.",
  canonical,
  type: "article",
});

const appPracticeHref = behaviorStudyToolsAppHref("/onboarding/bcba", {
  intent: "sixth_edition_practice_questions",
  utm_content: "bcba_6th_edition_practice_questions",
});

export default function BcbaSixthEditionPracticeQuestionsPage() {
  return (
    <SeoArticlePage
      title="BCBA 6th Edition Practice Questions"
      description="Use 6th Edition practice questions to rehearse applied decision-making, review rationales, and decide whether your next step should be domain practice, weak-area review, or a timed mock exam."
      eyebrow="6th Edition BCBA exam prep"
      breadcrumbLabel="BCBA 6th Edition Practice Questions"
      canonical={canonical}
      heroVisual
      primaryCta={{ label: "Practice in the study app", href: appPracticeHref }}
      secondaryLinks={[
        { label: "BCBA readiness check", href: "/bcba-readiness-quiz" },
        { label: "BCBA exam practice questions", href: "/bcba-exam-practice-questions" },
        { label: "BCBA test questions", href: "/bcba-test-questions" },
        { label: "Free BCBA mock exam", href: "/free-bcba-mock-exam" },
        { label: "BCBA study schedule", href: "/bcba-study-schedule" },
      ]}
      sections={[
        {
          heading: "What changed about studying for the 6th Edition?",
          body: "The study task is still applied behavior analysis, but candidates should practice with current domain language, school and clinical scenarios, ethics decisions, and rationales that connect the answer to the concept.",
          bullets: [
            "Use current 6th Edition domain names when organizing review.",
            "Practice applied scenarios, not only definition recall.",
            "Review why distractors are wrong, not only why the answer is right.",
          ],
        },
        {
          heading: "Use practice questions to diagnose the problem",
          body: "A missed question can mean several different things: weak concept knowledge, poor discrimination, rushed reading, or pacing pressure. The rationale should help you identify which one happened.",
          bullets: [
            "If you missed the concept, return to domain study.",
            "If you picked a plausible distractor, write the deciding detail.",
            "If you knew the answer but ran out of time, practice fluency.",
          ],
        },
        {
          heading: "Move from short practice to mock exams",
          body: "Short 6th Edition practice sets are ideal for concept review. Once accuracy is stable, move into timed mock exams so you can test endurance, mixed-domain discrimination, and pacing.",
        },
      ]}
      faqs={[
        {
          question: "Are these official BACB questions?",
          answer:
            "No. Behavior School practice content is exam preparation content, not official BACB exam content. Use it to practice concepts, timing, and rationales.",
        },
        {
          question: "Should I study by domain or use mixed questions?",
          answer:
            "Use domain practice when you are learning or repairing weak areas. Use mixed questions when you need to test discrimination, timing, and exam readiness.",
        },
      ]}
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Sample 6th Edition practice flow</h2>
        <div className="mt-5 space-y-4">
          {[
            {
              step: "1",
              title: "Read the scenario for the decision, not the keyword",
              body: "Ask what the behavior analyst must decide: measurement, assessment, intervention, ethics, supervision, or system support.",
            },
            {
              step: "2",
              title: "Choose the answer and name the rule",
              body: "Before checking the rationale, name the concept or ethical principle that made the answer stronger than the distractors.",
            },
            {
              step: "3",
              title: "Convert the miss into a weak-area label",
              body: "Label the miss as concept, discrimination, reading, timing, or endurance. That label tells you what to practice next.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 rounded-xl border border-slate-200 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-lg font-bold text-white">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-700">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7">
        <h2 className="text-2xl font-bold text-emerald-950">Next best step</h2>
        <p className="mt-3 leading-relaxed text-emerald-900">
          If you want the shortest path from practice to action, start in Behavior Study Tools, then use the results to decide whether to repeat a domain, take a mock exam, or rebuild your study schedule.
        </p>
        <Link
          href={appPracticeHref}
          className="mt-5 inline-flex rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
        >
          Open Behavior Study Tools
        </Link>
      </section>
    </SeoArticlePage>
  );
}
