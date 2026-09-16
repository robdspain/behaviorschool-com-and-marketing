import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

// The page component is a client component, so metadata lives here.
export const metadata: Metadata = buildPageMetadata({
  title: "The Weekly Research Brief for School BCBAs | Behavior School",
  description:
    "A free weekly email for school-based BCBAs: one practice problem, two full-text research briefs in plain language, and one practical next step for your team.",
  canonical: "https://behaviorschool.com/subscribe",
  imageAlt: "The Weekly Research Brief from Behavior School",
});

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
