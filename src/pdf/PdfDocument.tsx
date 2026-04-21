import { Document, Page } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { pdfStyles } from './pdfStyles';
import CoverPdf from './sections/CoverPdf';
import OverviewPdf from './sections/OverviewPdf';
import SummaryPdf from './sections/SummaryPdf';
import FlowPdf from './sections/FlowPdf';
import FeaturesPdf from './sections/FeaturesPdf';
import SitemapPdf from './sections/SitemapPdf';
import EstimatePdf from './sections/EstimatePdf';
import SchedulePdf from './sections/SchedulePdf';
import TermsPdf from './sections/TermsPdf';
import NotesPdf from './sections/NotesPdf';
import FooterPdf from './sections/FooterPdf';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function PdfDocument({ form, theme }: Props) {
  return (
    <Document>
      {/* 表紙（1ページ目全体） */}
      <Page size="A4" style={pdfStyles.coverPage}>
        <CoverPdf form={form} theme={theme} />
      </Page>

      {/* 本文（2ページ目以降、自動改ページ） */}
      <Page size="A4" style={pdfStyles.contentPage}>
        <OverviewPdf form={form} theme={theme} />
        <SummaryPdf form={form} theme={theme} />
        <FlowPdf form={form} theme={theme} />
        <FeaturesPdf form={form} theme={theme} />
        <SitemapPdf form={form} theme={theme} />
        <EstimatePdf form={form} theme={theme} />
        <SchedulePdf form={form} theme={theme} />
        <TermsPdf form={form} theme={theme} />
        <NotesPdf form={form} theme={theme} />
        <FooterPdf form={form} />
      </Page>
    </Document>
  );
}
