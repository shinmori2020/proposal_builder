import { View, Text } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { pdfStyles } from '../pdfStyles';
import { PC } from '../pdfColors';
import { totalWeeksLabel } from '@/lib/schedule';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function SummaryPdf({ form, theme }: Props) {
  const P = theme.primary;
  const totalPages = form.pages.reduce(
    (s, p) => s + 1 + p.children.length,
    0
  );
  const twLabel = totalWeeksLabel(form.schedule);

  return (
    <View style={pdfStyles.section}>
      <Text
        style={[
          pdfStyles.sectionHeading,
          { color: P, borderBottomColor: P },
        ]}
      >
        制作概要
      </Text>
      <View>
        <InfoRow label="サイト種別" value={form.siteType} />
        <InfoRow label="総ページ数" value={`${totalPages}ページ`} />
        {form.deliveryDate && (
          <InfoRow label="納品希望日" value={form.deliveryDate} />
        )}
        <InfoRow label="制作期間" value={twLabel} />
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 3,
      }}
    >
      <Text
        style={{
          width: 80,
          fontSize: 10,
          fontWeight: 600,
          color: PC.ink.body,
        }}
      >
        {label}
      </Text>
      <Text style={{ flex: 1, fontSize: 10, color: PC.ink.primary }}>
        {value}
      </Text>
    </View>
  );
}
