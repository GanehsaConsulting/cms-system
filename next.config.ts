import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Keep default gzip/brotli compression enabled for production responses.
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    // Client router cache — revisited CMS pages feel instant without refetch flash.
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    // Aggressive tree-shaking for large barrel packages used across the CMS.
    optimizePackageImports: [
      "lucide-react",
      "@bradleyhodges/sfsymbols-react",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@tiptap/core",
      "@tiptap/pm",
      "cmdk",
      "sonner",
      "zod",
    ],
  },
  // Skip `output: "standalone"` — Vercel does not need it and changing it can
  // break the current deployment path.
};

export default withBundleAnalyzer(nextConfig);
