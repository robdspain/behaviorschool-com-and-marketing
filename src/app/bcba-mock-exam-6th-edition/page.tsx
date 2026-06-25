import type { Metadata } from "next";
import { BcbaSeoLanding } from "@/components/marketing/BcbaSeoLanding";
import {
  applySeoMetadataOverride,
  getBehaviorStudyToolsSeoOverride,
  seoOverrideFaq,
} from "@/lib/behavior-study-tools/seo-draft-overrides";
import { behaviorStudyToolsAppHref } from "@/lib/behavior-study-tools/links";

const PAGE_HREF = "https://behaviorschool.com/bcba-mock-exam-6th-edition";
const SEO_OVERRIDE_HREF = "https://behaviorstudytools.com/bcba-mock-exam-6th-edition";

const baseMetadata: Metadata = {
  title: "BCBA Mock Exam 6th Edition | BehaviorSchool Study",
  description:
    "Take a BCBA mock exam built for 6th Edition study: timed practice, domain review, readiness scoring, rationales, and next-step analytics.",
  alternates: { canonical: PAGE_HREF },
  openGraph: {
    title: "BCBA Mock Exam 6th Edition | BehaviorSchool Study",
    description:
      "Timed mock exams, domain-level review, readiness scoring, and next-step analytics for BCBA candidates.",
    url: PAGE_HREF,
    images: [{ url: "/optimized/og-image.webp", width: 1200, height: 630 }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const override = await getBehaviorStudyToolsSeoOverride(SEO_OVERRIDE_HREF);
  return applySeoMetadataOverride({ base: baseMetadata, pageHref: PAGE_HREF, override });
}

export default async function BCBAMockExamSixthEditionPage() {
  const override = await getBehaviorStudyToolsSeoOverride(SEO_OVERRIDE_HREF);
  return (
    <BcbaSeoLanding
      eyebrow="BCBA mock exam"
      title={override?.heroHeadline || "BCBA mock exams built for 6th Edition study decisions."}
      description={override?.metaDescription || "A mock exam should do more than produce a score. BehaviorSchool helps candidates practice timing, build endurance, review rationales, and decide which domains need the next study block."}
      primaryCta={override?.primaryCta || "Start a free mock exam"}
      primaryHref={behaviorStudyToolsAppHref("/free-mock-exam/full", {
        intent: "full_mock",
        utm_content: "bcba_mock_6th_primary_cta",
      })}
      imageAlt="BehaviorSchool Study mock exam and readiness dashboard"
      features={[
        {
          title: "Timed exam practice",
          body: "Use full-mock structure to practice pacing, stamina, and the experience of answering mixed-domain questions under time pressure.",
        },
        {
          title: "Domain-level review",
          body: "After the attempt, review performance by content area instead of guessing what to study next.",
        },
        {
          title: "Readiness status",
          body: "Readiness combines accuracy, response time, endurance, and consistency into a simple status candidates can understand quickly.",
        },
      ]}
      sections={[
        {
          title: "Built around the 6th Edition study workflow",
          body: "The public page and in-app flows emphasize 6th Edition alignment, review signals, and transparent rationales.",
        },
        {
          title: "Designed for endurance, not only recall",
          body: "Mock exams help candidates learn whether their performance holds up after a longer session, not just during short quizzes.",
        },
        {
          title: "Use results to plan the next week",
          body: "The app turns mock performance into focused practice recommendations instead of leaving candidates with a raw score.",
        },
        {
          title: "Share progress when needed",
          body: "Supervisor reports make progress easier to discuss in supervision, university cohorts, or employment settings.",
        },
      ]}
      relatedLinks={[
        {
          title: "BCBA mock exam free",
          body: "Start with the free public mock exam page when you need a realistic readiness check before a full app workflow.",
          href: "/free-bcba-mock-exam",
        },
        {
          title: "BCBA exam practice questions",
          body: "Use mixed practice questions when you need shorter study sessions before or between full mock exams.",
          href: "/bcba-exam-practice-questions",
        },
        {
          title: "Sample BCBA exam questions",
          body: "Review sample question formats and rationales before deciding whether to practice by domain or take a timed exam.",
          href: "/bcba-test-questions",
        },
        {
          title: "BCBA practice exam",
          body: "Move into a broader practice exam when you want repeated exam-style practice with scoring and explanations.",
          href: "/bcba-practice-exam",
        },
      ]}
      faqs={[
        ...seoOverrideFaq(override),
        {
          title: "Is this the same as the real BCBA exam?",
          body: "No practice product can be the official exam. The goal is to simulate timing, mixed-domain practice, and review decisions so candidates can prepare more deliberately.",
        },
        {
          title: "Should I take a mock before I finish studying?",
          body: "Yes, if you treat the result as diagnostic. Early mocks help identify weak domains and pacing issues before they become exam-day problems.",
        },
        {
          title: "Where does the actual mock exam live?",
          body: "The app and practice flows live at study.behaviorschool.com. This page is the canonical public guide and search page.",
        },
      ]}
    />
  );
}
