import type { Metadata } from "next";
import { SchoolBcbaSurvey } from "./SchoolBcbaSurvey";

const title = "2026 School BCBA Burnout & Workload Survey";
const description =
  "Contribute to the 2026 School BCBA Burnout & Workload Survey and help document the real workload of school-based behavior analysts.";

export const metadata: Metadata = {
  title: `${title} | Behavior School`,
  description,
  alternates: {
    canonical: "https://behaviorschool.com/school-bcba-burnout-workload-survey",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title,
    description,
    url: "https://behaviorschool.com/school-bcba-burnout-workload-survey",
    siteName: "Behavior School",
    type: "website",
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
    title,
    description,
    images: ["/optimized/og-image.webp"],
  },
};

export default function SchoolBcbaBurnoutWorkloadSurveyPage() {
  return <SchoolBcbaSurvey />;
}
