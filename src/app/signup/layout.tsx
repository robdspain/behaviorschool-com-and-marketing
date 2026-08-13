import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for School BCBA Transformation System | Behavior School",
  description: "Apply for the six-week School BCBA Transformation System focused on assessment, intervention, implementation, and systems work in schools.",
  keywords: ["BCBA training", "behavior analyst program", "school BCBA", "behavior intervention", "district leadership", "BCBA certification"],
  openGraph: {
    title: "Apply for School BCBA Transformation System | Behavior School",
    description: "Apply for the six-week School BCBA Transformation System focused on assessment, intervention, implementation, and systems work in schools.",
    url: "https://behaviorschool.com/signup",
    siteName: "Behavior School",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply for School BCBA Transformation System",
    description: "Apply for the six-week School BCBA Transformation System focused on assessment, intervention, implementation, and systems work in schools.",
    images: ["/optimized/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
