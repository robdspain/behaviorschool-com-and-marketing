import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Behavior School Products - BCBA Study Tools, Supervision & IEP Solutions",
  description: "Comprehensive tools for behavior analysts: AI-powered BCBA exam prep, supervision systems, IEP goal writing, and behavior plan creation. Transform your practice with Behavior School.",
  keywords: "BCBA exam prep, behavior analysis tools, supervision systems, IEP goals, behavior plans, ABA software, study tools",
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    title: "Behavior School Products - BCBA Study Tools, Supervision & IEP Solutions",
    description: "Comprehensive tools for behavior analysts: AI-powered BCBA exam prep, supervision systems, IEP goal writing, and behavior plan creation.",
    url: "/products",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Behavior School Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Behavior School Products - BCBA Study Tools, Supervision & IEP Solutions",
    description: "Comprehensive tools for behavior analysts: AI-powered BCBA exam prep, supervision systems, IEP goal writing, and behavior plan creation.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
