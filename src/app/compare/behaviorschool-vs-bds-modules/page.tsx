import type { Metadata } from "next";
import { BcbaComparisonLanding } from "@/components/marketing/BcbaComparisonLanding";
import {
  applySeoMetadataOverride,
  getBehaviorStudyToolsSeoOverride,
} from "@/lib/behavior-study-tools/seo-draft-overrides";

const PAGE_HREF = "https://behaviorschool.com/compare/behaviorschool-vs-bds-modules";
const SEO_OVERRIDE_HREF = "https://behaviorstudytools.com/compare/behaviorschool-vs-bds-modules";

const baseMetadata: Metadata = {
  title: "Behavior School vs BDS Modules: Which BCBA Prep Fits You?",
  description:
    "Side-by-side: BDS fluency modules vs Behavior Study Tools adaptive practice, rationales, and timed mocks. Pick the prep style that matches how you study.",
  alternates: { canonical: PAGE_HREF },
  openGraph: {
    title: "Behavior School vs BDS Modules: Which BCBA Prep Fits You?",
    description:
      "Side-by-side: BDS fluency modules vs Behavior Study Tools adaptive practice, rationales, and timed mocks. Pick the prep style that matches how you study.",
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
      description={override?.metaDescription || "Behavior Development Solutions (BDS) is the long-running fluency program most BCBA candidates have heard of: work through modules until you answer quickly and accurately, then take domain tests and a mock. Behavior Study Tools starts from practice questions instead of modules: every answer shows the missed domain and a rationale, and timed mocks feed a readiness signal so you can decide the next study task. This page compares the two study methods, not their catalogs or pass-rate claims."}
      primaryCta={override?.primaryCta || "Try BehaviorSchool free"}
      bestForCompetitor={override?.faqAnswer || "You want a fluency program with a fixed sequence of modules to complete, you are motivated by a published money-back guarantee, and you would rather work through a set curriculum from start to finish than have practice adapt to your results."}
      rows={[
        {
          label: "How you study",
          behaviorSchool: "Answer practice questions, see the missed domain, review the rationale, and choose the next study task. Timed mocks act as checkpoints.",
          competitor: "Complete modules in order until you reach a fluency criterion, then move to domain tests and a mock exam.",
        },
        {
          label: "What happens when you miss a question",
          behaviorSchool: "A rationale appears immediately and the domain is flagged so your next practice set weights it more heavily.",
          competitor: "The item cycles back into the module until you answer it correctly and quickly.",
        },
        {
          label: "Readiness signal",
          behaviorSchool: "One readiness status built from domain accuracy, response time, consistency, and mock endurance, so you know whether to schedule the exam or keep studying.",
          competitor: "Readiness is tied to finishing the modules and meeting fluency criteria on the program's own tests.",
        },
        {
          label: "Where you can study",
          behaviorSchool: "Web app on any device, so short practice sets fit between fieldwork, supervision, and school days.",
          competitor: "Module-based program; a session runs until the module's fluency criterion is met.",
        },
        {
          label: "Guarantee and trial",
          behaviorSchool: "Free practice questions and a free mock exam before you pay, so you can judge fit on real questions. No pass guarantee is advertised.",
          competitor: "A published money-back guarantee tied to completing the program as directed.",
        },
        {
          label: "Beyond exam prep",
          behaviorSchool: "Free IEP goal, FBA, and BIP tools on behaviorschool.com for school-based practice after you pass.",
          competitor: "Focused on exam preparation and continuing education.",
        },
      ]}
    />
  );
}
