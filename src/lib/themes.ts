export interface Theme {
  id: string;
  label: string;
  primary: string;
  dark: string;
  light: string;
  bg: string;
}

export const THEMES: Theme[] = [
  { id: 'crimson', label: 'クリムゾン', primary: '#a32b3b', dark: '#5c1820', light: '#f5e2e5', bg: '#faeef0' },
  { id: 'coral', label: 'コーラル', primary: '#c4564a', dark: '#6e2e28', light: '#fae8e6', bg: '#fdf1f0' },
  { id: 'brown', label: 'ブラウン', primary: '#6b4a1a', dark: '#3d2a0d', light: '#f5efe6', bg: '#faf6f0' },
  { id: 'gold', label: 'ゴールド', primary: '#9a7b2e', dark: '#5c4a1a', light: '#f5f0e0', bg: '#faf7ee' },
  { id: 'olive', label: 'オリーブ', primary: '#5c6b1a', dark: '#2e360d', light: '#eef0e2', bg: '#f5f7ee' },
  { id: 'green', label: 'フォレスト', primary: '#1a6b4f', dark: '#0d3d2e', light: '#e8f5ef', bg: '#f0faf5' },
  { id: 'mint', label: 'ミント', primary: '#2a9d8f', dark: '#155049', light: '#e0f4f1', bg: '#eefaf8' },
  { id: 'teal', label: 'ティール', primary: '#0d7377', dark: '#063b3d', light: '#e0f2f3', bg: '#edf8f8' },
  { id: 'ocean', label: 'オーシャン', primary: '#1a5f7a', dark: '#0d3040', light: '#e6f2f7', bg: '#eef7fa' },
  { id: 'steel', label: 'スチール', primary: '#546a7b', dark: '#2a3540', light: '#e6ecf0', bg: '#eef3f6' },
  { id: 'navy', label: 'ネイビー', primary: '#1e3a5f', dark: '#0f1f33', light: '#e6edf5', bg: '#eef3fa' },
  { id: 'slate', label: 'スレート', primary: '#4a5568', dark: '#2d3748', light: '#e8ecf0', bg: '#f0f3f6' },
  { id: 'indigo', label: 'インディゴ', primary: '#3b4cca', dark: '#1e2870', light: '#e6e8f8', bg: '#eff0fc' },
  { id: 'royal', label: 'ロイヤル', primary: '#4a2e7a', dark: '#261740', light: '#ede6f5', bg: '#f4f0fa' },
  { id: 'plum', label: 'プラム', primary: '#8b3a62', dark: '#4a1e34', light: '#f2e4ec', bg: '#f8eff4' },
  { id: 'wine', label: 'ワイン', primary: '#7a2e4a', dark: '#3d1726', light: '#f5e6ed', bg: '#faf0f4' },
  { id: 'rose', label: 'ローズ', primary: '#b5456a', dark: '#6b2840', light: '#f8e4ec', bg: '#fcf0f4' },
  { id: 'charcoal', label: 'チャコール', primary: '#3a3a3a', dark: '#1a1a1a', light: '#eeeeee', bg: '#f5f5f5' },
];

export function shades(hex: string, n = 7): string[] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return Array.from({ length: n }, (_, i) => {
    const t = (i / (n - 1)) * 0.85;
    return `#${[r, g, b]
      .map((c) => Math.round(c + (255 - c) * t).toString(16).padStart(2, '0'))
      .join('')}`;
  });
}

export function getTheme(themeId: string): Theme {
  return THEMES.find((t) => t.id === themeId) || THEMES[5];
}
