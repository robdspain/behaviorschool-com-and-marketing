import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BCBA CEUs and Professional Development | Behavior School",
  description:
    "Earn continuing education with courses designed for school-based behavior analysts. Start with our free masterclass or join the Transformation Program.",
  openGraph: {
    title: "CEUs & Professional Development for BCBAs | Behavior School",
    description:
      "Professional Development offering continuing education for school-based BCBAs. Free masterclass, intensive training programs, and more.",
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
