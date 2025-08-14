import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Behavior School Products | BCBA Study Tools & Supervision",
  description: "Explore Behavior School’s BCBA exam prep and BCBA supervision tools built for school-based behavior analysts.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Behavior School Products | BCBA Study Tools & Supervision",
    description: "Explore Behavior School’s BCBA exam prep and BCBA supervision tools built for school-based behavior analysts.",
    url: "/products",
  },
  twitter: {
    card: "summary_large_image",
    title: "Behavior School Products | BCBA Study Tools & Supervision",
    description: "Explore Behavior School’s BCBA exam prep and BCBA supervision tools built for school-based behavior analysts.",
  },
  robots: { index: true, follow: true },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}