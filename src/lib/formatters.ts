/**
 * 納品希望日をフォーマット
 * - YYYY-MM-DD 形式 → "YYYY年M月D日"
 * - それ以外（レガシーの自由記述） → そのまま返す
 */
export function formatDeliveryDate(value: string): string {
  if (!value) return '';
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    return `${match[1]}年${parseInt(match[2], 10)}月${parseInt(match[3], 10)}日`;
  }
  return value;
}

/**
 * URL が http:// または https:// で始まるか
 * （空文字はバリデーションOK扱い）
 */
export function isValidUrl(url: string): boolean {
  if (!url) return true;
  return /^https?:\/\/.+/.test(url);
}

/**
 * 数値をカンマ区切りの文字列にフォーマット
 * 例: 50000 → "50,000"
 */
export function formatNumberWithCommas(n: number): string {
  return n.toLocaleString('ja-JP');
}

/**
 * カンマ区切り文字列から数値のみ抽出
 * 例: "50,000円" → 50000
 */
export function parseNumberFromString(str: string): number {
  const clean = str.replace(/[^0-9]/g, '');
  return clean ? Number(clean) : 0;
}
