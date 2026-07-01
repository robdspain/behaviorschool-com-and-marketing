import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About Behavior School | Empowering BCBAs in Education",
  description: "Learn about Behavior School's mission to help school-based BCBAs and behavior teams lead with confidence, reduce overwhelm, and create lasting change—without burnout. Founded by Rob Spain, BCBA.",
  keywords: "BCBA, behavior analysis, school-based BCBA, behavior intervention, special education, Rob Spain",
  canonical: "https://behaviorschool.com/about",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
