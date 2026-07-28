import type { Metadata } from "next";
import { BCBAStudyToolsClient } from "./BCBAStudyToolsClient";

export const metadata: Metadata = {
  title: "BCBA Study Tools for 6th Edition Exam Prep | Behavior School",
  description:
    "Explore BCBA study tools for 6th Edition exam prep: free practice questions, mock exams, flashcards, pacing, weak-area review, and progress tracking.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "BCBA study tools",
    "BCBA exam study materials free",
    "BCBA study guide 6th edition",
    "best BCBA study materials",
    "BCBA exam prep course",
    "BCBA exam prep 6th edition",
    "BCBA practice questions",
    "BCBA mock exam",
  ],
  openGraph: {
    title: "BCBA Study Tools for 6th Edition Exam Prep",
    description:
      "Start with free BCBA questions, then use mock exams, flashcards, pacing, and progress data to plan what to study next.",
    type: "website",
    url: "https://behaviorschool.com/bcba-study-tools",
    images: [
      {
        url: "https://behaviorschool.com/BehaviorStudyTools/Hero-BST-Home.webp",
        width: 1200,
        height: 630,
        alt: "Behavior Study Tools BCBA exam prep dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Study Tools for 6th Edition Exam Prep",
    description:
      "Free practice questions, mock exams, flashcards, pacing tools, and progress tracking for BCBA candidates.",
    images: ["https://behaviorschool.com/BehaviorStudyTools/Hero-BST-Home.webp"],
  },
  alternates: {
    canonical: "https://behaviorschool.com/bcba-study-tools",
  },
};

export default function BCBAStudyToolsPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Behavior Study Tools",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web, iOS",
      url: "https://study.behaviorschool.com/",
      description:
        "BCBA exam preparation app with practice questions, mock exams, flashcards, pacing tools, and progress tracking.",
      provider: {
        "@type": "Organization",
        name: "Behavior School",
        url: "https://behaviorschool.com/",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What BCBA study tools are included?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Behavior Study Tools includes practice questions, domain mini-exams, timed mock exams, flashcards, pacing tools, answer rationales, and progress analytics.",
          },
        },
        {
          "@type": "Question",
          name: "Can I try the BCBA study tools for free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Candidates can try ten BCBA practice questions without an account. Free and paid options are available after the starter set.",
          },
        },
        {
          "@type": "Question",
          name: "Are the study tools aligned with the BCBA 6th Edition?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The BCBA study pathway is organized around the current 6th Edition Test Content Outline. It is independent preparation content and is not official BACB exam content.",
          },
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BCBAStudyToolsClient />
    </>
  );
}
