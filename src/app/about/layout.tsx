import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Behavior School | Empowering BCBAs in Education",
  description: "Learn about Behavior School's mission to help school-based BCBAs and behavior teams lead with confidence, reduce overwhelm, and create lasting change—without burnout. Founded by Rob Spain, BCBA.",
  keywords: "BCBA, behavior analysis, school-based BCBA, behavior intervention, special education, Rob Spain",
  alternates: { canonical: "http://localhost:3000/about" },
  openGraph: {
    title: "About Behavior School | Empowering BCBAs in Education",
    description: "Learn about Behavior School's mission to help school-based BCBAs and behavior teams lead with confidence, reduce overwhelm, and create lasting change—without burnout.",
    type: "website",
    url: "http://localhost:3000/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Behavior School | Empowering BCBAs in Education",
    description: "Learn about Behavior School's mission to help school-based BCBAs and behavior teams lead with confidence, reduce overwhelm, and create lasting change—without burnout.",
  },
  robots: { index: true, follow: true },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}