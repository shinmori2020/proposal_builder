import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { PC } from '../pdfColors';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

const styles = StyleSheet.create({
  cover: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 40,
    color: PC.white,
  },
  subtitle: {
    fontSize: 8,
    letterSpacing: 4,
    opacity: 0.6,
    marginBottom: 12,
    color: PC.white,
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 6,
    color: PC.white,
  },
  client: {
    fontSize: 12,
    opacity: 0.85,
    color: PC.white,
  },
  date: {
    marginTop: 16,
    fontSize: 10,
    opacity: 0.5,
    color: PC.white,
  },
  logo: {
    maxHeight: 40,
    maxWidth: 140,
    marginTop: 12,
    objectFit: 'contain',
  },
  company: {
    marginTop: 4,
    fontSize: 10,
    opacity: 0.65,
    color: PC.white,
  },
});

export default function CoverPdf({ form, theme }: Props) {
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={[styles.cover, { backgroundColor: theme.primary }]}>
      <Text style={styles.subtitle}>WEB SITE PROPOSAL</Text>
      <Text style={styles.title}>
        {form.projectName || 'Webサイト制作のご提案'}
      </Text>
      {form.clientName && (
        <Text style={styles.client}>{form.clientName} 様</Text>
      )}
      <Text style={styles.date}>{today}</Text>
      {form.companyLogo && <Image src={form.companyLogo} style={styles.logo} />}
      {form.companyName && (
        <Text style={styles.company}>{form.companyName}</Text>
      )}
    </View>
  );
}
