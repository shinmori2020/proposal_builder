import { StyleSheet } from '@react-pdf/renderer';
import { PC } from './pdfColors';

export const FONT = 'Noto Sans JP';

/**
 * PDF 共通スタイル
 * テーマカラーに依存する値（見出しのcolor/borderColor等）はインラインで付与する
 */
export const pdfStyles = StyleSheet.create({
  /* ========== ページ ========== */
  coverPage: {
    fontFamily: FONT,
    fontSize: 10,
    color: PC.white,
  },
  contentPage: {
    fontFamily: FONT,
    fontSize: 10,
    color: PC.ink.primary,
    lineHeight: 1.6,
    paddingTop: 55,
    paddingBottom: 50,
    paddingHorizontal: 40,
  },

  /* ========== 見出し ========== */
  sectionHeading: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    letterSpacing: 0.5,
  },

  /* ========== セクション ========== */
  section: {
    marginBottom: 18,
  },

  /* ========== テキスト階層 ========== */
  body: {
    fontSize: 10,
    color: PC.ink.label,
  },
  sub: {
    fontSize: 9,
    color: PC.ink.body,
  },
  small: {
    fontSize: 8,
    color: PC.ink.soft,
  },
});
