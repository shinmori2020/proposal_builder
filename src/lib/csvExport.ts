import { ProposalForm } from './types';

/**
 * CSV 用の値エスケープ。ダブルクォート・カンマ・改行を含む値を安全に出力する。
 */
function escapeCell(value: string | number): string {
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * 見積もり項目を CSV 形式でダウンロード。
 *
 * 列構成: プラン名 / 項目名 / 単位 / 数量 / 単価 / 小計
 * 末尾にプランごとの合計（税抜・税込）を付ける
 *
 * Excel での文字化けを防ぐため UTF-8 BOM 付きで出力。
 */
export function exportEstimateAsCsv(
  form: ProposalForm,
  filename: string
): void {
  const taxRate = form.taxRate ?? 10;
  const headers = ['プラン名', '項目名', '単位', '数量', '単価', '小計'];

  const rows: string[][] = [headers];

  for (const plan of form.plans) {
    // 行を出力（空項目はスキップ）
    const visibleItems = plan.items.filter(
      (it) => it.name.trim() !== '' || it.price !== 0
    );

    for (const it of visibleItems) {
      rows.push([
        plan.name,
        it.name,
        it.unit,
        String(it.qty),
        String(it.price),
        String(it.qty * it.price),
      ]);
    }

    // プランごとの合計行
    const sub = visibleItems.reduce((s, it) => s + it.qty * it.price, 0);
    let disc = 0;
    if (plan.discount.type === 'percent') {
      disc = Math.floor(sub * (plan.discount.value / 100));
    } else if (plan.discount.type === 'fixed') {
      disc = Math.min(plan.discount.value, sub);
    }
    const taxable = sub - disc;
    const tax = Math.floor(taxable * (taxRate / 100));
    const total = taxable + tax;

    rows.push([plan.name, '小計', '', '', '', String(sub)]);
    if (disc > 0) {
      rows.push([
        plan.name,
        plan.discount.label || '割引',
        '',
        '',
        '',
        String(-disc),
      ]);
    }
    rows.push([plan.name, `消費税(${taxRate}%)`, '', '', '', String(tax)]);
    rows.push([plan.name, '合計（税込）', '', '', '', String(total)]);
    rows.push([]); // 空行（プラン区切り）
  }

  const csvBody = rows
    .map((row) => row.map(escapeCell).join(','))
    .join('\r\n');

  // Excel での文字化け防止のため UTF-8 BOM を先頭に付ける
  const bom = '﻿';
  const blob = new Blob([bom + csvBody], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
