import type { Metadata } from "next";
import { SeoArticlePage } from "@/components/seo/SeoArticlePage";

const canonical = "https://behaviorschool.com/functional-behavior-assessment-guide";

export const metadata: Metadata = {
  title: "Functional Behavior Assessment Guide | School FBA Steps",
  description:
    "Functional behavior assessment guide for school teams, including FBA steps, data sources, hypothesis statements, and links to BIP planning.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <SeoArticlePage
      title="Functional Behavior Assessment Guide"
      description="A functional behavior assessment helps school teams understand why behavior occurs so they can build a practical, function-based behavior intervention plan."
      eyebrow="FBA guide"
      breadcrumbLabel="Functional Behavior Assessment Guide"
      canonical={canonical}
      primaryCta={{ label: "Turn an FBA into a BIP", href: "/fba-to-bip" }}
      secondaryLinks={[
        { label: "Behavior intervention plan examples", href: "/behavior-intervention-plan-examples" },
        { label: "Behavior Plan Writer", href: "/behavior-plans" },
        { label: "School BCBA job guide", href: "/school-bcba/job-guide" },
      ]}
      sections={[
        {
          heading: "Core FBA steps",
          body: "An FBA should define the behavior, gather information across sources, identify patterns, and produce a testable hypothesis that guides intervention.",
          bullets: [
            "Define the target behavior in observable terms.",
            "Review records, interviews, rating scales, and direct observation data.",
            "Look for antecedent and consequence patterns.",
            "Write a hypothesis that names context, behavior, and function.",
          ],
        },
        {
          heading: "Data sources to include",
          body: "School FBAs are stronger when they combine interviews, ABC data, scatterplots, work samples, attendance or discipline data, and direct observations across settings.",
        },
        {
          heading: "From FBA to BIP",
          body: "The hypothesis should drive the plan. If the function is escape, teach appropriate escape or help responses. If the function is attention, teach appropriate attention requests and adjust adult response patterns.",
        },
      ]}
      faqs={[
        {
          question: "What is the purpose of an FBA?",
          answer: "The purpose is to identify why behavior occurs so the team can design supports that teach replacement skills and reduce the need for interfering behavior.",
        },
        {
          question: "Does every BIP need an FBA?",
          answer: "A strong BIP should be based on functional information. The depth of assessment depends on the student's needs, context, and legal or district requirements.",
        },
      ]}
    />
  );
}
