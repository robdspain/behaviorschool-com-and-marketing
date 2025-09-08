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
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    webVitalsAttribution: ['CLS', 'LCP'],
    optimizeCss: true,
    scrollRestoration: true,
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
