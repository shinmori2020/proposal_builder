import { useState, useEffect } from "react";

// ========== THEME ==========
const THEMES = [
  { id: "crimson", label: "クリムゾン", primary: "#a32b3b", dark: "#5c1820", light: "#f5e2e5", bg: "#faeef0" },
  { id: "coral", label: "コーラル", primary: "#c4564a", dark: "#6e2e28", light: "#fae8e6", bg: "#fdf1f0" },
  { id: "brown", label: "ブラウン", primary: "#6b4a1a", dark: "#3d2a0d", light: "#f5efe6", bg: "#faf6f0" },
  { id: "gold", label: "ゴールド", primary: "#9a7b2e", dark: "#5c4a1a", light: "#f5f0e0", bg: "#faf7ee" },
  { id: "olive", label: "オリーブ", primary: "#5c6b1a", dark: "#2e360d", light: "#eef0e2", bg: "#f5f7ee" },
  { id: "green", label: "フォレスト", primary: "#1a6b4f", dark: "#0d3d2e", light: "#e8f5ef", bg: "#f0faf5" },
  { id: "mint", label: "ミント", primary: "#2a9d8f", dark: "#155049", light: "#e0f4f1", bg: "#eefaf8" },
  { id: "teal", label: "ティール", primary: "#0d7377", dark: "#063b3d", light: "#e0f2f3", bg: "#edf8f8" },
  { id: "ocean", label: "オーシャン", primary: "#1a5f7a", dark: "#0d3040", light: "#e6f2f7", bg: "#eef7fa" },
  { id: "steel", label: "スチール", primary: "#546a7b", dark: "#2a3540", light: "#e6ecf0", bg: "#eef3f6" },
  { id: "navy", label: "ネイビー", primary: "#1e3a5f", dark: "#0f1f33", light: "#e6edf5", bg: "#eef3fa" },
  { id: "slate", label: "スレート", primary: "#4a5568", dark: "#2d3748", light: "#e8ecf0", bg: "#f0f3f6" },
  { id: "indigo", label: "インディゴ", primary: "#3b4cca", dark: "#1e2870", light: "#e6e8f8", bg: "#eff0fc" },
  { id: "royal", label: "ロイヤル", primary: "#4a2e7a", dark: "#261740", light: "#ede6f5", bg: "#f4f0fa" },
  { id: "plum", label: "プラム", primary: "#8b3a62", dark: "#4a1e34", light: "#f2e4ec", bg: "#f8eff4" },
  { id: "wine", label: "ワイン", primary: "#7a2e4a", dark: "#3d1726", light: "#f5e6ed", bg: "#faf0f4" },
  { id: "rose", label: "ローズ", primary: "#b5456a", dark: "#6b2840", light: "#f8e4ec", bg: "#fcf0f4" },
  { id: "charcoal", label: "チャコール", primary: "#3a3a3a", dark: "#1a1a1a", light: "#eeeeee", bg: "#f5f5f5" },
];
function shades(hex, n = 7) { const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); return Array.from({ length: n }, (_, i) => { const t = i / (n - 1) * 0.85; return `#${[r, g, b].map((c) => Math.round(c + (255 - c) * t).toString(16).padStart(2, "0")).join("")}`; }); }

// ========== ICONS ==========
const Ic = ({ children, size = 20, color = "currentColor", ...p }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} {...p}>{children}</svg>);
const I = {
  clipboard: (p) => <Ic {...p}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></Ic>,
  folder: (p) => <Ic {...p}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></Ic>,
  coins: (p) => <Ic {...p}><circle cx="8" cy="14" r="6" /><path d="M18.09 10.37A6 6 0 1 0 10.34 18" /><path d="M7 14h2m-1-1v2" /></Ic>,
  calendar: (p) => <Ic {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Ic>,
  eye: (p) => <Ic {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Ic>,
  eyeOff: (p) => <Ic {...p}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></Ic>,
  printer: (p) => <Ic {...p}><path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></Ic>,
  file: (p) => <Ic {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Ic>,
  fileText: (p) => <Ic {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></Ic>,
  building: (p) => <Ic {...p}><rect x="4" y="2" width="16" height="20" rx="1" /><path d="M9 22v-4h6v4" /><line x1="8" y1="6" x2="8" y2="6.01" /><line x1="12" y1="6" x2="12" y2="6.01" /><line x1="16" y1="6" x2="16" y2="6.01" /><line x1="8" y1="10" x2="8" y2="10.01" /><line x1="12" y1="10" x2="12" y2="10.01" /><line x1="16" y1="10" x2="16" y2="10.01" /></Ic>,
  utensils: (p) => <Ic {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></Ic>,
  scissors: (p) => <Ic {...p}><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></Ic>,
  hospital: (p) => <Ic {...p}><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" /><path d="M10 9h4" /><path d="M12 7v4" /></Ic>,
  scale: (p) => <Ic {...p}><path d="M12 3v19" /><path d="M5 8l7-5 7 5" /><path d="M3 13l2-5h0l2 5" /><path d="M17 13l2-5h0l2 5" /><path d="M3 13a2 2 0 0 0 4 0" /><path d="M17 13a2 2 0 0 0 4 0" /></Ic>,
  hammer: (p) => <Ic {...p}><path d="M15 12l-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9" /><path d="M17.64 15L22 10.64" /><path d="M20.91 11.7l-1.25-1.25a1 1 0 0 1 0-1.41l2.35-2.35-3.54-3.54-2.35 2.35a1 1 0 0 1-1.41 0L13.46 4.25" /></Ic>,
  users: (p) => <Ic {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Ic>,
  tag: (p) => <Ic {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></Ic>,
  package: (p) => <Ic {...p}><path d="M16.5 9.4l-9-5.19" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></Ic>,
  plus: (p) => <Ic {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Ic>,
  x: (p) => <Ic size={16} {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Ic>,
  check: (p) => <Ic {...p}><polyline points="20 6 9 17 4 12" /></Ic>,
  link: (p) => <Ic {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></Ic>,
  save: (p) => <Ic {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></Ic>,
  copy: (p) => <Ic {...p}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></Ic>,
  percent: (p) => <Ic {...p}><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></Ic>,
  star: (p) => <Ic {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Ic>,
  layers: (p) => <Ic {...p}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></Ic>,
  direction: (p) => <Ic {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></Ic>,
  palette2: (p) => <Ic {...p}><circle cx="13.5" cy="6.5" r="0.01" strokeWidth="3" /><circle cx="17.5" cy="10.5" r="0.01" strokeWidth="3" /><circle cx="8.5" cy="7.5" r="0.01" strokeWidth="3" /><circle cx="6.5" cy="12" r="0.01" strokeWidth="3" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.04-.23-.29-.38-.63-.38-1.03 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.17-4.49-9-10-9z" /></Ic>,
  code: (p) => <Ic {...p}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Ic>,
  wrench: (p) => <Ic {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></Ic>,
  mail: (p) => <Ic {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22 4 12 13 2 4" /></Ic>,
  trendUp: (p) => <Ic {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></Ic>,
  shield: (p) => <Ic {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Ic>,
  checkCircle: (p) => <Ic {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Ic>,
};
const ri = (n, p = {}) => { const C = I[n]; return C ? <C {...p} /> : null; };
const fp = (n) => n.toLocaleString("ja-JP");

// ========== DATA ==========
const SITE_TYPES = ["コーポレートサイト", "ランディングページ", "ECサイト", "ブログ・メディア", "ポートフォリオ", "採用サイト", "その他"];
const FEATURES_ALL = ["お問い合わせフォーム", "ブログ機能", "EC・カート機能", "会員ログイン", "多言語対応", "SEO対策", "アクセス解析導入", "SNS連携", "動画埋め込み", "Googleマップ", "SSL対応", "レスポンシブ対応", "CMS導入(WordPress等)", "アニメーション演出", "予約システム", "求人応募フォーム", "ギャラリー・施工事例"];

const CONTRACT_PRESETS = {
  payment: [
    { id: "p1", label: "着手金50%/納品時50%", text: "ご契約時に50%を着手金、納品完了後に残り50%をお支払いいただきます。" },
    { id: "p2", label: "着手金30%/中間30%/納品時40%", text: "着手時30%、デザイン確定時30%、納品完了時40%の3回払いです。" },
    { id: "p3", label: "納品後一括", text: "納品完了後、請求書発行から30日以内に一括でお支払いください。" },
    { id: "p4", label: "月額分割", text: "制作費総額を分割でお支払いいただけます。回数はご相談ください。" },
    { id: "p5", label: "ココナラ決済", text: "ココナラのプラットフォームを通じて安全にお支払いいただきます。" },
  ],
  revision: [
    { id: "r1", label: "デザイン2回・コーディング1回", text: "デザイン修正2回、コーディング修正1回まで無償。以降は別途費用です。" },
    { id: "r2", label: "各工程3回まで", text: "各工程3回まで無償修正。4回目以降は別途費用です。" },
    { id: "r3", label: "期間内無制限", text: "納品前の修正は期間内無制限。仕様変更は別途お見積もりです。" },
  ],
  copyright: [
    { id: "c1", label: "クライアントに譲渡", text: "お支払い完了後、著作権はすべてクライアント様に譲渡します。" },
    { id: "c2", label: "制作者帰属（使用権付与）", text: "著作権は制作者に帰属し、使用権を無期限で付与します。" },
  ],
  delivery: [
    { id: "d1", label: "サーバーアップロード", text: "ご指定のサーバーにアップロードし公開します。" },
    { id: "d2", label: "データ一式納品", text: "制作データ一式をzipでお渡しします。" },
    { id: "d3", label: "アップロード＋データ納品", text: "サーバー公開に加え、データ一式もお渡しします。" },
  ],
  notes: [
    { id: "n1", label: "対応ブラウザ", text: "Chrome / Safari / Firefox / Edge（各最新版）対応。IE非対応。" },
    { id: "n2", label: "サーバー費用別途", text: "サーバー・ドメイン費用は本見積もりに含まれません。" },
    { id: "n3", label: "素材ご提供", text: "原稿・写真・ロゴ等はクライアント様よりご支給ください。" },
    { id: "n4", label: "納品後保守", text: "納品後1ヶ月間は無償でバグ修正に対応します。" },
    { id: "n5", label: "キャンセル", text: "着手後のキャンセルは進行状況に応じた費用をご請求します。" },
  ],
};

const EP = [
  { category: "ディレクション", icon: "direction", items: [{ name: "ディレクション費", unit: "式", qty: 1, price: 50000 }, { name: "企画・構成費", unit: "式", qty: 1, price: 40000 }, { name: "ワイヤーフレーム", unit: "ページ", qty: 5, price: 10000 }] },
  { category: "デザイン", icon: "palette2", items: [{ name: "トップページデザイン", unit: "ページ", qty: 1, price: 100000 }, { name: "下層ページデザイン", unit: "ページ", qty: 5, price: 40000 }, { name: "LPデザイン", unit: "ページ", qty: 1, price: 120000 }, { name: "ロゴデザイン", unit: "式", qty: 1, price: 80000 }] },
  { category: "コーディング", icon: "code", items: [{ name: "トップコーディング", unit: "ページ", qty: 1, price: 40000 }, { name: "下層コーディング", unit: "ページ", qty: 5, price: 25000 }, { name: "レスポンシブ対応", unit: "式", qty: 1, price: 30000 }] },
  { category: "WordPress", icon: "wrench", items: [{ name: "WordPress構築", unit: "式", qty: 1, price: 80000 }, { name: "オリジナルテーマ", unit: "式", qty: 1, price: 150000 }, { name: "操作マニュアル", unit: "式", qty: 1, price: 15000 }] },
  { category: "フォーム・機能", icon: "mail", items: [{ name: "お問い合わせフォーム", unit: "式", qty: 1, price: 20000 }, { name: "予約システム", unit: "式", qty: 1, price: 40000 }, { name: "Googleマップ", unit: "式", qty: 1, price: 10000 }] },
  { category: "SEO・集客", icon: "trendUp", items: [{ name: "SEO内部対策", unit: "式", qty: 1, price: 30000 }, { name: "Analytics導入", unit: "式", qty: 1, price: 15000 }, { name: "MEO対策", unit: "式", qty: 1, price: 20000 }] },
  { category: "セキュリティ", icon: "shield", items: [{ name: "SSL設定", unit: "式", qty: 1, price: 10000 }, { name: "セキュリティ対策", unit: "式", qty: 1, price: 20000 }, { name: "月額保守", unit: "月", qty: 12, price: 10000 }] },
  { category: "テスト", icon: "checkCircle", items: [{ name: "テスト・デバッグ", unit: "式", qty: 1, price: 30000 }, { name: "公開作業", unit: "式", qty: 1, price: 15000 }] },
];

const makePlan = (name = "スタンダードプラン", items = [{ name: "ディレクション費", unit: "式", qty: 1, price: 50000 }], rec = false) => ({ name, items, discount: { type: "none", value: 0, label: "" }, recommended: rec });

const TEMPLATES = [
  { id: "blank", label: "白紙", icon: "file", desc: "自由に作成", siteType: "コーポレートサイト", overview: "", purpose: "", features: ["レスポンシブ対応", "SSL対応"], pages: [{ name: "トップページ", children: [] }], plans: [makePlan()], schedule: [{ phase: "ヒアリング", weeks: 1 }, { phase: "デザイン", weeks: 2 }, { phase: "コーディング", weeks: 2 }, { phase: "納品", weeks: 0.5 }] },
  { id: "corporate", label: "企業", icon: "building", desc: "会社紹介の王道構成", siteType: "コーポレートサイト", overview: "企業の信頼性向上とブランディング強化を目的としたサイト制作をご提案します。", purpose: "信頼感と先進性を両立したデザインで企業価値を表現します。", features: ["お問い合わせフォーム", "SEO対策", "アクセス解析導入", "SNS連携", "Googleマップ", "SSL対応", "レスポンシブ対応", "CMS導入(WordPress等)"], pages: [{ name: "トップページ", children: [] }, { name: "会社概要", children: ["代表挨拶", "企業理念"] }, { name: "事業内容", children: ["事業A", "事業B"] }, { name: "お知らせ", children: [] }, { name: "お問い合わせ", children: [] }], plans: [makePlan("スタンダードプラン", [{ name: "ディレクション費", unit: "式", qty: 1, price: 60000 }, { name: "トップページデザイン", unit: "ページ", qty: 1, price: 100000 }, { name: "下層ページデザイン", unit: "ページ", qty: 5, price: 40000 }, { name: "コーディング", unit: "ページ", qty: 8, price: 25000 }, { name: "WordPress構築", unit: "式", qty: 1, price: 80000 }, { name: "フォーム", unit: "式", qty: 1, price: 20000 }, { name: "SEO対策", unit: "式", qty: 1, price: 30000 }, { name: "テスト", unit: "式", qty: 1, price: 30000 }], true)], schedule: [{ phase: "ヒアリング", weeks: 1 }, { phase: "ワイヤーフレーム", weeks: 1 }, { phase: "デザイン", weeks: 2 }, { phase: "コーディング", weeks: 2 }, { phase: "WordPress", weeks: 1.5 }, { phase: "テスト・納品", weeks: 1 }] },
  { id: "restaurant", label: "飲食店", icon: "utensils", desc: "メニュー・予約中心", siteType: "コーポレートサイト", overview: "来店につながるサイト設計をご提案します。", purpose: "メニューから予約までのスムーズな導線を構築します。", features: ["お問い合わせフォーム", "SEO対策", "SNS連携", "Googleマップ", "SSL対応", "レスポンシブ対応", "CMS導入(WordPress等)", "予約システム"], pages: [{ name: "トップページ", children: [] }, { name: "コンセプト", children: [] }, { name: "メニュー", children: ["フード", "ドリンク"] }, { name: "店舗情報", children: [] }, { name: "ご予約", children: [] }], plans: [makePlan("スタンダードプラン", [{ name: "ディレクション費", unit: "式", qty: 1, price: 50000 }, { name: "トップページデザイン", unit: "ページ", qty: 1, price: 90000 }, { name: "下層ページデザイン", unit: "ページ", qty: 5, price: 35000 }, { name: "コーディング", unit: "ページ", qty: 7, price: 25000 }, { name: "WordPress構築", unit: "式", qty: 1, price: 70000 }, { name: "予約システム", unit: "式", qty: 1, price: 40000 }, { name: "テスト", unit: "式", qty: 1, price: 25000 }], true)], schedule: [{ phase: "ヒアリング", weeks: 1 }, { phase: "デザイン", weeks: 2 }, { phase: "コーディング", weeks: 1.5 }, { phase: "WordPress", weeks: 1 }, { phase: "テスト・納品", weeks: 1 }] },
  { id: "beauty", label: "美容院", icon: "scissors", desc: "スタッフ・予約導線", siteType: "コーポレートサイト", overview: "予約への導線を最短にするサイトをご提案します。", purpose: "ギャラリーで信頼感を醸成し予約導線を設計します。", features: ["お問い合わせフォーム", "SEO対策", "SNS連携", "Googleマップ", "SSL対応", "レスポンシブ対応", "CMS導入(WordPress等)", "予約システム", "ギャラリー・施工事例"], pages: [{ name: "トップページ", children: [] }, { name: "メニュー・料金", children: ["カット", "カラー"] }, { name: "スタッフ", children: [] }, { name: "ギャラリー", children: [] }, { name: "店舗情報", children: [] }, { name: "ご予約", children: [] }], plans: [makePlan("スタンダードプラン", [{ name: "ディレクション費", unit: "式", qty: 1, price: 50000 }, { name: "トップページデザイン", unit: "ページ", qty: 1, price: 90000 }, { name: "下層ページデザイン", unit: "ページ", qty: 6, price: 35000 }, { name: "コーディング", unit: "ページ", qty: 8, price: 25000 }, { name: "WordPress構築", unit: "式", qty: 1, price: 80000 }, { name: "ギャラリー機能", unit: "式", qty: 1, price: 30000 }, { name: "予約システム", unit: "式", qty: 1, price: 35000 }, { name: "テスト", unit: "式", qty: 1, price: 25000 }], true)], schedule: [{ phase: "ヒアリング", weeks: 1 }, { phase: "デザイン", weeks: 2 }, { phase: "コーディング", weeks: 2 }, { phase: "WordPress", weeks: 1.5 }, { phase: "テスト・納品", weeks: 1 }] },
  { id: "clinic", label: "クリニック", icon: "hospital", desc: "診療案内・予約", siteType: "コーポレートサイト", overview: "安心感を与えるクリニックサイトをご提案します。", purpose: "清潔感あるデザインで診療内容を伝えます。", features: ["お問い合わせフォーム", "SEO対策", "Googleマップ", "SSL対応", "レスポンシブ対応", "CMS導入(WordPress等)", "予約システム"], pages: [{ name: "トップページ", children: [] }, { name: "医院紹介", children: ["院長挨拶"] }, { name: "診療案内", children: ["一般", "専門"] }, { name: "アクセス", children: [] }, { name: "Web予約", children: [] }], plans: [makePlan("スタンダードプラン", [{ name: "ディレクション費", unit: "式", qty: 1, price: 60000 }, { name: "トップページデザイン", unit: "ページ", qty: 1, price: 100000 }, { name: "下層ページデザイン", unit: "ページ", qty: 6, price: 40000 }, { name: "コーディング", unit: "ページ", qty: 8, price: 25000 }, { name: "WordPress構築", unit: "式", qty: 1, price: 80000 }, { name: "予約システム", unit: "式", qty: 1, price: 50000 }, { name: "テスト", unit: "式", qty: 1, price: 30000 }], true)], schedule: [{ phase: "ヒアリング", weeks: 1 }, { phase: "デザイン", weeks: 2.5 }, { phase: "コーディング", weeks: 2 }, { phase: "WordPress", weeks: 1.5 }, { phase: "テスト・納品", weeks: 1 }] },
  { id: "law", label: "士業", icon: "scale", desc: "業務案内・相談フォーム", siteType: "コーポレートサイト", overview: "専門性を伝え相談依頼につなげるサイトをご提案します。", purpose: "実績を整理し相談導線を最適化します。", features: ["お問い合わせフォーム", "SEO対策", "Googleマップ", "SSL対応", "レスポンシブ対応", "CMS導入(WordPress等)"], pages: [{ name: "トップページ", children: [] }, { name: "事務所案内", children: [] }, { name: "業務案内", children: ["分野A", "分野B"] }, { name: "解決事例", children: [] }, { name: "ご相談", children: [] }], plans: [makePlan("スタンダードプラン", [{ name: "ディレクション費", unit: "式", qty: 1, price: 60000 }, { name: "トップページデザイン", unit: "ページ", qty: 1, price: 90000 }, { name: "下層ページデザイン", unit: "ページ", qty: 5, price: 38000 }, { name: "コーディング", unit: "ページ", qty: 7, price: 25000 }, { name: "WordPress構築", unit: "式", qty: 1, price: 80000 }, { name: "テスト", unit: "式", qty: 1, price: 30000 }], true)], schedule: [{ phase: "ヒアリング", weeks: 1 }, { phase: "デザイン", weeks: 2 }, { phase: "コーディング", weeks: 2 }, { phase: "WordPress", weeks: 1.5 }, { phase: "テスト・納品", weeks: 1 }] },
  { id: "construction", label: "建設", icon: "hammer", desc: "施工事例中心", siteType: "コーポレートサイト", overview: "施工実績で信頼を高めるサイトをご提案します。", purpose: "事例ギャラリーで実績をアピールします。", features: ["お問い合わせフォーム", "SEO対策", "Googleマップ", "SSL対応", "レスポンシブ対応", "CMS導入(WordPress等)", "ギャラリー・施工事例"], pages: [{ name: "トップページ", children: [] }, { name: "会社概要", children: [] }, { name: "サービス", children: ["新築", "リフォーム"] }, { name: "施工事例", children: [] }, { name: "お見積もり", children: [] }], plans: [makePlan("スタンダードプラン", [{ name: "ディレクション費", unit: "式", qty: 1, price: 60000 }, { name: "トップページデザイン", unit: "ページ", qty: 1, price: 100000 }, { name: "下層ページデザイン", unit: "ページ", qty: 5, price: 38000 }, { name: "コーディング", unit: "ページ", qty: 7, price: 25000 }, { name: "WordPress構築", unit: "式", qty: 1, price: 80000 }, { name: "ギャラリー", unit: "式", qty: 1, price: 40000 }, { name: "テスト", unit: "式", qty: 1, price: 30000 }], true)], schedule: [{ phase: "ヒアリング", weeks: 1 }, { phase: "デザイン", weeks: 2 }, { phase: "コーディング", weeks: 2 }, { phase: "WordPress", weeks: 1.5 }, { phase: "テスト・納品", weeks: 1 }] },
  { id: "recruit", label: "採用サイト", icon: "users", desc: "社員紹介・応募", siteType: "採用サイト", overview: "応募数の増加を目指す採用サイトをご提案します。", purpose: "企業文化を魅力的に伝えます。", features: ["求人応募フォーム", "SEO対策", "SNS連携", "SSL対応", "レスポンシブ対応", "CMS導入(WordPress等)", "動画埋め込み"], pages: [{ name: "トップページ", children: [] }, { name: "私たちについて", children: [] }, { name: "社員インタビュー", children: [] }, { name: "募集要項", children: [] }, { name: "エントリー", children: [] }], plans: [makePlan("スタンダードプラン", [{ name: "ディレクション費", unit: "式", qty: 1, price: 60000 }, { name: "トップページデザイン", unit: "ページ", qty: 1, price: 100000 }, { name: "下層ページデザイン", unit: "ページ", qty: 5, price: 40000 }, { name: "コーディング", unit: "ページ", qty: 6, price: 25000 }, { name: "WordPress構築", unit: "式", qty: 1, price: 80000 }, { name: "応募フォーム", unit: "式", qty: 1, price: 35000 }, { name: "テスト", unit: "式", qty: 1, price: 30000 }], true)], schedule: [{ phase: "ヒアリング", weeks: 1.5 }, { phase: "デザイン", weeks: 2.5 }, { phase: "コーディング", weeks: 2 }, { phase: "WordPress", weeks: 1.5 }, { phase: "テスト・納品", weeks: 1 }] },
];

const TABS = [
  { id: "basic", label: "基本情報", icon: "clipboard" },
  { id: "pages", label: "ページ構成", icon: "folder" },
  { id: "estimate", label: "見積もり", icon: "coins" },
  { id: "schedule", label: "スケジュール", icon: "calendar" },
  { id: "terms", label: "契約条件", icon: "fileText" },
  { id: "preview", label: "プレビュー", icon: "eye" },
];

const defaultForm = () => ({ clientName: "", projectName: "", siteType: "コーポレートサイト", overview: "", purpose: "", features: ["レスポンシブ対応", "SSL対応"], pages: [{ name: "トップページ", children: [] }], plans: [makePlan("スタンダードプラン", [{ name: "ディレクション費", unit: "式", qty: 1, price: 50000 }], true)], schedule: [{ phase: "ヒアリング", weeks: 1 }, { phase: "デザイン", weeks: 2 }, { phase: "コーディング", weeks: 2 }, { phase: "納品", weeks: 0.5 }], companyName: "", companyUrl: "", companyLogo: "", deliveryDate: "", notes: "", contractTerms: { payment: null, revision: null, copyright: null, delivery: null, extraNotes: [] }, themeId: "green", hidePrices: false, scheduleStart: "" });

// ========== SAVE/LOAD ==========
const SK = "proposal-projects";
async function loadP() { try { const r = await window.storage.get(SK); return r ? JSON.parse(r.value) : []; } catch { return []; } }
async function saveP(p) { try { await window.storage.set(SK, JSON.stringify(p)); } catch {} }

function SavePanel({ form, setForm, theme, onClose }) {
  const [pj, setPj] = useState([]); const [sv, setSv] = useState(false); const [msg, setMsg] = useState(""); const P = theme.primary;
  useEffect(() => { loadP().then(setPj); }, []);
  const doSave = async () => { const n = form.projectName || form.clientName || `案件_${new Date().toLocaleDateString("ja-JP")}`; const p = { id: Date.now().toString(), name: n, data: form, savedAt: new Date().toISOString() }; const u = [p, ...pj].slice(0, 20); setSv(true); await saveP(u); setPj(u); setSv(false); setMsg("保存しました"); setTimeout(() => setMsg(""), 2000); };
  const doDel = async (id) => { const u = pj.filter((x) => x.id !== id); await saveP(u); setPj(u); };
  return (<div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}><div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, maxWidth: 540, width: "100%", maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
    <div style={{ padding: "20px 24px 14px", borderBottom: "2px solid #e8ece9", display: "flex", justifyContent: "space-between", alignItems: "center" }}><h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: P }}>案件の保存・読み込み</h2><button onClick={onClose} style={{ width: 32, height: 32, border: "none", background: "#f0f0f0", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{ri("x", { size: 14, color: "#666" })}</button></div>
    <div style={{ padding: "16px 24px" }}><button onClick={doSave} disabled={sv} style={{ width: "100%", padding: 12, border: "none", borderRadius: 10, background: P, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>{ri("save", { size: 18, color: "#fff" })} {sv ? "保存中..." : "現在の内容を保存"}</button>{msg && <div style={{ textAlign: "center", color: P, fontWeight: 600, fontSize: 13, marginTop: 8 }}>{msg}</div>}</div>
    <div style={{ padding: "0 24px 20px" }}><p style={{ fontSize: 13, fontWeight: 600, color: "#888", marginBottom: 10 }}>保存済み（{pj.length}件）</p>{pj.length === 0 && <p style={{ color: "#bbb", fontSize: 13, textAlign: "center", padding: 20 }}>保存された案件はありません</p>}<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{pj.map((p) => (<div key={p.id} style={{ padding: "12px 14px", border: "1.5px solid #e0e4e2", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontWeight: 600, fontSize: 14, color: "#333" }}>{p.name}</div><div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{new Date(p.savedAt).toLocaleString("ja-JP")}</div></div><div style={{ display: "flex", gap: 6 }}><button onClick={() => { setForm(p.data); onClose(); }} style={{ padding: "5px 10px", border: `1.5px solid ${P}`, borderRadius: 6, background: "transparent", color: P, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>読込</button><button onClick={() => { setForm({ ...p.data, projectName: p.data.projectName + "（コピー）" }); onClose(); }} style={{ padding: "5px 10px", border: "1.5px solid #888", borderRadius: 6, background: "transparent", color: "#888", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>複製</button><button onClick={() => doDel(p.id)} style={{ padding: "5px 10px", border: "1.5px solid #c33", borderRadius: 6, background: "transparent", color: "#c33", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>削除</button></div></div>))}</div></div>
  </div></div>);
}

function TplSelector({ onSelect, onClose, theme }) {
  const [sel, setSel] = useState(null); const P = theme.primary;
  return (<div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}><div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, maxWidth: 700, width: "100%", maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
    <div style={{ padding: "20px 24px 14px", borderBottom: "2px solid #e8ece9" }}><h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: P }}>業種テンプレートを選択</h2></div>
    <div style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{TEMPLATES.map((t) => (<button key={t.id} onClick={() => setSel(t.id)} style={{ padding: 14, border: sel === t.id ? `2.5px solid ${P}` : "1.5px solid #ddd", borderRadius: 12, background: sel === t.id ? theme.bg : "#fff", cursor: "pointer", textAlign: "left", display: "flex", gap: 12, alignItems: "center" }}><div style={{ width: 40, height: 40, borderRadius: 10, background: sel === t.id ? P : "#f0f4f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{ri(t.icon, { size: 20, color: sel === t.id ? "#fff" : P })}</div><div><div style={{ fontWeight: 700, fontSize: 14, color: sel === t.id ? P : "#333" }}>{t.label}</div><div style={{ fontSize: 12, color: "#888" }}>{t.desc}</div></div></button>))}</div>
    <div style={{ padding: "14px 24px 20px", display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid #eee" }}><button onClick={onClose} style={{ padding: "10px 24px", border: "1.5px solid #ccc", borderRadius: 8, background: "#fff", color: "#666", fontSize: 14, cursor: "pointer" }}>キャンセル</button><button onClick={() => { if (sel) { onSelect(sel); onClose(); } }} disabled={!sel} style={{ padding: "10px 28px", border: "none", borderRadius: 8, fontSize: 14, cursor: sel ? "pointer" : "not-allowed", fontWeight: 700, background: sel ? P : "#ccc", color: "#fff" }}>作成</button></div>
  </div></div>);
}

function PresetDrawer({ onAdd, onClose, theme }) {
  const [oc, setOc] = useState(EP[0].category); const [added, setAdded] = useState(new Set()); const P = theme.primary;
  const add = (item) => { onAdd({ ...item }); setAdded((p) => new Set(p).add(item.name)); setTimeout(() => setAdded((p) => { const n = new Set(p); n.delete(item.name); return n; }), 1200); };
  return (<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", justifyContent: "flex-end" }}><div onClick={onClose} style={{ flex: 1 }} /><div style={{ width: 420, background: "#fff", boxShadow: "-8px 0 30px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ padding: "18px 20px 14px", borderBottom: "2px solid #e8ece9", display: "flex", justifyContent: "space-between", alignItems: "center" }}><h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: P }}>項目プリセット</h2><button onClick={onClose} style={{ width: 30, height: 30, border: "none", background: "#f0f0f0", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{ri("x", { size: 14, color: "#666" })}</button></div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, padding: "10px 18px", borderBottom: "1px solid #eee", background: "#fafbfa" }}>{EP.map((c) => (<button key={c.category} onClick={() => setOc(c.category)} style={{ padding: "4px 10px", borderRadius: 14, border: "1.5px solid", borderColor: oc === c.category ? P : "#ddd", background: oc === c.category ? theme.light : "#fff", color: oc === c.category ? P : "#666", fontSize: 11, cursor: "pointer", fontWeight: oc === c.category ? 700 : 400, display: "flex", alignItems: "center", gap: 4 }}>{ri(c.icon, { size: 13, color: oc === c.category ? P : "#999" })} {c.category}</button>))}</div>
    <div style={{ flex: 1, overflowY: "auto", padding: "10px 18px" }}>{EP.filter((c) => c.category === oc).map((c) => (<div key={c.category} style={{ display: "flex", flexDirection: "column", gap: 7 }}>{c.items.map((item, i) => { const isA = added.has(item.name); return (<button key={i} onClick={() => add(item)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", border: isA ? `1.5px solid ${P}` : "1.5px solid #e0e4e2", borderRadius: 9, background: isA ? theme.light : "#fff", cursor: "pointer", textAlign: "left" }}><div><div style={{ fontWeight: 600, fontSize: 13, color: "#333" }}>{item.name}</div><div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{item.qty}{item.unit} × ¥{fp(item.price)} = <strong style={{ color: P }}>¥{fp(item.qty * item.price)}</strong></div></div><span style={{ fontSize: 11, fontWeight: 700, color: isA ? P : "#aaa", display: "flex", alignItems: "center", gap: 3 }}>{isA ? <>{ri("check", { size: 13, color: P })} 済</> : <>{ri("plus", { size: 13, color: "#aaa" })} 追加</>}</span></button>); })}</div>))}</div>
  </div></div>);
}

// ========== PLAN HELPERS ==========
function calcPlan(plan) {
  const sub = plan.items.reduce((s, it) => s + it.qty * it.price, 0);
  const d = plan.discount || { type: "none", value: 0 };
  const disc = d.type === "percent" ? Math.floor(sub * (d.value / 100)) : d.type === "fixed" ? d.value : 0;
  const after = sub - disc;
  return { sub, disc, tax: Math.floor(after * 0.1), total: after + Math.floor(after * 0.1) };
}

// ========== TABS ==========
function BasicInfoTab({ form, sf, onOpenTpl, theme }) {
  const u = (k, v) => sf((f) => ({ ...f, [k]: v })); const P = theme.primary;
  const tf = (f) => sf((prev) => ({ ...prev, features: prev.features.includes(f) ? prev.features.filter((x) => x !== f) : [...prev.features, f] }));
  return (<div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <button onClick={onOpenTpl} style={{ padding: "11px 18px", border: `2px dashed ${P}`, borderRadius: 10, background: theme.bg, color: P, fontSize: 14, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>{ri("tag", { size: 18, color: P })} 業種テンプレート</button>
    <div><label style={ls}>テーマカラー</label><div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>{THEMES.map((t) => (<button key={t.id} onClick={() => u("themeId", t.id)} style={{ width: 30, height: 30, borderRadius: "50%", background: t.primary, border: form.themeId === t.id ? "3px solid #333" : "3px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transform: form.themeId === t.id ? "scale(1.15)" : "scale(1)", transition: "transform .1s" }} title={t.label}>{form.themeId === t.id && ri("check", { size: 11, color: "#fff" })}</button>))}</div></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}><Fld label="クライアント名" value={form.clientName} onChange={(v) => u("clientName", v)} placeholder="株式会社〇〇" /><Fld label="案件名" value={form.projectName} onChange={(v) => u("projectName", v)} placeholder="サイトリニューアル" /></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}><div><label style={ls}>サイト種別</label><select value={form.siteType} onChange={(e) => u("siteType", e.target.value)} style={is}>{SITE_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div><Fld label="納品希望日" value={form.deliveryDate} onChange={(v) => u("deliveryDate", v)} placeholder="2026年6月末" /></div>
    <div><label style={ls}>案件概要</label><textarea value={form.overview} onChange={(e) => u("overview", e.target.value)} style={{ ...is, minHeight: 65, resize: "vertical" }} placeholder="目的・課題など..." /></div>
    <div><label style={ls}>制作方針</label><textarea value={form.purpose} onChange={(e) => u("purpose", e.target.value)} style={{ ...is, minHeight: 45, resize: "vertical" }} placeholder="方向性..." /></div>
    <div><label style={ls}>実装機能</label><div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>{FEATURES_ALL.map((f) => (<button key={f} onClick={() => tf(f)} style={{ padding: "5px 12px", borderRadius: 18, border: "1.5px solid", borderColor: form.features.includes(f) ? P : "#ccc", background: form.features.includes(f) ? theme.light : "#fff", color: form.features.includes(f) ? P : "#666", fontSize: 12, cursor: "pointer", fontWeight: form.features.includes(f) ? 600 : 400, display: "flex", alignItems: "center", gap: 3 }}>{form.features.includes(f) && ri("check", { size: 12, color: P })}{f}</button>))}</div></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}><Fld label="自社名" value={form.companyName} onChange={(v) => u("companyName", v)} placeholder="制作会社名" /><Fld label="自社URL" value={form.companyUrl} onChange={(v) => u("companyUrl", v)} placeholder="https://..." /></div>
    <div><label style={ls}>自社ロゴ</label><div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
      {form.companyLogo ? (<div style={{ position: "relative" }}><img src={form.companyLogo} alt="logo" style={{ maxHeight: 48, maxWidth: 160, objectFit: "contain", borderRadius: 6, border: "1px solid #e0e4e2", padding: 4, background: "#fff" }} /><button onClick={() => u("companyLogo", "")} style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", border: "none", background: "#c33", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>×</button></div>) : (
        <label style={{ padding: "8px 16px", border: `2px dashed ${P}`, borderRadius: 8, background: theme.bg, color: P, fontSize: 13, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>{ri("file", { size: 15, color: P })} ロゴ画像を選択<input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = (ev) => u("companyLogo", ev.target.result); r.readAsDataURL(f); } }} /></label>
      )}<span style={{ fontSize: 11, color: "#999" }}>表紙・フッターに表示されます</span>
    </div></div>
    <div><label style={ls}>備考</label><textarea value={form.notes} onChange={(e) => u("notes", e.target.value)} style={{ ...is, minHeight: 40, resize: "vertical" }} /></div>
  </div>);
}

function PagesTab({ form, sf, theme }) {
  const pages = form.pages; const sp = (p) => sf((f) => ({ ...f, pages: p })); const P = theme.primary;
  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}><p style={{ color: "#666", fontSize: 14, margin: 0 }}>ページ名を入力するとサイトマップが自動生成されます。</p>{pages.map((pg, i) => (<div key={i} style={{ background: "#f8faf9", borderRadius: 10, padding: 12, border: "1px solid #e0e8e4" }}><div style={{ display: "flex", gap: 7, alignItems: "center" }}><span style={{ color: P, fontWeight: 700, fontSize: 14, minWidth: 18 }}>{i + 1}.</span><input value={pg.name} onChange={(e) => sp(pages.map((p, idx) => idx === i ? { ...p, name: e.target.value } : p))} style={{ ...is, flex: 1 }} placeholder="ページ名" /><button onClick={() => sp(pages.map((p, idx) => idx === i ? { ...p, children: [...p.children, ""] } : p))} style={{ ...sBtn(P), display: "flex", alignItems: "center", gap: 2 }}>{ri("plus", { size: 12, color: P })}子</button><button onClick={() => sp(pages.filter((_, idx) => idx !== i))} style={{ ...sBtn("#c33"), display: "flex", alignItems: "center" }}>{ri("x", { size: 12, color: "#c33" })}</button></div>{pg.children.map((c, ci) => (<div key={ci} style={{ display: "flex", gap: 7, alignItems: "center", marginTop: 7, marginLeft: 28 }}><span style={{ color: "#bbb" }}>└</span><input value={c} onChange={(e) => sp(pages.map((p, idx) => idx === i ? { ...p, children: p.children.map((x, j) => j === ci ? e.target.value : x) } : p))} style={{ ...is, flex: 1, fontSize: 13 }} placeholder="子ページ" /><button onClick={() => sp(pages.map((p, idx) => idx === i ? { ...p, children: p.children.filter((_, j) => j !== ci) } : p))} style={{ ...sBtn("#c33"), padding: "2px 7px" }}>{ri("x", { size: 11, color: "#c33" })}</button></div>))}</div>))}<button onClick={() => sp([...pages, { name: "", children: [] }])} style={{ ...pBtn(P), alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 5 }}>{ri("plus", { size: 14, color: "#fff" })} ページ追加</button></div>);
}

// ========== ESTIMATE TAB (MULTI-PLAN) ==========
function EstimateTab({ form, sf, theme }) {
  const [showP, setShowP] = useState(false);
  const [activePlan, setActivePlan] = useState(0);
  const plans = form.plans || [makePlan()];
  const P = theme.primary;
  const setPlans = (p) => sf((f) => ({ ...f, plans: p }));
  const plan = plans[activePlan] || plans[0];
  const setPlan = (updated) => setPlans(plans.map((p, i) => i === activePlan ? updated : p));
  const items = plan.items;
  const setItems = (it) => setPlan({ ...plan, items: it });
  const ui = (i, k, v) => setItems(items.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const disc = plan.discount || { type: "none", value: 0, label: "" };
  const ud = (k, v) => setPlan({ ...plan, discount: { ...disc, [k]: v } });
  const { sub, disc: discAmt, tax } = calcPlan(plan);

  const addPlan = () => { const n = [...plans, makePlan(`プラン${plans.length + 1}`)]; setPlans(n); setActivePlan(n.length - 1); };
  const removePlan = (i) => { if (plans.length <= 1) return; const n = plans.filter((_, idx) => idx !== i); setPlans(n); setActivePlan(Math.min(activePlan, n.length - 1)); };
  const duplicatePlan = (i) => { const n = [...plans]; n.splice(i + 1, 0, { ...JSON.parse(JSON.stringify(plans[i])), name: plans[i].name + "（コピー）", recommended: false }); setPlans(n); setActivePlan(i + 1); };
  const toggleRec = () => setPlan({ ...plan, recommended: !plan.recommended });

  return (<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {showP && <PresetDrawer onAdd={(item) => setItems([...items, item])} onClose={() => setShowP(false)} theme={theme} />}
    {/* Plan Tabs */}
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      {plans.map((p, i) => (<button key={i} onClick={() => setActivePlan(i)} style={{ padding: "7px 14px", borderRadius: 8, border: i === activePlan ? `2px solid ${P}` : "1.5px solid #ddd", background: i === activePlan ? theme.light : "#fff", color: i === activePlan ? P : "#666", fontSize: 13, fontWeight: i === activePlan ? 700 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
        {p.recommended && ri("star", { size: 13, color: i === activePlan ? P : "#ccc" })}
        {p.name || `プラン${i + 1}`}
      </button>))}
      <button onClick={addPlan} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px dashed #bbb", background: "#fafafa", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{ri("plus", { size: 15, color: "#999" })}</button>
    </div>
    {/* Plan header */}
    <div style={{ display: "flex", gap: 8, alignItems: "center", background: "#f8f9fa", borderRadius: 10, padding: "10px 14px" }}>
      <input value={plan.name} onChange={(e) => setPlan({ ...plan, name: e.target.value })} style={{ ...is, flex: 1, fontWeight: 700, fontSize: 15 }} placeholder="プラン名" />
      <button onClick={toggleRec} style={{ padding: "5px 10px", borderRadius: 6, border: plan.recommended ? `1.5px solid ${P}` : "1.5px solid #ccc", background: plan.recommended ? theme.light : "#fff", color: plan.recommended ? P : "#999", fontSize: 11, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>{ri("star", { size: 13, color: plan.recommended ? P : "#ccc" })} おすすめ</button>
      <button onClick={() => duplicatePlan(activePlan)} style={{ ...sBtn(P), display: "flex", alignItems: "center", gap: 3, whiteSpace: "nowrap" }}>{ri("copy", { size: 13, color: P })} 複製</button>
      {plans.length > 1 && <button onClick={() => removePlan(activePlan)} style={{ ...sBtn("#c33"), display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>{ri("x", { size: 13, color: "#c33" })} 削除</button>}
    </div>
    <button onClick={() => setShowP(true)} style={{ padding: "9px 18px", border: `2px dashed ${P}`, borderRadius: 10, background: theme.bg, color: P, fontSize: 13, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>{ri("package", { size: 16, color: P })} プリセットから追加</button>
    <div style={{ display: "grid", gridTemplateColumns: "2fr 65px 55px 95px 32px", gap: 7, fontWeight: 600, fontSize: 12, color: "#555", padding: "0 4px" }}><span>項目名</span><span>単位</span><span>数量</span><span>単価</span><span></span></div>
    {items.map((item, i) => (<div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 65px 55px 95px 32px", gap: 7, alignItems: "center" }}><input value={item.name} onChange={(e) => ui(i, "name", e.target.value)} style={is} placeholder="項目名" /><select value={item.unit} onChange={(e) => ui(i, "unit", e.target.value)} style={is}>{["式", "ページ", "点", "時間", "月"].map((u) => <option key={u}>{u}</option>)}</select><input type="number" min={0} value={item.qty} onChange={(e) => ui(i, "qty", Number(e.target.value))} style={{ ...is, textAlign: "center" }} /><input type="number" min={0} step={1000} value={item.price} onChange={(e) => ui(i, "price", Number(e.target.value))} style={{ ...is, textAlign: "right" }} /><button onClick={() => setItems(items.filter((_, idx) => idx !== i))} style={{ ...sBtn("#c33"), display: "flex", alignItems: "center", justifyContent: "center" }}>{ri("x", { size: 12, color: "#c33" })}</button></div>))}
    <button onClick={() => setItems([...items, { name: "", unit: "式", qty: 1, price: 0 }])} style={{ ...pBtn(P), alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>{ri("plus", { size: 14, color: "#fff" })} 手動追加</button>
    <div style={{ background: "#f8f9fa", borderRadius: 10, padding: 12, border: "1px solid #e0e4e2" }}>
      <label style={{ ...ls, display: "flex", alignItems: "center", gap: 5, marginBottom: 7 }}>{ri("percent", { size: 15, color: P })} 割引・値引き</label>
      <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
        <select value={disc.type} onChange={(e) => ud("type", e.target.value)} style={{ ...is, width: 120 }}><option value="none">なし</option><option value="percent">％割引</option><option value="fixed">金額値引き</option></select>
        {disc.type !== "none" && (<><input type="number" min={0} value={disc.value} onChange={(e) => ud("value", Number(e.target.value))} style={{ ...is, width: 80, textAlign: "right" }} /><span style={{ fontSize: 12, color: "#666" }}>{disc.type === "percent" ? "%" : "円"}</span><input value={disc.label} onChange={(e) => ud("label", e.target.value)} style={{ ...is, flex: 1, minWidth: 100 }} placeholder="割引名" /></>)}
      </div>
    </div>
    <div style={{ borderTop: `2px solid ${P}`, marginTop: 4, paddingTop: 10, display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
      <div style={{ fontSize: 13, color: "#555" }}>小計: <strong>¥{fp(sub)}</strong></div>
      {discAmt > 0 && <div style={{ fontSize: 13, color: "#c33" }}>{disc.label || "割引"}: <strong>-¥{fp(discAmt)}</strong></div>}
      <div style={{ fontSize: 13, color: "#555" }}>消費税: <strong>¥{fp(tax)}</strong></div>
      <div style={{ fontSize: 19, color: P, fontWeight: 800 }}>合計: ¥{fp(sub - discAmt + tax)}</div>
    </div>
  </div>);
}

function fmtDate(d) { return `${d.getMonth() + 1}/${d.getDate()}`; }
function fmtDateFull(d) { return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`; }
function addDaysToDate(d, days) { const r = new Date(d); r.setDate(r.getDate() + days); return r; }
function itemDays(it) { return (it.weeks || 0) * 7 + (it.extraDays || 0); }
function fmtDur(it) { const w = it.weeks || 0; const d = it.extraDays || 0; if (w > 0 && d > 0) return `${w}週${d}日`; if (w > 0) return `${w}週間`; if (d > 0) return `${d}日`; return "—"; }
function totalDays(items) { return items.reduce((s, it) => s + itemDays(it), 0); }
function totalWeeksLabel(items) { const d = totalDays(items); const w = Math.floor(d / 7); const r = d % 7; if (w > 0 && r > 0) return `${w}週${r}日`; if (w > 0) return `約${w}週間`; return `${d}日`; }

function ScheduleTab({ form, sf, theme }) {
  const items = form.schedule; const P = theme.primary; const cl = shades(P);
  const si = (it) => sf((f) => ({ ...f, schedule: it }));
  const ui = (i, k, v) => si(items.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const td = totalDays(items);
  const hasStart = !!form.scheduleStart;
  const startD = hasStart ? new Date(form.scheduleStart) : null;

  return (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <div><label style={ls}>制作開始日（任意）</label><div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 3 }}><input type="date" value={form.scheduleStart || ""} onChange={(e) => sf((f) => ({ ...f, scheduleStart: e.target.value }))} style={{ ...is, width: 180 }} />{hasStart && <button onClick={() => sf((f) => ({ ...f, scheduleStart: "" }))} style={{ ...sBtn("#c33"), display: "flex", alignItems: "center", gap: 3, fontSize: 11 }}>{ri("x", { size: 12, color: "#c33" })} クリア</button>}<span style={{ fontSize: 11, color: "#999" }}>日付入力でガントチャートに反映</span></div></div>
    {items.map((item, i) => {
      let dateLabel = "";
      if (hasStart) { let o = 0; for (let j = 0; j < i; j++) o += itemDays(items[j]); const from = addDaysToDate(startD, o); const to = addDaysToDate(startD, o + itemDays(item)); dateLabel = `${fmtDate(from)}〜${fmtDate(to)}`; }
      return (<div key={i} style={{ background: "#f8faf9", borderRadius: 9, padding: "10px 12px", border: "1px solid #e8ece9" }}>
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          <input value={item.phase} onChange={(e) => ui(i, "phase", e.target.value)} style={{ ...is, flex: 1 }} placeholder="フェーズ名" />
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <input type="number" min={0} step={1} value={item.weeks || 0} onChange={(e) => ui(i, "weeks", Number(e.target.value))} style={{ ...is, textAlign: "center", width: 42 }} />
            <span style={{ fontSize: 11, color: "#666", minWidth: 14 }}>週</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <input type="number" min={0} max={6} step={1} value={item.extraDays || 0} onChange={(e) => ui(i, "extraDays", Math.min(6, Math.max(0, Number(e.target.value))))} style={{ ...is, textAlign: "center", width: 42 }} />
            <span style={{ fontSize: 11, color: "#666", minWidth: 14 }}>日</span>
          </div>
          <button onClick={() => si(items.filter((_, idx) => idx !== i))} style={{ ...sBtn("#c33"), display: "flex", alignItems: "center", justifyContent: "center" }}>{ri("x", { size: 12, color: "#c33" })}</button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, paddingLeft: 4 }}>
          <span style={{ fontSize: 10, color: "#999" }}>{fmtDur(item)}（{itemDays(item)}日間）</span>
          {dateLabel && <span style={{ fontSize: 10, color: P, fontWeight: 500 }}>{dateLabel}</span>}
        </div>
      </div>);
    })}
    <button onClick={() => si([...items, { phase: "", weeks: 1, extraDays: 0 }])} style={{ ...pBtn(P), alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 5 }}>{ri("plus", { size: 14, color: "#fff" })} フェーズ追加</button>
    <div style={{ marginTop: 6 }}>
      <p style={{ fontWeight: 600, fontSize: 13, color: "#555", marginBottom: 6 }}>ガントチャート（{totalWeeksLabel(items)}{hasStart ? ` ・ ${fmtDateFull(startD)}〜${fmtDateFull(addDaysToDate(startD, td))}` : ""}）</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {(() => { let o = 0; return items.map((item, i) => { const d = itemDays(item); const p = td > 0 ? (d / td) * 100 : 0; const l = td > 0 ? (o / td) * 100 : 0; const fromD = hasStart ? addDaysToDate(startD, o) : null; const toD = hasStart ? addDaysToDate(startD, o + d) : null; o += d; return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 7, height: 26 }}><span style={{ fontSize: 11, color: "#555", minWidth: 120, textAlign: "right" }}>{item.phase || "—"}</span><div style={{ flex: 1, position: "relative", height: 19, background: "#f0f4f2", borderRadius: 4 }}><div style={{ position: "absolute", left: `${l}%`, width: `${p}%`, height: "100%", background: cl[i % cl.length], borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: hasStart ? 9 : 10, color: "#fff", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden" }}>{hasStart ? `${fmtDate(fromD)}–${fmtDate(toD)}` : fmtDur(item)}</div></div></div>); }); })()}
      </div>
    </div>
  </div>);
}

function TermsTab({ form, sf, theme }) {
  const terms = form.contractTerms; const P = theme.primary;
  const st = (t) => sf((f) => ({ ...f, contractTerms: t }));
  const sp = (cat, item) => st({ ...terms, [cat]: terms[cat] === item.id ? null : item.id });
  const tn = (id) => { const n = terms.extraNotes || []; st({ ...terms, extraNotes: n.includes(id) ? n.filter((x) => x !== id) : [...n, id] }); };
  const rc = (title, cat, presets, icon) => (<div style={{ marginBottom: 18 }}><label style={{ ...ls, fontSize: 13, marginBottom: 7, display: "flex", alignItems: "center", gap: 5 }}>{ri(icon, { size: 15, color: P })} {title}</label><div style={{ display: "flex", flexDirection: "column", gap: 7 }}>{presets.map((item) => (<button key={item.id} onClick={() => sp(cat, item)} style={{ padding: "10px 14px", border: terms[cat] === item.id ? `2px solid ${P}` : "1.5px solid #e0e4e2", borderRadius: 9, background: terms[cat] === item.id ? theme.bg : "#fff", cursor: "pointer", textAlign: "left" }}><div style={{ display: "flex", alignItems: "center", gap: 7 }}><div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${terms[cat] === item.id ? P : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: terms[cat] === item.id ? P : "#fff" }}>{terms[cat] === item.id && ri("check", { size: 10, color: "#fff" })}</div><div><div style={{ fontWeight: 600, fontSize: 13 }}>{item.label}</div><div style={{ fontSize: 11, color: "#777", marginTop: 2, lineHeight: 1.5 }}>{item.text}</div></div></div></button>))}</div></div>);
  return (<div style={{ display: "flex", flexDirection: "column", gap: 6 }}><p style={{ color: "#666", fontSize: 13, margin: "0 0 6px" }}>選択した条件がプレビューに反映されます。</p>{rc("お支払い条件", "payment", CONTRACT_PRESETS.payment, "coins")}{rc("修正回数", "revision", CONTRACT_PRESETS.revision, "wrench")}{rc("著作権", "copyright", CONTRACT_PRESETS.copyright, "shield")}{rc("納品形式", "delivery", CONTRACT_PRESETS.delivery, "file")}<div style={{ marginBottom: 18 }}><label style={{ ...ls, fontSize: 13, marginBottom: 7, display: "flex", alignItems: "center", gap: 5 }}>{ri("fileText", { size: 15, color: P })} その他（複数選択可）</label><div style={{ display: "flex", flexDirection: "column", gap: 7 }}>{CONTRACT_PRESETS.notes.map((item) => { const a = (terms.extraNotes || []).includes(item.id); return (<button key={item.id} onClick={() => tn(item.id)} style={{ padding: "10px 14px", border: a ? `2px solid ${P}` : "1.5px solid #e0e4e2", borderRadius: 9, background: a ? theme.bg : "#fff", cursor: "pointer", textAlign: "left" }}><div style={{ display: "flex", alignItems: "center", gap: 7 }}><div style={{ width: 18, height: 18, borderRadius: 3, border: `2px solid ${a ? P : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: a ? P : "#fff" }}>{a && ri("check", { size: 10, color: "#fff" })}</div><div><div style={{ fontWeight: 600, fontSize: 13 }}>{item.label}</div><div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{item.text}</div></div></div></button>); })}</div></div></div>);
}

// ========== PREVIEW ==========
function Preview({ form, theme }) {
  const P = theme.primary; const D = theme.dark; const L = theme.light; const cl = shades(P);
  const hp = form.hidePrices;
  const plans = form.plans || []; const td = totalDays(form.schedule); const twLabel = totalWeeksLabel(form.schedule);
  const today = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  const terms = form.contractTerms; const gp = (cat) => CONTRACT_PRESETS[cat]?.find((p) => p.id === terms[cat]);
  const aN = (terms.extraNotes || []).map((id) => CONTRACT_PRESETS.notes.find((n) => n.id === id)).filter(Boolean);
  const hasT = terms.payment || terms.revision || terms.copyright || terms.delivery || aN.length > 0;

  return (
    <div id="proposal-preview" style={{ background: "#fff", color: "#222", fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif", fontSize: 13, lineHeight: 1.8 }}>
      <div style={{ minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: `linear-gradient(135deg, ${P} 0%, ${D} 100%)`, color: "#fff", padding: 36, textAlign: "center", borderRadius: "8px 8px 0 0" }}>
        <div style={{ fontSize: 10, letterSpacing: 6, textTransform: "uppercase", opacity: 0.6, marginBottom: 12 }}>Web Site Proposal</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>{form.projectName || "Webサイト制作のご提案"}</h1>
        <div style={{ fontSize: 13, opacity: 0.85 }}>{form.clientName ? `${form.clientName} 様` : ""}</div>
        <div style={{ marginTop: 16, fontSize: 11, opacity: 0.5 }}>{today}</div>
        {form.companyLogo && <img src={form.companyLogo} alt="" style={{ maxHeight: 40, maxWidth: 140, objectFit: "contain", marginTop: 12, opacity: 0.9 }} />}
        {form.companyName && <div style={{ marginTop: form.companyLogo ? 4 : 4, fontSize: 12, opacity: 0.65 }}>{form.companyName}</div>}
      </div>
      <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 24 }}>
        {(form.overview || form.purpose) && <Sec t="提案概要" c={P}>{form.overview && <p style={{ margin: "0 0 6px", color: "#444" }}>{form.overview}</p>}{form.purpose && <div style={{ marginTop: 6 }}><strong style={{ color: P }}>制作方針</strong><p style={{ margin: "3px 0 0", color: "#444" }}>{form.purpose}</p></div>}</Sec>}
        <Sec t="制作概要" c={P}><div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "5px 14px", fontSize: 12 }}><IR l="サイト種別" v={form.siteType} /><IR l="総ページ数" v={`${form.pages.reduce((s, p) => s + 1 + p.children.length, 0)}ページ`} />{form.deliveryDate && <IR l="納品希望日" v={form.deliveryDate} />}<IR l="制作期間" v={twLabel} /></div></Sec>
        {form.schedule.length > 1 && (() => { const hs = !!form.scheduleStart; const sd = hs ? new Date(form.scheduleStart) : null; let dOff = 0; return <Sec t="制作フロー" c={P}><div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", padding: "6px 0" }}>{form.schedule.map((s, i) => { const fd = hs ? addDaysToDate(sd, dOff) : null; dOff += itemDays(s); return (<div key={i} style={{ display: "flex", alignItems: "center" }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><div style={{ width: 40, height: 40, borderRadius: "50%", background: cl[i % cl.length], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 800 }}>{i + 1}</div><div style={{ fontSize: 9, fontWeight: 600, color: "#444", textAlign: "center", maxWidth: 65, lineHeight: 1.3 }}>{s.phase}</div><div style={{ fontSize: 8, color: "#999" }}>{hs ? `${fmtDate(fd)}〜` : fmtDur(s)}</div></div>{i < form.schedule.length - 1 && <div style={{ margin: "0 3px", marginBottom: 24 }}><svg width="18" height="9" viewBox="0 0 18 9"><path d="M0 4.5h14m-3-3l3 3-3 3" stroke={P} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}</div>); })}</div></Sec>; })()}
        {form.features.length > 0 && <Sec t="実装機能" c={P}><div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{form.features.map((f) => <span key={f} style={{ padding: "3px 10px", background: L, color: P, borderRadius: 14, fontSize: 11, fontWeight: 500 }}>✓ {f}</span>)}</div></Sec>}
        {form.pages.length > 0 && <Sec t="サイトマップ" c={P}><div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><div style={{ background: P, color: "#fff", padding: "6px 18px", borderRadius: 7, fontWeight: 700, fontSize: 12 }}>{form.clientName || "サイト"} TOP</div><div style={{ width: 2, height: 10, background: P }} /><div style={{ display: "flex", gap: 0, justifyContent: "center", flexWrap: "wrap", position: "relative" }}><div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: P }} />{form.pages.map((pg, i) => (<div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 75, padding: "0 4px" }}><div style={{ width: 2, height: 10, background: P }} /><div style={{ background: theme.bg, border: `2px solid ${P}`, padding: "3px 9px", borderRadius: 5, fontSize: 10, fontWeight: 600, color: P, whiteSpace: "nowrap" }}>{pg.name || "—"}</div>{pg.children.map((c, ci) => (<div key={ci} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><div style={{ width: 2, height: 6, background: `${P}66` }} /><div style={{ background: "#fff", border: `1.5px solid ${P}66`, padding: "2px 7px", borderRadius: 4, fontSize: 9, color: P, whiteSpace: "nowrap" }}>{c || "—"}</div></div>))}</div>))}</div></div></Sec>}

        {/* ========== MULTI-PLAN ESTIMATE ========== */}
        <Sec t="お見積もり" c={P}>
          {hp ? (
            <div style={{ textAlign: "center", padding: "24px 16px", background: "#f8faf9", borderRadius: 10, border: "1.5px solid #e0e4e2" }}>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>お見積もり金額につきましては、別途ご案内させていただきます。</div>
              <div style={{ fontSize: 11, color: "#999" }}>詳細はお気軽にお問い合わせください。</div>
              {plans.length > 0 && (
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6, textAlign: "left" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 2 }}>含まれる作業項目：</div>
                  {plans.map((plan, pi) => (
                    <div key={pi}>
                      {plans.length > 1 && <div style={{ fontSize: 11, fontWeight: 700, color: P, marginBottom: 3 }}>{plan.recommended && "★ "}{plan.name}</div>}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {plan.items.map((it, i) => <span key={i} style={{ padding: "2px 8px", background: L, color: P, borderRadius: 10, fontSize: 10, fontWeight: 500 }}>{it.name}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : plans.length > 1 ? (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${plans.length}, 1fr)`, gap: 12 }}>
              {plans.map((plan, pi) => {
                const { sub, disc, tax, total } = calcPlan(plan);
                return (
                  <div key={pi} style={{ border: plan.recommended ? `2.5px solid ${P}` : "1.5px solid #ddd", borderRadius: 10, overflow: "hidden", position: "relative" }}>
                    {plan.recommended && <div style={{ background: P, color: "#fff", textAlign: "center", fontSize: 10, fontWeight: 700, padding: "3px 0" }}>おすすめ</div>}
                    <div style={{ padding: 12 }}>
                      <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: P, textAlign: "center" }}>{plan.name}</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {plan.items.map((it, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, borderBottom: "1px solid #f0f0f0", padding: "3px 0" }}><span style={{ color: "#555" }}>{it.name}</span><span style={{ fontWeight: 600 }}>¥{fp(it.qty * it.price)}</span></div>))}
                      </div>
                      <div style={{ borderTop: `2px solid ${P}`, marginTop: 8, paddingTop: 8, textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: "#888" }}>小計: ¥{fp(sub)}</div>
                        {disc > 0 && <div style={{ fontSize: 10, color: "#c33" }}>{plan.discount?.label || "割引"}: -¥{fp(disc)}</div>}
                        <div style={{ fontSize: 10, color: "#888" }}>税込</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: P, marginTop: 2 }}>¥{fp(total)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : plans.length === 1 ? (
            <div>
              {(() => { const plan = plans[0]; const { sub, disc, tax, total } = calcPlan(plan); return (<>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}><thead><tr style={{ background: P, color: "#fff" }}><th style={th}>項目</th><th style={{ ...th, width: 40 }}>単位</th><th style={{ ...th, width: 35 }}>数量</th><th style={{ ...th, width: 70, textAlign: "right" }}>単価</th><th style={{ ...th, width: 80, textAlign: "right" }}>小計</th></tr></thead><tbody>{plan.items.map((it, i) => (<tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8faf9" }}><td style={td}>{it.name || "—"}</td><td style={{ ...td, textAlign: "center" }}>{it.unit}</td><td style={{ ...td, textAlign: "center" }}>{it.qty}</td><td style={{ ...td, textAlign: "right" }}>¥{fp(it.price)}</td><td style={{ ...td, textAlign: "right", fontWeight: 600 }}>¥{fp(it.qty * it.price)}</td></tr>))}</tbody><tfoot><tr><td colSpan={4} style={{ ...td, textAlign: "right", fontWeight: 600 }}>小計</td><td style={{ ...td, textAlign: "right" }}>¥{fp(sub)}</td></tr>{disc > 0 && <tr style={{ color: "#c33" }}><td colSpan={4} style={{ ...td, textAlign: "right", fontWeight: 600 }}>{plan.discount?.label || "割引"}</td><td style={{ ...td, textAlign: "right", fontWeight: 600 }}>-¥{fp(disc)}</td></tr>}<tr><td colSpan={4} style={{ ...td, textAlign: "right" }}>消費税</td><td style={{ ...td, textAlign: "right" }}>¥{fp(tax)}</td></tr><tr style={{ background: L }}><td colSpan={4} style={{ ...td, textAlign: "right", fontWeight: 800, fontSize: 13, color: P }}>合計（税込）</td><td style={{ ...td, textAlign: "right", fontWeight: 800, fontSize: 13, color: P }}>¥{fp(total)}</td></tr></tfoot></table>
              </>); })()}
            </div>
          ) : null}
        </Sec>

        {form.schedule.length > 0 && (() => { const hs = !!form.scheduleStart; const sd = hs ? new Date(form.scheduleStart) : null; return <Sec t="制作スケジュール" c={P}><div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{(() => { let o = 0; return form.schedule.map((item, i) => { const d = itemDays(item); const p = td > 0 ? (d / td) * 100 : 0; const l = td > 0 ? (o / td) * 100 : 0; const fd = hs ? addDaysToDate(sd, o) : null; const td2 = hs ? addDaysToDate(sd, o + d) : null; o += d; return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 7, height: 22 }}><span style={{ fontSize: 10, color: "#555", minWidth: 100, textAlign: "right" }}>{item.phase || "—"}</span><div style={{ flex: 1, position: "relative", height: 15, background: "#f0f4f2", borderRadius: 3 }}><div style={{ position: "absolute", left: `${l}%`, width: `${p}%`, height: "100%", background: cl[i % cl.length], borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden" }}>{hs ? `${fmtDate(fd)}–${fmtDate(td2)}` : fmtDur(item)}</div></div></div>); }); })()}</div><p style={{ textAlign: "right", fontSize: 10, color: "#888", marginTop: 3 }}>{hs ? `${fmtDateFull(sd)}〜${fmtDateFull(addDaysToDate(sd, td))}（${twLabel}）` : twLabel}</p></Sec>; })()}
        {hasT && <Sec t="契約条件" c={P}><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{gp("payment") && <TB l="お支払い条件" t={gp("payment").text} c={P} />}{gp("revision") && <TB l="修正回数" t={gp("revision").text} c={P} />}{gp("copyright") && <TB l="著作権" t={gp("copyright").text} c={P} />}{gp("delivery") && <TB l="納品形式" t={gp("delivery").text} c={P} />}{aN.map((n) => <TB key={n.id} l={n.label} t={n.text} c={P} />)}</div></Sec>}
        {form.notes && <Sec t="備考" c={P}><p style={{ color: "#444", margin: 0, whiteSpace: "pre-wrap" }}>{form.notes}</p></Sec>}
        <div style={{ textAlign: "center", paddingTop: 16, borderTop: "2px solid #e0e8e4", color: "#888", fontSize: 10 }}>{form.companyLogo && <img src={form.companyLogo} alt="" style={{ maxHeight: 30, maxWidth: 120, objectFit: "contain", marginBottom: 6 }} />}{form.companyName && <p style={{ margin: 0, fontWeight: 600, color: "#555" }}>{form.companyName}</p>}{form.companyUrl && <p style={{ margin: "1px 0 0" }}>{form.companyUrl}</p>}<p style={{ margin: "3px 0 0" }}>有効期限: 発行日より30日間</p></div>
      </div>
    </div>
  );
}

function TB({ l, t, c }) { return (<div style={{ padding: "8px 12px", background: "#f8faf9", borderRadius: 7, borderLeft: `3px solid ${c}` }}><div style={{ fontWeight: 700, fontSize: 11, color: c, marginBottom: 2 }}>{l}</div><div style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>{t}</div></div>); }
function Sec({ t, c, children }) { return <div><h2 style={{ fontSize: 14, fontWeight: 800, color: c, margin: "0 0 8px", paddingBottom: 4, borderBottom: `2px solid ${c}`, letterSpacing: 1 }}>{t}</h2>{children}</div>; }
function IR({ l, v }) { return <><span style={{ fontWeight: 600, color: "#555" }}>{l}</span><span style={{ color: "#333" }}>{v}</span></>; }
function Fld({ label, value, onChange, placeholder }) { return <div><label style={ls}>{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} style={is} placeholder={placeholder} /></div>; }

const ls = { display: "block", fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 3 };
const is = { width: "100%", padding: "7px 11px", border: "1.5px solid #d0d8d4", borderRadius: 6, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };
const sBtn = (c) => ({ padding: "3px 9px", border: `1.5px solid ${c}`, borderRadius: 6, background: "transparent", color: c, fontSize: 11, cursor: "pointer", fontWeight: 600 });
const pBtn = (c) => ({ padding: "7px 18px", border: "none", borderRadius: 8, background: c, color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600 });
const th = { padding: "6px 7px", textAlign: "left", fontSize: 10, fontWeight: 600 };
const td = { padding: "5px 7px", borderBottom: "1px solid #e8ece9" };

// ========== MAIN ==========
export default function App() {
  const [form, sf] = useState(defaultForm());
  const [tab, setTab] = useState("basic");
  const [showTpl, setShowTpl] = useState(true);
  const [showSave, setShowSave] = useState(false);
  const theme = THEMES.find((t) => t.id === form.themeId) || THEMES[5];
  const P = theme.primary;

  const applyTpl = (id) => { const t = TEMPLATES.find((x) => x.id === id); if (!t) return; sf((f) => ({ ...f, siteType: t.siteType, overview: t.overview, purpose: t.purpose, features: [...t.features], pages: t.pages.map((p) => ({ ...p, children: [...p.children] })), plans: JSON.parse(JSON.stringify(t.plans)), schedule: t.schedule.map((s) => ({ ...s })) })); };
  const print = () => { const el = document.getElementById("proposal-preview"); if (!el) return; const w = window.open("", "_blank"); w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${form.projectName || "提案書"}</title><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>body{margin:0;padding:20px;font-family:'Noto Sans JP',sans-serif}@media print{body{padding:0}}</style></head><body>${el.outerHTML}</body></html>`); w.document.close(); setTimeout(() => w.print(), 500); };

  return (
    <div style={{ fontFamily: "'Noto Sans JP', 'Hiragino Sans', system-ui, sans-serif", minHeight: "100vh", background: "#f4f7f5" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {showTpl && <TplSelector onSelect={applyTpl} onClose={() => setShowTpl(false)} theme={theme} />}
      {showSave && <SavePanel form={form} setForm={sf} theme={theme} onClose={() => setShowSave(false)} />}
      <div style={{ background: `linear-gradient(135deg, ${P} 0%, ${theme.dark} 100%)`, color: "#fff", padding: "13px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>{ri("file", { size: 18, color: "#fff" })}</div><div><h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>提案書ビルダー</h1><p style={{ margin: "1px 0 0", fontSize: 10, opacity: 0.7 }}>Web制作の提案書をかんたん作成</p></div></div>
        <div style={{ display: "flex", gap: 7 }}>
          <button onClick={() => sf((f) => ({ ...f, hidePrices: !f.hidePrices }))} style={{ padding: "6px 14px", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 7, background: form.hidePrices ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)", color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>{ri(form.hidePrices ? "eyeOff" : "coins", { size: 14, color: "#fff" })} {form.hidePrices ? "金額非表示中" : "金額表示中"}</button>
          <button onClick={() => setShowSave(true)} style={{ padding: "6px 14px", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 7, background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>{ri("save", { size: 14, color: "#fff" })} 保存</button>
          <button onClick={print} style={{ padding: "6px 14px", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 7, background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>{ri("printer", { size: 14, color: "#fff" })} PDF</button>
        </div>
      </div>
      <div style={{ display: "flex", background: "#fff", borderBottom: "2px solid #e0e8e4", padding: "0 10px", overflowX: "auto" }}>
        {TABS.map((t) => (<button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 12px", border: "none", borderBottom: tab === t.id ? `3px solid ${P}` : "3px solid transparent", background: "transparent", color: tab === t.id ? P : "#888", fontSize: 12, fontWeight: tab === t.id ? 700 : 400, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>{ri(t.icon, { size: 15, color: tab === t.id ? P : "#aaa" })} {t.label}</button>))}
      </div>
      {tab === "preview" ? (<div style={{ maxWidth: 800, margin: "20px auto", padding: "0 14px" }}><Preview form={form} theme={theme} /></div>) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", maxWidth: 1400, margin: "0 auto", minHeight: "calc(100vh - 105px)" }}>
          <div style={{ padding: "18px 22px", overflowY: "auto", maxHeight: "calc(100vh - 105px)" }}>
            {tab === "basic" && <BasicInfoTab form={form} sf={sf} onOpenTpl={() => setShowTpl(true)} theme={theme} />}
            {tab === "pages" && <PagesTab form={form} sf={sf} theme={theme} />}
            {tab === "estimate" && <EstimateTab form={form} sf={sf} theme={theme} />}
            {tab === "schedule" && <ScheduleTab form={form} sf={sf} theme={theme} />}
            {tab === "terms" && <TermsTab form={form} sf={sf} theme={theme} />}
          </div>
          <div style={{ borderLeft: "2px solid #e0e8e4", background: "#eef2f0", padding: 14, overflowY: "auto", maxHeight: "calc(100vh - 105px)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "flex", alignItems: "center", gap: 5 }}>{ri("link", { size: 14, color: "#aaa" })} ライブプレビュー</span>
            <div style={{ marginTop: 8, transform: "scale(0.68)", transformOrigin: "top left", width: "147%" }}><Preview form={form} theme={theme} /></div>
          </div>
        </div>
      )}
    </div>
  );
}
