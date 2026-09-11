import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Behavior Tools for School BCBAs | Behavior School",
  description:
    "Free tools for school BCBAs: write measurable IEP behavior goals, build FBA-to-BIP plans, review goal quality, and use ACT resources. Built by a practicing school BCBA.",
  canonical: "https://behaviorschool.com/behavior-tools",
});

export default function BehaviorToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
