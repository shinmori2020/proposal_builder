import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { PC } from './pdfColors';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

const FONT = 'Noto Sans JP';

// A4: 595 x 842 pt
const styles = StyleSheet.create({
  page: {
    fontFamily: FONT,
    fontSize: 10,
    color: PC.ink.primary,
    lineHeight: 1.6,
  },
  /* 表紙（単色） */
  cover: {
    flexGrow: 1,
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 40,
    color: PC.white,
  },
  coverSubtitle: {
    fontSize: 8,
    letterSpacing: 4,
    opacity: 0.6,
    marginBottom: 12,
  },
  coverTitle: {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 6,
  },
  coverClient: {
    fontSize: 12,
    opacity: 0.85,
  },
  coverDate: {
    marginTop: 16,
    fontSize: 10,
    opacity: 0.5,
  },
  coverLogo: {
    maxHeight: 40,
    maxWidth: 140,
    marginTop: 12,
    opacity: 0.9,
    objectFit: 'contain',
  },
  coverCompany: {
    marginTop: 4,
    fontSize: 10,
    opacity: 0.65,
  },
});

export default function PdfDocument({ form, theme }: Props) {
  const P = theme.primary;

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      {/* 表紙ページ */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.cover, { backgroundColor: P }]}>
          <Text style={styles.coverSubtitle}>WEB SITE PROPOSAL</Text>
          <Text style={styles.coverTitle}>
            {form.projectName || 'Webサイト制作のご提案'}
          </Text>
          {form.clientName && (
            <Text style={styles.coverClient}>{form.clientName} 様</Text>
          )}
          <Text style={styles.coverDate}>{today}</Text>
          {form.companyLogo && (
            <Image src={form.companyLogo} style={styles.coverLogo} />
          )}
          {form.companyName && (
            <Text style={styles.coverCompany}>{form.companyName}</Text>
          )}
        </View>
      </Page>
    </Document>
  );
}
