import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: "export",
  
  // Performance optimizations
  compress: true,
  
  // Image optimization
  images: {
    unoptimized: true, // Required for static export
    formats: ["image/avif", "image/webp"],
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60", // Cache API responses for 1 minute
          },
        ],
      },
    ];
  },

  // Enable experimental features for speed
  experimental: {
    optimizePackageImports: ["@/lib", "@/components"],
  },

  // Production optimizations
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};


export default nextConfig;
