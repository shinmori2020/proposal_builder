import { Page, Plan, SchedulePhase } from './types';

export interface Template {
  id: string;
  label: string;
  icon: string;
  desc: string;
  siteType: string;
  overview: string;
  purpose: string;
  features: string[];
  pages: Page[];
  plans: Plan[];
  schedule: SchedulePhase[];
}

function makePlan(
  name: string,
  items: Plan['items'] = [{ name: 'ディレクション費', unit: '式', qty: 1, price: 50000 }],
  recommended = false
): Plan {
  return {
    name,
    items,
    discount: { type: 'none', value: 0, label: '' },
    recommended,
  };
}

export const TEMPLATES: Template[] = [
  {
    id: 'blank',
    label: '白紙',
    icon: 'FileText',
    desc: '自由に作成',
    siteType: 'コーポレートサイト',
    overview: '',
    purpose: '',
    features: ['レスポンシブ対応', 'SSL対応'],
    pages: [{ name: 'トップページ', children: [] }],
    plans: [makePlan('スタンダードプラン')],
    schedule: [
      { phase: 'ヒアリング', weeks: 1, extraDays: 0 },
      { phase: 'デザイン', weeks: 2, extraDays: 0 },
      { phase: 'コーディング', weeks: 2, extraDays: 0 },
      { phase: '納品', weeks: 0, extraDays: 4 },
    ],
  },
  {
    id: 'corporate',
    label: '企業',
    icon: 'Building2',
    desc: '会社紹介の王道構成',
    siteType: 'コーポレートサイト',
    overview: '企業の信頼性向上とブランディング強化を目的としたサイト制作をご提案します。',
    purpose: '信頼感と先進性を両立したデザインで企業価値を表現します。',
    features: ['お問い合わせフォーム', 'SEO対策', 'アクセス解析導入', 'SNS連携', 'Googleマップ', 'SSL対応', 'レスポンシブ対応', 'CMS導入(WordPress等)'],
    pages: [
      { name: 'トップページ', children: [] },
      { name: '会社概要', children: ['代表挨拶', '企業理念'] },
      { name: '事業内容', children: ['事業A', '事業B'] },
      { name: 'お知らせ', children: [] },
      { name: 'お問い合わせ', children: [] },
    ],
    plans: [
      makePlan('スタンダードプラン', [
        { name: 'ディレクション費', unit: '式', qty: 1, price: 60000 },
        { name: 'トップページデザイン', unit: 'ページ', qty: 1, price: 100000 },
        { name: '下層ページデザイン', unit: 'ページ', qty: 5, price: 40000 },
        { name: 'コーディング', unit: 'ページ', qty: 8, price: 25000 },
        { name: 'WordPress構築', unit: '式', qty: 1, price: 80000 },
        { name: 'フォーム', unit: '式', qty: 1, price: 20000 },
        { name: 'SEO対策', unit: '式', qty: 1, price: 30000 },
        { name: 'テスト', unit: '式', qty: 1, price: 30000 },
      ], true),
    ],
    schedule: [
      { phase: 'ヒアリング', weeks: 1, extraDays: 0 },
      { phase: 'ワイヤーフレーム', weeks: 1, extraDays: 0 },
      { phase: 'デザイン', weeks: 2, extraDays: 0 },
      { phase: 'コーディング', weeks: 2, extraDays: 0 },
      { phase: 'WordPress', weeks: 1, extraDays: 4 },
      { phase: 'テスト・納品', weeks: 1, extraDays: 0 },
    ],
  },
  {
    id: 'restaurant',
    label: '飲食店',
    icon: 'UtensilsCrossed',
    desc: 'メニュー・予約中心',
    siteType: 'コーポレートサイト',
    overview: '来店につながるサイト設計をご提案します。',
    purpose: 'メニューから予約までのスムーズな導線を構築します。',
    features: ['お問い合わせフォーム', 'SEO対策', 'SNS連携', 'Googleマップ', 'SSL対応', 'レスポンシブ対応', 'CMS導入(WordPress等)', '予約システム'],
    pages: [
      { name: 'トップページ', children: [] },
      { name: 'コンセプト', children: [] },
      { name: 'メニュー', children: ['フード', 'ドリンク'] },
      { name: '店舗情報', children: [] },
      { name: 'ご予約', children: [] },
    ],
    plans: [
      makePlan('スタンダードプラン', [
        { name: 'ディレクション費', unit: '式', qty: 1, price: 50000 },
        { name: 'トップページデザイン', unit: 'ページ', qty: 1, price: 90000 },
        { name: '下層ページデザイン', unit: 'ページ', qty: 5, price: 35000 },
        { name: 'コーディング', unit: 'ページ', qty: 7, price: 25000 },
        { name: 'WordPress構築', unit: '式', qty: 1, price: 70000 },
        { name: '予約システム', unit: '式', qty: 1, price: 40000 },
        { name: 'テスト', unit: '式', qty: 1, price: 25000 },
      ], true),
    ],
    schedule: [
      { phase: 'ヒアリング', weeks: 1, extraDays: 0 },
      { phase: 'デザイン', weeks: 2, extraDays: 0 },
      { phase: 'コーディング', weeks: 1, extraDays: 4 },
      { phase: 'WordPress', weeks: 1, extraDays: 0 },
      { phase: 'テスト・納品', weeks: 1, extraDays: 0 },
    ],
  },
  {
    id: 'beauty',
    label: '美容院',
    icon: 'Scissors',
    desc: 'スタッフ・予約導線',
    siteType: 'コーポレートサイト',
    overview: '予約への導線を最短にするサイトをご提案します。',
    purpose: 'ギャラリーで信頼感を醸成し予約導線を設計します。',
    features: ['お問い合わせフォーム', 'SEO対策', 'SNS連携', 'Googleマップ', 'SSL対応', 'レスポンシブ対応', 'CMS導入(WordPress等)', '予約システム', 'ギャラリー・施工事例'],
    pages: [
      { name: 'トップページ', children: [] },
      { name: 'メニュー・料金', children: ['カット', 'カラー'] },
      { name: 'スタッフ', children: [] },
      { name: 'ギャラリー', children: [] },
      { name: '店舗情報', children: [] },
      { name: 'ご予約', children: [] },
    ],
    plans: [
      makePlan('スタンダードプラン', [
        { name: 'ディレクション費', unit: '式', qty: 1, price: 50000 },
        { name: 'トップページデザイン', unit: 'ページ', qty: 1, price: 90000 },
        { name: '下層ページデザイン', unit: 'ページ', qty: 6, price: 35000 },
        { name: 'コーディング', unit: 'ページ', qty: 8, price: 25000 },
        { name: 'WordPress構築', unit: '式', qty: 1, price: 80000 },
        { name: 'ギャラリー機能', unit: '式', qty: 1, price: 30000 },
        { name: '予約システム', unit: '式', qty: 1, price: 35000 },
        { name: 'テスト', unit: '式', qty: 1, price: 25000 },
      ], true),
    ],
    schedule: [
      { phase: 'ヒアリング', weeks: 1, extraDays: 0 },
      { phase: 'デザイン', weeks: 2, extraDays: 0 },
      { phase: 'コーディング', weeks: 2, extraDays: 0 },
      { phase: 'WordPress', weeks: 1, extraDays: 4 },
      { phase: 'テスト・納品', weeks: 1, extraDays: 0 },
    ],
  },
  {
    id: 'clinic',
    label: 'クリニック',
    icon: 'Hospital',
    desc: '診療案内・予約',
    siteType: 'コーポレートサイト',
    overview: '安心感を与えるクリニックサイトをご提案します。',
    purpose: '清潔感あるデザインで診療内容を伝えます。',
    features: ['お問い合わせフォーム', 'SEO対策', 'Googleマップ', 'SSL対応', 'レスポンシブ対応', 'CMS導入(WordPress等)', '予約システム'],
    pages: [
      { name: 'トップページ', children: [] },
      { name: '医院紹介', children: ['院長挨拶'] },
      { name: '診療案内', children: ['一般', '専門'] },
      { name: 'アクセス', children: [] },
      { name: 'Web予約', children: [] },
    ],
    plans: [
      makePlan('スタンダードプラン', [
        { name: 'ディレクション費', unit: '式', qty: 1, price: 60000 },
        { name: 'トップページデザイン', unit: 'ページ', qty: 1, price: 100000 },
        { name: '下層ページデザイン', unit: 'ページ', qty: 6, price: 40000 },
        { name: 'コーディング', unit: 'ページ', qty: 8, price: 25000 },
        { name: 'WordPress構築', unit: '式', qty: 1, price: 80000 },
        { name: '予約システム', unit: '式', qty: 1, price: 50000 },
        { name: 'テスト', unit: '式', qty: 1, price: 30000 },
      ], true),
    ],
    schedule: [
      { phase: 'ヒアリング', weeks: 1, extraDays: 0 },
      { phase: 'デザイン', weeks: 2, extraDays: 4 },
      { phase: 'コーディング', weeks: 2, extraDays: 0 },
      { phase: 'WordPress', weeks: 1, extraDays: 4 },
      { phase: 'テスト・納品', weeks: 1, extraDays: 0 },
    ],
  },
  {
    id: 'law',
    label: '士業',
    icon: 'Scale',
    desc: '業務案内・相談フォーム',
    siteType: 'コーポレートサイト',
    overview: '専門性を伝え相談依頼につなげるサイトをご提案します。',
    purpose: '実績を整理し相談導線を最適化します。',
    features: ['お問い合わせフォーム', 'SEO対策', 'Googleマップ', 'SSL対応', 'レスポンシブ対応', 'CMS導入(WordPress等)'],
    pages: [
      { name: 'トップページ', children: [] },
      { name: '事務所案内', children: [] },
      { name: '業務案内', children: ['分野A', '分野B'] },
      { name: '解決事例', children: [] },
      { name: 'ご相談', children: [] },
    ],
    plans: [
      makePlan('スタンダードプラン', [
        { name: 'ディレクション費', unit: '式', qty: 1, price: 60000 },
        { name: 'トップページデザイン', unit: 'ページ', qty: 1, price: 90000 },
        { name: '下層ページデザイン', unit: 'ページ', qty: 5, price: 38000 },
        { name: 'コーディング', unit: 'ページ', qty: 7, price: 25000 },
        { name: 'WordPress構築', unit: '式', qty: 1, price: 80000 },
        { name: 'テスト', unit: '式', qty: 1, price: 30000 },
      ], true),
    ],
    schedule: [
      { phase: 'ヒアリング', weeks: 1, extraDays: 0 },
      { phase: 'デザイン', weeks: 2, extraDays: 0 },
      { phase: 'コーディング', weeks: 2, extraDays: 0 },
      { phase: 'WordPress', weeks: 1, extraDays: 4 },
      { phase: 'テスト・納品', weeks: 1, extraDays: 0 },
    ],
  },
  {
    id: 'construction',
    label: '建設',
    icon: 'Hammer',
    desc: '施工事例中心',
    siteType: 'コーポレートサイト',
    overview: '施工実績で信頼を高めるサイトをご提案します。',
    purpose: '事例ギャラリーで実績をアピールします。',
    features: ['お問い合わせフォーム', 'SEO対策', 'Googleマップ', 'SSL対応', 'レスポンシブ対応', 'CMS導入(WordPress等)', 'ギャラリー・施工事例'],
    pages: [
      { name: 'トップページ', children: [] },
      { name: '会社概要', children: [] },
      { name: 'サービス', children: ['新築', 'リフォーム'] },
      { name: '施工事例', children: [] },
      { name: 'お見積もり', children: [] },
    ],
    plans: [
      makePlan('スタンダードプラン', [
        { name: 'ディレクション費', unit: '式', qty: 1, price: 60000 },
        { name: 'トップページデザイン', unit: 'ページ', qty: 1, price: 100000 },
        { name: '下層ページデザイン', unit: 'ページ', qty: 5, price: 38000 },
        { name: 'コーディング', unit: 'ページ', qty: 7, price: 25000 },
        { name: 'WordPress構築', unit: '式', qty: 1, price: 80000 },
        { name: 'ギャラリー', unit: '式', qty: 1, price: 40000 },
        { name: 'テスト', unit: '式', qty: 1, price: 30000 },
      ], true),
    ],
    schedule: [
      { phase: 'ヒアリング', weeks: 1, extraDays: 0 },
      { phase: 'デザイン', weeks: 2, extraDays: 0 },
      { phase: 'コーディング', weeks: 2, extraDays: 0 },
      { phase: 'WordPress', weeks: 1, extraDays: 4 },
      { phase: 'テスト・納品', weeks: 1, extraDays: 0 },
    ],
  },
  {
    id: 'recruit',
    label: '採用サイト',
    icon: 'Users',
    desc: '社員紹介・応募',
    siteType: '採用サイト',
    overview: '応募数の増加を目指す採用サイトをご提案します。',
    purpose: '企業文化を魅力的に伝えます。',
    features: ['求人応募フォーム', 'SEO対策', 'SNS連携', 'SSL対応', 'レスポンシブ対応', 'CMS導入(WordPress等)', '動画埋め込み'],
    pages: [
      { name: 'トップページ', children: [] },
      { name: '私たちについて', children: [] },
      { name: '社員インタビュー', children: [] },
      { name: '募集要項', children: [] },
      { name: 'エントリー', children: [] },
    ],
    plans: [
      makePlan('スタンダードプラン', [
        { name: 'ディレクション費', unit: '式', qty: 1, price: 60000 },
        { name: 'トップページデザイン', unit: 'ページ', qty: 1, price: 100000 },
        { name: '下層ページデザイン', unit: 'ページ', qty: 5, price: 40000 },
        { name: 'コーディング', unit: 'ページ', qty: 6, price: 25000 },
        { name: 'WordPress構築', unit: '式', qty: 1, price: 80000 },
        { name: '応募フォーム', unit: '式', qty: 1, price: 35000 },
        { name: 'テスト', unit: '式', qty: 1, price: 30000 },
      ], true),
    ],
    schedule: [
      { phase: 'ヒアリング', weeks: 1, extraDays: 4 },
      { phase: 'デザイン', weeks: 2, extraDays: 4 },
      { phase: 'コーディング', weeks: 2, extraDays: 0 },
      { phase: 'WordPress', weeks: 1, extraDays: 4 },
      { phase: 'テスト・納品', weeks: 1, extraDays: 0 },
    ],
  },
];
