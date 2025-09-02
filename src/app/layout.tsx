import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { ToastProvider } from "@/components/toast";
import { ConditionalNavBar } from "@/components/ConditionalNavBar";
import { PrivacyCompliantAnalytics } from "@/components/analytics/PrivacyCompliantAnalytics";
import Script from "next/script";

export const metadata: Metadata = {
  title: "BCBA Training & Exam Prep for School-Based Behavior Analysts | Behavior School",
  description: "Comprehensive BCBA exam prep and school behavior support tools for behavior analysts. Get AI-powered practice tests, supervision tools, IEP goal templates, and proven training programs. Try free.",
  keywords: ["behavior change", "leadership", "productivity", "burnout prevention"],
  authors: [{ name: "Behavior School" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "BCBA Training & Exam Prep for School-Based Behavior Analysts | Behavior School", 
    description: "Comprehensive BCBA exam prep and school behavior support tools for behavior analysts. Get AI-powered practice tests, supervision tools, IEP goal templates, and proven training programs.",
    url: "https://behaviorschool.com",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
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
    title: "BCBA Training & Exam Prep for School-Based Behavior Analysts | Behavior School",
    description: "Comprehensive BCBA exam prep and school behavior support tools for behavior analysts. Get AI-powered practice tests, supervision tools, IEP goal templates, and proven training programs.",
    images: ["/optimized/og-image.webp"],
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
    "@type": ["Organization", "EducationalOrganization"],
    name: "Behavior School",
    url: SITE_URL,
    logo: `${SITE_URL}/Logos/Logo.webp`,
    description: "Professional development and training platform for school-based BCBAs, behavior analysts in education, and applied behavior analysis professionals. We provide BCBA exam prep, supervision tools, IEP goal writing, behavior intervention plans, and comprehensive training programs.",
    foundingDate: "2020",
    founder: {
      "@type": "Person",
      name: "Rob Spain",
      jobTitle: "BCBA, IBA",
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
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: "39.8283",
        longitude: "-98.5795"
      },
      geoRadius: "10000000"
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Behavior School Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "BCBA Exam Prep & Practice Tests",
            description: "Comprehensive BCBA exam preparation with AI-powered practice questions, study materials, and mock exams designed specifically for behavior analysts.",
            provider: {
              "@type": "Organization",
              name: "Behavior School"
            },
            areaServed: "Worldwide",
            availableChannel: {
              "@type": "ServiceChannel",
              serviceUrl: `${SITE_URL}/behavior-study-tools`,
              serviceSmsNumber: null,
              servicePhone: null
            }
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service", 
            name: "BCBA Supervision Tools & Training",
            description: "Digital tools and training for BCBA supervisors including fieldwork tracking, competency assessments, and supervision workflows for behavior analysts.",
            provider: {
              "@type": "Organization",
              name: "Behavior School"
            },
            areaServed: "Worldwide",
            availableChannel: {
              "@type": "ServiceChannel",
              serviceUrl: `${SITE_URL}/supervisors`,
              serviceSmsNumber: null,
              servicePhone: null
            }
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            name: "School BCBA Transformation Program",
            description: "8-week intensive training program for school-based BCBAs to master ethical leadership, crisis management, teacher collaboration, and school-wide behavior support implementation.",
            provider: {
              "@type": "Organization",
              name: "Behavior School"
            },
            courseMode: "online",
            educationalCredentialAwarded: "Certificate of Completion",
            timeRequired: "P8W",
            availableChannel: {
              "@type": "ServiceChannel",
              serviceUrl: `${SITE_URL}/transformation-program`,
              serviceSmsNumber: null,
              servicePhone: null
            }
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "IEP Goal Writing Tools",
            description: "Professional tools for writing measurable IEP goals, behavior goals, and SMART IEP objectives for students with behavioral needs in educational settings.",
            provider: {
              "@type": "Organization",
              name: "Behavior School"
            },
            areaServed: "United States",
            availableChannel: {
              "@type": "ServiceChannel",
              serviceUrl: `${SITE_URL}/iep-goals`,
              serviceSmsNumber: null,
              servicePhone: null
            }
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Behavior Intervention Plan Development",
            description: "Templates, tools, and training for developing comprehensive behavior intervention plans (BIPs) based on functional behavior assessments in school settings.",
            provider: {
              "@type": "Organization",
              name: "Behavior School"
            },
            areaServed: "United States",
            availableChannel: {
              "@type": "ServiceChannel",
              serviceUrl: `${SITE_URL}/behavior-plans`,
              serviceSmsNumber: null,
              servicePhone: null
            }
          }
        }
      ]
    },
    knowsAbout: [
      "Applied Behavior Analysis",
      "BCBA Certification",
      "School-Based Behavior Support",
      "Behavior Intervention Plans",
      "IEP Goal Writing",
      "BCBA Supervision",
      "Educational Psychology",
      "School Psychology",
      "MTSS Implementation",
      "PBIS Training",
      "Crisis Management in Schools",
      "Functional Behavior Assessment"
    ]
  } as const;

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Behavior School",
    alternateName: "Behavior School - BCBA Training & Exam Prep",
    url: SITE_URL,
    description: "Professional development platform for school-based BCBAs and behavior analysts in education. BCBA exam prep, supervision tools, IEP goals, behavior plans, and training programs.",
    publisher: {
      "@type": "Organization",
      name: "Behavior School",
      logo: `${SITE_URL}/optimized/Logos/logo-gold-transparent.webp`
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    mainEntity: {
      "@type": "Organization",
      name: "Behavior School"
    },
    about: {
      "@type": "Thing",
      name: "Applied Behavior Analysis Education",
      description: "Training and professional development for behavior analysts, BCBAs, and education professionals in school-based applied behavior analysis practices."
    }
  } as const;
  return (
    <html lang="en">
      <head>
        {/* Preconnect hints for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://behaviorstudytools.com" />
        <link rel="preconnect" href="https://community.behaviorschool.com" />
        
        <PrivacyCompliantAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1F4D3F" />
        <meta name="application-name" content="Behavior School" />
        <meta name="apple-mobile-web-app-title" content="Behavior School" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="font-sans antialiased">
        <ToastProvider>
          <div className="min-h-screen flex flex-col">
            <ConditionalNavBar />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `${SITE_URL}#LocalBusiness`,
            name: "Behavior School",
            description: "Professional development and training platform for school-based BCBAs and behavior analysts in education",
            url: SITE_URL,
            logo: `${SITE_URL}/Logos/Logo.webp`,
            image: `${SITE_URL}/optimized/og-image.webp`,
            telephone: null,
            priceRange: "$",
            address: {
              "@type": "PostalAddress",
              addressCountry: "US"
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "39.8283",
              longitude: "-98.5795"
            },
            areaServed: {
              "@type": "Country",
              name: "United States"
            },
            serviceArea: {
              "@type": "GeoCircle", 
              geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: "39.8283",
                longitude: "-98.5795"
              },
              geoRadius: "10000000"
            },
            openingHours: "Mo-Fr 09:00-17:00",
            currenciesAccepted: "USD",
            paymentAccepted: "Credit Card, PayPal",
            founder: {
              "@type": "Person",
              name: "Rob Spain",
              jobTitle: "BCBA, IBA"
            }
          }) }}
        />
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(registration => {
                  console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, err => {
                  console.log('ServiceWorker registration failed: ', err);
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
