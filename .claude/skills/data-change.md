# スキル: データ構造変更

## 概要
フォームのデータ構造（types.ts）を変更する際の手順。
変更漏れを防ぐためのチェックリスト。

## 変更手順

### 1. 型定義を更新
```
src/lib/types.ts の ProposalForm に新フィールドを追加
```

### 2. デフォルト値を更新
```
src/hooks/useProposalForm.ts (または page.tsx) の defaultForm に初期値を追加
```

### 3. テンプレートを更新（該当する場合）
```
src/lib/templates.ts の各業種テンプレートに新フィールドの値を追加
```

### 4. 入力UIを追加
```
src/components/tabs/ の該当タブに入力フィールドを追加
```

### 5. プレビューに反映
```
src/components/preview/ の該当セクションに表示を追加
```

### 6. 保存互換性を確認
```
localStorage から読み込んだ古いデータに新フィールドがない場合のフォールバック:
const loaded = JSON.parse(data);
const form = { ...defaultForm(), ...loaded };
```

## チェックリスト

新フィールド追加時:
- [ ] `types.ts` に型追加
- [ ] `defaultForm()` に初期値追加
- [ ] テンプレートに値追加（必要な場合）
- [ ] 入力UI追加
- [ ] プレビュー表示追加
- [ ] 保存/読み込みのフォールバック確認
- [ ] `project-spec.md` のデータ構造セクション更新
- [ ] `work-log.md` に変更内容を記録

## 既存フィールド一覧（変更時の影響範囲）

| フィールド | 入力タブ | プレビュー | 特記 |
|-----------|---------|-----------|------|
| clientName | 基本情報 | 表紙, サイトマップTOP | |
| projectName | 基本情報 | 表紙 | 保存名にも使用 |
| siteType | 基本情報 | 制作概要 | |
| overview | 基本情報 | 提案概要 | |
| purpose | 基本情報 | 提案概要 | |
| features | 基本情報 | 実装機能 | トグルボタン |
| pages | ページ構成 | サイトマップ, 制作概要(ページ数) | 子ページあり |
| plans | 見積もり | お見積もり | 複数プラン対応 |
| schedule | スケジュール | フロー図, ガントチャート, 制作概要(期間) | 週+日 |
| scheduleStart | スケジュール | フロー図, ガントチャート | 日付表示切替 |
| contractTerms | 契約条件 | 契約条件 | プリセット選択 |
| themeId | 基本情報 | 全体 | 18色 |
| hidePrices | ヘッダー | 見積もりセクション | トグル |
| companyLogo | 基本情報 | 表紙, フッター | Base64 |
| companyName | 基本情報 | 表紙, フッター | |
| companyUrl | 基本情報 | フッター | |
| deliveryDate | 基本情報 | 制作概要 | |
| notes | 基本情報 | 備考 | |
