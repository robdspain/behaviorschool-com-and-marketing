import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToastProvider } from "@/components/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
  description: "Special education software to plan lessons, track IEP goals, and generate progress reports with ease. AI-powered for teachers and case managers.",
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
    "assistive technology integration"
  ],
  authors: [{ name: "ClassroomPilot" }],
  openGraph: {
    title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
    description: "Special education software to plan lessons, track IEP goals, and generate progress reports with ease. AI-powered for teachers and case managers.",
    url: "https://classroompilot.com",
    siteName: "ClassroomPilot",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClassroomPilot - Special Education Teacher Software",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
    description: "Special education software to plan lessons, track IEP goals, and generate progress reports with ease. AI-powered for teachers and case managers.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://classroompilot.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://classroompilot.com";
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ClassroomPilot",
    url: SITE_URL,
    description: "Special education software for IEP goal tracking and progress monitoring",
    sameAs: [
      "https://twitter.com/classroompilot",
      "https://linkedin.com/company/classroompilot"
    ]
  } as const;
  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ClassroomPilot",
    url: SITE_URL,
    description: "IEP goal tracking and progress monitoring software for special education teachers",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  } as const;
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ToastProvider>
          <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ToastProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </body>
    </html>
  );
}
