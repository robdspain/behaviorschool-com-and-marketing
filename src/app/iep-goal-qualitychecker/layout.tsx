import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IEP Behavior Goal Quality Checker | Free Tool",
  description:
    "Paste any IEP behavior goal and get instant, rule-based feedback on measurability, conditions, criteria (90–100%), and monitoring.",
  alternates: { canonical: "https://behaviorschool.com/iep-goal-qualitychecker" },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
