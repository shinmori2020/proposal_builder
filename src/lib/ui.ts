/**
 * 共通 UI クラス。各タブ・モーダルで使い回すことで見た目を揃える。
 *
 * - input/select/textarea: `inputClass`
 * - フォームラベル: `labelClass`
 * - ボタン: サイズ別に `btnSm` `btnMd`
 * - セクション余白: 各タブ最上位 flex container は `sectionStack`
 * - フォーカス時のリング色は globals.css の .focus-ring クラスで theme primary を参照
 */
/** 入力系の基本クラス。幅は呼び出し側で `w-full` / `flex-1` 等を付ける。 */
export const inputClass =
  'focus-ring px-3 py-2 border-[1.5px] border-line-input rounded-md text-sm font-inherit outline-none box-border transition-colors';

/** 幅いっぱい版（フォーム入力で通常こちら） */
export const inputFull = `${inputClass} w-full`;

export const labelClass = 'block text-[13px] font-semibold text-ink-label mb-2';

/** タブ直下のセクション間を揃えるフレックス縦並び */
export const sectionStack = 'flex flex-col gap-4';

/** 小さめボタン（アイコン併記ラベル付き・サイドアクション等） */
export const btnSm =
  'px-2.5 py-1 rounded-md border-[1.5px] bg-transparent text-[11px] cursor-pointer font-semibold flex items-center gap-1 transition-colors';

/** 標準ボタン（タブ内で一般的な操作） */
export const btnMd =
  'px-3 py-1.5 rounded-md border-[1.5px] bg-transparent text-xs cursor-pointer font-semibold flex items-center gap-1 transition-colors';
