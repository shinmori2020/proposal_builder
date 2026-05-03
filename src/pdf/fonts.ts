import { Font } from '@react-pdf/renderer';

/**
 * Noto Sans JP フォントの登録
 *
 * basePath は next.config.ts でデプロイ環境ごとに設定（Vercel=空 / GH Pages=/proposal_builder）。
 * 同じ値を NEXT_PUBLIC_BASE_PATH として注入してあるので、それを参照して動的にパスを組む。
 */
let registered = false;

export function registerPdfFonts() {
  if (registered) return;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const base = `${basePath}/fonts`;

  Font.register({
    family: 'Noto Sans JP',
    fonts: [
      { src: `${base}/NotoSansJP-Regular.otf`, fontWeight: 400 },
      { src: `${base}/NotoSansJP-Bold.otf`, fontWeight: 600 },
      { src: `${base}/NotoSansJP-Black.otf`, fontWeight: 800 },
    ],
  });

  // 日本語の改行調整
  Font.registerHyphenationCallback((word) => [word]);

  registered = true;
}
