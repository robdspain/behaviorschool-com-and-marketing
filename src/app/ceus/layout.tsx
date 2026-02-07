import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CEUs & Professional Development for BCBAs | Free Masterclass | Behavior School",
  description:
    "Earn BACB-approved CEUs with courses designed for school-based behavior analysts. Start with our free 1-CEU Masterclass or join the Transformation Program.",
  openGraph: {
    title: "CEUs & Professional Development for BCBAs | Behavior School",
    description:
      "BACB ACE Provider offering continuing education for school-based BCBAs. Free masterclass, intensive training programs, and more.",
    url: "https://behaviorschool.com/ceus",
  },
  alternates: {
    canonical: "https://behaviorschool.com/ceus",
  },
};

export default function CEUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
