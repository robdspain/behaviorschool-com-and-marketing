import type { Metadata } from "next";
import { SchoolFAKitPage } from "./SchoolFAKitPage";

export const metadata: Metadata = {
  title: "Free School FA Starter Kit | Behavior School",
  description:
    "Free School FA starter kit: task analyses, printable datasheets, and a graphing template for five functional analysis formats used in schools.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Free School FA Starter Kit",
    description:
      "Task analyses, printable datasheets, and a graphing template for five school functional analysis formats.",
    url: "https://behaviorschool.com/fba",
    type: "website",
    siteName: "Behavior School",
  },
};

export default function FbaStarterKitPage() {
  return <SchoolFAKitPage />;
}
