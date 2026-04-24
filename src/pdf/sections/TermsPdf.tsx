import { View, Text } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { pdfStyles } from '../pdfStyles';
import { PC } from '../pdfColors';
import { CONTRACT_PRESETS, ContractCategory } from '@/lib/contracts';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function TermsPdf({ form, theme }: Props) {
  const P = theme.primary;
  const terms = form.contractTerms;

  const getPreset = (cat: Exclude<ContractCategory, 'notes'>) => {
    const id = terms[cat];
    if (!id) return null;
    return CONTRACT_PRESETS[cat].find((p) => p.id === id) || null;
  };

  const activeNotes = (terms.extraNotes || [])
    .map((id) => CONTRACT_PRESETS.notes.find((n) => n.id === id))
    .filter((n): n is NonNullable<typeof n> => Boolean(n));

  const hasTerms =
    terms.payment ||
    terms.revision ||
    terms.copyright ||
    terms.delivery ||
    activeNotes.length > 0;

  if (!hasTerms) return null;

  return (
    <View style={pdfStyles.section}>
      <Text
        style={[
          pdfStyles.sectionHeading,
          { color: P, borderBottomColor: P },
        ]}
      >
        契約条件
      </Text>
      <View style={{ gap: 5 }}>
        {getPreset('payment') && (
          <TermsBlock
            label="お支払い条件"
            text={getPreset('payment')!.text}
            color={P}
          />
        )}
        {getPreset('revision') && (
          <TermsBlock
            label="修正回数"
            text={getPreset('revision')!.text}
            color={P}
          />
        )}
        {getPreset('copyright') && (
          <TermsBlock
            label="著作権"
            text={getPreset('copyright')!.text}
            color={P}
          />
        )}
        {getPreset('delivery') && (
          <TermsBlock
            label="納品形式"
            text={getPreset('delivery')!.text}
            color={P}
          />
        )}
        {activeNotes.map((n) => (
          <TermsBlock key={n.id} label={n.label} text={n.text} color={P} />
        ))}
      </View>
    </View>
  );
}

function TermsBlock({
  label,
  text,
  color,
}: {
  label: string;
  text: string;
  color: string;
}) {
  return (
    <View
      style={{
        paddingVertical: 5,
        paddingHorizontal: 8,
        backgroundColor: PC.surface.panel,
        borderRadius: 4,
      }}
    >
      <Text
        style={{
          fontWeight: 600,
          fontSize: 9,
          color,
          marginBottom: 2,
        }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: 9, color: PC.ink.label }}>{text}</Text>
    </View>
  );
}
