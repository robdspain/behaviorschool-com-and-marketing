import type { Metadata } from "next";
import { BcbaComparisonLanding } from "@/components/marketing/BcbaComparisonLanding";
import {
  applySeoMetadataOverride,
  getBehaviorStudyToolsSeoOverride,
} from "@/lib/behavior-study-tools/seo-draft-overrides";

const PAGE_HREF = "https://behaviorschool.com/compare/behaviorschool-vs-bds-modules";
const SEO_OVERRIDE_HREF = "https://behaviorstudytools.com/compare/behaviorschool-vs-bds-modules";

const baseMetadata: Metadata = {
  title: "BehaviorSchool vs BDS Modules | BCBA Exam Prep Comparison",
  description:
    "Compare BehaviorSchool and BDS Modules for BCBA exam prep. Review structured modules versus adaptive practice, readiness scoring, and supervisor reports.",
  alternates: { canonical: PAGE_HREF },
  openGraph: {
    title: "BehaviorSchool vs BDS Modules | BCBA Exam Prep Comparison",
    description:
      "A BCBA exam prep comparison focused on study workflow, adaptive practice, readiness scoring, and progress reporting.",
    url: PAGE_HREF,
    images: [{ url: "/optimized/og-image.webp", width: 1200, height: 630 }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const override = await getBehaviorStudyToolsSeoOverride(SEO_OVERRIDE_HREF);
  return applySeoMetadataOverride({ base: baseMetadata, pageHref: PAGE_HREF, override });
}

export default async function BehaviorSchoolVsBDSModulesPage() {
  const override = await getBehaviorStudyToolsSeoOverride(SEO_OVERRIDE_HREF);
  return (
    <BcbaComparisonLanding
      competitor="BDS Modules"
      title={override?.heroHeadline || "BehaviorSchool vs BDS Modules"}
      description={override?.metaDescription || "BDS Modules is known as a structured BCBA study option. BehaviorSchool is positioned for candidates who want adaptive practice, mock exam readiness, transparent review labels, and progress reports they can share."}
      primaryCta={override?.primaryCta || "Try BehaviorSchool free"}
      bestForCompetitor={override?.faqAnswer || "A candidate prefers a traditional module-based study structure and already knows they want that format."}
      rows={[
        {
          label: "Study structure",
          behaviorSchool: "Adaptive practice, domain work, mock exams, readiness status, and next-step analytics.",
          competitor: "Traditional module-based study structure.",
        },
        {
          label: "Readiness signal",
          behaviorSchool: "Exam Readiness status based on accuracy, response time, endurance, and consistency.",
          competitor: "Candidates should compare current scoring and reporting details before choosing.",
        },
        {
          label: "Supervisor or cohort use",
          behaviorSchool: "Clean export/share workflow for supervisors, universities, and employers.",
          competitor: "May not be centered on supervisor-facing progress reports.",
        },
        {
          label: "Best fit",
          behaviorSchool: "Candidates who want a modern app workflow with clear progress decisions.",
          competitor: "Candidates who prefer established modular study routines.",
        },
      ]}
    />
  );
}
