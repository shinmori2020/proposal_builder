import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function FeaturesSection({ form, theme }: Props) {
  const P = theme.primary;
  const L = theme.light;

  if (form.features.length === 0) return null;

  return (
    <div>
      <h2
        className="text-sm font-extrabold mb-2 pb-1 border-b-2 tracking-wide"
        style={{ color: P, borderBottomColor: P }}
      >
        実装機能
      </h2>
      <div className="flex flex-wrap gap-1.5">
        {form.features.map((f) => (
          <span
            key={f}
            className="py-0.5 px-2.5 rounded-[14px] text-[11px] font-medium"
            style={{ background: L, color: P }}
          >
            ✓ {f}
          </span>
        ))}
      </div>
    </div>
  );
}
