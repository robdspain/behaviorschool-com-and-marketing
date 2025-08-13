import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToastProvider } from "@/components/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Behavior School - Lead with confidence. Reduce overwhelm.",
  description: "Lead with confidence. Reduce overwhelm. Create lasting change—without the burnout.",
  keywords: ["behavior change", "leadership", "productivity", "burnout prevention"],
  authors: [{ name: "Behavior School" }],
  openGraph: {
    title: "Behavior School - Lead with confidence. Reduce overwhelm.",
    description: "Lead with confidence. Reduce overwhelm. Create lasting change—without the burnout.",
    url: "https://behaviorschool.com",
    siteName: "Behavior School",
    images: [
      {
        url: "/og-image.png",
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
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://behaviorschool.com"),
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
