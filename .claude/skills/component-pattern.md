# スキル: コンポーネント作成

## 概要
提案書ビルダーの新規コンポーネントを一貫したパターンで作成する。

## ルール

### ファイル構造
```typescript
'use client';

import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';

interface Props {
  form: ProposalForm;
  setForm: React.Dispatch<React.SetStateAction<ProposalForm>>;
  theme: Theme;
}

export default function ComponentName({ form, setForm, theme }: Props) {
  const P = theme.primary;
  
  // フォーム更新ヘルパー
  const update = <K extends keyof ProposalForm>(key: K, value: ProposalForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* コンテンツ */}
    </div>
  );
}
```

### テーマカラーの適用
- Tailwind のクラスでは動的カラーが使えないため、`style={{ color: theme.primary }}` を使用
- ボーダー、背景、テキストすべてに theme から色を取得
- ハードコードの色は `#fff`, `#333`, `#666`, `#999`, `#c33`（削除ボタン）のみ許可

### 命名規則
- タブコンポーネント: `XxxTab.tsx` (例: `BasicInfoTab.tsx`)
- プレビューセクション: `XxxSection.tsx` (例: `EstimateSection.tsx`)
- モーダル: `XxxModal.tsx` or `XxxDrawer.tsx`
- UI部品: そのまま (例: `Button.tsx`, `Field.tsx`)

### モーダルの共通パターン
```typescript
// オーバーレイクリックで閉じる
<div onClick={onClose} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5">
  <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-auto">
    {/* モーダル内容 */}
  </div>
</div>
```

### ボタンスタイル
```typescript
// プライマリボタン
<button style={{ background: theme.primary }} className="px-5 py-2 rounded-lg text-white text-sm font-semibold">

// アウトラインボタン
<button style={{ borderColor: theme.primary, color: theme.primary }} className="px-3 py-1 rounded-md border-2 bg-transparent text-xs font-semibold">

// 削除ボタン
<button className="px-3 py-1 rounded-md border-2 border-red-500 text-red-500 bg-transparent text-xs font-semibold">
```
