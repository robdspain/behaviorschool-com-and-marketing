import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToastProvider } from "@/components/toast";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Behavior School - Lead with confidence. Reduce overwhelm.",
  description: "Lead with confidence. Reduce overwhelm. Create lasting change—without the burnout.",
  keywords: ["behavior change", "leadership", "productivity", "burnout prevention"],
  authors: [{ name: "Behavior School" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Behavior School - Lead with confidence. Reduce overwhelm.",
    description: "Lead with confidence. Reduce overwhelm. Create lasting change—without the burnout.",
    url: "https://behaviorschool.com",
    siteName: "Behavior School",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior School",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Behavior School - Lead with confidence. Reduce overwhelm.",
    description: "Lead with confidence. Reduce overwhelm. Create lasting change—without the burnout.",
    images: ["/og-image.webp"],
  },
  metadataBase: new URL("https://behaviorschool.com"),
  other: {
    'feed': '/feed.xml',
    'rss': '/feed.xml',
    'application/rss+xml': '/feed.xml',
    'application/feed+json': '/feed.json',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Behavior School",
    url: SITE_URL,
  } as const;
  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Behavior School",
    url: SITE_URL,
  } as const;
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SessionProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col">
              <NavBar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ToastProvider>
        </SessionProvider>
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
