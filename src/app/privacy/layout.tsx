import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Behavior School",
  description: "Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use Behavior Study Tools and our services.",
  keywords: "privacy policy, data protection, personal information, behavior school, study tools privacy",
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    title: "Privacy Policy - Behavior School",
    description: "Your privacy is important to us. This policy explains how we collect, use, and protect your information.",
    url: "/privacy",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - Behavior School",
    description: "Your privacy is important to us. This policy explains how we collect, use, and protect your information.",
    images: ["/optimized/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
