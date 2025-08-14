import type { Metadata } from "next"
import ClientContent from "./ClientContent"

export const metadata: Metadata = {
  title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
  description:
    "Special education teacher software to plan lessons, track IEP goals, and generate progress reports with ease. AI-powered for teachers and case managers.",
  keywords: [
    "special education teacher software",
    "IEP goal tracking tool",
    "progress monitoring app for special ed",
    "IEP progress report generator",
    "accommodations tracking tool",
    "sped data collection app",
    "special education planning software",
    "IDEA compliance",
    "parent communication tools",
    "assistive technology integration",
    "IEP data collection",
  ],
  alternates: { canonical: "/products/classroom-pilot" },
  openGraph: {
    type: "website",
    title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
    description:
      "Special education software to plan lessons, track IEP goals, and generate progress reports with ease.",
    url: "/products/classroom-pilot",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "ClassroomPilot" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
    description:
      "Plan lessons, track IEP goals, monitor progress, and generate reports with ease.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
}

export default function ClassroomPilotPage() {
  const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com"
  const product = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ClassroomPilot",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/products/classroom-pilot`,
    description:
      "Special education planning software for IEP goal tracking, progress monitoring, and report generation.",
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
    keywords:
      "special education teacher software, IEP goal tracking tool, progress monitoring app for special ed, IEP progress report generator, accommodations tracking tool, IEP data collection, IDEA compliance, parent communication tools, assistive technology integration",
  } as const

  return (
    <>
      <ClientContent />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }} />
    </>
  )
}