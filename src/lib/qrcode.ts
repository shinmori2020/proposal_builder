import QRCode from 'qrcode';

/**
 * URL を QR コードの data URL（PNG base64）に変換する。
 *
 * - PDF 埋め込み用に高解像度（256px）で生成
 * - エラー訂正レベル M（中程度・印刷時の汚れに耐性）
 * - URL が空文字や無効な場合は null を返す
 */
export async function generateQrDataUrl(
  url: string
): Promise<string | null> {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const dataUrl = await QRCode.toDataURL(trimmed, {
      width: 256,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#222222',
        light: '#ffffff',
      },
    });
    return dataUrl;
  } catch {
    return null;
  }
}
