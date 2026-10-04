import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { HubContent } from "./HubContent";

const canonical = "https://behaviorschool.com/school-bcba";

export const metadata: Metadata = buildPageMetadata({
  title: "BCBA in Schools: Role, Salary and How to Get Hired",
  description:
    "What a BCBA does in schools, what it pays (BLS and a posted district schedule), and how to get hired and get through year one.",
  canonical,
  type: "article",
  imageAlt: "BCBA in Schools",
  keywords: [
    "bcba in schools",
    "behavior analyst in schools",
    "school bcba",
    "what does a school bcba do",
    "school bcba salary",
    "school bcba jobs",
    "bcba in schools jobs",
    "do bcbas get paid more than teachers",
    "can bcbas work in schools",
  ],
});

export default function SchoolBCBAHub() {
  return <HubContent />;
}
