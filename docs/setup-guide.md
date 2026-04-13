# Claude Code セットアップガイド — 提案書ビルダー

## プロジェクトの始め方

### 1. Next.js プロジェクト作成

```bash
npx create-next-app@latest proposal-builder --typescript --tailwind --eslint --app --src-dir
cd proposal-builder
```

### 2. Claude Code で開始

```bash
claude
```

Claude Code に以下のように指示します：

```
このプロジェクトは「Web制作の提案書ビルダー」です。
SPEC.md に仕様書があります。まずこれを読んでください。
proposal-builder.jsx にReactプロトタイプがあります。
これをNext.js + TypeScript + Tailwind CSS に移植してください。
```

### 3. プロジェクトに仕様書とプロトタイプを配置

```
proposal-builder/
├── docs/
│   └── SPEC.md          ← 仕様書をここに
├── prototype/
│   └── proposal-builder.jsx  ← プロトタイプをここに
├── src/
│   └── app/
│       └── ...           ← Next.js のコード
└── ...
```

---

## Claude Code への指示のコツ

### 移植は段階的に

一度に全部移植しようとせず、タブごとに進めるのがおすすめです：

```
Step 1: プロジェクト構造とレイアウト（ヘッダー、タブナビゲーション）
Step 2: 基本情報タブ（テーマカラー、テンプレート選択含む）
Step 3: ページ構成タブ + サイトマップ表示
Step 4: 見積もりタブ（複数プラン、プリセット、割引）
Step 5: スケジュールタブ（日付対応、ガントチャート）
Step 6: 契約条件タブ
Step 7: プレビュー（全セクション統合）
Step 8: 保存/読み込み、PDF出力、金額非表示
```

### 推奨コンポーネント分割

```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── TabNav.tsx
│   ├── tabs/
│   │   ├── BasicInfoTab.tsx
│   │   ├── PagesTab.tsx
│   │   ├── EstimateTab.tsx
│   │   ├── ScheduleTab.tsx
│   │   └── TermsTab.tsx
│   ├── preview/
│   │   ├── ProposalPreview.tsx
│   │   ├── CoverSection.tsx
│   │   ├── SitemapSection.tsx
│   │   ├── FlowDiagram.tsx
│   │   ├── GanttChart.tsx
│   │   └── EstimateSection.tsx
│   ├── modals/
│   │   ├── TemplateSelector.tsx
│   │   ├── PresetDrawer.tsx
│   │   └── SaveLoadPanel.tsx
│   └── ui/
│       ├── Icons.tsx
│       ├── Field.tsx
│       └── Button.tsx
├── lib/
│   ├── types.ts          ← フォームデータの型定義
│   ├── themes.ts         ← テーマカラー定義
│   ├── templates.ts      ← 業種テンプレート
│   ├── presets.ts        ← 見積もりプリセット、契約条件プリセット
│   ├── calculations.ts   ← 金額計算、日付計算
│   └── storage.ts        ← 保存・読み込みロジック
└── hooks/
    └── useProposalForm.ts ← フォーム状態管理
```

### 型定義の例（types.ts）

```typescript
export interface Page {
  name: string;
  children: string[];
}

export interface EstimateItem {
  name: string;
  unit: '式' | 'ページ' | '点' | '時間' | '月';
  qty: number;
  price: number;
}

export interface Discount {
  type: 'none' | 'percent' | 'fixed';
  value: number;
  label: string;
}

export interface Plan {
  name: string;
  recommended: boolean;
  items: EstimateItem[];
  discount: Discount;
}

export interface SchedulePhase {
  phase: string;
  weeks: number;
  extraDays: number;
}

export interface ContractTerms {
  payment: string | null;
  revision: string | null;
  copyright: string | null;
  delivery: string | null;
  extraNotes: string[];
}

export interface ProposalForm {
  clientName: string;
  projectName: string;
  siteType: string;
  overview: string;
  purpose: string;
  features: string[];
  pages: Page[];
  plans: Plan[];
  schedule: SchedulePhase[];
  scheduleStart: string;
  companyName: string;
  companyUrl: string;
  companyLogo: string;
  deliveryDate: string;
  notes: string;
  contractTerms: ContractTerms;
  themeId: string;
  hidePrices: boolean;
}
```

---

## 追加パッケージ（推奨）

```bash
# PDF出力を高品質にする場合
npm install @react-pdf/renderer
# or
npm install html2canvas jspdf

# ドラッグ&ドロップ（今後の実装）
npm install @dnd-kit/core @dnd-kit/sortable

# 状態管理が複雑になった場合
npm install zustand

# アイコン（SVGからLucideに移行する場合）
npm install lucide-react
```

---

## 注意点

- プロトタイプのSVGアイコンはインラインで定義。Next.js移植時は `lucide-react` に置き換えてもOK
- `window.storage` はClaude Artifact専用API。Next.js では `localStorage` または Supabase/Firebase に置き換え
- テーマカラーの `shades()` 関数は CSS変数 + Tailwind のカスタムカラーに移行するとクリーン
- PDF出力は現在ブラウザ印刷に依存。品質を上げるなら `@react-pdf/renderer` でサーバーサイド生成を検討
