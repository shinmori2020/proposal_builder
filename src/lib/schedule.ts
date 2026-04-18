import { SchedulePhase } from './types';

export function itemDays(it: SchedulePhase): number {
  return (it.weeks || 0) * 7 + (it.extraDays || 0);
}

export function totalDays(items: SchedulePhase[]): number {
  return items.reduce((s, it) => s + itemDays(it), 0);
}

export function formatDuration(it: SchedulePhase): string {
  const w = it.weeks || 0;
  const d = it.extraDays || 0;
  if (w > 0 && d > 0) return `${w}週${d}日`;
  if (w > 0) return `${w}週間`;
  if (d > 0) return `${d}日`;
  return '—';
}

export function totalWeeksLabel(items: SchedulePhase[]): string {
  const d = totalDays(items);
  const w = Math.floor(d / 7);
  const r = d % 7;
  if (w > 0 && r > 0) return `${w}週${r}日`;
  if (w > 0) return `約${w}週間`;
  return `${d}日`;
}

export function addDaysToDate(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

export function formatDate(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function formatDateFull(d: Date): string {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
