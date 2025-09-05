import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GHOST_CONTENT_URL: process.env.GHOST_CONTENT_URL,
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
    
    // Optimize bundle splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    };
    
    return config;
  },
  async redirects() {
    return [
      {
        source: '/supervision',
        destination: '/supervisors',
        permanent: true,
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
        ],
      },
    ];
  },
};

export default nextConfig;
