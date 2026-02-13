import type { Metadata } from "next";
import { FBADecisionMatrix } from "./FBADecisionMatrix";

export const metadata: Metadata = {
  title: "Free FBA Decision Matrix | Do You Need a Functional Behavior Assessment?",
  description: "Free FBA Decision Matrix tool - answer 7 quick questions to determine if a Functional Behavior Assessment is needed or if alternative interventions should be tried first.",
  keywords: [
    "FBA decision matrix",
    "functional behavior assessment decision tree",
    "when to do an FBA",
    "FBA vs tier 2 interventions",
    "do I need an FBA",
    "functional behavior assessment checklist",
    "FBA decision tool",
    "behavior assessment decision matrix",
    "when is an FBA required",
    "FBA necessity checklist",
    "school behavior assessment tool",
    "BCBA FBA decision",
    "special education FBA",
    "behavior intervention decision"
  ],
  openGraph: {
    title: "Free FBA Decision Matrix | Do You Need a Functional Behavior Assessment?",
    description: "Free FBA Decision Matrix tool - answer 7 quick questions to determine if a Functional Behavior Assessment is needed or if alternative interventions should be tried first.",
    type: "website",
    url: "https://behaviorschool.com/fba-decision-matrix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free FBA Decision Matrix | Do You Need a Functional Behavior Assessment?",
    description: "Free FBA Decision Matrix tool - answer 7 quick questions to determine if a Functional Behavior Assessment is needed or if alternative interventions should be tried first.",
  },
  alternates: {
    canonical: "https://behaviorschool.com/fba-decision-matrix"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "When is a Functional Behavior Assessment (FBA) required?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An FBA is typically required when: (1) behavior significantly impedes the student's or others' learning, (2) the behavior is a safety concern, (3) Tier 1 and Tier 2 interventions have been attempted without success, (4) the IEP team requests a behavior assessment, or (5) a manifestation determination review indicates the behavior is related to the disability."
      }
    },
    {
      "@type": "Question",
      name: "What should I try before conducting an FBA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Before conducting a full FBA, schools should typically: (1) document the behavior for at least 2 weeks, (2) implement Tier 1 universal supports, (3) try Tier 2 targeted interventions, (4) attempt environmental modifications, (5) consult with the IEP team or behavior support team, and (6) ensure adequate baseline data collection."
      }
    },
    {
      "@type": "Question",
      name: "How do I know if I have enough data to conduct an FBA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You should have: (1) at least 2 weeks of documented behavior data, (2) clear operational definitions of the target behavior, (3) information about when and where the behavior occurs, (4) data on what happens before and after the behavior, and (5) documentation of interventions already attempted. If you lack this data, focus on systematic data collection before starting the FBA."
      }
    },
    {
      "@type": "Question",
      name: "What is the difference between an FBA and Tier 2 interventions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tier 2 interventions are targeted, group-based supports (like check-in/check-out, social skills groups, or behavior contracts) that don't require a full functional assessment. An FBA is a comprehensive, individualized assessment process that identifies the function of behavior through systematic data collection and analysis. FBAs are typically reserved for students who don't respond to Tier 2 supports."
      }
    },
    {
      "@type": "Question",
      name: "Can this decision matrix replace professional judgment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. This FBA Decision Matrix is a screening tool to guide your thinking and help organize your decision-making process. It should not replace professional judgment, team collaboration, or legal requirements. Always consult with your IEP team, behavior specialists, and school administrators when making decisions about conducting an FBA."
      }
    },
    {
      "@type": "Question",
      name: "How long does it take to complete the FBA Decision Matrix?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The FBA Decision Matrix takes approximately 3-5 minutes to complete. It consists of 7 conditional questions about the student's behavior, previous interventions, and current situation. You'll receive an immediate recommendation with next steps."
      }
    }
  ]
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FBA Decision Matrix Tool",
  description: "A free decision support tool to help school-based BCBAs and behavior specialists determine when a Functional Behavior Assessment is necessary versus when alternative interventions should be tried first.",
  url: "https://behaviorschool.com/fba-decision-matrix",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    availability: "InStock",
    price: "0",
    priceCurrency: "USD",
    description: "Free FBA Decision Matrix - no registration required"
  },
  audience: {
    "@type": "Audience",
    audienceType: ["BCBAs", "Behavior Specialists", "Special Education Teachers", "School Psychologists", "IEP Teams"]
  },
  provider: {
    "@type": "Organization",
    name: "Behavior School",
    url: "https://behaviorschool.com"
  }
};

export default function FBADecisionMatrixPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <FBADecisionMatrix />
    </>
  );
}
