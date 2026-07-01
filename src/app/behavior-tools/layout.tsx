import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Behavior Tools for School BCBAs | IEP Goals, BIPs, ACT",
  description:
    "AI-powered tools for school BCBAs: write IEP goals, build FBA-to-BIP plans, review goal quality, and use ACT resources.",
  canonical: "https://behaviorschool.com/behavior-tools",
});

export default function BehaviorToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
