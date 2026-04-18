import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function FooterSection({ form }: Props) {
  return (
    <div className="text-center pt-4 border-t-2 border-line-faint text-ink-soft text-[10px]">
      {form.companyLogo && (
        <img
          src={form.companyLogo}
          alt=""
          className="max-h-[30px] max-w-[120px] object-contain mb-1.5 mx-auto"
        />
      )}
      {form.companyName && (
        <p className="m-0 font-semibold text-ink-body">{form.companyName}</p>
      )}
      {form.companyUrl && <p className="m-0 mt-px">{form.companyUrl}</p>}
      <p className="m-0 mt-1">有効期限: 発行日より30日間</p>
    </div>
  );
}
