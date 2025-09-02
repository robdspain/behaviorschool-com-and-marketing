import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Behavior School Operating System | Behavior School",
  description: "Secure your spot in the 8-week Behavior School Operating System. Transform from overwhelmed BCBA to confident district leader. Limited spots available.",
  keywords: ["BCBA training", "behavior analyst program", "school BCBA", "behavior intervention", "district leadership", "BCBA certification"],
  openGraph: {
    title: "Apply for Behavior School Operating System | Behavior School",
    description: "Secure your spot in the 8-week Behavior School Operating System. Transform from overwhelmed BCBA to confident district leader.",
    url: "http://localhost:3000/signup",
    siteName: "Behavior School",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply for Behavior School Operating System",
    description: "Secure your spot in the 8-week Behavior School Operating System. Transform from overwhelmed BCBA to confident district leader.",
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
