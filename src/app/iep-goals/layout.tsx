import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BehaviorSchool Goal Writing System | IEP Behavior Goals",
  description: "Build an editable IEP behavior goal draft from student-specific baseline, context, supports, measurement, and mastery decisions.",
  keywords: "IEP goals, special education, goal writing, measurable objectives, student success, behavior analysis, education tools, IEP writing software",
  alternates: { canonical: "https://behaviorschool.com/iep-goals" },
  openGraph: {
    type: "website",
    title: "BehaviorSchool Goal Writing System | IEP Behavior Goals",
    description: "Build an editable IEP behavior goal draft from student-specific information for IEP team review.",
    url: "/iep-goals",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BehaviorSchool Goal Writing System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BehaviorSchool Goal Writing System | IEP Behavior Goals",
    description: "Build an editable IEP behavior goal draft from student-specific information for IEP team review.",
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
