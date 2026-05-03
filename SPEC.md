# 提案書ビルダー 仕様書

ブラウザ完結型の Web 制作提案書作成ツール。テンプレート選択 → 項目編集 → 高品質 PDF 出力まで一貫して行える、フリーランス Web 制作者向けのツール。

---

## 1. プロジェクト概要

| 項目 | 内容 |
|---|---|
| プロジェクト名 | 提案書ビルダー (proposal-builder) |
| 目的 | Web 制作の提案書を素早く・体裁よく作成し、PDF 出力する |
| ターゲットユーザー | ココナラ等で受注するフリーランス Web 制作者 |
| 完成度 | 約 95%（販売可能レベル） |
| 作者 | シン｜WEB制作・コーディング (https://coconala.com/users/2033628) |

### 公開 URL

| 環境 | URL |
|---|---|
| Vercel（メイン） | `https://proposal-builder-flame.vercel.app/` |
| GitHub Pages（バックアップ） | `https://shinmori2020.github.io/proposal_builder/` |

### 設計思想

- **完全クライアント完結**: バックエンドなし、データは全て localStorage
- **オフライン動作可**: 初回アクセス後はインターネット接続なしでも動作
- **PDF 品質優先**: 画像化ではなく `@react-pdf/renderer` で本物の PDF テキスト
- **PC 第一**: モバイルは閲覧+軽編集のみで割り切り

---

## 2. 技術スタック

### フレームワーク・言語

| 技術 | バージョン | 用途 |
|---|---|---|
| Next.js | 16.2.3 | フレームワーク（静的エクスポート） |
| React | 19.2.4 | UI ライブラリ |
| TypeScript | ^5 | 型安全 (strict モード) |
| Tailwind CSS | ^4 | スタイリング (`@theme inline`) |

### 主要ライブラリ

| パッケージ | バージョン | 用途 |
|---|---|---|
| `@react-pdf/renderer` | ^4.5.1 | PDF 生成（本物のテキスト PDF） |
| `exceljs` | ^4.4.0 | Excel (.xlsx) 出力（プラン別シート） |
| `qrcode` | ^1.5.4 | QR コード SVG 生成 |
| `lucide-react` | ^1.8.0 | アイコンライブラリ |

### 開発ツール

| ツール | 用途 |
|---|---|
| Turbopack | ビルドツール（Next.js 16 デフォルト） |
| ESLint | 静的解析 |

### 同梱フォント

- Noto Sans JP OTF (Regular / Bold / Black)
- 計約 14MB（PDF 内に埋め込まれるため文字化け一切なし）

---

## 3. アーキテクチャ

### 構成図

```
[ブラウザ]
   ↓
[Next.js 静的サイト (HTML/CSS/JS)]
   ↓
[React コンポーネントツリー]
   ↓
[localStorage] ← 全データ永続化
   ↓
[@react-pdf/renderer] ← クライアント側で PDF 生成
[exceljs] ← クライアント側で Excel 生成
[qrcode] ← クライアント側で QR 生成
```

### データフロー

```
ProposalForm (React state)
  ├── localStorage 自動保存（2秒デバウンス）
  ├── Undo/Redo履歴に記録（600msデバウンス）
  ├── ライブプレビュー（500msデバウンス → PDFViewer）
  └── 各種エクスポート（PDF / CSV / Excel / JSON）
```

### ビルド・デプロイ

| 環境 | ビルド方式 | basePath |
|---|---|---|
| Vercel | `output: 'export'` | 空 |
| GitHub Pages | `output: 'export'` | `/proposal_builder` |
| ローカル開発 | `next dev` (Turbopack) | `/proposal_builder` |

`next.config.ts` で `process.env.VERCEL` を判定し条件分岐。

---

## 4. ディレクトリ構造

```
proposal-builder/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 自動デプロイ
├── public/
│   └── fonts/                  # Noto Sans JP OTF (14MB)
├── src/
│   ├── app/
│   │   ├── globals.css         # Tailwind + テーマトークン + スクロールバー
│   │   ├── icon.svg            # ファビコン
│   │   ├── layout.tsx          # HTML ルート
│   │   └── page.tsx            # メインページ
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNotice.tsx
│   │   │   └── TabNav.tsx
│   │   ├── modals/
│   │   │   ├── PresetDrawer.tsx
│   │   │   ├── RestoreDraftDialog.tsx
│   │   │   ├── SaveLoadPanel.tsx
│   │   │   └── TemplateSelector.tsx
│   │   ├── preview/
│   │   │   ├── PdfLivePreview.tsx  # 二重バッファ点滅防止
│   │   │   └── ... (旧 HTML プレビュー、現在未使用)
│   │   ├── tabs/
│   │   │   ├── BasicInfoTab.tsx
│   │   │   ├── EstimateTab.tsx
│   │   │   ├── PagesTab.tsx
│   │   │   ├── ScheduleTab.tsx
│   │   │   └── TermsTab.tsx
│   │   └── ui/
│   │       └── NumberStepper.tsx
│   ├── hooks/
│   │   ├── useAutoSave.ts          # 2秒デバウンス自動保存
│   │   └── useUndoableForm.ts      # 600msデバウンス Undo/Redo
│   ├── lib/
│   │   ├── calculations.ts         # 見積もり計算
│   │   ├── colors.ts               # CSS変数→JS定数マッピング
│   │   ├── constants.ts            # サイト種別・実装機能・タブ定義
│   │   ├── contracts.ts            # 契約条件プリセット (34項目)
│   │   ├── csvExport.ts            # CSV出力（BOM付き）
│   │   ├── defaults.ts             # ProposalForm 初期値
│   │   ├── excelExport.ts          # Excel出力（プラン別シート）
│   │   ├── formatters.ts           # 日付・金額・URL検証
│   │   ├── jsonTransfer.ts         # JSON 入出力（単一/一括）
│   │   ├── pdfExport.tsx           # PDF ダウンロード（単一/両版）
│   │   ├── presets.ts              # 見積もり項目プリセット
│   │   ├── qrcode.ts               # QR data URL 生成
│   │   ├── schedule.ts             # スケジュール計算ヘルパー
│   │   ├── storage.ts              # localStorage 操作
│   │   ├── templates.ts            # 業種テンプレート定義
│   │   ├── themes.ts               # 18 テーマカラー
│   │   ├── types.ts                # TypeScript 型定義
│   │   └── ui.ts                   # 共通 UI クラス
│   └── pdf/
│       ├── PdfDocument.tsx         # PDF ルート (Document)
│       ├── fonts.ts                # フォント登録
│       ├── pdfColors.ts            # PDF 用色定数
│       ├── pdfStyles.ts            # PDF 共通スタイル
│       └── sections/               # PDF 各セクション
│           ├── CoverPdf.tsx
│           ├── EstimatePdf.tsx
│           ├── FeaturesPdf.tsx
│           ├── FlowPdf.tsx
│           ├── NotesPdf.tsx
│           ├── SchedulePdf.tsx
│           ├── SitemapPdf.tsx
│           └── TermsPdf.tsx
├── next.config.ts
├── package.json
├── SPEC.md                          # 本ドキュメント
└── tsconfig.json
```

---

## 5. データモデル

### `ProposalForm`（メイン状態）

```typescript
interface ProposalForm {
  clientName: string;       // クライアント名
  projectName: string;      // 案件名
  siteType: string;         // サイト種別（コーポレート/LP/EC等）
  overview: string;         // 案件概要
  purpose: string;          // 制作方針
  features: string[];       // 実装機能（複数選択）
  pages: Page[];            // ページ構成
  plans: Plan[];            // 見積もりプラン（1+）
  schedule: SchedulePhase[];// スケジュールフェーズ
  scheduleStart: string;    // 制作開始日 ISO形式 (任意)
  companyName: string;      // 自社名
  companyUrl: string;       // 自社URL（QR遷移先・URL検証あり）
  companyLogo: string;      // 自社ロゴ Base64 DataURL
  deliveryDate: string;     // 納品希望日 ISO形式 (任意)
  notes: string;            // 備考（800文字制限）
  contractTerms: ContractTerms;
  themeId: string;          // 'green' などテーマID
  hidePrices: boolean;      // 金額非表示モード
  taxRate: number;          // 消費税率（10%等）
}
```

### `Plan` / `EstimateItem`

```typescript
interface EstimateItem {
  name: string;
  unit: '式' | 'ページ' | '点' | '時間' | '月';
  qty: number;
  price: number;
}

interface Discount {
  type: 'none' | 'percent' | 'fixed';
  value: number;
  label: string;
}

interface Plan {
  name: string;
  recommended: boolean;     // ★おすすめバッジ表示
  items: EstimateItem[];
  discount: Discount;
}
```

### `SchedulePhase`

```typescript
interface SchedulePhase {
  phase: string;        // フェーズ名（ヒアリング/デザイン等）
  weeks: number;        // 週数
  extraDays: number;    // 追加日数 (0-6)
}
```

### `ContractTerms`

```typescript
interface ContractTerms {
  payment: string | null;     // 'p1'〜'p8' のID
  revision: string | null;    // 'r1'〜'r4'
  copyright: string | null;   // 'c1'〜'c3'
  delivery: string | null;    // 'd1'〜'd5'
  extraNotes: string[];       // 'n1'〜'n14' の複数選択
}
```

### `Page`

```typescript
interface Page {
  name: string;          // 親ページ名（45文字超は省略）
  children: string[];    // 子ページ名配列（40文字超は省略）
}
```

### ストレージ用型

```typescript
interface SavedProject {
  id: string;            // タイムスタンプ ID
  name: string;          // 案件名
  data: ProposalForm;
  savedAt: string;       // ISO 形式
  tags?: string[];       // 分類タグ
}

interface VersionSnapshot {
  id: string;
  data: ProposalForm;
  savedAt: string;
}

interface CustomTemplate {
  id: string;
  name: string;
  createdAt: string;
  data: {
    siteType: string;
    overview: string;
    purpose: string;
    features: string[];
    pages: Page[];
    plans: Plan[];
    schedule: SchedulePhase[];
  };
}
```

---

## 6. UI 構造

### 全体レイアウト

```
┌─────────────────────────────────────┐
│ Header（提案書ビルダー）             │ ← グラデーション背景
├─────────────────────────────────────┤
│ MobileNotice（モバイル時のみ）       │ ← 警告バナー
├─────────────────────────────────────┤
│ TabNav（タブ切替）                   │ ← 6タブ + 横スクロール
├──────────────────┬──────────────────┤
│                  │                  │
│  入力フォーム     │  ライブプレビュー │ ← PC: 2カラム
│  （タブ切替）     │  （PDFViewer）    │   モバイル: 1カラム
│                  │                  │
└──────────────────┴──────────────────┘
```

### Header

PC 版:
```
[📄] 提案書ビルダー         [↶][↷] [👁金額] [💾保存] [🖨PDF]
     Web制作の提案書をかんたん作成
```

モバイル版:
```
[📄] 提案書ビルダー       [👁] [💾] [🖨]
```
- サブタイトル非表示
- Undo/Redo 非表示（PC ショートカット前提）
- ボタンはアイコンのみ

### TabNav

タブ一覧（6つ）:
1. 📋 基本情報
2. 📁 ページ構成
3. 💰 見積もり
4. 📅 スケジュール
5. 📄 契約条件
6. 👁 プレビュー

横スクロール可、モバイルでは padding/font 縮小。

---

## 7. 機能仕様

### 7.1 基本情報タブ

#### フィールド

| フィールド | 型 | バリデーション |
|---|---|---|
| テーマカラー | radio | 18色から選択 |
| クライアント名 | text | なし |
| 案件名 | text | なし |
| サイト種別 | select | 8種類（constants.ts） |
| 納品希望日 | date | フォーマット表示 |
| 消費税率 | NumberStepper (0.5刻み) | 0-30 |
| 案件概要 | textarea | なし |
| 制作方針 | textarea | なし |
| 実装機能 | チェック | 17項目から複数選択 |
| 自社名 | text | なし |
| 自社URL | text | http://〜 警告ピル |
| 自社ロゴ | file (image) | DataURL 化、削除可 |
| 備考 | textarea | **800文字ハード制限** + カウンター + 切り詰めボタン |

#### テーマカラー選択 UI

- 30px の円形ボタン × 18 色
- 選択時: 白2px + テーマ色 4px の二重リング
- scale(1.05) + 白チェックマーク

### 7.2 ページ構成タブ

- ページ追加・削除・並び替え
- 各ページに子ページ追加可
- 上限文字数: ページ名 45文字、子ページ 40文字（超過分はサイトマップで省略）
- 説明文は **HelpCircle のカスタムツールチップ**で即時表示（ブラウザ標準より高速）

### 7.3 見積もりタブ

#### プラン管理
- プランタブで切替（複数プラン対応）
- 「+」で追加、「複製」で複製、「削除」で削除（最低1プラン必須）
- 「★おすすめ」トグルでバッジ付与

#### 項目管理
- 7列グリッド: `32px 2fr 88px 68px 95px 28px 28px`
  - ドラッグハンドル（24px、HelpCircle）
  - 項目名（テキスト）
  - 単位（select、カスタム chevron）
  - 数量（NumberStepper）
  - 単価（カンマ区切り表示）
  - 複製ボタン
  - 削除ボタン
- ドラッグ&ドロップで並び替え（HTML5 D&D、PC のみ）
- 「プリセットから追加」で `PresetDrawer` を開く
- 「手動追加」で空行を末尾追加

#### 割引・値引き
- なし / ％割引 / 金額値引き から選択
- カスタムラベル設定可

#### 合計表示
- 小計 / 割引 / 消費税 / 合計（税込）をリアルタイム計算

### 7.4 スケジュールタブ

- フェーズ追加・削除
- 各フェーズ: フェーズ名 / 週数 / 追加日数
- 制作開始日（任意）入力でガントチャートに日付反映
- ガントチャート: 期間比でバー幅を計算、テーマ色のシェード

### 7.5 契約条件タブ

#### カテゴリ

| カテゴリ | 項目数 | 選択方式 | デフォルト |
|---|---|---|---|
| お支払い条件 | 8 | radio | p1（着手金50%/納品時50%） |
| 修正回数 | 4 | radio | r1（デザイン2回・コーディング1回） |
| 著作権 | 3 | radio | c2（制作者帰属・使用権付与） |
| 納品形式 | 5 | radio | d3（アップロード+データ納品） |
| その他 | 14 | checkbox | n1, n3, n4, n6, n7, n8 |

合計 **34項目** のプリセット文言（ココナラ販売文脈で発生しやすいトラブルを予防）。

### 7.6 プレビュータブ

- PC: `PDFViewer`（@react-pdf/renderer）で実際の PDF を全画面表示
- モバイル: 「PDF をダウンロードしてご確認ください」誘導 + ダウンロードボタン

### 7.7 ライブプレビュー

- 編集タブ右側（PC のみ）
- `PdfLivePreview` コンポーネント
- **二重バッファ方式**: A/B 2つの iframe を切り替えて点滅防止
- 500ms デバウンスで再生成

---

## 8. PDF 出力仕様

### 8.1 ページ構成

#### 単一プラン時
```
ページ1: 表紙
ページ2: 制作フロー / 実装機能 / サイトマップ / 制作スケジュール
ページ3: お見積もり / 契約条件 / 備考
```

#### 複数プラン時
```
ページ1: 表紙
ページ2: 制作フロー / 実装機能 / サイトマップ / 制作スケジュール
ページ3: プラン比較・お見積もり 見出し + プラン1
ページ4: プラン2 (1ページ専有)
ページ5: プラン3
...
ページN: 契約条件 / 備考
```

### 8.2 表紙詳細 (`CoverPdf.tsx`)

```
┌────────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━ (テーマ色 topBar)│
│                                         │
│ Webサイト制作のご提案 (24pt 太字)        │
│ ─────────────────────                    │
│                                         │
│ 提 出 先  ○○株式会社 様                 │
│ 提 案 日  2026年5月3日                  │
│ 有 効 期 限 発行日より30日間              │
│ 提 案 者  自社名                         │
│                                         │
│ [提案概要]                              │
│ 案件概要のテキスト...                   │
│                                         │
│ [制作方針・目的]                         │
│ 制作方針のテキスト...                   │
│                                         │
│ [制作概要]（縦並び）                     │
│ サイト種別 / 総ページ数 / 制作期間       │
│                                         │
│ ┌─────────────────────────────┐        │
│ │ お見積もり総額   ¥X,XXX,XXX │        │
│ └─────────────────────────────┘        │
│                                         │
│         [QR コード 120px]                │
│       お問い合わせ・詳細はこちら         │
│       スマートフォンでスキャン           │
└────────────────────────────────────────┘
```

### 8.3 共通要素

#### `ProposerInfo`（全ページ下部）
- 自社ロゴ + 会社名 + URL を横並び
- border-top の細い区切り線

#### `Credit`（全ページ下部）
- "Produced by シン｜WEB制作・コーディング https://coconala.com/users/2033628"
- 左端、左下から 22px の位置

#### `PageNumber`
- "現在ページ / 総ページ" 形式
- 右下、下から 22px

### 8.4 PDF メタデータ

```typescript
<Document
  title={form.projectName || form.clientName || `提案書_YYYY/M/D`}
  author={form.companyName}
  subject="Web制作のご提案"
  creator="シン｜WEB制作・コーディング"
  producer="シン｜WEB制作・コーディング"
>
```

### 8.5 PDF しおり（ブックマーク）

- ページ1: "表紙・提案サマリー"（expanded: true）
- ページ2: "制作フロー・機能・サイトマップ"
- ページ3: "プラン比較・お見積もり" or "お見積もり・契約条件"
- 各プランページ: プラン名
- 最終ページ: "契約条件・備考"

### 8.6 プラン比較カード仕様

- 6項目以上のプランは **2列レイアウトに自動切替**（左:前半 / 右:後半）
- ヘッダー部（プラン名 + 税込合計 + 「含まれる項目」見出し）は `wrap={false}` で塊保持
- 項目リストはページを跨いで分割可
- 「★ おすすめ」は theme 色背景の 9pt 太字バッジ

### 8.7 フォント仕様

```typescript
Font.register({
  family: 'Noto Sans JP',
  fonts: [
    { src: '/fonts/NotoSansJP-Regular.otf', fontWeight: 400 },
    { src: '/fonts/NotoSansJP-Bold.otf', fontWeight: 600 },
    { src: '/fonts/NotoSansJP-Black.otf', fontWeight: 800 },
  ],
});
```

`NEXT_PUBLIC_BASE_PATH` で動的にパス解決（Vercel/GH Pages 両対応）。

---

## 9. データ管理機能

### 9.1 自動保存（`useAutoSave`）

- 入力変化を監視、**2秒デバウンス**で `localStorage` に保存
- 復元ダイアログ表示中は保存を停止（上書き防止）
- 初回起動時にドラフト存在確認、`RestoreDraftDialog` で「続きから」or「破棄して最初から」

### 9.2 手動保存（保存パネル）

- 最大 **20件** の保存案件
- 各案件に **タグ複数付与可能**（AND フィルター + 件数表示）
- **検索ボックス**で案件名フィルター
- **タグ + 検索の併用可（AND）**

### 9.3 バージョン履歴

- 手動保存ボタン押下時に **同時にスナップショット記録**
- 最大 **20件**、古いものから自動破棄
- 折りたたみ式で表示
- 各スナップショットに「復元」「削除」ボタン
- 復元時は確認ダイアログ + パネル自動クローズ

### 9.4 Undo / Redo（`useUndoableForm`）

- form 変化を **600ms デバウンス**でスナップショット
- 最大 **50履歴** 保持
- Ctrl+Z / Ctrl+Shift+Z で操作
- ヘッダーの ↶ ↷ ボタンも対応（PC のみ）

### 9.5 単一案件 JSON 入出力

- エクスポート: `提案書_案件名.json`
- インポート: 確認ダイアログ後に上書き

### 9.6 全案件一括バックアップ

- エクスポート: `案件バックアップ_YYYY-M-D_N件.json`
- インポート時に「追加マージ」or「既存を上書き」を選択

### 9.7 カスタムテンプレート

- 任意のフォーム状態を「テンプレート」として保存可
- 最大 **30件**
- `TemplateSelector` から呼び出し、適用
- 標準8業種テンプレートと併用

---

## 10. エクスポート機能

### 10.1 PDF（単一）

- ヘッダー右の「PDF」ボタン（または Ctrl+P）
- ファイル名: `案件名.pdf` または `クライアント名.pdf` または `提案書_YYYY-M-D.pdf`
- QR コードも事前生成して埋め込み

### 10.2 PDF（両バージョン）

- 保存パネルの「両バージョン PDF」ボタン
- 金額あり版（`案件名_金額あり.pdf`）と金額なし版（`案件名_金額なし.pdf`）を順次ダウンロード
- 連続ダウンロードがブロックされないよう間に 600ms 遅延

### 10.3 CSV

- UTF-8 BOM 付き（Excel で文字化けしない）
- 列構成: プラン名 / 項目名 / 単位 / 数量 / 単価 / 小計
- プランごとに 小計・割引・消費税・税込合計 行
- ファイル名: `案件名.csv`

### 10.4 Excel（プラン別シート）

- `exceljs` で生成
- **プラン1つ = ワークシート1枚**
- 各シート構成:
  - タイトル行（プラン名、14pt 太字）
  - ヘッダー行（白文字 + 緑背景 #4A6B5A）
  - 項目データ（金額は `¥#,##0` 書式）
  - 小計 / 割引 / 消費税 / 合計（税込）行（合計は太字 + 薄背景 + 上罫線）
- シート名は重複時 `(2)` `(3)` 連番、Excel 禁止文字 `\/?*[]:` は `_` に置換

### 10.5 Apple Touch Icon

- ファビコンと同等の SVG（`icon.svg`）
- Next.js が自動でメタタグ生成

---

## 11. キーボードショートカット

| キー | 動作 |
|---|---|
| Ctrl + S | 保存パネルを開く |
| Ctrl + P | PDF 出力（ダウンロード） |
| Ctrl + Z | Undo |
| Ctrl + Shift + Z | Redo |
| Ctrl + Y | Redo（Windows 慣例） |

すべて Ctrl + 修飾キー、Mac の Cmd でも動作（`e.metaKey || e.ctrlKey`）。

---

## 12. テーマ・スタイル

### 12.1 テーマカラー（18色）

| ID | ラベル | primary |
|---|---|---|
| crimson | クリムゾン | #a32b3b |
| coral | コーラル | #c4564a |
| brown | ブラウン | #6b4a1a |
| gold | ゴールド | #9a7b2e |
| olive | オリーブ | #5c6b1a |
| **green** | **フォレスト** | **#1a6b4f**（デフォルト） |
| mint | ミント | #2a9d8f |
| teal | ティール | #0d7377 |
| ocean | オーシャン | #1a5f7a |
| steel | スチール | #546a7b |
| navy | ネイビー | #1e3a5f |
| slate | スレート | #4a5568 |
| indigo | インディゴ | #3b4cca |
| royal | ロイヤル | #4a2e7a |
| plum | プラム | #8b3a62 |
| wine | ワイン | #7a2e4a |
| rose | ローズ | #b5456a |
| charcoal | チャコール | #3a3a3a |

各テーマには `primary / dark / light / bg` の4色を持つ。

### 12.2 タイポグラフィスケール

`globals.css` の `@theme` で定義:

| トークン | サイズ | 用途 |
|---|---|---|
| `text-micro` | 10px | 警告 / チャート極小ラベル |
| `text-meta` | 11px | チップ / 日時 / 注釈 |
| `text-xs`（標準） | 12px | ボタン / ヒント |
| `text-label` | 13px | フォームラベル / セクション見出し |
| `text-sm`（標準） | 14px | 入力 / 本文 |
| `text-base` | 16px | 標準 |
| `text-lg` | 18px | モーダルタイトル |

すべての arbitrary value (`text-[10px]` など) はトークン化済み。

### 12.3 スクロールバー

- 全体的にテーマ色に連動（`--theme-primary` CSS 変数経由）
- 通常: 60% 透明、ホバー時 85% 透明
- 幅 10px、角丸 5px
- Firefox は `scrollbar-width: thin` で対応
- **PDF iframe 内部はブラウザ仕様で対応不可**

### 12.4 共通 UI クラス（`src/lib/ui.ts`）

```typescript
export const inputClass    // フォーカスリング付き入力
export const inputFull     // 上記 + w-full
export const labelClass    // text-label + mb-2
export const sectionStack  // gap-4 縦積み
export const btnSm / btnMd // ボタンサイズ
```

### 12.5 警告ピル（`.warn-pill`）

- 赤背景 (#fef2f2) + 赤文字 (#c33) + 赤枠
- URL バリデーション、文字数超過警告で使用

---

## 13. レスポンシブ対応

### 13.1 ブレークポイント

| 範囲 | レイアウト |
|---|---|
| 〜 639px (mobile) | スマホ専用 1カラム |
| 640px 〜 (sm+) | PC 用 2カラム |

### 13.2 モバイル時の挙動

| 要素 | 挙動 |
|---|---|
| PC推奨バナー | 表示（dismiss 可能、localStorage 保存） |
| ヘッダーロゴ・タイトル | 縮小、サブタイトル非表示 |
| Undo/Redo ボタン | 非表示 |
| 金額・保存・PDF ボタン | アイコンのみ表示 |
| メイン 2カラム | 1カラムに（プレビュー領域非表示） |
| プレビュータブ | 「PDFダウンロード」誘導に切替 |
| タブナビ | padding/font 縮小、横スクロール |
| モーダル | `p-2` に縮小、`w-full max-h-[95vh]` |
| PresetDrawer | 全幅表示 |
| BasicInfo の grid-cols-2 | 1列化 |
| 見積もりタブ 7列グリッド | そのまま（横スクロール許容） |

---

## 14. ストレージ仕様

### 14.1 localStorage キー

| キー | 内容 | 最大件数 |
|---|---|---|
| `proposal-projects` | 保存案件配列 | 20件 |
| `proposal-draft` | 自動保存ドラフト | 1件 |
| `proposal-custom-templates` | カスタムテンプレート | 30件 |
| `proposal-versions` | バージョン履歴 | 20件 |
| `mobile-notice-dismissed` | バナー dismiss 状態 | - |

### 14.2 容量管理

- 上限の保守的見積もり: **5MB**
- `getStorageUsage()` で現在の使用量を計算（UTF-16 ベース）
- **80% 超**: オレンジ警告
- **95% 超**: 赤の critical 警告 + 注意文表示
- 保存時 `QuotaExceededError` を捕捉してアラート表示

### 14.3 マイグレーション

- 旧データに `tags` フィールドがない場合は `[]` 扱い（optional）
- インポート時に `defaults.ts` の値で欠損フィールド補完

---

## 15. デプロイ

### 15.1 GitHub Pages

- **`.github/workflows/deploy.yml`**: main push で自動ビルド・デプロイ
- Node.js 22, npm ci → npm run build → upload-pages-artifact → deploy-pages
- basePath: `/proposal_builder`
- URL: `https://shinmori2020.github.io/proposal_builder/`

### 15.2 Vercel

- GitHub 連携で main push 自動デプロイ
- Framework Preset: Next.js（自動検出）
- basePath: 空（VERCEL=1 環境変数で自動判定）
- URL: `https://proposal-builder-flame.vercel.app/`（実際の URL は Vercel が決定）

### 15.3 環境変数

| 変数 | 設定元 | 用途 |
|---|---|---|
| `VERCEL` | Vercel 自動 | basePath 判定 |
| `NEXT_PUBLIC_BASE_PATH` | `next.config.ts` の `env` で注入 | クライアントコードからの asset path 解決 |

### 15.4 next.config.ts

```typescript
const isVercel = !!process.env.VERCEL;
const basePath = isVercel ? '' : '/proposal_builder';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: { unoptimized: true },
};
```

---

## 16. 既知の制約・トレードオフ

### 16.1 PDF iframe 内部スクロールバー

- ブラウザの仕様（iframe サンドボックス）で外部 CSS が届かない
- → デフォルトのブラウザスクロールバーのまま
- 解決には PDFViewer を自前実装に置き換える必要あり（半日〜1日工数）

### 16.2 モバイル D&D

- HTML5 Drag & Drop API はタッチデバイス非対応
- → 並び替えは PC 必須、モバイルでは項目順入れ替え不可
- 解決には `@dnd-kit` などのタッチ対応ライブラリ導入が必要

### 16.3 localStorage 5MB 制限

- 大きな画像（自社ロゴ）の DataURL を多数保存すると逼迫しやすい
- → 容量警告システムで事前通知

### 16.4 静的エクスポート（output: 'export'）

- SSR / API ルート / ISR は使えない
- → クラウド同期・マルチユーザー対応は未実装（追加開発要）

### 16.5 フォントサイズ

- Noto Sans JP OTF 3ウェイト = 約14MB
- → 初回ロードがやや重い（一度キャッシュされれば問題なし）
- サブセット化で 2-3MB に削減可能だが、絵文字・記号が欠落するリスクあり

---

## 17. 動作確認項目

### 17.1 基本フロー

- [ ] テンプレート選択 → 自動でフォームに反映
- [ ] 各タブで入力 → ライブプレビューに即時反映（500ms）
- [ ] PDF 出力 → 案件名でダウンロード
- [ ] 保存 → ブラウザリロード後も復元

### 17.2 エッジケース

- [ ] 30+ 項目のプラン → 2列レイアウトで1ページ収納
- [ ] 4プラン → 1プラン1ページ × 4 + 契約条件ページ
- [ ] 備考 800文字 → 入力ブロック、超過分は切り詰めボタン
- [ ] localStorage 80% → オレンジ警告
- [ ] 自社URL に `https://` なし → 警告ピル

### 17.3 マルチデバイス

- [ ] PC（Chrome）: 全機能動作
- [ ] PC（Safari/Firefox/Edge）: 全機能動作
- [ ] iPad: 2カラム表示、ほぼ PC と同等
- [ ] スマホ: PC推奨バナー表示、編集タブ全幅、プレビュー誘導

---

## 18. 今後の拡張候補（Phase 2 / 3）

### 🥈 中規模改善

| ID | タスク | 工数 |
|---|---|---|
| C1 | 見積もり項目の一括操作（全単価10%増等） | 2h |
| C2 | インポート時の追加/上書き選択 UI 改善 | 1h |
| C3 | カラーテーマのカスタム色（任意16進） | 1h |
| C4 | テンプレート検索/並び替え | 1h |
| ⑮ | ガントチャート色覚配慮（パターン併用） | 2h |

### 🥉 大型・差別化機能

| ID | タスク | 工数 |
|---|---|---|
| D1 | 提案文 AI 生成（Claude/OpenAI 連携） | 半日+ |
| D2 | PDF 署名欄の追加 | 3h |
| D3 | 案件ダッシュボード（月別集計） | 半日 |

### モバイル完全対応

- 案C: 軽編集対応（半日〜1日）
- 案D: フル対応（1〜2日）

### バックエンド連携

- クラウド同期（Firebase / Supabase）
- マルチユーザー対応
- 課金システム

---

## 19. ライセンス・著作権

### 本ツール

- 制作者: シン｜WEB制作・コーディング (https://coconala.com/users/2033628)
- 著作権: 制作者に帰属
- 出力 PDF にもクレジット表記される（Produced by ...）

### 同梱フォント

- Noto Sans JP: SIL Open Font License 1.1
- 商用利用・改変・再配布可

### 使用ライブラリ

- 主要ライブラリは MIT / Apache-2.0 等のオープンソースライセンス
- 詳細は `package.json` および各パッケージのライセンスを参照

---

## 20. 参考リンク

- 本リポジトリ: https://github.com/shinmori2020/proposal_builder
- Vercel デプロイ: https://proposal-builder-flame.vercel.app/
- GitHub Pages デプロイ: https://shinmori2020.github.io/proposal_builder/
- @react-pdf/renderer: https://react-pdf.org/
- exceljs: https://github.com/exceljs/exceljs
- Noto Sans JP: https://fonts.google.com/noto/specimen/Noto+Sans+JP

---

**最終更新**: 2026-05-03  
**バージョン**: 1.0.0（リリース版）
