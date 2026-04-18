/**
 * 色トークン定数
 *
 * globals.css の @theme inline で定義した CSS カスタムプロパティと対応する。
 * - JSX の style={{}} では C.* を使用
 * - className の Tailwind 任意値では "text-ink-label" のような生成ユーティリティを使用
 *
 * skills/component-pattern.md で許可されている 5色 (#fff, #333, #666, #999, #c33)
 * はそのままリテラル文字列として使用可能。
 */
export const C = {
  // テキスト階層
  ink: {
    primary: '#333', // 許可色: メインテキスト
    label: 'var(--color-ink-label)',
    body: 'var(--color-ink-body)',
    muted: '#666', // 許可色: サブテキスト
    soft: 'var(--color-ink-soft)',
    faint: '#999', // 許可色: 薄テキスト
    softer: 'var(--color-ink-softer)',
    softest: 'var(--color-ink-softest)',
  },
  // ボーダー
  line: {
    input: 'var(--color-line-input)',
    default: 'var(--color-line-default)',
    soft: 'var(--color-line-soft)',
    subtle: 'var(--color-line-subtle)',
    muted: 'var(--color-line-muted)',
    faint: 'var(--color-line-faint)',
    divider: 'var(--color-line-divider)',
  },
  // 背景
  surface: {
    app: 'var(--color-surface-app)',
    panel: 'var(--color-surface-panel)',
    muted: 'var(--color-surface-muted)',
    subtle: 'var(--color-surface-subtle)',
    faint: 'var(--color-surface-faint)',
    track: 'var(--color-surface-track)',
    preview: 'var(--color-surface-preview)',
  },
  // セマンティック（許可色）
  white: '#fff',
  delete: '#c33',
};
