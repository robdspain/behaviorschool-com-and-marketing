import type { Metadata } from "next";
import { BCBAPacingPlanner } from "@/components/bcba-pacing/BCBAPacingPlanner";

const PAGE_URL = "https://behaviorschool.com/bcba-pacing-planner";
const DESCRIPTION =
  "Enter your BCBA exam date, prep stage, and weekly hours to get a weekly study target, mock-exam cadence, and a pacing goal for the 185-question exam.";

export const metadata: Metadata = {
  title: "BCBA Exam Pacing Planner | Behavior School",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "BCBA Exam Pacing Planner | Behavior School",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Behavior School",
    type: "website",
    images: [{ url: "/optimized/og-image.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Exam Pacing Planner | Behavior School",
    description: DESCRIPTION,
  },
};

export default function BCBAPacingPlannerPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <BCBAPacingPlanner />
      </div>
    </main>
  );
}
