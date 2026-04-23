import { Document, Page, View, Text } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { pdfStyles } from './pdfStyles';
import { registerPdfFonts } from './fonts';
import { PC } from './pdfColors';
import CoverPdf from './sections/CoverPdf';
import FlowPdf from './sections/FlowPdf';
import FeaturesPdf from './sections/FeaturesPdf';
import SitemapPdf from './sections/SitemapPdf';
import EstimatePdf from './sections/EstimatePdf';
import SchedulePdf from './sections/SchedulePdf';
import TermsPdf from './sections/TermsPdf';
import NotesPdf from './sections/NotesPdf';
import FooterPdf from './sections/FooterPdf';

// モジュールロード時にフォント登録（PDFViewer でも pdf() でも同じ関数経由）
registerPdfFonts();

interface Props {
  form: ProposalForm;
  theme: Theme;
}

/**
 * 全ページに表示するページ番号（右下、ページ全体で通し番号）
 */
function PageNumber() {
  return (
    <Text
      fixed
      style={{
        position: 'absolute',
        bottom: 16,
        right: 20,
        fontSize: 8,
        color: PC.ink.soft,
      }}
      render={({ pageNumber, totalPages }) =>
        `${pageNumber} / ${totalPages}`
      }
    />
  );
}

export default function PdfDocument({ form, theme }: Props) {
  return (
    <Document>
      {/* ページ1: 表紙（提案概要・制作概要・見積もり総額） */}
      <Page size="A4" style={pdfStyles.coverPage}>
        <CoverPdf form={form} theme={theme} />
        <PageNumber />
      </Page>

      {/* ページ2: 制作フロー + 実装機能 + サイトマップ + 制作スケジュール */}
      <Page size="A4" style={pdfStyles.contentPage}>
        <FlowPdf form={form} theme={theme} />
        <FeaturesPdf form={form} theme={theme} />
        <SitemapPdf form={form} theme={theme} />
        <SchedulePdf form={form} theme={theme} />
        <PageNumber />
      </Page>

      {/* ページ3以降: お見積もり + 契約条件 + 備考 + フッター
          コンテンツ量によって自動改ページ、Footer は最終ページ最下部に配置 */}
      <Page size="A4" style={pdfStyles.contentPage}>
        {/* コンテンツ領域: flex:1 で空白を占有し、Footer を下に押し込む */}
        <View style={{ flex: 1 }}>
          <EstimatePdf form={form} theme={theme} />
          <TermsPdf form={form} theme={theme} />
          <NotesPdf form={form} theme={theme} />
        </View>
        <FooterPdf form={form} />
        <PageNumber />
      </Page>
    </Document>
  );
}
