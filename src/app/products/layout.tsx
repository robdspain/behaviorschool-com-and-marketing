import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Behavior School Products | BCBA Study, Supervision, IEP Tools",
  description: "Explore free school-practice tools, BCBA exam prep, invite-only Pro and supervision previews, and behavior plan tools built for school BCBAs.",
  keywords: "BCBA exam prep, behavior analysis tools, supervision systems, IEP goals, behavior plans, ABA software, study tools",
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    title: "Behavior School Products | BCBA Study, Supervision, IEP Tools",
    description: "Explore free school-practice tools, BCBA exam prep, invite-only Pro and supervision previews, and behavior plan tools built for school BCBAs.",
    url: "/products",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior School Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Behavior School Products | BCBA Study, Supervision, IEP Tools",
    description: "Explore free school-practice tools, BCBA exam prep, invite-only Pro and supervision previews, and behavior plan tools built for school BCBAs.",
    images: ["/optimized/og-image.webp"],
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
