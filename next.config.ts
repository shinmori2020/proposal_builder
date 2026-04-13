import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/proposal_builder',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
