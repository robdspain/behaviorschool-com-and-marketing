import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "BCBA CEUs and Professional Development | Behavior School",
  description:
    "Earn continuing education with courses designed for school-based behavior analysts. Start with our free masterclass or join the Transformation Program.",
  canonical: "https://behaviorschool.com/ceus",
});

export default function CEUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
