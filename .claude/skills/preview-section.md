# スキル: プレビューセクション追加

## 概要
提案書プレビューに新しいセクションを追加する際のパターン。

## セクションコンポーネントのテンプレート

```typescript
// src/components/preview/XxxSection.tsx
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function XxxSection({ form, theme }: Props) {
  const P = theme.primary;
  
  // セクションが表示条件を満たさない場合は null を返す
  if (!shouldShow(form)) return null;

  return (
    <div>
      <h2 style={{ 
        color: P, 
        borderBottomColor: P 
      }} className="text-sm font-extrabold mb-2 pb-1 border-b-2 tracking-wide">
        セクション名
      </h2>
      {/* セクション内容 */}
    </div>
  );
}
```

## ProposalPreview.tsx への統合

```typescript
// セクションの表示順序（この順番を守る）
1. 表紙（CoverSection）
2. 提案概要（OverviewSection）
3. 制作概要（SummarySection）
4. 制作フロー（FlowSection）
5. 実装機能（FeaturesSection）
6. サイトマップ（SitemapSection）
7. お見積もり（EstimateSection）
8. 制作スケジュール（ScheduleSection）
9. 契約条件（TermsSection）
10. 備考（NotesSection）
11. フッター（FooterSection）
```

## テーマカラーの使い分け
- `theme.primary` — 見出し、ボーダー、アクセント
- `theme.dark` — グラデーションの暗い側（表紙のみ）
- `theme.light` — タグ背景、選択状態の背景
- `theme.bg` — サイトマップノードの背景
- `shades(theme.primary)` — ガントチャート、フロー図のグラデーション

## 金額非表示対応
金額を表示するセクションでは必ず `form.hidePrices` をチェック:
```typescript
{form.hidePrices ? (
  <div>別途ご案内</div>
) : (
  <div>¥{amount.toLocaleString()}</div>
)}
```
