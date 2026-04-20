import { Document, Page } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { pdfStyles } from './pdfStyles';
import CoverPdf from './sections/CoverPdf';
import OverviewPdf from './sections/OverviewPdf';
import SummaryPdf from './sections/SummaryPdf';
import FeaturesPdf from './sections/FeaturesPdf';
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
        {/* Phase 3: FlowPdf */}
        <FeaturesPdf form={form} theme={theme} />
        {/* Phase 3: SitemapPdf */}
        {/* Phase 4: EstimatePdf */}
        {/* Phase 3: SchedulePdf */}
        <TermsPdf form={form} theme={theme} />
        <NotesPdf form={form} theme={theme} />
        <FooterPdf form={form} />
      </Page>
    </Document>
  );
}
