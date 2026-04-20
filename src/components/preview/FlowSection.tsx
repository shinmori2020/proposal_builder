import { ProposalForm } from '@/lib/types';
import { Theme, shades } from '@/lib/themes';
import {
  itemDays,
  addDaysToDate,
  formatDate,
  formatDuration,
} from '@/lib/schedule';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function FlowSection({ form, theme }: Props) {
  const P = theme.primary;
  const cl = shades(P);
  const items = form.schedule;

  if (items.length <= 1) return null;

  const hasStart = !!form.scheduleStart;
  const startD = hasStart ? new Date(form.scheduleStart) : null;

  return (
    <div>
      <h2
        className="text-sm font-extrabold mb-2 pb-1 border-b-2 tracking-wide"
        style={{ color: P, borderBottomColor: P }}
      >
        制作フロー
      </h2>

      <div className="flex items-center justify-center flex-wrap py-1.5">
        {(() => {
          let dOff = 0;
          return items.map((s, i) => {
            const fd = hasStart && startD ? addDaysToDate(startD, dOff) : null;
            dOff += itemDays(s);

            return (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm leading-none"
                    style={{ background: cl[i % cl.length] }}
                  >
                    {i + 1}
                  </div>
                  <div
                    className="text-[9px] font-semibold text-ink-label text-center leading-tight"
                    style={{ maxWidth: 65 }}
                  >
                    {s.phase}
                  </div>
                  <div className="text-[8px] text-[#999]">
                    {hasStart && fd ? `${formatDate(fd)}〜` : formatDuration(s)}
                  </div>
                </div>

                {/* 矢印（最後以外） */}
                {i < items.length - 1 && (
                  <div className="mx-1 mb-6">
                    <svg width="18" height="9" viewBox="0 0 18 9">
                      <path
                        d="M0 4.5h14m-3-3l3 3-3 3"
                        stroke={P}
                        strokeWidth="1.4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
