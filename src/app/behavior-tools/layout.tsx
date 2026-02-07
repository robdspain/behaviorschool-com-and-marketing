import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Behavior Tools for School-Based BCBAs | IEP Goals, BIPs, ACT Tools | Behavior School",
  description:
    "AI-powered behavior tools for school BCBAs: IEP Goal Writer, FBA-to-BIP Generator, Goal Quality Checker, ACT Matrix & more. Write better goals and build stronger behavior plans.",
  openGraph: {
    title: "Behavior Tools for School-Based BCBAs | Behavior School",
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
