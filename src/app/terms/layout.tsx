import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Behavior School",
  description: "Please read these terms carefully before using Behavior Study Tools. Comprehensive terms covering user accounts, subscriptions, acceptable use, and legal requirements.",
  keywords: "terms of service, user agreement, Behavior School, study tools terms, legal terms, service agreement",
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website",
    title: "Terms of Service - Behavior School",
    description: "Please read these terms carefully before using Behavior Study Tools.",
    url: "/terms",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service - Behavior School",
    description: "Please read these terms carefully before using Behavior Study Tools.",
    images: ["/optimized/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
