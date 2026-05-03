import type { NextConfig } from "next";

// Vercel デプロイ時は VERCEL=1 が自動設定されるので basePath を空に。
// GitHub Pages（プロジェクトページ /proposal_builder/ 配下）では basePath が必要。
const isVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isVercel ? '' : '/proposal_builder',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
