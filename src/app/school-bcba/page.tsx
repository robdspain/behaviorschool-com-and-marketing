import { Metadata } from "next";
import SchoolBCBAContent from "./SchoolBCBAContent";

export const metadata: Metadata = {
  title: "School-Based BCBA: Complete Career Guide, Jobs & Resources | Behavior School",
  description:
    "Everything you need as a school-based BCBA: job guides, salary data by state, career pathways, free tools, and practical training. Build your school BCBA career with confidence.",
  keywords: [
    "school-based BCBA",
    "school BCBA",
    "school bcba jobs",
    "school bcba salary",
    "how to become a school bcba",
    "bcba in schools",
    "iep behavior goals",
    "behavior intervention plan",
    "mtss pbis",
  ],
  openGraph: {
    title: "School-Based BCBA: Complete Career Guide & Resources | Behavior School",
    description:
      "Comprehensive school BCBA resources: job guides, salary insights, career pathways, free tools, and training for school-based behavior analysts.",
    url: "https://behaviorschool.com/school-bcba",
    siteName: "Behavior School",
    images: [
      { url: "/optimized/og-image.webp", width: 1200, height: 630, alt: "School BCBA Resources" },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: { canonical: "https://behaviorschool.com/school-bcba" },
  robots: { index: true, follow: true },
};

export default function SchoolBCBAHub() {
  return <SchoolBCBAContent />;
}