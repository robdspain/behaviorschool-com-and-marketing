import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BCBA Supervision Platform | Behavior School",
  description: "Streamline BCBA supervision with digital competency tracking, automated workflows, and BACB-compliant documentation. Start progress monitoring today. Free for supervisors.",
  keywords: [
    "BCBA supervision",
    "BCBA supervision platform",
    "digital competency tracking",
    "BACB compliant supervision",
    "behavior analyst supervision",
    "RBT supervision",
    "BCaBA supervision",
    "supervision hours tracking",
    "competency matrix",
    "fieldwork tracking",
    "BCBA supervisor tools",
    "automated supervision workflows",
    "aba supervision tools",
    "bcba supervision tools",
    "bcba supervision curriculum"
  ],
  alternates: { canonical: "https://behaviorschool.com/supervisors" },
  openGraph: {
    type: "website",
    title: "BCBA Supervision Platform | Digital Competency Tracking | Behavior School",
    description: "Streamline BCBA supervision with digital competency tracking, automated workflows, and BACB-compliant documentation. Start progress monitoring today.",
    url: "https://behaviorschool.com/supervisors",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BCBA Supervision Platform - Digital competency tracking and automated workflows for behavior analyst supervision",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Supervision Platform | Behavior School",
    description: "Streamline BCBA supervision with digital competency tracking, automated workflows, and BACB-compliant documentation. Start progress monitoring today.",
    images: ["/optimized/og-image.webp"],
  },
  robots: { 
    index: true, 
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function SupervisorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
