import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function NotesSection({ form, theme }: Props) {
  const P = theme.primary;

  if (!form.notes) return null;

  return (
    <div>
      <h2
        className="text-sm font-extrabold mb-2 pb-1 border-b-2 tracking-wide"
        style={{ color: P, borderBottomColor: P }}
      >
        備考
      </h2>
      <p className="m-0 text-ink-label whitespace-pre-wrap">{form.notes}</p>
    </div>
  );
}
