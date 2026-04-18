import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { totalWeeksLabel } from '@/lib/schedule';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function SummarySection({ form, theme }: Props) {
  const P = theme.primary;

  const totalPages = form.pages.reduce(
    (s, p) => s + 1 + p.children.length,
    0
  );
  const twLabel = totalWeeksLabel(form.schedule);

  return (
    <div>
      <h2
        className="text-sm font-extrabold mb-2 pb-1 border-b-2 tracking-wide"
        style={{ color: P, borderBottomColor: P }}
      >
        制作概要
      </h2>
      <div
        className="grid text-xs"
        style={{ gridTemplateColumns: '100px 1fr', rowGap: 5, columnGap: 14 }}
      >
        <InfoRow label="サイト種別" value={form.siteType} />
        <InfoRow label="総ページ数" value={`${totalPages}ページ`} />
        {form.deliveryDate && (
          <InfoRow label="納品希望日" value={form.deliveryDate} />
        )}
        <InfoRow label="制作期間" value={twLabel} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="font-semibold text-ink-body">{label}</span>
      <span className="text-[#333]">{value}</span>
    </>
  );
}
