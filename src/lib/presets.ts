import { EstimateItem } from './types';

export interface PresetCategory {
  category: string;
  icon: string;
  items: EstimateItem[];
}

export const ESTIMATE_PRESETS: PresetCategory[] = [
  {
    category: 'ディレクション',
    icon: 'Compass',
    items: [
      { name: 'ディレクション費', unit: '式', qty: 1, price: 50000 },
      { name: '企画・構成費', unit: '式', qty: 1, price: 40000 },
      { name: 'ワイヤーフレーム', unit: 'ページ', qty: 5, price: 10000 },
    ],
  },
  {
    category: 'デザイン',
    icon: 'Palette',
    items: [
      { name: 'トップページデザイン', unit: 'ページ', qty: 1, price: 100000 },
      { name: '下層ページデザイン', unit: 'ページ', qty: 5, price: 40000 },
      { name: 'LPデザイン', unit: 'ページ', qty: 1, price: 120000 },
      { name: 'ロゴデザイン', unit: '式', qty: 1, price: 80000 },
    ],
  },
  {
    category: 'コーディング',
    icon: 'Code2',
    items: [
      { name: 'トップコーディング', unit: 'ページ', qty: 1, price: 40000 },
      { name: '下層コーディング', unit: 'ページ', qty: 5, price: 25000 },
      { name: 'レスポンシブ対応', unit: '式', qty: 1, price: 30000 },
    ],
  },
  {
    category: 'WordPress',
    icon: 'Wrench',
    items: [
      { name: 'WordPress構築', unit: '式', qty: 1, price: 80000 },
      { name: 'オリジナルテーマ', unit: '式', qty: 1, price: 150000 },
      { name: '操作マニュアル', unit: '式', qty: 1, price: 15000 },
    ],
  },
  {
    category: 'フォーム・機能',
    icon: 'Mail',
    items: [
      { name: 'お問い合わせフォーム', unit: '式', qty: 1, price: 20000 },
      { name: '予約システム', unit: '式', qty: 1, price: 40000 },
      { name: 'Googleマップ', unit: '式', qty: 1, price: 10000 },
    ],
  },
  {
    category: 'SEO・集客',
    icon: 'TrendingUp',
    items: [
      { name: 'SEO内部対策', unit: '式', qty: 1, price: 30000 },
      { name: 'Analytics導入', unit: '式', qty: 1, price: 15000 },
      { name: 'MEO対策', unit: '式', qty: 1, price: 20000 },
    ],
  },
  {
    category: 'セキュリティ',
    icon: 'Shield',
    items: [
      { name: 'SSL設定', unit: '式', qty: 1, price: 10000 },
      { name: 'セキュリティ対策', unit: '式', qty: 1, price: 20000 },
      { name: '月額保守', unit: '月', qty: 12, price: 10000 },
    ],
  },
  {
    category: 'テスト',
    icon: 'CheckCircle2',
    items: [
      { name: 'テスト・デバッグ', unit: '式', qty: 1, price: 30000 },
      { name: '公開作業', unit: '式', qty: 1, price: 15000 },
    ],
  },
];
