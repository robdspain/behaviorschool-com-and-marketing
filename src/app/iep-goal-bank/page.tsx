import { Metadata } from "next";
import IEPGoalBankClient from "./IEPGoalBankClient";

export const metadata: Metadata = {
  title: "IEP Goal Bank — 120+ Behavior IEP Goal Examples | Behavior School",
  description:
    "Free searchable IEP goal bank with 120+ pre-written behavior goals in condition/behavior/criteria format. Filter by category and grade level. Copy goals instantly or customize with our IEP Goal Generator.",
  keywords: [
    "IEP goal bank",
    "IEP goal examples",
    "behavior IEP goals",
    "IEP goals for behavior",
    "measurable IEP goals",
    "IEP goal database",
    "behavior goals for IEP",
    "social skills IEP goals",
    "self-regulation IEP goals",
    "communication IEP goals",
    "academic engagement IEP goals",
    "daily living IEP goals",
    "special education goals",
    "IEP behavior goal examples",
    "pre-written IEP goals",
    "aggression IEP goals",
    "elopement IEP goals",
    "self-injury IEP goals",
    "task refusal IEP goals",
    "on-task behavior IEP goals",
    "coping strategies IEP goals",
    "anger management IEP goals",
    "functional communication IEP goals",
  ],
  openGraph: {
    title: "IEP Goal Bank — 120+ Free Behavior IEP Goal Examples | Behavior School",
    description:
      "Search, filter, and copy 120+ professionally written IEP behavior goals. Organized by category and grade level in proper condition/behavior/criteria format.",
    type: "website",
    url: "https://behaviorschool.com/iep-goal-bank",
    images: [
      {
        url: "https://behaviorschool.com/thumbnails/iep-goal-thumb.webp",
        width: 1200,
        height: 630,
        alt: "IEP Goal Bank - 120+ Pre-Written Behavior Goals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IEP Goal Bank — 120+ Free Behavior IEP Goal Examples",
    description:
      "Search, filter, and copy 120+ professionally written IEP behavior goals organized by category and grade level.",
    images: ["https://behaviorschool.com/thumbnails/iep-goal-thumb.webp"],
  },
  alternates: {
    canonical: "https://behaviorschool.com/iep-goal-bank",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "IEP Goal Bank - Behavior Goals",
  description:
    "A comprehensive database of 120+ pre-written IEP behavior goals organized by category (Behavior Reduction, Social Skills, Self-Regulation, Communication, Academic Engagement, Daily Living) and grade level.",
  url: "https://behaviorschool.com/iep-goal-bank",
  creator: {
    "@type": "Organization",
    name: "Behavior School",
    url: "https://behaviorschool.com",
  },
  keywords: [
    "IEP goals",
    "behavior goals",
    "special education",
    "IEP goal bank",
    "behavior intervention",
  ],
};

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is an IEP goal bank?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An IEP goal bank is a searchable collection of pre-written Individualized Education Program (IEP) goals that educators can use as starting points when writing goals for students with disabilities. Goals are typically organized by skill area and written in measurable condition/behavior/criteria format.",
      },
    },
    {
      "@type": "Question",
      name: "How do I write a measurable IEP behavior goal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A measurable IEP behavior goal includes three components: (1) the condition — when or under what circumstances the behavior occurs, (2) the behavior — a specific, observable, and measurable description of what the student will do, and (3) the criteria — how well or how often the student must perform the behavior to meet the goal, including the measurement method.",
      },
    },
    {
      "@type": "Question",
      name: "Can I customize goals from this IEP goal bank?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Every goal in our bank can be copied and modified to fit your student's individual needs. We also offer a free IEP Goal Generator tool that creates fully customized goals based on your student's specific behaviors, baseline data, and target criteria.",
      },
    },
  ],
};

export default function IEPGoalBankPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <IEPGoalBankClient />
    </>
  );
}
