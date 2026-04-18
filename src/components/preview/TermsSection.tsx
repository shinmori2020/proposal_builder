import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { CONTRACT_PRESETS, ContractCategory } from '@/lib/contracts';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function TermsSection({ form, theme }: Props) {
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
    <div>
      <h2
        className="text-sm font-extrabold mb-2 pb-1 border-b-2 tracking-wide"
        style={{ color: P, borderBottomColor: P }}
      >
        契約条件
      </h2>
      <div className="flex flex-col gap-2">
        {getPreset('payment') && (
          <TermsBlock label="お支払い条件" text={getPreset('payment')!.text} color={P} />
        )}
        {getPreset('revision') && (
          <TermsBlock label="修正回数" text={getPreset('revision')!.text} color={P} />
        )}
        {getPreset('copyright') && (
          <TermsBlock label="著作権" text={getPreset('copyright')!.text} color={P} />
        )}
        {getPreset('delivery') && (
          <TermsBlock label="納品形式" text={getPreset('delivery')!.text} color={P} />
        )}
        {activeNotes.map((n) => (
          <TermsBlock key={n.id} label={n.label} text={n.text} color={P} />
        ))}
      </div>
    </div>
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
    <div
      className="py-2 px-3 rounded-[7px] bg-[#f8faf9]"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <div
        className="font-bold text-[11px] mb-0.5"
        style={{ color }}
      >
        {label}
      </div>
      <div className="text-[11px] text-[#444] leading-[1.6]">{text}</div>
    </div>
  );
}
