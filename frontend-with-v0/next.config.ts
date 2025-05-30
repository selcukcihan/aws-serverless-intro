import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: './',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
