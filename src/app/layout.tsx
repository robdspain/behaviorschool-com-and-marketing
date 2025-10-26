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

export const metadata: Metadata = {
  title: "FREE BCBA Exam Prep + Mock Tests | Pass Your BCBA Exam | Behavior School",
  description: "Behavior School: Get FREE BCBA practice questions, mock exams, and school behavior tools. Professional resources for behavior analysts. Download free study guides and IEP templates now!",
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
    title: "FREE BCBA Exam Prep + Mock Tests | Pass Your BCBA Exam | Behavior School",
    description: "Get FREE BCBA practice questions, mock exams, and school behavior tools. Professional resources for behavior analysts. Download free study guides now!",
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
    title: "FREE BCBA Exam Prep + Mock Tests | Pass Your BCBA Exam",
    description: "Get FREE BCBA practice questions, mock exams, and school behavior tools. Professional resources for behavior analysts!",
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
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization", "ProfessionalService"],
    name: "Behavior School",
    legalName: "Behavior School LLC",
    alternateName: ["Behavior School", "Professional Development for School-Based Behavior Analysts", "BehaviorSchool.com"],
    url: SITE_URL,
    logo: `${SITE_URL}/Logos/Logo.webp`,
    slogan: "Tools, Training, and Community for School-Based Behavior Analysts",
    description: "Educational institution providing professional development, certification training, and research-based resources for school-based behavior analysts, special education teachers, and educational professionals in applied behavior analysis.",
    educationalCredentialAwarded: ["Continuing Education Units", "Professional Development Certificates"],
    hasEducationalUse: "Professional Development",
    foundingDate: "2020",
    accreditedBy: {
      "@type": "Organization",
      name: "Evidence-Based Professional Development Standards"
    },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "BACB-Aligned Training Provider",
        credentialCategory: "Educational Standards",
        recognizedBy: {
          "@type": "Organization",
          name: "Behavior Analyst Certification Board (BACB)"
        }
      }
    ],
    award: [
      "Leader in School-Based Behavior Analysis Training",
      "Innovative Educational Platform Development",
      "Excellence in Professional Development Delivery"
    ],
    expertise: [
      "Applied Behavior Analysis in Educational Settings",
      "School-Based BCBA Training and Supervision",
      "Evidence-Based Behavior Intervention Strategies",
      "PBIS Implementation and Training",
      "Special Education Professional Development",
      "Functional Behavior Assessment Training"
    ],
    founder: {
      "@type": "Person",
      name: "Rob Spain",
      jobTitle: ["BCBA", "IBA", "Educational Consultant", "Behavior Analyst"],
      description: "Board Certified Behavior Analyst with over 20 years of experience in school-based applied behavior analysis, special education, and professional development training.",
      url: "https://robspain.com",
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          name: "Board Certified Behavior Analyst (BCBA)",
          credentialCategory: "Professional Certification",
          recognizedBy: {
            "@type": "Organization",
            name: "Behavior Analyst Certification Board (BACB)"
          }
        },
        {
          "@type": "EducationalOccupationalCredential",
          name: "Illinois Behavior Analyst (IBA)",
          credentialCategory: "State License",
          recognizedBy: {
            "@type": "Organization",
            name: "Illinois Department of Financial and Professional Regulation"
          }
        }
      ],
      knowsAbout: [
        "Applied Behavior Analysis",
        "School-Based Behavior Analysis",
        "Special Education",
        "PBIS Implementation",
        "Functional Behavior Assessment",
        "Behavior Intervention Plans",
        "Professional Development",
        "Educational Leadership"
      ],
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Graduate Training in Applied Behavior Analysis"
      },
      memberOf: [
        {
          "@type": "Organization",
          name: "Association for Behavior Analysis International (ABAI)"
        },
        {
          "@type": "Organization",
          name: "Illinois Association for Behavior Analysis (IlABA)"
        }
      ],
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
            "@type": "Product",
            name: "BCBA Exam Prep & Practice Tests",
            description: "AI-powered BCBA exam preparation, BCBA practice exams, BCBA study materials, and free BCBA practice tests",
            url: `${SITE_URL}/behavior-study-tools`,
            image: `${SITE_URL}/optimized/hero-thumb.webp`, // Generic image
            provider: {
              "@type": "Organization",
              name: "Behavior School"
            }
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "US",
            "returnPolicyCategory": "https://schema.org/NoReturns"
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "0",
              "currency": "USD"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "US"
            },
            "doesNotShip": true
          }
        },
        {
          "@type": "Offer",
          name: "BCBA Supervision Tools & Training",
          image: `${SITE_URL}/Supervision/Supervision1.webp`,
          itemOffered: {
            "@type": "Product",
            name: "BCBA Supervision Tools",
            description: "Track BCBA fieldwork hours, BCBA supervision log, competency assessments, and supervision workflows",
            url: `${SITE_URL}/supervisors`,
            image: `${SITE_URL}/thumbnails/supervision-thumb.webp`, // Generic image
            provider: {
              "@type": "Organization",
              name: "Behavior School"
            }
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "US",
            "returnPolicyCategory": "https://schema.org/NoReturns"
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "0",
              "currency": "USD"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "US"
            },
            "doesNotShip": true
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "School BCBA Training Program",
            description: "8-week cohort-based program for school BCBAs to reduce burnout, master crisis management in schools, build teacher buy-in for behavior plans, and implement school-wide behavior support systems",
            url: `${SITE_URL}/transformation-program`,
            image: `${SITE_URL}/optimized/OperatingSystem/DD83BB21-6F33-4A94-BF67-311EDDE6D309.webp`, // Generic image
            provider: {
              "@type": "Organization",
              name: "Behavior School"
            }
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "US",
            "returnPolicyCategory": "https://schema.org/NoReturns"
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "0",
              "currency": "USD"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "US"
            },
            "doesNotShip": true
          }
        },
        {
          "@type": "Offer",
          name: "IEP Goal Writing Tools",
          image: `${SITE_URL}/IEP-Goal/IEP-Goal-Writing.webp`,
          itemOffered: {
            "@type": "Product",
            name: "IEP Goal Writing",
            description: "Write measurable IEP goals, behavior IEP goals, and SMART IEP goals for students with autism, ADHD, and behavioral challenges",
            url: `${SITE_URL}/iep-goals`,
            image: `${SITE_URL}/thumbnails/iep-goal-thumb.webp`, // Generic image
            provider: {
              "@type": "Organization",
              name: "Behavior School"
            }
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "US",
            "returnPolicyCategory": "https://schema.org/NoReturns"
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "0",
              "currency": "USD"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "US"
            },
            "doesNotShip": true
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Behavior Intervention Plans",
            description: "Behavior intervention plan templates, behavior support plans, and tools to write BIPs from functional behavior assessments in schools",
            url: `${SITE_URL}/behavior-plans`,
            image: `${SITE_URL}/thumbnails/bip-writer-thumb.webp`, // Generic image
            provider: {
              "@type": "Organization",
              name: "Behavior School"
            }
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "US",
            "returnPolicyCategory": "https://schema.org/NoReturns"
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "0",
              "currency": "USD"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "US"
            },
            "doesNotShip": true
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
    alternateName: ["Behavior School", "Behavior School - BCBA Training & Exam Prep", "BehaviorSchool.com"],
    url: SITE_URL,
    inLanguage: "en-US",
    description: "Behavior School: Professional development platform for school-based BCBAs and behavior analysts in education. BCBA exam prep, supervision tools, IEP goals, behavior plans, and training programs.",
    about: {
      "@type": "Thing",
      name: "Applied Behavior Analysis in Schools",
      description: "School-based behavior analysis, BCBA training, and professional development for educators"
    },
    publisher: {
      "@type": "Organization",
      name: "Behavior School",
      logo: `${SITE_URL}/optimized/Logos/logo-gold-transparent.webp`
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    mainEntity: {
      "@type": "Organization",
      name: "Behavior School"
    }
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
        <Script 
          src="https://analytics.ahrefs.com/analytics.js" 
          data-key="qFMnKEdLIrHbuzIcuxBlmw"
          strategy="lazyOnload"
        />
        
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
        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* E-A-T Enhancement Meta Tags */}
        <meta name="expertise" content="Applied Behavior Analysis, School-Based Behavior Support, BCBA Certification" />
        <meta name="authority" content="20+ years experience, BACB-aligned training, professional development leader" />
        <meta name="trustworthiness" content="Evidence-based practices, professional credentials, transparent methodology" />
        <meta name="author-credentials" content="BCBA, IBA, 20+ years experience" />
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
        <ToastProvider>
          <div className="min-h-screen flex flex-col w-full max-w-full">
            <ConditionalNavBar />
            <ScrollProgressBar />
            <main id="main-content" role="main" aria-label="Main Content" className="flex-1 w-full max-w-full">{children}</main>
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
            "@type": "Organization",
            "@id": `${SITE_URL}#Organization`,
            name: "Behavior School",
            url: SITE_URL,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/Logos/Logo.webp`,
              width: 512,
              height: 512,
              caption: "Behavior School Logo"
            },
            image: {
              "@type": "ImageObject", 
              url: `${SITE_URL}/Logos/Logo.webp`,
              width: 512,
              height: 512
            },
            sameAs: [
              "https://www.linkedin.com/company/behavior-school",
              "https://x.com/behaviorschool",
              "https://community.behaviorschool.com"
            ]
          }) }}
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
