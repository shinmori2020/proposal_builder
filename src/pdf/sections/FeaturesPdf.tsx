import { View, Text } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { pdfStyles } from '../pdfStyles';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function FeaturesPdf({ form, theme }: Props) {
  if (form.features.length === 0) return null;

  const P = theme.primary;
  const L = theme.light;

  return (
    <View style={pdfStyles.section}>
      <Text
        style={[
          pdfStyles.sectionHeading,
          { color: P, borderBottomColor: P },
        ]}
      >
        実装機能
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 4,
        }}
      >
        {form.features.map((f) => (
          <Text
            key={f}
            style={{
              paddingVertical: 2,
              paddingHorizontal: 8,
              borderRadius: 10,
              fontSize: 9,
              fontWeight: 600,
              backgroundColor: L,
              color: P,
            }}
          >
            ✓ {f}
          </Text>
        ))}
      </View>
    </View>
  );
}
