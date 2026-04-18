import { ProposalForm } from '@/lib/types';
import { Theme, shades } from '@/lib/themes';
import {
  itemDays,
  totalDays,
  totalWeeksLabel,
  addDaysToDate,
  formatDate,
  formatDateFull,
  formatDuration,
} from '@/lib/schedule';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function ScheduleSection({ form, theme }: Props) {
  const P = theme.primary;
  const cl = shades(P);
  const items = form.schedule;

  if (items.length === 0) return null;

  const td = totalDays(items);
  const twLabel = totalWeeksLabel(items);
  const hasStart = !!form.scheduleStart;
  const startD = hasStart ? new Date(form.scheduleStart) : null;

  return (
    <div>
      <h2
        className="text-sm font-extrabold mb-2 pb-1 border-b-2 tracking-wide"
        style={{ color: P, borderBottomColor: P }}
      >
        制作スケジュール
      </h2>

      <div className="flex flex-col gap-0.5">
        {(() => {
          let offset = 0;
          return items.map((item, i) => {
            const d = itemDays(item);
            const percent = td > 0 ? (d / td) * 100 : 0;
            const left = td > 0 ? (offset / td) * 100 : 0;
            const fromD = hasStart && startD ? addDaysToDate(startD, offset) : null;
            const toD =
              hasStart && startD ? addDaysToDate(startD, offset + d) : null;
            offset += d;

            return (
              <div key={i} className="flex items-center gap-2 h-[22px]">
                <span
                  className="text-[10px] text-[#555] text-right"
                  style={{ minWidth: 100 }}
                >
                  {item.phase || '—'}
                </span>
                <div className="flex-1 relative h-[15px] bg-[#f0f4f2] rounded-[3px]">
                  <div
                    className="absolute h-full rounded-[3px] flex items-center justify-center text-white font-semibold whitespace-nowrap overflow-hidden text-[8px]"
                    style={{
                      left: `${left}%`,
                      width: `${percent}%`,
                      background: cl[i % cl.length],
                    }}
                  >
                    {hasStart && fromD && toD
                      ? `${formatDate(fromD)}–${formatDate(toD)}`
                      : formatDuration(item)}
                  </div>
                </div>
              </div>
            );
          });
        })()}
      </div>
      <p className="text-right text-[10px] text-[#888] mt-1">
        {hasStart && startD
          ? `${formatDateFull(startD)}〜${formatDateFull(
              addDaysToDate(startD, td)
            )}（${twLabel}）`
          : twLabel}
      </p>
    </div>
  );
}
