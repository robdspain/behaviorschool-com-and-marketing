import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IEP Goal Writing Tool | Behavior School",
  description: "Write clear, measurable IEP goals that drive student success. Perfect for teachers, BCBAs, and school psychologists. Try our free IEP goal writer today.",
  keywords: "IEP goals, special education, goal writing, measurable objectives, student success, behavior analysis, education tools, IEP writing software",
  alternates: { canonical: "https://behaviorschool.com/iep-goals" },
  openGraph: {
    type: "website",
    title: "IEP Goal Writing Tool | Behavior School",
    description: "Write clear, measurable IEP goals that drive student success. Perfect for teachers, BCBAs, and school psychologists. Try our free IEP goal writer today.",
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
    title: "IEP Goal Writing Tool | Behavior School",
    description: "Write clear, measurable IEP goals that drive student success. Perfect for teachers, BCBAs, and school psychologists. Try our free IEP goal writer today.",
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
