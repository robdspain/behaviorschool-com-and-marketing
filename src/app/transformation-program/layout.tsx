import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transform Your School Practice in 8 Weeks | BCBA Operating System | Behavior School",
  description: "Join 500+ School BCBAs, Psychologists & Special Ed Leaders who transformed chaos into confidence. Stop firefighting, build ethical systems, reduce burnout. 8-week cohort program with proven results.",
  keywords: "school BCBA training, behavior analyst burnout solution, special education leadership, school psychology systems, BCBA ethics training, crisis management schools, staff training protocols, behavior support systems, school transformation program, cohort-based BCBA course",
  alternates: { canonical: "https://behaviorschool.com/transformation-program" },
  openGraph: {
    type: "website",
    title: "Transform Your School Practice in 8 Weeks | BCBA Operating System",
    description: "Join 500+ School BCBAs who transformed chaos into confidence. Stop firefighting, build ethical systems, reduce burnout. Proven 8-week program with immediate results.",
    url: "/transformation-program",
    siteName: "Behavior School",
    locale: "en_US",
    images: [
      {
        url: "/hero-chaos-to-confidence.jpg",
        width: 1200,
        height: 630,
        alt: "School BCBA professionals working confidently with systematic approach - Behavior School transformation program",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Transform Your School Practice in 8 Weeks | BCBA Operating System",
    description: "Join 500+ School BCBAs who transformed chaos into confidence. Stop firefighting, build ethical systems, reduce burnout. Proven results.",
    images: ["/hero-chaos-to-confidence.jpg"],
    creator: "@BehaviorSchool",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  other: {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
  },
};

export default function TransformationProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}
