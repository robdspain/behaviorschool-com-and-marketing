import { SeoArticlePage } from "@/components/seo/SeoArticlePage";
import { buildPageMetadata } from "@/lib/seo/metadata";

const canonical = "https://behaviorschool.com/school-bcba/interview-questions";

export const metadata = buildPageMetadata({
  title: "School BCBA Interview Questions | Behavior School",
  description:
    "Prepare for school BCBA interviews with common district questions, sample answer themes, and portfolio artifacts to bring.",
  canonical,
  type: "article",
});

export default function Page() {
  return (
    <SeoArticlePage
      title="School BCBA Interview Questions"
      description="School BCBA interviews usually test your ability to support teams, explain data, handle conflict, and keep interventions practical in classrooms."
      eyebrow="Interview prep"
      breadcrumbLabel="School BCBA Interview Questions"
      canonical={canonical}
      primaryCta={{ label: "Build your school BCBA portfolio", href: "/school-bcba/job-guide" }}
      secondaryLinks={[
        { label: "School BCBA job description", href: "/school-bcba/job-description" },
        { label: "School BCBA salary", href: "/school-bcba/salary-by-state" },
        { label: "Transformation Program", href: "/transformation-program" },
      ]}
      sections={[
        {
          heading: "Questions districts commonly ask",
          body: "Expect questions about FBAs, BIPs, IEP teams, staff coaching, crisis response, and how you handle disagreement with teachers or administrators.",
          bullets: [
            "How do you conduct an FBA in a busy school setting?",
            "How do you make sure a BIP is implemented with fidelity?",
            "How do you coach a teacher who disagrees with the plan?",
            "How do you decide whether behavior data show progress?",
          ],
        },
        {
          heading: "What strong answers include",
          body: "Strong answers are specific. Name the data you collect, the team members you involve, the ethical concerns you consider, and the follow-up system you use.",
          bullets: [
            "A clear decision process, not just a preferred intervention.",
            "Examples of collaboration with educators and families.",
            "Attention to feasibility and implementation fidelity.",
          ],
        },
        {
          heading: "What to bring",
          body: "Bring a small portfolio with a de-identified FBA/BIP example, coaching checklist, progress graph, sample IEP behavior goal, and a 90-day support plan.",
        },
      ]}
      faqs={[
        {
          question: "Should I bring work samples to a school BCBA interview?",
          answer: "Yes. De-identified artifacts help districts see how you think, write, train, and monitor implementation.",
        },
        {
          question: "What is the most important interview theme?",
          answer: "Show that you can make behavior analysis usable for school teams, not just technically correct on paper.",
        },
      ]}
    />
  );
}
