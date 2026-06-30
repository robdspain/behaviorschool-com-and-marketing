import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Behavior Tools for School BCBAs | IEP Goals, BIPs, ACT",
  description:
    "AI-powered tools for school BCBAs: write IEP goals, build FBA-to-BIP plans, review goal quality, and use ACT resources.",
  openGraph: {
    title: "Behavior Tools for School BCBAs | Behavior School",
    description:
      "AI-powered IEP goal writing, FBA-to-BIP generation, and ACT-based clinical tools — designed for behavior analysts in schools.",
    url: "https://behaviorschool.com/behavior-tools",
  },
  alternates: {
    canonical: "https://behaviorschool.com/behavior-tools",
  },
};

export default function BehaviorToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
