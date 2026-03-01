import type { Metadata } from "next";
import { RBTHoursCalc } from "@/components/rbt-hours/RBTHoursCalc";

export const metadata: Metadata = {
  title: "RBT Supervision Hours Calculator | Free Tool | BehaviorSchool",
  description:
    "Calculate your remaining RBT supervision hours, projected BCBA exam eligibility date, and monthly supervision requirements. Free for RBTs and supervisors.",
  openGraph: {
    title: "RBT Supervision Hours Calculator | Free Tool",
    description:
      "Calculate your remaining RBT supervision hours, projected BCBA exam eligibility date, and monthly supervision requirements. Free for RBTs and supervisors.",
    url: "https://behaviorschool.com/rbt-hours",
    siteName: "BehaviorSchool",
    images: [{ url: "https://behaviorschool.com/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RBT Supervision Hours Calculator | Free Tool",
    description:
      "Calculate your remaining RBT supervision hours, projected BCBA exam eligibility date, and monthly supervision requirements. Free for RBTs and supervisors.",
  },
};

export default function RBTHoursPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            RBT Supervision Hours Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Track your progress toward certification and check your monthly
            supervision requirements.
          </p>
        </div>
        <RBTHoursCalc />
      </div>
    </main>
  );
}
