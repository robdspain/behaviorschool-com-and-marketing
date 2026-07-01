import type { Metadata } from "next";
import { SupportPage } from "./SupportPage";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Support | Behavior School",
  description:
    "Get help with your Behavior School account, study tools, billing, or questions. Browse FAQs or send us a message. We're here to help you succeed!",
  canonical: "https://behaviorschool.com/support",
});

export default function Support() {
  return <SupportPage />;
}
