import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IEP Goal Writing Tool - Effective IEP Goals That Drive Student Success | Behavior School",
  description: "Simple tool for writing effective IEP goals that are clear, measurable, and built for long-term student success. Perfect for teachers, BCBAs, and schools.",
  keywords: "IEP goals, special education, goal writing, measurable objectives, student success, behavior analysis, education tools, IEP writing software",
  alternates: { canonical: "/iep-goals" },
  openGraph: {
    type: "website",
    title: "IEP Goal Writing Tool - Effective IEP Goals That Drive Student Success",
    description: "Simple tool for writing effective IEP goals that are clear, measurable, and built for long-term student success. Perfect for teachers, BCBAs, and schools.",
    url: "/iep-goals",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "IEP Goal Writing Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IEP Goal Writing Tool - Effective IEP Goals That Drive Student Success",
    description: "Simple tool for writing effective IEP goals that are clear, measurable, and built for long-term student success. Perfect for teachers, BCBAs, and schools.",
    images: ["/optimized/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default function IEPGoalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
