import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';

interface Props {
  form: ProposalForm;
  theme: Theme;
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
      <div className="flex flex-col items-center">
        {/* TOPノード */}
        <div
          className="text-white py-1.5 px-[18px] rounded-[7px] font-bold text-xs"
          style={{ background: P }}
        >
          {form.clientName || 'サイト'} TOP
        </div>

        {/* TOPから横ライン */}
        <div className="w-0.5 h-2.5" style={{ background: P }} />

        {/* ページノード */}
        <div className="flex justify-center flex-wrap relative gap-0">
          {/* 横つなぎライン（複数ページの場合のみ） */}
          {form.pages.length > 1 && (
            <div
              className="absolute top-0 h-0.5"
              style={{ background: P, left: '10%', right: '10%' }}
            />
          )}

          {form.pages.map((pg, i) => (
            <div
              key={i}
              className="flex flex-col items-center min-w-[75px] px-1"
            >
              <div className="w-0.5 h-2.5" style={{ background: P }} />
              <div
                className="py-0.5 px-2.5 rounded-[5px] text-[10px] font-semibold whitespace-nowrap border-2"
                style={{
                  background: theme.bg,
                  borderColor: P,
                  color: P,
                }}
              >
                {pg.name || '—'}
              </div>

              {/* 子ページ */}
              {pg.children.map((c, ci) => (
                <div key={ci} className="flex flex-col items-center">
                  <div
                    className="w-0.5 h-1.5"
                    style={{ background: `${P}66` }}
                  />
                  <div
                    className="bg-white py-0.5 px-[7px] rounded-[4px] text-[9px] whitespace-nowrap border-[1.5px]"
                    style={{ borderColor: `${P}66`, color: P }}
                  >
                    {c || '—'}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
