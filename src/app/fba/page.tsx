import type { Metadata } from "next";
import { SchoolFAKitPage } from "./SchoolFAKitPage";

export const metadata: Metadata = {
  title: "School FA Starter Kit | Behavior School",
  description:
    "Behavior School handout for the Friday, October 9 CalABA BehaviorLive presentation, Functional Behavior Assessment in a School Setting.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "School FA Starter Kit for October 9",
    description:
      "The Behavior School handout for CalABA BehaviorLive: Functional Behavior Assessment in a School Setting.",
    url: "https://behaviorschool.com/fba",
    type: "website",
    siteName: "Behavior School",
  },
  twitter: {
    card: "summary_large_image",
    title: "School FA Starter Kit for October 9",
    description:
      "The Behavior School handout for CalABA BehaviorLive: Functional Behavior Assessment in a School Setting.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function FbaStarterKitPage() {
  return <SchoolFAKitPage />;
}
