import type { Metadata } from "next";
import { BcbaComparisonLanding } from "@/components/marketing/BcbaComparisonLanding";
import {
  applySeoMetadataOverride,
  getBehaviorStudyToolsSeoOverride,
} from "@/lib/behavior-study-tools/seo-draft-overrides";

const PAGE_HREF = "https://behaviorschool.com/compare/behaviorschool-vs-aba-wizard";
const SEO_OVERRIDE_HREF = "https://behaviorstudytools.com/compare/behaviorschool-vs-aba-wizard";

const baseMetadata: Metadata = {
  title: "BehaviorSchool vs ABA Wizard | BCBA Study App Comparison",
  description:
    "Compare BehaviorSchool and ABA Wizard for BCBA exam prep. See which study workflow fits candidates who need practice, readiness, reports, and review signals.",
  alternates: { canonical: PAGE_HREF },
  openGraph: {
    title: "BehaviorSchool vs ABA Wizard | BCBA Study App Comparison",
    description:
      "A fair BCBA study app comparison focused on workflow, readiness, reports, and review signals.",
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
  return (
    <BcbaComparisonLanding
      competitor="ABA Wizard"
      title={override?.heroHeadline || "BehaviorSchool vs ABA Wizard"}
      description={override?.metaDescription || "ABA Wizard is commonly considered by candidates who want mobile BCBA question practice. BehaviorSchool is positioned for candidates who want a fuller study workflow with mock exams, readiness scoring, review labels, and supervisor reporting."}
      primaryCta={override?.primaryCta || "Try BehaviorSchool free"}
      bestForCompetitor={override?.faqAnswer || "A candidate primarily wants lightweight mobile-style question practice and does not need readiness reporting, supervisor exports, or a broader BehaviorSchool study ecosystem."}
      rows={[
        {
          label: "Primary study job",
          behaviorSchool: "Practice plus readiness, reporting, and next-step planning.",
          competitor: "Often considered for question practice and quick review.",
        },
        {
          label: "Quality signals",
          behaviorSchool: "Visible labels for alignment, review status, sources, last reviewed, and issue reporting.",
          competitor: "Candidates should review the current app details before relying on comparable signals.",
        },
        {
          label: "Supervisor or cohort use",
          behaviorSchool: "Progress reports support supervision, university cohorts, and employer conversations.",
          competitor: "May not be designed around supervisor-facing progress artifacts.",
        },
        {
          label: "Best fit",
          behaviorSchool: "Candidates who want a measurable study system.",
          competitor: "Candidates who want simpler practice-first study support.",
        },
      ]}
    />
  );
}
