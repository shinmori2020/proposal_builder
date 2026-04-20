/**
 * PDF 用の色定数（@react-pdf/renderer の style は var() や CSS vars を使えないため、
 * 実際の hex 値を保持する）
 */
export const PC = {
  // テキスト
  ink: {
    primary: '#333333',
    label: '#444444',
    body: '#555555',
    muted: '#666666',
    soft: '#888888',
    faint: '#999999',
    softer: '#aaaaaa',
    softest: '#bbbbbb',
  },
  // ボーダー
  line: {
    input: '#d0d8d4',
    default: '#cccccc',
    soft: '#dddddd',
    subtle: '#e0e4e2',
    muted: '#e8ece9',
    faint: '#e0e8e4',
    divider: '#f0f0f0',
  },
  // 背景
  surface: {
    app: '#f4f7f5',
    panel: '#f8faf9',
    muted: '#f8f9fa',
    subtle: '#fafafa',
    faint: '#fafbfa',
    track: '#f0f4f2',
  },
  white: '#ffffff',
  delete: '#cc3333',
};
