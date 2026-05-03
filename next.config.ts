import type { NextConfig } from "next";

// Vercel デプロイ時は VERCEL=1 が自動設定されるので basePath を空に。
// GitHub Pages（プロジェクトページ /proposal_builder/ 配下）では basePath が必要。
const isVercel = !!process.env.VERCEL;
const basePath = isVercel ? '' : '/proposal_builder';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  // クライアントコードからアセットの絶対パスを組むときに参照する
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
