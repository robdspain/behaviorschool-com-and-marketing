import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { ToastProvider } from "@/components/toast";
import { ConditionalNavBar } from "@/components/ConditionalNavBar";
import { PrivacyCompliantAnalytics } from "@/components/analytics/PrivacyCompliantAnalytics";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import Script from "next/script";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { RevenueBanner } from "@/components/ui/revenue-banner";
import { Providers } from "@/components/providers";

// Ensure OG image URLs never resolve to localhost in production crawls
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
const EFFECTIVE_SITE_URL = (!RAW_SITE_URL || /localhost/i.test(RAW_SITE_URL))
  ? "https://behaviorschool.com"
  : RAW_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(EFFECTIVE_SITE_URL),
  title: "Behavior School | Tools & Training for School BCBAs",
  description: "Tools, training, and research for school-based BCBAs: IEP behavior goals, FBA and BIP systems, CEUs, and exam prep. Built by a practicing school BCBA.",
  keywords: [
    "Behavior School",
    "school BCBA",
    "school-based BCBA",
    "behavior analysis in schools",
    "special education",
    "IEP behavior goals",
    "functional behavior assessment",
    "behavior intervention plan",
    "BCBA supervision",
    "BCBA CEUs",
    "BCBA exam prep",
    "applied behavior analysis"
  ],
  authors: [{ name: "Behavior School" }],
  icons: {
    icon: [
      { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/behavior-school-icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/behavior-school-icon.png", sizes: "512x512", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.svg",
        color: "#1F4D3F",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Behavior School | Tools & Training for School BCBAs",
    description: "Tools, training, and research for school-based BCBAs: IEP behavior goals, FBA and BIP systems, CEUs, and exam prep. Built by a practicing school BCBA.",
    url: "https://behaviorschool.com",
    siteName: "Behavior School",
    locale: "en_US",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Behavior School | Tools & Training for School BCBAs",
    description: "Tools, training, and research for school-based BCBAs: IEP behavior goals, FBA and BIP systems, CEUs, and exam prep.",
    images: ["/optimized/og-image.webp"],
  },
  other: {
    'feed': '/feed.xml',
    'rss': '/feed.xml',
    'application/rss+xml': '/feed.xml',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
  const siteGraphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#organization`,
        name: "Behavior School",
        legalName: "Behavior School LLC",
        alternateName: ["Behavior School", "BehaviorSchool.com"],
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/behavior-school-icon.png`,
          width: 512,
          height: 512
        },
        image: `${SITE_URL}/optimized/og-image.webp`,
        description: "Behavior School builds practical tools, live training, and research summaries for school-based BCBAs: IEP behavior goals, FBA and BIP systems, supervision, and BACB continuing education.",
        foundingDate: "2024-04-01",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@behaviorschool.com",
          availableLanguage: "English"
        },
        founder: {
          "@type": "Person",
          name: "Rob Spain",
          jobTitle: ["BCBA", "IBA", "Behavior Analyst"],
          url: "https://robspain.com",
          sameAs: [
            "https://www.linkedin.com/in/robspain/",
            "https://x.com/robspainBCBA",
            "https://www.instagram.com/robdspain/"
          ]
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: "US"
        },
        sameAs: [
          "https://www.linkedin.com/company/behavior-school",
          "https://x.com/behavior_school",
          "https://www.youtube.com/@BehaviorSchool",
          "https://www.instagram.com/behaviorschool",
          "https://bsky.app/profile/behaviorschool.bsky.social",
          "https://www.facebook.com/profile.php?id=61564836345571"
        ],
        knowsAbout: [
          "Applied Behavior Analysis",
          "BCBA Certification",
          "School-Based Behavior Support",
          "Behavior Intervention Plans",
          "IEP Goal Writing",
          "BCBA Supervision",
          "Functional Behavior Assessment"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Behavior School",
        alternateName: ["Behavior School", "BehaviorSchool.com"],
        url: SITE_URL,
        inLanguage: "en-US",
        description: "Behavior School provides IEP goal tools, FBA and BIP resources, supervision tools, BACB continuing education, and BCBA exam prep for school-based behavior analysts.",
        publisher: {
          "@id": `${SITE_URL}/#organization`
        }
      }
    ]
  } as const;
  return (
    <html lang="en">
      <head>
        <PerformanceMonitor />
        {/* Preconnect hints for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://behaviorstudytools.com" />
        <link rel="preconnect" href="https://community.behaviorschool.com" />

        {/* Preload critical images */}
        <link rel="preload" href="/optimized/Hero/Hero-group1-optimized.webp" as="image" type="image/webp" fetchPriority="high" />

        {/* DNS prefetch for additional performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//googletagmanager.com" />

        <PrivacyCompliantAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-Z3XWL488ZP"} />

        {/* Google Ads tag (gtag.js) - Deferred for better performance */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17439907778"
          strategy="lazyOnload"
        />
        <Script id="google-ads-config" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17439907778');
          `}
        </Script>

        {/* Ahrefs Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="S+Vj3X2Qa6J/7godUSWIPg"
          strategy="lazyOnload"
        />

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1F4D3F" />

        {/* Logo hint for search result branding */}
        <meta name="logo" content="https://behaviorschool.com/behavior-school-icon.png" />
        <link rel="image_src" href="https://behaviorschool.com/behavior-school-icon.png" />

        {/* Bing site verification and tile config */}
        <meta name="msvalidate.01" content="D6F638D35C42D071C62B47907C2CD0CC" />
        <meta name="msapplication-TileColor" content="#1F4D3F" />
        <meta name="msapplication-TileImage" content="/behavior-school-icon-150.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        <meta name="rating" content="general" />
        <meta name="language" content="en" />
      </head>
      <body className="font-sans antialiased mobile-optimized prevent-horizontal-scroll">
        {/* Skip link for keyboard users */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded focus:shadow">
          Skip to content
        </a>
        <Providers>
        <ToastProvider>
          <div className="min-h-screen flex flex-col w-full max-w-full">
            <RevenueBanner />
            <ConditionalNavBar />
            <ScrollProgressBar />
            <main id="main-content" role="main" aria-label="Main Content" className="flex-1 w-full max-w-full">{children}</main>
            <Footer />
          </div>
        </ToastProvider>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraphJsonLd) }}
        />
        {/* <Script id="sw-register" strategy="afterInteractive">
          {`
            // Avoid registering the Service Worker on admin pages to prevent
            // stale HTML/JS caching that can break the Editor and dashboard.
            if ('serviceWorker' in navigator) {
              const isAdminPath = () => {
                try {
                  return location.pathname.startsWith('/admin');
                } catch (_) {
                  return false;
                }
              };

              // Also avoid SW in Next.js preview/draft mode via search params
              const isPreview = () => {
                try {
                  const qs = location.search || '';
                  return qs.includes('preview') || qs.includes('draft');
                } catch (_) {
                  return false;
                }
              };

              if (!isAdminPath() && !isPreview()) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, err => {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              } else {
                // If a SW is already controlling this scope, unregister it on admin
                if (navigator.serviceWorker.controller) {
                  navigator.serviceWorker.getRegistrations().then(rs => {
                    rs.forEach(r => r.unregister());
                  });
                }
              }
            }
          `}
        </Script> */}
      </body>
    </html>
  );
}
