import type { Metadata } from "next";
import { BCBAPacingPlanner } from "@/components/bcba-pacing/BCBAPacingPlanner";

export const metadata: Metadata = {
  title: "BCBA Exam Pacing Planner | Free Tool | BehaviorSchool",
  description:
    "Build a personalized BCBA study pacing plan based on your exam date and prep stage. Free weekly schedule and study checklist.",
  openGraph: {
    title: "BCBA Exam Pacing Planner | Free Tool",
    description:
      "Build a personalized BCBA study pacing plan based on your exam date and prep stage. Free weekly schedule and study checklist.",
    url: "https://behaviorschool.com/bcba-pacing-planner",
    siteName: "BehaviorSchool",
    images: [{ url: "https://behaviorschool.com/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Exam Pacing Planner | Free Tool",
    description:
      "Build a personalized BCBA study pacing plan based on your exam date and prep stage. Free weekly schedule and study checklist.",
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
