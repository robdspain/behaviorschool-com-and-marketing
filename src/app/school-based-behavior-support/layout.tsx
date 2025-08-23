import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "School-Based Behavior Support & PBIS Training | Behavior School",
  description: "Comprehensive behavior support training for school-based BCBAs, psychologists, and educators. PBIS implementation, behavior intervention plans, and evidence-based strategies for schools.",
  keywords: "school-based behavior support, PBIS training, behavior intervention plans, school BCBA, behavior analyst in schools, MTSS behavior support, school-wide behavior interventions, classroom behavior management",
  alternates: { canonical: "https://behaviorschool.com/school-based-behavior-support" },
  openGraph: {
    title: "School-Based Behavior Support & PBIS Training",
    description: "Comprehensive behavior support training for school-based BCBAs and educators. PBIS implementation and evidence-based interventions.",
    url: "/school-based-behavior-support",
    type: "website",
    siteName: "Behavior School",
    images: [
      {
        url: "/og-image.webp", 
        width: 1200,
        height: 630,
        alt: "School-Based Behavior Support - Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "School-Based Behavior Support & PBIS Training",
    description: "Comprehensive behavior support training for school-based BCBAs and educators. PBIS implementation and evidence-based interventions.",
    images: ["/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default function SchoolBehaviorSupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}