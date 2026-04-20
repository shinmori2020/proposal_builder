import { View, Text } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { pdfStyles } from '../pdfStyles';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function NotesPdf({ form, theme }: Props) {
  if (!form.notes) return null;

  const P = theme.primary;

  return (
    <View style={pdfStyles.section}>
      <Text
        style={[
          pdfStyles.sectionHeading,
          { color: P, borderBottomColor: P },
        ]}
      >
        備考
      </Text>
      <Text style={pdfStyles.body}>{form.notes}</Text>
    </View>
  );
}
