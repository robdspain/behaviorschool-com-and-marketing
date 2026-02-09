import type { Metadata } from "next";
import { SupportPage } from "./SupportPage";

export const metadata: Metadata = {
  title: "Support | Behavior School",
  description:
    "Get help with your Behavior School account, study tools, billing, or anything else. Browse common questions or send us a message.",
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
