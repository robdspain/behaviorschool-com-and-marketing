import type { Metadata } from "next";
import { SchoolFAKitPage } from "./SchoolFAKitPage";

export const metadata: Metadata = {
  title: "School FA Starter Kit | Behavior School",
  description:
    "Behavior School handout for the October 9, 2026 CalABA - Behavior Analysts in Education SIG (BAE) presentation, Functional Behavior Assessment in a School Setting.",
  alternates: { canonical: "https://behaviorschool.com/FA" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "School FA Starter Kit for October 9",
    description:
      "The Behavior School handout for CalABA - Behavior Analysts in Education SIG (BAE): Functional Behavior Assessment in a School Setting.",
    url: "https://behaviorschool.com/FA",
    type: "website",
    siteName: "Behavior School",
  },
  twitter: {
    card: "summary_large_image",
    title: "School FA Starter Kit for October 9",
    description:
      "The Behavior School handout for CalABA - Behavior Analysts in Education SIG (BAE): Functional Behavior Assessment in a School Setting.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function FaStarterKitPage() {
  return <SchoolFAKitPage />;
}
