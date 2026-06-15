import type { Metadata } from "next";
import { BcbaSeoLanding } from "@/components/marketing/BcbaSeoLanding";
import {
  applySeoMetadataOverride,
  getBehaviorStudyToolsSeoOverride,
  seoOverrideFaq,
} from "@/lib/behavior-study-tools/seo-draft-overrides";
import { behaviorStudyToolsAppHref } from "@/lib/behavior-study-tools/links";

const PAGE_HREF = "https://behaviorstudytools.com/bcba-study-app-school-based-bcbas";

const baseMetadata: Metadata = {
  title: "BCBA Study App for School-Based BCBAs | BehaviorSchool Study",
  description:
    "A BCBA study app for school-based candidates who need adaptive practice, school-relevant scenarios, readiness scoring, and supervisor reporting.",
  alternates: { canonical: PAGE_HREF },
  openGraph: {
    title: "BCBA Study App for School-Based BCBAs | BehaviorSchool Study",
    description:
      "Adaptive BCBA practice for school-based candidates, with readiness scoring, review labels, and supervisor reports.",
    url: PAGE_HREF,
    images: [{ url: "/optimized/og-image.webp", width: 1200, height: 630 }],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const override = await getBehaviorStudyToolsSeoOverride(PAGE_HREF);
  return applySeoMetadataOverride({ base: baseMetadata, pageHref: PAGE_HREF, override });
}

export default async function SchoolBasedBCBAStudyAppPage() {
  const override = await getBehaviorStudyToolsSeoOverride(PAGE_HREF);
  return (
    <BcbaSeoLanding
      eyebrow="School-based BCBA exam prep"
      title={override?.heroHeadline || "A BCBA study app built for candidates who work in schools."}
      description={override?.metaDescription || "School-based candidates need more than generic question drilling. BehaviorSchool connects adaptive BCBA practice with school-relevant scenarios, progress reports, and next-step readiness signals."}
      primaryCta={override?.primaryCta || "Start school-based practice"}
      primaryHref={behaviorStudyToolsAppHref("/onboarding/bcba", {
        intent: "school_based_bcba",
        utm_content: "school_based_bcba_primary_cta",
      })}
      imageAlt="BehaviorSchool Study app for school-based BCBA candidates"
      features={[
        {
          title: "School-relevant scenarios",
          body: "Study examples can connect concepts to classrooms, teams, supervision, data review, and school-based service delivery.",
        },
        {
          title: "Supervisor-ready reporting",
          body: "Export progress summaries for supervisors, university cohorts, or employers when candidates need to show study progress.",
        },
        {
          title: "Clear readiness language",
          body: "Candidates see whether they are not yet ready, building, near ready, or ready based on more than one quiz score.",
        },
      ]}
      sections={[
        {
          title: "Practice between real school demands",
          body: "The app supports short focused sessions and longer mock sessions, which fits candidates studying between fieldwork and supervision.",
        },
        {
          title: "Translate exam content into decision-making",
          body: "Rationales and distractor review help candidates understand why an answer fits, not only which option was marked correct.",
        },
        {
          title: "Keep weak domains visible",
          body: "Domain reporting keeps the next study decision obvious when candidates have limited time.",
        },
        {
          title: "Stay inside the BehaviorSchool ecosystem",
          body: "BehaviorSchool’s public resources, school BCBA content, and study app can support the same candidate journey.",
        },
      ]}
      faqs={[
        ...seoOverrideFaq(override),
        {
          title: "Is this only for school-based BCBAs?",
          body: "No. BCBA candidates in other settings can still use the app. This page explains why school-based candidates may find the workflow especially useful.",
        },
        {
          title: "Can a supervisor see my full account?",
          body: "The intended workflow is a clean progress report, not unrestricted account access. Candidates can share the level of progress evidence they need.",
        },
        {
          title: "Where should I start?",
          body: "Start with a short practice session or free mock flow at study.behaviorschool.com, then use the score report to choose a domain focus.",
        },
      ]}
    />
  );
}
