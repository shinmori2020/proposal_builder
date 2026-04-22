import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

function truncate(text: string, maxLen: number): string {
  if (!text) return '—';
  if (text.length > maxLen) return text.slice(0, maxLen) + '…';
  return text;
}

export default function SitemapSection({ form, theme }: Props) {
  const P = theme.primary;

  if (form.pages.length === 0) return null;

  return (
    <div>
      <h2
        className="text-sm font-extrabold mb-2 pb-1 border-b-2 tracking-wide"
        style={{ color: P, borderBottomColor: P }}
      >
        サイトマップ
      </h2>

      {/* TOP ヘッダー（左寄せ） */}
      <div
        className="text-white py-1 px-3 rounded text-xs font-bold inline-block mb-2"
        style={{ background: P }}
      >
        {form.clientName || 'サイト'} TOP
      </div>

      {/* ページリスト */}
      <div
        className="pl-3 ml-1"
        style={{ borderLeft: `1.5px solid ${P}` }}
      >
        {form.pages.map((pg, i) => (
          <div key={i} className="mb-1">
            {/* 親ページ */}
            <div className="flex items-center py-0.5">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 shrink-0"
                style={{ background: P }}
              />
              <span
                className="text-[11px] font-bold text-[#333] truncate"
                style={{ maxWidth: '90%' }}
                title={pg.name}
              >
                {truncate(pg.name, 45)}
              </span>
            </div>

            {/* 子ページ */}
            {pg.children.map((c, ci) => (
              <div
                key={ci}
                className="flex items-center py-0.5 pl-4"
              >
                <span
                  className="text-[10px] mr-1 shrink-0"
                  style={{ color: P }}
                >
                  └
                </span>
                <span
                  className="text-[10px] text-ink-body truncate"
                  style={{ maxWidth: '85%' }}
                  title={c}
                >
                  {truncate(c, 40)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
