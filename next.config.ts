import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Restrict to known hosts to avoid Next/Image runtime blocks
    remotePatterns: [
      // Ghost CMS
      { protocol: "https", hostname: "ghost.behaviorschool.com" },
      { protocol: "http", hostname: "ghost.behaviorschool.com" },
      // Ghost can serve from subpaths like /content/images/...; wildcard path is implicit
      // Allow our own site as well (OG images, etc.)
      { protocol: "https", hostname: "behaviorschool.com" },
      { protocol: "https", hostname: "www.behaviorschool.com" },
      // Common external image CDNs we might reference in posts
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    formats: ['image/webp', 'image/avif'],
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
