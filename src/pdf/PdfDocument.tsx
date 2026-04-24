import { Document, Page, View, Text, Image, Link } from '@react-pdf/renderer';
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

// モジュールロード時にフォント登録（PDFViewer でも pdf() でも同じ関数経由）
registerPdfFonts();

interface Props {
  form: ProposalForm;
  theme: Theme;
}

const CREATOR_NAME = 'シン｜WEB制作・コーディング';
const CREATOR_URL = 'https://coconala.com/users/2033628';

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

/**
 * 全ページ左下に固定表示する制作者クレジット。
 * 著作物としての主張として常時表示。
 * left は content 領域の左端に揃える（表紙=50, コンテンツ=40）。
 */
function Credit({ left = 40 }: { left?: number }) {
  return (
    <View
      fixed
      style={{
        position: 'absolute',
        bottom: 16,
        left,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
      }}
    >
      <Text style={{ fontSize: 6, color: PC.ink.softer }}>Produced by</Text>
      <Text
        style={{
          fontSize: 7,
          color: PC.ink.soft,
          fontWeight: 600,
        }}
      >
        {CREATOR_NAME}
      </Text>
      <Link
        src={CREATOR_URL}
        style={{
          fontSize: 6,
          color: PC.ink.softer,
          textDecoration: 'none',
        }}
      >
        {CREATOR_URL}
      </Link>
    </View>
  );
}

/**
 * コンテンツページ（2ページ目以降）の上部に固定表示する提案者情報ヘッダー。
 * 表紙は独自のプロミネントなレイアウトを持つため非表示。
 */
function ContentHeader({ form }: { form: ProposalForm }) {
  if (!form.companyLogo && !form.companyName && !form.companyUrl) return null;
  return (
    <View
      fixed
      style={{
        position: 'absolute',
        top: 14,
        left: 40,
        right: 40,
        paddingBottom: 4,
        borderBottomWidth: 0.5,
        borderBottomStyle: 'solid',
        borderBottomColor: PC.line.faint,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {form.companyLogo && (
        <Image
          src={form.companyLogo}
          style={{ maxHeight: 14, maxWidth: 60, objectFit: 'contain' }}
        />
      )}
      {form.companyName && (
        <Text style={{ fontSize: 8, fontWeight: 600, color: PC.ink.body }}>
          {form.companyName}
        </Text>
      )}
      {form.companyUrl && (
        <Text style={{ fontSize: 7, color: PC.ink.soft }}>
          {form.companyUrl}
        </Text>
      )}
    </View>
  );
}

export default function PdfDocument({ form, theme }: Props) {
  return (
    <Document>
      {/* ページ1: 表紙（提案概要・制作概要・見積もり総額） */}
      <Page
        size="A4"
        style={pdfStyles.coverPage}
        bookmark={{ title: '表紙・提案サマリー', expanded: true }}
      >
        <CoverPdf form={form} theme={theme} />
        <Credit left={50} />
        <PageNumber />
      </Page>

      {/* ページ2: 制作フロー + 実装機能 + サイトマップ + 制作スケジュール */}
      <Page
        size="A4"
        style={pdfStyles.contentPage}
        bookmark="制作フロー・機能・サイトマップ"
      >
        <ContentHeader form={form} />
        <FlowPdf form={form} theme={theme} />
        <FeaturesPdf form={form} theme={theme} />
        <SitemapPdf form={form} theme={theme} />
        <SchedulePdf form={form} theme={theme} />
        <Credit />
        <PageNumber />
      </Page>

      {/* ページ3以降: お見積もり + 契約条件 + 備考
          コンテンツ量によって自動改ページ */}
      <Page
        size="A4"
        style={pdfStyles.contentPage}
        bookmark="お見積もり・契約条件"
      >
        <ContentHeader form={form} />
        <EstimatePdf form={form} theme={theme} />
        <TermsPdf form={form} theme={theme} />
        <NotesPdf form={form} theme={theme} />
        <Credit />
        <PageNumber />
      </Page>
    </Document>
  );
}
