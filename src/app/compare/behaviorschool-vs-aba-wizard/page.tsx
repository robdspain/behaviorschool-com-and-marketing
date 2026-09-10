import type { Metadata } from "next";
import { BcbaComparisonLanding } from "@/components/marketing/BcbaComparisonLanding";
import {
  applySeoMetadataOverride,
  applySchoolBcbaBrandCopy,
  getBehaviorStudyToolsSeoOverride,
} from "@/lib/behavior-study-tools/seo-draft-overrides";
import { behaviorStudyToolsAppHref } from "@/lib/behavior-study-tools/links";

const PAGE_HREF = "https://behaviorschool.com/compare/behaviorschool-vs-aba-wizard";
const SEO_OVERRIDE_HREF = "https://behaviorstudytools.com/compare/behaviorschool-vs-aba-wizard";

const baseMetadata: Metadata = {
  title: "Behavior School vs ABA Wizard: BCBA Study App Comparison",
  description:
    "Compare BehaviorSchool Study with ABA Wizard's mobile app, Total Learning System, and 185-question timed mock exams. See which BCBA prep workflow fits you.",
  alternates: { canonical: PAGE_HREF },
  openGraph: {
    title: "Behavior School vs ABA Wizard: BCBA Study App Comparison",
    description:
      "Side-by-side look at BehaviorSchool Study vs ABA Wizard mock exams, learning system, and mobile practice—without ignoring what each vendor publishes.",
    url: PAGE_HREF,
    images: [{ url: "/optimized/og-image.webp", width: 1200, height: 630 }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const override = await getBehaviorStudyToolsSeoOverride(SEO_OVERRIDE_HREF);
  return applySeoMetadataOverride({ base: baseMetadata, pageHref: PAGE_HREF, override });
}

export default async function BehaviorSchoolVsABAWizardPage() {
  const override = await getBehaviorStudyToolsSeoOverride(SEO_OVERRIDE_HREF);
  const appHref = behaviorStudyToolsAppHref("/free-practice/", {
    intent: "comparison_page_start",
    utm_content: "comparison_aba_wizard_primary",
  });

  return (
    <BcbaComparisonLanding
      competitor="ABA Wizard"
      title={applySchoolBcbaBrandCopy(override?.heroHeadline, "BehaviorSchool vs ABA Wizard")}
      description={applySchoolBcbaBrandCopy(
        override?.metaDescription,
        "ABA Wizard is a lecture-and-drill program: a mobile study app, a Total Learning System built around video lectures and TAFMEDS flashcards, and timed mock exams sold on their own. Behavior Study Tools is practice-first: adaptive questions with a rationale on every answer, timed full mocks, domain-level results, and progress you can share with a supervisor. This page compares how the two products teach, not how much they sell.",
      )}
      primaryCta={applySchoolBcbaBrandCopy(override?.primaryCta, "Try BehaviorSchool free")}
      primaryHref={appHref}
      bestForCompetitor={applySchoolBcbaBrandCopy(
        override?.faqAnswer,
        "You learn best by watching lectures and drilling flashcards, you want a fixed curriculum that walks the Test Content Outline section by section, and you are happy to review mock results on your own rather than share them with a supervisor.",
      )}
      rows={[
        {
          label: "How you study",
          behaviorSchool: "Answer questions, see the missed domain, review the rationale, and choose the next study task. The app adapts to your results.",
          competitor: "Watch a video lecture for each outline section, drill TAFMEDS flashcards, then take section probes and mock exams in a set order.",
        },
        {
          label: "Full mock exams (185 questions, 4 hours)",
          behaviorSchool: "Timed full mocks in the app, scored by domain, with a readiness signal built from accuracy, response time, consistency, and mock endurance.",
          competitor: "Timed full mocks aligned to the 6th Edition Test Content Outline, with a percentage grade and per-question feedback delivered after you finish.",
        },
        {
          label: "Explanations",
          behaviorSchool: "A rationale on every practice question, shown as soon as you answer, so you can fix the misconception before the next question.",
          competitor: "Per-question feedback on mock exams; instruction comes through the video lectures.",
        },
        {
          label: "Weak-domain targeting",
          behaviorSchool: "Practice sets weight your weakest domains automatically between mock checkpoints.",
          competitor: "You choose which sections to rewatch or drill based on your own review of the results.",
        },
        {
          label: "Sharing progress",
          behaviorSchool: "Domain-level progress summaries you can send to a supervisor or study group.",
          competitor: "Results are yours to review; a supervisor-facing report is not part of the published product.",
        },
        {
          label: "Platform",
          behaviorSchool: "Web app that works in any browser, including on your phone.",
          competitor: "Mobile app first, with web-based mock exams sold separately.",
        },
      ]}
    />
  );
}
