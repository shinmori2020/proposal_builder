import { View, Text } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { pdfStyles } from '../pdfStyles';
import { PC } from '../pdfColors';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function OverviewPdf({ form, theme }: Props) {
  if (!form.overview && !form.purpose) return null;

  const P = theme.primary;

  return (
    <View style={pdfStyles.section}>
      <Text
        style={[
          pdfStyles.sectionHeading,
          { color: P, borderBottomColor: P },
        ]}
      >
        提案概要
      </Text>
      {form.overview && (
        <Text style={[pdfStyles.body, { marginBottom: 4 }]}>
          {form.overview}
        </Text>
      )}
      {form.purpose && (
        <View style={{ marginTop: 4 }}>
          <Text style={{ fontSize: 10, fontWeight: 600, color: P }}>
            制作方針
          </Text>
          <Text style={[pdfStyles.body, { marginTop: 2 }]}>{form.purpose}</Text>
        </View>
      )}
    </View>
  );
}
