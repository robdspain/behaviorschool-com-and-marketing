import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*" },
      { protocol: "http", hostname: "*" },
    ],
  },
  async redirects() {
    return [
      { source: "/classroompilot", destination: "/clasroompilot", permanent: true },
    ];
  },
};

export default nextConfig;
