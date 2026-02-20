import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Download: The 2026 BCBA Exam Survival Guide | Behavior School",
  description: "Download your free guide to passing the BCBA exam. Includes 5th Edition Task List breakdown, 12-week study schedule, test-taking strategies, and more.",
  keywords: [
    "BCBA exam guide",
    "BCBA study guide",
    "BCBA exam prep",
    "free BCBA guide",
    "BCBA exam tips",
    "2026 BCBA exam"
  ],
  openGraph: {
    title: "Free Download: The 2026 BCBA Exam Survival Guide",
    description: "Your complete roadmap to passing the BCBA exam on your first attempt. Study smarter, not harder.",
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
    title: "Free Download: The 2026 BCBA Exam Survival Guide",
    description: "Your complete roadmap to passing the BCBA exam on your first attempt.",
    images: ["/ebooks/bcba-guide-mockup.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
