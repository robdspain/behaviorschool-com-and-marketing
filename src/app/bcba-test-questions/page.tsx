import type { Metadata } from "next";
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
      primaryCta={{ label: "Practice BCBA questions", href: "/bcba-practice-exam" }}
      secondaryLinks={[
        { label: "Free BCBA practice exam", href: "/free-bcba-practice-exam" },
        { label: "BCBA exam practice questions", href: "/bcba-exam-practice-questions" },
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
    />
  );
}
