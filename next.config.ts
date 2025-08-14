import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*" },
      { protocol: "http", hostname: "*" },
    ],
  },
  async rewrites() {
    return [
      { source: "/tierpath", destination: "/tierpath.html" },
      { source: "/tierpath/", destination: "/tierpath/index.html" },
    ];
  },
};

export default nextConfig;
