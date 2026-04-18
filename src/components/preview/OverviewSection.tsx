import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function OverviewSection({ form, theme }: Props) {
  const P = theme.primary;

  if (!form.overview && !form.purpose) return null;

  return (
    <div>
      <h2
        className="text-sm font-extrabold mb-2 pb-1 border-b-2 tracking-wide"
        style={{ color: P, borderBottomColor: P }}
      >
        提案概要
      </h2>
      {form.overview && (
        <p className="m-0 mb-1.5 text-ink-label">{form.overview}</p>
      )}
      {form.purpose && (
        <div className="mt-1.5">
          <strong style={{ color: P }}>制作方針</strong>
          <p className="m-0 mt-1 text-ink-label">{form.purpose}</p>
        </div>
      )}
    </div>
  );
}
