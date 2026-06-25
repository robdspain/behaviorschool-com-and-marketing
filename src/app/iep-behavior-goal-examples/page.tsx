import type { Metadata } from "next";
import { SeoArticlePage } from "@/components/seo/SeoArticlePage";

const canonical = "https://behaviorschool.com/iep-behavior-goal-examples";

export const metadata: Metadata = {
  title: "IEP Behavior Goal Examples | Measurable School Goals",
  description:
    "IEP behavior goal examples for school teams, including measurable replacement behavior goals, baseline language, criteria, and data collection tips.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <SeoArticlePage
      title="IEP Behavior Goal Examples"
      description="Good IEP behavior goals describe what the student will do, under what conditions, how progress will be measured, and what level of performance counts as success."
      eyebrow="IEP goal writing"
      breadcrumbLabel="IEP Behavior Goal Examples"
      canonical={canonical}
      primaryCta={{ label: "Use the IEP goal writer", href: "/iep-goals" }}
      secondaryLinks={[
        { label: "IEP Goal Writer", href: "/iep-goal-writer" },
        { label: "Behavior Plan Writer", href: "/behavior-plans" },
        { label: "Behavior tools", href: "/behavior-tools" },
      ]}
      sections={[
        {
          heading: "What a measurable behavior goal includes",
          body: "A measurable goal needs a clear behavior, condition, criterion, measurement method, and timeline. Avoid vague goals like 'will improve behavior.'",
          bullets: [
            "Target a replacement behavior when possible.",
            "Include baseline-informed criteria.",
            "Name the setting, support level, and data source.",
          ],
        },
        {
          heading: "Example: help request goal",
          body: "Given a difficult independent task and a visual support, the student will request help or a break using an agreed response in 80% of observed opportunities across four consecutive weeks.",
        },
        {
          heading: "Example: transition goal",
          body: "Given a transition warning and visual schedule, the student will move to the next activity within two minutes with no more than one adult prompt in 4 of 5 opportunities.",
        },
      ]}
      faqs={[
        {
          question: "Should IEP behavior goals focus on reducing behavior?",
          answer: "Goals are usually stronger when they define the replacement behavior the student will learn, while the BIP tracks reduction in interfering behavior.",
        },
        {
          question: "Who writes IEP behavior goals?",
          answer: "The IEP team writes goals. BCBAs often support drafting, measurement, baseline interpretation, and progress-monitoring systems.",
        },
      ]}
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">IEP behavior goal examples by function</h2>
        <div className="mt-5 space-y-4">
          {[
            {
              function: "Escape",
              goal:
                "Given a nonpreferred academic task and a visual support, the student will request help or a break before leaving the area in 80% of observed opportunities across four consecutive weeks.",
            },
            {
              function: "Attention",
              goal:
                "Given whole-group instruction, the student will use an agreed attention request instead of calling out in 4 of 5 observed opportunities across three consecutive data days.",
            },
            {
              function: "Access to tangibles or activities",
              goal:
                "Given a preferred item is unavailable, the student will request a turn, choose an alternative, or wait with a visual timer for two minutes in 80% of opportunities.",
            },
            {
              function: "Automatic or sensory",
              goal:
                "Given access to matched sensory supports, the student will use an agreed regulation strategy for three minutes before returning to the assigned routine in 4 of 5 opportunities.",
            },
          ].map((item) => (
            <div key={item.function} className="rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-950">{item.function}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.goal}</p>
            </div>
          ))}
        </div>
      </section>
    </SeoArticlePage>
  );
}
