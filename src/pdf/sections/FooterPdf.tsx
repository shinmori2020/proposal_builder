import { View, Text, Image } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { PC } from '../pdfColors';

interface Props {
  form: ProposalForm;
}

export default function FooterPdf({ form }: Props) {
  return (
    <View
      style={{
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 2,
        borderTopStyle: 'solid',
        borderTopColor: PC.line.faint,
        alignItems: 'center',
      }}
    >
      {form.companyLogo && (
        <Image
          src={form.companyLogo}
          style={{
            maxHeight: 30,
            maxWidth: 120,
            marginBottom: 4,
            objectFit: 'contain',
          }}
        />
      )}
      {form.companyName && (
        <Text
          style={{
            fontSize: 8,
            fontWeight: 600,
            color: PC.ink.body,
            marginBottom: 1,
          }}
        >
          {form.companyName}
        </Text>
      )}
      {form.companyUrl && (
        <Text style={{ fontSize: 8, color: PC.ink.soft, marginBottom: 1 }}>
          {form.companyUrl}
        </Text>
      )}
      <Text style={{ fontSize: 8, color: PC.ink.soft, marginTop: 2 }}>
        有効期限: 発行日より30日間
      </Text>
    </View>
  );
}
