import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    GHOST_CONTENT_URL: process.env.GHOST_CONTENT_URL,
    NEXT_PUBLIC_GHOST_CONTENT_URL: process.env.GHOST_CONTENT_URL,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*" },
      { protocol: "http", hostname: "*" },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: 'default',
    domains: [],
    unoptimized: false,
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-accordion', '@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-label', '@radix-ui/react-slot', '@radix-ui/react-tabs'],
    webVitalsAttribution: ['CLS', 'LCP'],
    optimizeCss: true,
    scrollRestoration: true,
    inlineCss: true,
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async redirects() {
    return [
      // ============================================
      // HIGH-IMPACT SEO REDIRECTS (Jan 2025)
      // ============================================
      {
        source: '/bcba-mock-practice-test',
        destination: '/bcba-practice-exam',
        permanent: true,
      },
      {
        source: '/free-bcba-mock-practice-test',
        destination: '/free-bcba-practice-exam',
        permanent: true,
      },
      {
        source: '/behavior-study-tools',
        destination: '/study',
        permanent: true,
      },
      {
        source: '/bcba-study-tools',
        destination: '/study',
        permanent: true,
      },
      {
        source: '/school-based-bcba',
        destination: '/school-bcba',
        permanent: true,
      },
      {
        source: '/bcbas-in-schools',
        destination: '/school-bcba',
        permanent: true,
      },
      {
        source: '/school-bcba/job-guide',
        destination: '/school-bcba/job-guide-2025',
        permanent: true,
      },

      // ============================================
      // EXISTING REDIRECTS
      // ============================================
      {
        source: '/supervision',
        destination: '/supervisors',
        permanent: true,
      },
      // Fix 404 redirects from GSC
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home/',
        destination: '/',
        permanent: true,
      },
      {
        source: '/welcome',
        destination: '/',
        permanent: true,
      },
      {
        source: '/behavior-study-tools/',
        destination: '/study',
        permanent: true,
      },
      {
        source: '/fba-bip-plan-writer',
        destination: '/behavior-plans',
        permanent: true,
      },
      {
        source: '/program',
        destination: '/transformation-program',
        permanent: true,
      },
      {
        source: '/program/',
        destination: '/transformation-program',
        permanent: true,
      },
      {
        source: '/coming-soon',
        destination: '/',
        permanent: true,
      },
      {
        source: '/coming-soon/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/second-call-to-action/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/school-based-behavior-work-can-be-overwhelming-2/',
        destination: '/school-based-behavior-support',
        permanent: true,
      },
      // ACT Matrix pages (404s from GSC)
      {
        source: '/featured',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/featured/',
        destination: '/blog',
        permanent: true,
      },
      // Search page (returns 404)
      {
        source: '/search',
        destination: '/',
        permanent: false, // temporary - user might search again
      },
      // Category pages
      {
        source: '/category/uncategorized',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/category/uncategorized/',
        destination: '/blog',
        permanent: true,
      },
      // Author page redirects
      {
        source: '/author/robspain/:path*',
        destination: '/about',
        permanent: true,
      },
      // Misc page path appends (Ghost CMS artifacts)
      {
        source: '/terms-of-service/behavior-study-tools',
        destination: '/terms-of-service',
        permanent: true,
      },
      {
        source: '/about/behavior-study-tools',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/fba-bip-plan-writer/behavior-study-tools',
        destination: '/behavior-plans',
        permanent: true,
      },
      {
        source: '/tag/free-tools/behavior-study-tools',
        destination: '/study',
        permanent: true,
      },
      // Additional 404 fixes
      {
        source: '/unauthorized/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/test-forms/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/posts/:path*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/feed.json',
        destination: '/feed.xml',
        permanent: true,
      },
      // Fix common trailing slash issues
      {
        source: '/products/',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/about/',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/contact/',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/community/',
        destination: '/community',
        permanent: true,
      },
      // Block Ghost CMS URLs with redirects to proper pages
      {
        source: '/tag/:tag/ghost',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tag/:tag/@ghost',
        destination: '/blog',
        permanent: true,
      },
      // Fix specific failing tag URLs
      {
        source: '/tag/free-practice-test',
        destination: '/free-bcba-practice-exam',
        permanent: true,
      },
      {
        source: '/tag/bcba-certification',
        destination: '/bcba-exam-prep',
        permanent: true,
      },
      {
        source: '/tag/bcba-exam-prep',
        destination: '/bcba-exam-prep',
        permanent: true,
      },
      // Specific tag redirects (from GSC 404/redirect reports)
      {
        source: '/tag/language',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tag/language/',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tag/ai-powered-learning',
        destination: '/study',
        permanent: true,
      },
      {
        source: '/tag/ai-powered-learning/',
        destination: '/study',
        permanent: true,
      },
      {
        source: '/tag/products',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/tag/products/',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/tag/study-materials',
        destination: '/study',
        permanent: true,
      },
      {
        source: '/tag/study-materials/',
        destination: '/study',
        permanent: true,
      },
      {
        source: '/tag/training',
        destination: '/transformation-program',
        permanent: true,
      },
      {
        source: '/tag/training/',
        destination: '/transformation-program',
        permanent: true,
      },
      {
        source: '/tag/artificial-intelligence',
        destination: '/study',
        permanent: true,
      },
      {
        source: '/tag/artificial-intelligence/',
        destination: '/study',
        permanent: true,
      },
      {
        source: '/tag/resource',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tag/resource/',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tag/resources',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tag/resources/',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tag/product',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/tag/product/',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/tag/news',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tag/news/',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tag/bcba',
        destination: '/bcba-exam-prep',
        permanent: true,
      },
      {
        source: '/tag/bcba/',
        destination: '/bcba-exam-prep',
        permanent: true,
      },
      // General tag redirect fallback (must be after specific tag rules)
      {
        source: '/tag/:tag*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/author/:author/ghost',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/author/:author/@ghost',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/:slug/ghost',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/:slug/@ghost',
        destination: '/blog/:slug',
        permanent: true,
      },
      // Redirect Ghost blog post URLs to Next.js blog routes
      // This fixes canonical pointing to redirect issues
      {
        source: '/free-bcba-practice-test-ai-powered-exam-prep',
        destination: '/blog/free-bcba-practice-test-ai-powered-exam-prep',
        permanent: true,
      },
      {
        source: '/free-bcba-practice-test-ai-powered-exam-prep/',
        destination: '/blog/free-bcba-practice-test-ai-powered-exam-prep',
        permanent: true,
      },
      // Fix duplicate pages without canonical
      {
        source: '/act-matrix-schools-hub.html',
        destination: '/act-matrix-schools-hub',
        permanent: true,
      },
      // Domain redirect for schoolbcba.com
      {
        source: '/(.*)',
        destination: 'https://behaviorschool.com/school-based-bcba',
        permanent: true,
        has: [
          {
            type: 'host',
            value: 'schoolbcba.com',
          },
        ],
      },
      {
        source: '/(.*)',
        destination: 'https://behaviorschool.com/school-based-bcba',
        permanent: true,
        has: [
          {
            type: 'host',
            value: 'www.schoolbcba.com',
          },
        ],
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Performance headers
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;