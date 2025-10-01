import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  // Bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  async redirects() {
    return [
      // Existing redirects
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
        destination: '/behavior-study-tools',
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
        destination: '/free-bcba-mock-practice-test',
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
      // General tag redirect fallback
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
