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
    />
  );
}
