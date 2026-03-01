import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ACT-Informed FBA for Schools | CalABA 2026 | BehaviorSchool",
  description:
    "Free ACT-Informed FBA & BIP tool from Rob Spain's CalABA 2026 presentation. Generates a complete, values-based behavior plan in about 10 minutes. Free for school BCBAs.",
  openGraph: {
    title: "ACT-Informed FBA for Schools | CalABA 2026",
    description:
      "Free ACT-Informed FBA & BIP tool from Rob Spain's CalABA 2026 presentation. Generates a complete, values-based behavior plan in about 10 minutes. Free for school BCBAs.",
    url: "https://behaviorschool.com/calaba-2026",
    siteName: "BehaviorSchool",
    images: [{ url: "https://behaviorschool.com/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACT-Informed FBA for Schools | CalABA 2026",
    description:
      "Free ACT-Informed FBA & BIP tool from Rob Spain's CalABA 2026 presentation. Generates a complete, values-based behavior plan in about 10 minutes. Free for school BCBAs.",
  },
};

export default function CalABA2026Layout({ children }: { children: React.ReactNode }) {
  return children;
}
