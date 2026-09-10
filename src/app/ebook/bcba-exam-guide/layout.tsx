import { Metadata } from "next";

const title = "Free BCBA Exam Survival Guide (PDF) | Behavior School";
const description =
  "Free BCBA exam study guide: a 12-week study schedule, test-taking strategies, common mistakes to avoid, and a 30-day action plan from a practicing BCBA.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://behaviorschool.com/ebook/bcba-exam-guide" },
  keywords: [
    "BCBA exam guide",
    "BCBA study guide",
    "BCBA exam prep",
    "free BCBA guide",
    "BCBA exam tips",
    "BCBA study schedule"
  ],
  openGraph: {
    title: "Free BCBA Exam Survival Guide (PDF)",
    description,
    images: [
      {
        url: "/ebooks/bcba-guide-mockup.png",
        width: 1200,
        height: 900,
        alt: "The BCBA Exam Survival Guide from Behavior School",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free BCBA Exam Survival Guide (PDF)",
    description,
    images: ["/ebooks/bcba-guide-mockup.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
