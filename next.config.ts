import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep mongoose out of the bundler — reduces worker memory during "Collecting page data"
  serverExternalPackages: ["mongoose", "algoliasearch"],
  experimental: {
    // Cap page-data workers (default was ~19 and OOM'd on Windows)
    cpus: 2,
    webpackMemoryOptimizations: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
