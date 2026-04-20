import { Font } from '@react-pdf/renderer';

/**
 * Noto Sans JP フォントの登録
 * basePath は next.config.ts で /proposal_builder が設定されているため、
 * dev/prod 両方で /proposal_builder/fonts/... が正しいパスになる
 */
let registered = false;

export function registerPdfFonts() {
  if (registered) return;

  const base = '/proposal_builder/fonts';

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
