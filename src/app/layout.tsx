import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { ToastProvider } from "@/components/toast";
import { ConditionalNavBar } from "@/components/ConditionalNavBar";
import { PrivacyCompliantAnalytics } from "@/components/analytics/PrivacyCompliantAnalytics";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
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
  title: "BehaviorSchool | Tools & Resources for School BCBAs",
  description: "Free AI-powered tools for school-based BCBAs — FBA generator, BIP builder, IEP goal writer, and more. Built by a BCBA for the reality of school practice.",
  keywords: [
    "Behavior School",
    "Behavior School platform",
    "Behavior School BCBA",
    "education",
    "special education",
    "behavior analysis",
    "teacher training",
    "professional development",
    "educational research",
    "academic resources",
    "school psychology",
    "IEP goals",
    "behavior intervention",
    "BCBA certification",
    "applied behavior analysis"
  ],
  authors: [{ name: "Behavior School" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32", type: "image/x-icon" },
      { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/Logos/Logo.webp", sizes: "16x16", type: "image/webp" },
      { url: "/Logos/Logo.webp", sizes: "32x32", type: "image/webp" },
      { url: "/Logos/Logo.webp", sizes: "48x48", type: "image/webp" },
      { url: "/Logos/Logo.webp", sizes: "192x192", type: "image/webp" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/Logos/Logo.webp", sizes: "180x180", type: "image/webp" },
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
    title: "BehaviorSchool | Tools & Resources for School BCBAs",
    description: "Free AI-powered tools for school-based BCBAs — FBA generator, BIP builder, IEP goal writer, and more. Built by a BCBA for the reality of school practice.",
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
    title: "BehaviorSchool | Tools & Resources for School BCBAs",
    description: "Free AI-powered tools for school-based BCBAs — FBA generator, BIP builder, IEP goal writer, and more.",
    images: ["/optimized/og-image.webp"],
  },
  other: {
    'feed': '/feed.xml',
    'rss': '/feed.xml',
    'application/rss+xml': '/feed.xml',
    'application/feed+json': '/feed.json',
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
          url: `${SITE_URL}/Logos/Logo.webp`,
          width: 512,
          height: 512
        },
        image: `${SITE_URL}/optimized/og-image.webp`,
        description: "Professional development, study tools, and resources for school-based BCBAs and behavior analysts in education.",
        foundingDate: "2020",
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
          "https://x.com/behaviorschool",
          "https://community.behaviorschool.com"
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
        description: "Behavior School provides BCBA exam prep, supervision tools, IEP goal resources, behavior plan tools, and professional development for school-based behavior analysts.",
        publisher: {
          "@id": `${SITE_URL}/#organization`
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/blog?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  } as const;
  return (
    <html lang="en">
      <head>
        <PerformanceOptimizer />
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
        <script
          async
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="S+Vj3X2Qa6J/7godUSWIPg"
        ></script>

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1F4D3F" />

        {/* Educational Institution Classification */}
        <meta name="category" content="education" />
        <meta name="subject" content="special education, behavior analysis, teacher training" />
        <meta name="audience" content="educators, teachers, school psychologists, behavior analysts" />
        <meta name="education-level" content="higher education, professional development" />
        <meta name="content-type" content="educational resources" />

        {/* Academic and Research Tags */}
        <meta name="dc.type" content="Text.Educational" />
        <meta name="dc.subject" content="Applied Behavior Analysis; Special Education; Teacher Training" />
        <meta name="dc.audience" content="Educator" />
        <meta name="resource-type" content="educational" />

        {/* COPPA Compliance */}
        <meta name="coppa-compliant" content="true" />
        <meta name="child-safe" content="true" />
        <meta name="family-friendly" content="true" />

        {/* Educational Standards */}
        <meta name="educational-use" content="professional development" />
        <meta name="typical-age-range" content="adult" />
        <meta name="interactivity-type" content="mixed" />

        {/* Logo meta tags for Google search results */}
        <meta name="logo" content="https://behaviorschool.com/Logos/Logo.webp" />
        <link rel="image_src" href="https://behaviorschool.com/Logos/Logo.webp" />

        {/* Bing-specific meta tags */}
        <meta name="msvalidate.01" content="D6F638D35C42D071C62B47907C2CD0CC" />
        <meta name="msapplication-TileColor" content="#1F4D3F" />
        <meta name="msapplication-TileImage" content="/Logos/Logo.webp" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* IndexNow API key for instant indexing */}
        <meta name="indexnow" content="D6F638D35C42D071C62B47907C2CD0CC" />

        {/* Educational Verification & SafeSearch */}
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="language" content="en" />
        <meta name="content-language" content="en-US" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* E-A-T Enhancement Meta Tags */}
        <meta name="expertise" content="Applied Behavior Analysis, School-Based Behavior Support, BCBA Certification" />
        <meta name="authority" content="25+ years of experience, BACB-aligned training, professional development leader" />
        <meta name="trustworthiness" content="Evidence-based practices, professional credentials, transparent methodology" />
        <meta name="author-credentials" content="BCBA, IBA, 25+ years of experience" />
        <meta name="content-accuracy" content="Peer-reviewed, evidence-based, professionally verified" />
        <meta name="professional-standards" content="BACB-aligned, ethical guidelines maintained" />

        {/* SafeSearch and Content Filtering Tags */}
        <meta name="SafeSearch" content="true" />
        <meta name="adult" content="false" />
        <meta name="mature" content="false" />

        {/* Educational Taxonomy */}
        <meta name="ICRA labels" content="(pics-1.1 'http://www.icra.org/ratingsv02.html' l gen true for 'http://behaviorschool.com' on '2024.01.01' r (n 0 s 0 v 0 l 0))" />

        {/* Trust and Safety Indicators */}
        <meta name="verify-v1" content="educational+resource+professional+development" />
        <meta name="site-verification" content="educational-institution" />
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
