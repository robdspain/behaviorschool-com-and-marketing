import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free 2026 BCBA Exam Survival Guide (PDF) | Behavior School",
  description: "Free BCBA exam study guide: 6th Edition Task List breakdown, a 12-week study schedule, and test-taking strategies from a practicing BCBA.",
  alternates: { canonical: "https://behaviorschool.com/ebook/bcba-exam-guide" },
  keywords: [
    "BCBA exam guide",
    "BCBA study guide",
    "BCBA exam prep",
    "free BCBA guide",
    "BCBA exam tips",
    "2026 BCBA exam"
  ],
  openGraph: {
    title: "Free 2026 BCBA Exam Survival Guide (PDF)",
    description: "Free BCBA exam study guide: 6th Edition Task List breakdown, a 12-week study schedule, and test-taking strategies from a practicing BCBA.",
    images: [
      {
        url: "/ebooks/bcba-guide-mockup.png",
        width: 1200,
        height: 900,
        alt: "The 2026 BCBA Exam Survival Guide",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free 2026 BCBA Exam Survival Guide (PDF)",
    description: "6th Edition Task List breakdown, a 12-week study schedule, and test-taking strategies from a practicing BCBA.",
    images: ["/ebooks/bcba-guide-mockup.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
