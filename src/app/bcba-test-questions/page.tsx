import type { Metadata } from "next";
import Link from "next/link";
import { SeoArticlePage } from "@/components/seo/SeoArticlePage";

const canonical = "https://behaviorschool.com/bcba-test-questions";

export const metadata: Metadata = {
  title: "BCBA Test Questions with Rationales | Behavior School",
  description:
    "Practice BCBA test questions with rationales, domain review, and school-based examples designed for efficient exam preparation.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <SeoArticlePage
      title="BCBA Test Questions with Rationales"
      description="Good BCBA test questions should force concept application, not memorized definitions. Use rationales, domains, and timing to turn each question into a study decision."
      eyebrow="BCBA test prep"
      breadcrumbLabel="BCBA Test Questions"
      canonical={canonical}
      heroVisual
      primaryCta={{ label: "Practice BCBA questions", href: "/bcba-practice-exam" }}
      secondaryLinks={[
        { label: "Free BCBA practice exam", href: "/free-bcba-practice-exam" },
        { label: "BCBA exam practice questions", href: "/bcba-exam-practice-questions" },
        { label: "Free BCBA mock exam", href: "/free-bcba-mock-exam" },
        { label: "BCBA practice exam", href: "/bcba-practice-exam" },
        { label: "BCBA exam prep", href: "/bcba-exam-prep" },
      ]}
      sections={[
        {
          heading: "What makes a strong BCBA test question",
          body: "The best practice questions ask you to identify the principle, apply it to a realistic situation, and reject plausible distractors.",
          bullets: [
            "The stem includes enough context to select the best answer.",
            "Distractors reflect common misunderstandings.",
            "The rationale explains why the correct answer is best and why the others are weaker.",
          ],
        },
        {
          heading: "How to review missed questions",
          body: "A missed item is only useful if you convert it into a next action. Track the concept, the distractor you chose, and the reason it looked appealing.",
          bullets: [
            "Label the domain or topic for each miss.",
            "Rewrite the concept in your own words.",
            "Find a new example before moving on.",
          ],
        },
        {
          heading: "Why school-based examples help",
          body: "School-based scenarios make abstract concepts easier to practice because they connect assessment, intervention, ethics, supervision, and collaboration to familiar settings.",
        },
      ]}
      faqs={[
        {
          question: "How many BCBA test questions should I practice each day?",
          answer: "A focused set of 10 to 30 well-reviewed questions is usually more useful than a large set that you do not analyze.",
        },
        {
          question: "Are rationales important?",
          answer: "Yes. Rationales help you learn the decision rule behind the answer, which is more valuable than memorizing a single item.",
        },
      ]}
    >
      <section id="sample-bcba-exam-questions" className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Sample BCBA test questions</h2>
        <p className="mt-3 leading-relaxed text-slate-700">
          These sample BCBA exam questions show the level of reasoning to practice before a full mock exam. Each item should be reviewed for the concept, the distractor pattern, and the rationale.
        </p>
        <div className="mt-5 space-y-6">
          {[
            {
              question:
                "A student leaves the instructional area most often after independent writing tasks are presented. The behavior is followed by removal of the task for several minutes. Which function is most likely?",
              answer: "Escape from task demands.",
              rationale:
                "The antecedent is a difficult academic demand and the consequence is removal of that demand. The pattern points to escape-maintained behavior.",
            },
            {
              question:
                "A BCBA wants to compare two reading interventions by alternating them rapidly and measuring correct words per minute. Which design is the best fit?",
              answer: "Alternating treatments design.",
              rationale:
                "Alternating treatments designs are used to compare two or more interventions efficiently when rapid alternation is appropriate.",
            },
            {
              question:
                "A team measures how long it takes a student to begin work after a direction is given. Which measure are they collecting?",
              answer: "Latency.",
              rationale:
                "Latency measures the time between a stimulus or instruction and the beginning of the response.",
            },
          ].map((item) => (
            <div key={item.question} className="rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-950">{item.question}</h3>
              <p className="mt-3 text-sm font-semibold text-emerald-800">Answer: {item.answer}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.rationale}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Sample BCBA exam questions vs. a full practice exam</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-950">Use sample BCBA exam questions for concept checks</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Sample questions are useful when you need quick feedback on ethics, measurement, assessment, experimental design, or behavior-change procedures.
            </p>
            <Link href="/bcba-exam-practice-questions" className="mt-4 inline-flex text-sm font-semibold text-emerald-800 hover:text-emerald-900">
              Study BCBA exam practice questions
            </Link>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-950">Use a free BCBA mock exam for stamina</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              A mock exam is better when you need timing, endurance, and a realistic check of whether your practice-question accuracy holds across longer blocks.
            </p>
            <Link href="/free-bcba-mock-exam" className="mt-4 inline-flex text-sm font-semibold text-emerald-800 hover:text-emerald-900">
              Plan a free BCBA mock exam
            </Link>
          </div>
        </div>
      </section>
    </SeoArticlePage>
  );
}
