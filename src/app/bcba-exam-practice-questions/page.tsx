import type { Metadata } from "next";
import { SeoArticlePage } from "@/components/seo/SeoArticlePage";

const canonical = "https://behaviorschool.com/bcba-exam-practice-questions";

export const metadata: Metadata = {
  title: "BCBA Exam Practice Questions | Free Study Guide | Behavior School",
  description:
    "Use BCBA exam practice questions to review concepts, build fluency, and prepare for 6th Edition exam scenarios with rationales.",
  alternates: { canonical },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <SeoArticlePage
      title="BCBA Exam Practice Questions"
      description="BCBA exam practice questions are most effective when they are reviewed by concept, timing, and rationale. This guide shows how to use practice questions to build readiness."
      eyebrow="6th Edition study"
      breadcrumbLabel="BCBA Exam Practice Questions"
      canonical={canonical}
      primaryCta={{ label: "Start practice questions", href: "/bcba-practice-exam" }}
      secondaryLinks={[
        { label: "BCBA test questions", href: "/bcba-test-questions" },
        { label: "Free BCBA mock exam", href: "/free-bcba-mock-exam" },
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
    />
  );
}
