import ExcelJS from 'exceljs';
import { ProposalForm } from './types';

/**
 * 見積もりを Excel (.xlsx) ファイルとしてダウンロード。
 *
 * - プラン1つ = ワークシート1枚
 * - 各シートに「プラン名 → 項目テーブル → 小計/割引/消費税/合計」を出力
 * - ヘッダー行は太字 + 背景色、合計行は強調表示
 * - xlsx は内部的に UTF-8 固定なので文字化けの心配なし
 */
export async function exportEstimateAsExcel(
  form: ProposalForm,
  filename: string
): Promise<void> {
  const taxRate = form.taxRate ?? 10;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = '提案書ビルダー';
  workbook.created = new Date();

  // シート名は重複不可、プラン名が重複した場合は (2) (3) で連番
  const usedNames = new Set<string>();
  const safeSheetName = (raw: string, idx: number): string => {
    let name = (raw || `プラン${idx + 1}`)
      // Excel のシート名で禁止されている文字を除去
      .replace(/[\\/?*[\]:]/g, '_')
      .slice(0, 31);
    if (!usedNames.has(name)) {
      usedNames.add(name);
      return name;
    }
    let n = 2;
    while (usedNames.has(`${name} (${n})`)) n++;
    const result = `${name} (${n})`.slice(0, 31);
    usedNames.add(result);
    return result;
  };

  for (let i = 0; i < form.plans.length; i++) {
    const plan = form.plans[i];
    const sheet = workbook.addWorksheet(safeSheetName(plan.name, i));

    sheet.columns = [
      { key: 'name', width: 36 },
      { key: 'unit', width: 8 },
      { key: 'qty', width: 8 },
      { key: 'price', width: 12 },
      { key: 'total', width: 14 },
    ];

    // タイトル行（プラン名）
    const titleRow = sheet.addRow([
      `${plan.recommended ? '★ ' : ''}${plan.name}`,
    ]);
    titleRow.font = { size: 14, bold: true, color: { argb: 'FF222222' } };
    sheet.mergeCells(titleRow.number, 1, titleRow.number, 5);
    sheet.getRow(titleRow.number).height = 22;

    // 空行
    sheet.addRow([]);

    // ヘッダー行
    const headerRow = sheet.addRow([
      '項目名',
      '単位',
      '数量',
      '単価',
      '小計',
    ]);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4A6B5A' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };
    });

    // データ行
    const visibleItems = plan.items.filter(
      (it) => it.name.trim() !== '' || it.price !== 0
    );

    visibleItems.forEach((it) => {
      const row = sheet.addRow([
        it.name,
        it.unit,
        it.qty,
        it.price,
        it.qty * it.price,
      ]);
      // 数値書式: 単価・小計を ¥ 表示 + カンマ区切り
      row.getCell(4).numFmt = '"¥"#,##0';
      row.getCell(5).numFmt = '"¥"#,##0';
      row.getCell(2).alignment = { horizontal: 'center' };
      row.getCell(3).alignment = { horizontal: 'center' };
      row.eachCell((cell) => {
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFEEEEEE' } },
        };
      });
    });

    // サマリー行
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

    sheet.addRow([]); // 区切り行

    const subRow = sheet.addRow(['', '', '', '小計', sub]);
    subRow.getCell(4).font = { bold: true };
    subRow.getCell(4).alignment = { horizontal: 'right' };
    subRow.getCell(5).numFmt = '"¥"#,##0';

    if (disc > 0) {
      const discRow = sheet.addRow([
        '',
        '',
        '',
        plan.discount.label || '割引',
        -disc,
      ]);
      discRow.getCell(4).font = { bold: true, color: { argb: 'FFCC3333' } };
      discRow.getCell(4).alignment = { horizontal: 'right' };
      discRow.getCell(5).numFmt = '"¥"#,##0';
      discRow.getCell(5).font = { color: { argb: 'FFCC3333' } };
    }

    const taxRow = sheet.addRow(['', '', '', `消費税 (${taxRate}%)`, tax]);
    taxRow.getCell(4).font = { bold: true };
    taxRow.getCell(4).alignment = { horizontal: 'right' };
    taxRow.getCell(5).numFmt = '"¥"#,##0';

    const totalRow = sheet.addRow(['', '', '', '合計（税込）', total]);
    totalRow.font = { bold: true, size: 12 };
    totalRow.getCell(4).alignment = { horizontal: 'right' };
    totalRow.getCell(5).numFmt = '"¥"#,##0';
    totalRow.eachCell((cell, colNumber) => {
      if (colNumber >= 4) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE8F0EA' },
        };
        cell.border = {
          top: { style: 'medium', color: { argb: 'FF4A6B5A' } },
        };
      }
    });
  }

  // バッファ生成 → ダウンロード
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
