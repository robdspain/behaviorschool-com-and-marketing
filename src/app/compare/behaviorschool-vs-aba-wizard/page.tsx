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
    "Compare BehaviorSchool and ABA Wizard for BCBA exam prep. Mobile question drills vs full mock workflow, readiness reporting, and supervisor exports.",
  alternates: { canonical: PAGE_HREF },
  openGraph: {
    title: "BehaviorSchool vs ABA Wizard | BCBA Study App Comparison",
    description:
      "When mobile question practice is enough—and when candidates need timed mocks, domain reports, and supervisor-ready progress exports.",
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
      description={
        override?.metaDescription ||
        "ABA Wizard is often evaluated for quick mobile BCBA question practice. BehaviorSchool Study is built around timed mock exams, domain-level readiness, review labels, and progress reports you can share with a supervisor or cohort."
      }
      primaryCta={override?.primaryCta || "Try BehaviorSchool free"}
      bestForCompetitor={
        override?.faqAnswer ||
        "You mainly want a lightweight mobile app for short question sets during commutes or breaks, you do not need full-length timed mocks or exportable progress reports, and you are comfortable verifying question quality and update cadence directly in the app store listing."
      }
      rows={[
        {
          label: "Primary format",
          behaviorSchool: "Web-based study hub with full mocks, domain practice, and score reports.",
          competitor: "Mobile app centered on quick question sessions and on-the-go review.",
        },
        {
          label: "Timed mock exams",
          behaviorSchool: "Full-length mock flow with pacing and stamina feedback across domains.",
          competitor: "Often positioned around shorter drills; confirm whether current plans include full timed mocks.",
        },
        {
          label: "Readiness and next steps",
          behaviorSchool: "Domain results and readiness language tied to what to study next.",
          competitor: "May show performance by topic; verify whether reports guide mock-to-mock planning.",
        },
        {
          label: "Supervisor or university cohort",
          behaviorSchool: "Progress summaries designed for supervision or cohort check-ins.",
          competitor: "Typically self-contained in the app without supervisor-facing export workflow.",
        },
        {
          label: "Content quality signals",
          behaviorSchool: "Public review labels for alignment, sources, and issue reporting on explanations.",
          competitor: "Quality depends on the current question bank; read recent app reviews before relying on rationales.",
        },
        {
          label: "When it may be the better fit",
          behaviorSchool: "You want mock checkpoints, domain analytics, and a study system—not only daily drills.",
          competitor: "You want the lowest-friction mobile practice and do not need mock stamina training or shared reports.",
        },
      ]}
    />
  );
}
