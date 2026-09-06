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
  title: "BehaviorSchool vs ABA Wizard | BCBA Study App Comparison",
  description:
    "Compare BehaviorSchool Study with ABA Wizard's mobile app, Total Learning System, and 185-question timed mock exams. See which BCBA prep workflow fits you.",
  alternates: { canonical: PAGE_HREF },
  openGraph: {
    title: "BehaviorSchool vs ABA Wizard | BCBA Study App Comparison",
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
        "ABA Wizard sells a mobile study app, a Total Learning System with video lectures and TAFMEDS, and standalone 185-question timed mock exams with feedback on every question. BehaviorSchool Study focuses on adaptive practice, full mocks, domain readiness, and progress reports you can share with a supervisor or cohort. This page compares those published workflows—not only the mobile app.",
      )}
      primaryCta={applySchoolBcbaBrandCopy(override?.primaryCta, "Try BehaviorSchool free")}
      primaryHref={appHref}
      bestForCompetitor={applySchoolBcbaBrandCopy(
        override?.faqAnswer,
        "You want ABA Wizard's bundled Total Learning System (video lectures per Test Content Outline section, TAFMEDS, section probes, and a three-mock bundle), or you prefer their published 185-question, four-hour mock exams with per-question feedback emailed after completion—and you do not need BehaviorSchool's readiness reporting or school BCBA resource ecosystem.",
      )}
      rows={[
        {
          label: "Product scope",
          behaviorSchool: "Web-based study app with practice, full mocks, domain results, and readiness language.",
          competitor:
            "Mobile app, Total Learning System (videos + TAFMEDS + mock bundle), and standalone 6th-edition mock exams sold separately.",
        },
        {
          label: "Full mock exams (185 questions / 4 hours)",
          behaviorSchool: "Timed full mocks with domain-level score reports in the study app.",
          competitor:
            "Publishes 185-question, four-hour mocks aligned to the 6th Edition Test Content Outline, with percentage grades and feedback on every question emailed after completion.",
        },
        {
          label: "Structured curriculum",
          behaviorSchool: "Practice-first workflow with domain targeting between mock checkpoints.",
          competitor:
            "Total Learning System includes video lectures for each outline section, exclusive practice questions, TAFMEDS decks, and section probes.",
        },
        {
          label: "Explanations and review",
          behaviorSchool: "Rationales in practice sessions; public-facing review metadata where published.",
          competitor: "Mock exams provide feedback on every question; learning system includes section-level video instruction.",
        },
        {
          label: "Supervisor or cohort reporting",
          behaviorSchool: "Progress summaries intended for supervision or cohort check-ins (export workflow).",
          competitor: "Not advertised as a supervisor-facing export workflow on product pages reviewed.",
        },
        {
          label: "When ABA Wizard may fit better",
          behaviorSchool: "You want readiness signals, school BCBA resources, and a single BehaviorSchool study ecosystem.",
          competitor:
            "You want the published learning-system bundle (videos + TAFMEDS + mocks) or standalone timed mocks with emailed per-question feedback, and mobile-first practice is a priority.",
        },
      ]}
    />
  );
}
