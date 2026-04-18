'use client';

import { ProposalForm, SchedulePhase } from '@/lib/types';
import { Theme, shades } from '@/lib/themes';
import {
  itemDays,
  totalDays,
  formatDuration,
  totalWeeksLabel,
  addDaysToDate,
  formatDate,
  formatDateFull,
} from '@/lib/schedule';
import { Plus, X } from 'lucide-react';

interface Props {
  form: ProposalForm;
  setForm: React.Dispatch<React.SetStateAction<ProposalForm>>;
  theme: Theme;
}

export default function ScheduleTab({ form, setForm, theme }: Props) {
  const P = theme.primary;
  const cl = shades(P);
  const items = form.schedule;
  const td = totalDays(items);
  const hasStart = !!form.scheduleStart;
  const startD = hasStart ? new Date(form.scheduleStart) : null;

  const setItems = (newItems: SchedulePhase[]) => {
    setForm((f) => ({ ...f, schedule: newItems }));
  };

  const updateItem = <K extends keyof SchedulePhase>(
    i: number,
    key: K,
    value: SchedulePhase[K]
  ) => {
    setItems(items.map((item, idx) => (idx === i ? { ...item, [key]: value } : item)));
  };

  const inputClass =
    'px-3 py-2 border-[1.5px] border-[#d0d8d4] rounded-md text-sm font-inherit outline-none box-border';

  return (
    <div className="flex flex-col gap-3.5">
      {/* 制作開始日 */}
      <div>
        <label className="block text-[13px] font-semibold text-[#444] mb-1">
          制作開始日（任意）
        </label>
        <div className="flex items-center gap-2.5 mt-1">
          <input
            type="date"
            value={form.scheduleStart || ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, scheduleStart: e.target.value }))
            }
            className={inputClass}
            style={{ width: 180 }}
          />
          {hasStart && (
            <button
              onClick={() => setForm((f) => ({ ...f, scheduleStart: '' }))}
              className="px-2.5 py-1 rounded-md border-[1.5px] border-[#c33] text-[#c33] bg-transparent text-[11px] cursor-pointer font-semibold flex items-center gap-1"
            >
              <X size={12} color="#c33" />
              クリア
            </button>
          )}
          <span className="text-[11px] text-[#999]">
            日付入力でガントチャートに反映
          </span>
        </div>
      </div>

      {/* フェーズリスト */}
      {items.map((item, i) => {
        let dateLabel = '';
        if (hasStart && startD) {
          let offset = 0;
          for (let j = 0; j < i; j++) offset += itemDays(items[j]);
          const from = addDaysToDate(startD, offset);
          const to = addDaysToDate(startD, offset + itemDays(item));
          dateLabel = `${formatDate(from)}〜${formatDate(to)}`;
        }

        return (
          <div
            key={i}
            className="bg-[#f8faf9] rounded-[9px] py-2.5 px-3 border border-[#e8ece9]"
          >
            <div className="flex gap-2 items-center">
              <input
                value={item.phase}
                onChange={(e) => updateItem(i, 'phase', e.target.value)}
                className={`${inputClass} flex-1`}
                placeholder="フェーズ名"
              />
              <div className="flex items-center gap-0.5">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={item.weeks || 0}
                  onChange={(e) => updateItem(i, 'weeks', Number(e.target.value))}
                  className={`${inputClass} text-center`}
                  style={{ width: 48 }}
                />
                <span className="text-[11px] text-[#666] min-w-[14px]">週</span>
              </div>
              <div className="flex items-center gap-0.5">
                <input
                  type="number"
                  min={0}
                  max={6}
                  step={1}
                  value={item.extraDays || 0}
                  onChange={(e) =>
                    updateItem(
                      i,
                      'extraDays',
                      Math.min(6, Math.max(0, Number(e.target.value)))
                    )
                  }
                  className={`${inputClass} text-center`}
                  style={{ width: 48 }}
                />
                <span className="text-[11px] text-[#666] min-w-[14px]">日</span>
              </div>
              <button
                onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                className="rounded-md border-[1.5px] border-[#c33] text-[#c33] bg-transparent cursor-pointer flex items-center justify-center py-1 px-2"
              >
                <X size={12} color="#c33" />
              </button>
            </div>
            <div className="flex justify-between mt-1 pl-1">
              <span className="text-[10px] text-[#999]">
                {formatDuration(item)}（{itemDays(item)}日間）
              </span>
              {dateLabel && (
                <span
                  className="text-[10px] font-medium"
                  style={{ color: P }}
                >
                  {dateLabel}
                </span>
              )}
            </div>
          </div>
        );
      })}

      <button
        onClick={() => setItems([...items, { phase: '', weeks: 1, extraDays: 0 }])}
        className="self-start px-4 py-2 rounded-lg border-none text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5"
        style={{ background: P }}
      >
        <Plus size={14} color="#fff" />
        フェーズ追加
      </button>

      {/* ガントチャート */}
      <div className="mt-1.5">
        <p className="font-semibold text-[13px] text-[#555] mb-1.5">
          ガントチャート（{totalWeeksLabel(items)}
          {hasStart && startD
            ? ` ・ ${formatDateFull(startD)}〜${formatDateFull(
                addDaysToDate(startD, td)
              )}`
            : ''}
          ）
        </p>
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
                <div
                  key={i}
                  className="flex items-center gap-2 h-[26px]"
                >
                  <span
                    className="text-[11px] text-[#555] text-right"
                    style={{ minWidth: 120 }}
                  >
                    {item.phase || '—'}
                  </span>
                  <div className="flex-1 relative h-[19px] bg-[#f0f4f2] rounded">
                    <div
                      className="absolute h-full rounded flex items-center justify-center text-white font-semibold whitespace-nowrap overflow-hidden"
                      style={{
                        left: `${left}%`,
                        width: `${percent}%`,
                        background: cl[i % cl.length],
                        fontSize: hasStart ? 9 : 10,
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
      </div>
    </div>
  );
}
