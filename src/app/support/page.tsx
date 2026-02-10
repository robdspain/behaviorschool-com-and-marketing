import type { Metadata } from "next";
import { SupportPage } from "./SupportPage";

export const metadata: Metadata = {
  title: "Support | Behavior School",
  description:
    "Get help with your Behavior School account, study tools, billing, or questions. Browse FAQs or send us a message. We're here to help you succeed!",
  openGraph: {
    title: "Support | Behavior School",
    description: "Get help with Behavior School tools and account.",
    type: "website",
    url: "https://behaviorschool.com/support",
  },
};

export default function Support() {
  return <SupportPage />;
}
