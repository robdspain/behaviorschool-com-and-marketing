import { Metadata } from "next";
import { BCBAStudyToolsClient } from "./BCBAStudyToolsClient";

export const metadata: Metadata = {
  title: "🎯 BCBA Study Tools | Free Practice Tests + Exam Prep | Behavior School",
  description: "Complete BCBA study toolkit: free practice tests, domain mini-exams, study guides, and interactive tools. Everything you need to pass your BCBA exam in one place!",
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
  keywords: [
    "BCBA study tools",
    "BCBA exam prep tools",
    "BCBA practice tests",
    "behavior analyst study guide",
    "BCBA certification prep",
    "applied behavior analysis study tools",
    "BCBA exam practice",
    "behavior analysis exam prep",
    "BCBA test preparation",
    "free BCBA study resources",
    "BCBA domain practice",
    "behavior analyst exam tools",
    "BCBA study guide",
    "BCBA exam simulator",
    "behavior analysis practice questions"
  ],
  openGraph: {
    title: "🎯 BCBA Study Tools | Free Practice Tests + Exam Prep | Behavior School",
    description: "Complete BCBA study toolkit: free practice tests, domain mini-exams, study guides, and interactive tools. Everything you need to pass your BCBA exam!",
    type: "website",
    url: "https://behaviorschool.com/bcba-study-tools",
    images: [
      {
        url: "https://behaviorschool.com/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BCBA Study Tools - Behavior School"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "🎯 BCBA Study Tools | Free Practice Tests + Exam Prep",
    description: "Complete BCBA study toolkit with practice tests, study guides, and interactive tools to pass your exam!",
    images: ["https://behaviorschool.com/optimized/og-image.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/bcba-study-tools"
  }
};

export default function BCBAStudyToolsPage() {
  return <BCBAStudyToolsClient />;
}