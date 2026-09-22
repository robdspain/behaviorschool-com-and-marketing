import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "BCBA CEUs and Professional Development | Behavior School",
  description:
    "Earn BCBA CEUs and school-focused professional development on Behavior School Learning. Live and on-demand continuing education with certificates for school-based behavior analysts.",
  canonical: "https://behaviorschool.com/ceus",
  keywords: [
    "BCBA CEUs",
    "BCBA continuing education",
    "school BCBA professional development",
    "Behavior School Learning",
    "ACE Provider CEUs",
  ],
});

export default function CEUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
