import { ProposalForm } from './types';
import { defaultForm } from './defaults';
import { SavedProject } from './storage';

const EXPORT_VERSION = 1;
const BULK_EXPORT_KIND = 'proposal-projects-bulk';

interface ExportedData {
  version: number;
  exportedAt: string;
  form: ProposalForm;
}

interface BulkExportData {
  kind: typeof BULK_EXPORT_KIND;
  version: number;
  exportedAt: string;
  count: number;
  projects: SavedProject[];
}

/**
 * 現在のフォーム内容を JSON ファイルとしてダウンロード
 */
export function exportFormAsJson(form: ProposalForm, filename: string): void {
  const data: ExportedData = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    form,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * JSON ファイルを読み込んで ProposalForm を返す
 * 旧フォーマット・欠損フィールドもデフォルト値でマージして許容
 */
export function importFormFromJson(file: File): Promise<ProposalForm> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        // 本ツールのエクスポート形式 ({ version, form })
        let formData: unknown;
        if (parsed && typeof parsed === 'object' && 'form' in parsed) {
          formData = (parsed as ExportedData).form;
        } else if (
          parsed &&
          typeof parsed === 'object' &&
          'plans' in parsed &&
          'pages' in parsed
        ) {
          // 生の ProposalForm 形式も受け付ける
          formData = parsed;
        } else {
          reject(new Error('提案書ビルダーの JSON ファイルではありません'));
          return;
        }

        // デフォルト値にマージして欠損フィールドを補完
        const merged: ProposalForm = {
          ...defaultForm(),
          ...(formData as Partial<ProposalForm>),
        };

        resolve(merged);
      } catch (err) {
        reject(
          new Error(
            `JSON の解析に失敗しました: ${err instanceof Error ? err.message : String(err)}`
          )
        );
      }
    };
    reader.onerror = () =>
      reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsText(file);
  });
}

/**
 * 保存済み案件すべてを 1 つの JSON にまとめてダウンロード（一括バックアップ）
 */
export function exportAllProjectsAsJson(projects: SavedProject[]): void {
  const data: BulkExportData = {
    kind: BULK_EXPORT_KIND,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    count: projects.length,
    projects,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date()
    .toLocaleDateString('ja-JP')
    .replace(/\//g, '-');
  a.href = url;
  a.download = `案件バックアップ_${dateStr}_${projects.length}件.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * 一括バックアップ JSON を読み込んで SavedProject[] を返す。
 * 既存の保存案件にどう統合するかは呼び出し側の判断（追加 / 上書き）。
 */
export function importAllProjectsFromJson(
  file: File
): Promise<SavedProject[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        if (
          !parsed ||
          typeof parsed !== 'object' ||
          parsed.kind !== BULK_EXPORT_KIND ||
          !Array.isArray(parsed.projects)
        ) {
          reject(
            new Error(
              '一括バックアップ用の JSON ファイルではありません'
            )
          );
          return;
        }

        // 案件ごとにフォーム部分はデフォルトでマージして欠損フィールド補完
        const projects: SavedProject[] = (parsed.projects as SavedProject[])
          .filter((p) => p && typeof p === 'object' && p.id && p.data)
          .map((p) => ({
            ...p,
            data: { ...defaultForm(), ...p.data },
          }));

        resolve(projects);
      } catch (err) {
        reject(
          new Error(
            `JSON の解析に失敗しました: ${err instanceof Error ? err.message : String(err)}`
          )
        );
      }
    };
    reader.onerror = () =>
      reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsText(file);
  });
}
