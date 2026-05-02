'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { C } from '@/lib/colors';
import {
  loadProjects,
  saveProjects,
  makeSavedProject,
  renameProject,
  updateProjectTags,
  loadSnapshots,
  pushSnapshot,
  deleteSnapshot,
  getStorageUsage,
  formatBytes,
  SavedProject,
  VersionSnapshot,
  StorageUsage,
  MAX_SAVED,
} from '@/lib/storage';
import {
  exportFormAsJson,
  importFormFromJson,
  exportAllProjectsAsJson,
  importAllProjectsFromJson,
} from '@/lib/jsonTransfer';
import { exportEstimateAsCsv } from '@/lib/csvExport';
import { exportBothPdfVersions } from '@/lib/pdfExport';
import {
  Save,
  X,
  Pencil,
  Check,
  Search,
  Download,
  Upload,
  Tag,
  History,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Archive,
} from 'lucide-react';
import { useRef } from 'react';

interface Props {
  form: ProposalForm;
  setForm: React.Dispatch<React.SetStateAction<ProposalForm>>;
  theme: Theme;
  onClose: () => void;
}

export default function SaveLoadPanel({ form, setForm, theme, onClose }: Props) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTags, setEditTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [snapshots, setSnapshots] = useState<VersionSnapshot[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [usage, setUsage] = useState<StorageUsage>({
    used: 0,
    quota: 0,
    percent: 0,
    warning: false,
    critical: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const P = theme.primary;

  /** 使用量を再計算（保存・削除後など状態変化時に呼ぶ） */
  const refreshUsage = () => setUsage(getStorageUsage());

  // 全案件から集めたユニークタグ（使用数付き・ABC順）
  const tagCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) {
      for (const t of p.tags ?? []) {
        map.set(t, (map.get(t) ?? 0) + 1);
      }
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [projects]);

  // 検索クエリ + 選択タグ（AND）で絞り込み
  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return projects.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (activeTags.length > 0) {
        const pt = p.tags ?? [];
        if (!activeTags.every((t) => pt.includes(t))) return false;
      }
      return true;
    });
  }, [projects, searchQuery, activeTags]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const parseTags = (input: string): string[] =>
    Array.from(
      new Set(
        input
          .split(/[,、\s]+/)
          .map((t) => t.replace(/^#/, '').trim())
          .filter(Boolean)
      )
    );

  useEffect(() => {
    setProjects(loadProjects());
    setSnapshots(loadSnapshots());
    setUsage(getStorageUsage());
  }, []);

  const handleSave = () => {
    setSaving(true);
    const project = makeSavedProject(form);
    const updated = [project, ...projects].slice(0, MAX_SAVED);
    const ok = saveProjects(updated);
    if (!ok) {
      setSaving(false);
      alert(
        'ブラウザの保存容量が不足しているため、保存に失敗しました。\n' +
          '不要な保存案件・履歴を削除するか、JSON でバックアップしてから整理してください。'
      );
      return;
    }
    setProjects(updated);
    // 保存と同時に履歴スナップショットを追加（誤上書き救済用）
    setSnapshots(pushSnapshot(form));
    refreshUsage();
    setSaving(false);
    setMsg('保存しました');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleRestoreSnapshot = (snap: VersionSnapshot) => {
    if (
      confirm(
        '現在の編集内容を上書きしてこの履歴を復元しますか？\n\n' +
          `保存日時: ${new Date(snap.savedAt).toLocaleString('ja-JP')}`
      )
    ) {
      setForm(snap.data);
      onClose();
    }
  };

  const handleDeleteSnapshot = (id: string) => {
    setSnapshots(deleteSnapshot(id));
    refreshUsage();
  };

  const handleDelete = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);
    setProjects(updated);
    refreshUsage();
  };

  const handleLoad = (project: SavedProject) => {
    setForm(project.data);
    onClose();
  };

  const handleDuplicate = (project: SavedProject) => {
    setForm({
      ...project.data,
      projectName: project.data.projectName + '（コピー）',
    });
    onClose();
  };

  const startEdit = (project: SavedProject) => {
    setEditingId(project.id);
    setEditName(project.name);
    setEditTags((project.tags ?? []).map((t) => `#${t}`).join(' '));
  };

  const confirmEdit = () => {
    if (!editingId) return;
    let updated = renameProject(editingId, editName);
    updated = updateProjectTags(editingId, parseTags(editTags));
    setProjects(updated);
    setEditingId(null);
    setEditName('');
    setEditTags('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditTags('');
  };

  const baseFilename = () =>
    form.projectName ||
    form.clientName ||
    `提案書_${new Date().toLocaleDateString('ja-JP').replace(/\//g, '-')}`;

  const handleExportJson = () => {
    exportFormAsJson(form, baseFilename());
    setMsg('JSON をダウンロードしました');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleExportCsv = () => {
    exportEstimateAsCsv(form, baseFilename());
    setMsg('CSV をダウンロードしました');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleExportBothPdfs = async () => {
    setMsg('両バージョン PDF を生成中...');
    try {
      await exportBothPdfVersions(form, theme, baseFilename());
      setMsg('両バージョン PDF をダウンロードしました');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('');
      alert(
        `PDF 生成に失敗しました: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // input をリセット（同じファイルを再選択できるように）
    e.target.value = '';
    if (!file) return;

    try {
      const imported = await importFormFromJson(file);
      if (
        confirm(
          '現在の編集内容を上書きして、JSON ファイルの内容を読み込みますか？'
        )
      ) {
        setForm(imported);
        setMsg('JSON を読み込みました');
        setTimeout(() => setMsg(''), 3000);
        onClose();
      }
    } catch (err) {
      alert(
        `読み込みに失敗しました: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  const handleBulkExport = () => {
    if (projects.length === 0) {
      alert('保存済み案件がありません。');
      return;
    }
    exportAllProjectsAsJson(projects);
    setMsg(`全 ${projects.length} 件をバックアップしました`);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleBulkImportClick = () => {
    bulkInputRef.current?.click();
  };

  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    try {
      const imported = await importAllProjectsFromJson(file);
      if (imported.length === 0) {
        alert('バックアップ内に案件がありません。');
        return;
      }
      const choice = confirm(
        `バックアップから ${imported.length} 件を読み込みます。\n\n` +
          'OK: 既存の保存案件に追加（重複IDは置き換え）\n' +
          'キャンセル: 既存をすべて置き換え（既存案件は失われます）'
      );

      let merged: SavedProject[];
      if (choice) {
        // 追加マージ: 同じ id があれば imported 側で上書き
        const existingMap = new Map(projects.map((p) => [p.id, p]));
        for (const p of imported) existingMap.set(p.id, p);
        merged = Array.from(existingMap.values()).slice(0, MAX_SAVED);
      } else {
        if (
          !confirm(
            `本当に既存の ${projects.length} 件を上書きしますか？この操作は元に戻せません。`
          )
        ) {
          return;
        }
        merged = imported.slice(0, MAX_SAVED);
      }
      saveProjects(merged);
      setProjects(merged);
      setMsg(`${imported.length} 件を読み込みました`);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert(
        `読み込みに失敗しました: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-[540px] max-h-[90vh] sm:max-h-[80vh] overflow-auto shadow-xl border border-line-subtle"
      >
        {/* ヘッダー */}
        <div className="px-6 py-5 pb-3.5 border-b border-line-subtle flex justify-between items-center">
          <h2 className="m-0 text-lg font-extrabold" style={{ color: P }}>
            案件の保存・読み込み
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 border-none bg-line-divider rounded-lg cursor-pointer flex items-center justify-center"
          >
            <X size={14} color="#666" />
          </button>
        </div>

        {/* 保存ボタン */}
        <div className="px-6 py-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 border-none rounded-[10px] text-white text-sm font-bold cursor-pointer flex items-center justify-center gap-2"
            style={{ background: P }}
          >
            <Save size={18} color="#fff" />
            {saving ? '保存中...' : '現在の内容をブラウザに保存'}
          </button>

          {/* JSON エクスポート/インポート */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleExportJson}
              className="flex-1 py-2 border-[1.5px] rounded-md bg-transparent text-xs cursor-pointer font-semibold flex items-center justify-center gap-1.5"
              style={{ borderColor: P, color: P }}
              title="現在の内容を JSON ファイルとしてダウンロード（バックアップ・他PCへ移行用）"
            >
              <Download size={13} color={P} />
              JSON ダウンロード
            </button>
            <button
              onClick={handleImportClick}
              className="flex-1 py-2 border-[1.5px] rounded-md bg-transparent text-xs cursor-pointer font-semibold flex items-center justify-center gap-1.5"
              style={{ borderColor: P, color: P }}
              title="JSON ファイルを読み込んで現在の内容を置き換え"
            >
              <Upload size={13} color={P} />
              JSON 読込
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportJson}
            />
          </div>

          {/* 全案件の一括バックアップ */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleBulkExport}
              className="flex-1 py-2 border-[1.5px] border-ink-soft rounded-md bg-transparent text-xs cursor-pointer font-semibold text-ink-body flex items-center justify-center gap-1.5"
              title="保存済みの全案件を 1 つの JSON ファイルにバックアップ"
            >
              <Archive size={13} color="#666" />
              全案件バックアップ
            </button>
            <button
              onClick={handleBulkImportClick}
              className="flex-1 py-2 border-[1.5px] border-ink-soft rounded-md bg-transparent text-xs cursor-pointer font-semibold text-ink-body flex items-center justify-center gap-1.5"
              title="バックアップ JSON を読み込んで保存済み案件を復元"
            >
              <Upload size={13} color="#666" />
              バックアップ復元
            </button>
            <input
              ref={bulkInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleBulkImport}
            />
          </div>

          {/* 見積もり CSV ダウンロード + 両バージョン PDF */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleExportCsv}
              className="flex-1 py-2 border-[1.5px] border-ink-soft rounded-md bg-transparent text-xs cursor-pointer font-semibold text-ink-body flex items-center justify-center gap-1.5"
              title="見積もり項目を CSV（Excel 互換）でダウンロード"
            >
              <Download size={13} color="#666" />
              見積もり CSV
            </button>
            <button
              onClick={handleExportBothPdfs}
              className="flex-1 py-2 border-[1.5px] border-ink-soft rounded-md bg-transparent text-xs cursor-pointer font-semibold text-ink-body flex items-center justify-center gap-1.5"
              title="金額あり版と金額なし版を両方ダウンロード（内部用 + 提示用）"
            >
              <Download size={13} color="#666" />
              両バージョン PDF
            </button>
          </div>

          {/* localStorage 使用量バー */}
          <div className="mt-3 px-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-meta text-ink-soft">
                ブラウザ保存容量
              </span>
              <span
                className="text-meta font-semibold"
                style={{
                  color: usage.critical
                    ? C.delete
                    : usage.warning
                      ? '#d97706'
                      : '#888',
                }}
              >
                {formatBytes(usage.used)} / {formatBytes(usage.quota)}（
                {usage.percent}%）
              </span>
            </div>
            <div className="h-1.5 bg-line-divider rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${usage.percent}%`,
                  background: usage.critical
                    ? C.delete
                    : usage.warning
                      ? '#d97706'
                      : P,
                }}
              />
            </div>
            {usage.warning && (
              <p
                className="text-meta mt-1 m-0"
                style={{ color: usage.critical ? C.delete : '#d97706' }}
              >
                {usage.critical
                  ? '⚠ 容量がほぼ上限です。不要な案件・履歴を削除してください。'
                  : '⚠ 容量が逼迫しています。整理をご検討ください。'}
              </p>
            )}
          </div>

          {msg && (
            <div
              className="text-center font-semibold text-label mt-2"
              style={{ color: P }}
            >
              {msg}
            </div>
          )}
        </div>

        {/* 保存済み一覧 */}
        <div className="px-6 pb-5">
          <div className="flex items-center justify-between mb-2.5 gap-2">
            <p className="text-label font-bold text-ink-body m-0 shrink-0">
              保存済み（
              {searchQuery.trim() || activeTags.length > 0
                ? `${filteredProjects.length}/${projects.length}`
                : projects.length}
              件）
            </p>
            {projects.length > 0 && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 border-[1.5px] border-line-input rounded-md bg-white flex-1 max-w-[220px]"
              >
                <Search size={12} color="#888" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="案件名で検索..."
                  className="flex-1 border-none outline-none text-xs font-inherit bg-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="w-4 h-4 border-none bg-transparent cursor-pointer flex items-center justify-center p-0"
                    title="クリア"
                  >
                    <X size={11} color="#888" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* タグフィルターバー（AND 絞り込み） */}
          {tagCounts.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
              <Tag size={12} color="#888" />
              {tagCounts.map(([tag, count]) => {
                const isActive = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="py-0.5 px-2 rounded-full text-meta cursor-pointer font-semibold border-[1.5px] transition-colors"
                    style={{
                      borderColor: isActive ? P : C.line.default,
                      background: isActive ? theme.light : '#fff',
                      color: isActive ? P : '#666',
                    }}
                    title={`${count}件`}
                  >
                    #{tag}
                    <span className="ml-1 text-micro opacity-60">
                      {count}
                    </span>
                  </button>
                );
              })}
              {activeTags.length > 0 && (
                <button
                  onClick={() => setActiveTags([])}
                  className="py-0.5 px-2 rounded-full text-meta cursor-pointer font-semibold text-ink-soft border-none bg-transparent underline"
                >
                  フィルタ解除
                </button>
              )}
            </div>
          )}

          {projects.length === 0 && (
            <p className="text-ink-softest text-label text-center py-5">
              保存された案件はありません
            </p>
          )}
          {projects.length > 0 && filteredProjects.length === 0 && (
            <p className="text-ink-softest text-label text-center py-5">
              条件に一致する案件はありません
            </p>
          )}
          <div className="flex flex-col gap-2">
            {filteredProjects.map((p) => {
              const isEditing = editingId === p.id;
              const pTags = p.tags ?? [];
              return (
                <div
                  key={p.id}
                  className="py-3 px-3.5 border-[1.5px] border-line-subtle rounded-[10px] flex justify-between items-start gap-2"
                >
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') confirmEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                          placeholder="案件名"
                          className="focus-ring w-full px-2 py-1 border-[1.5px] border-line-input rounded-md text-sm outline-none"
                          style={{ borderColor: P }}
                        />
                        <input
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') confirmEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          placeholder="タグ（スペース/カンマ区切り・例: A社 コーポレート）"
                          className="focus-ring w-full px-2 py-1 border-[1.5px] border-line-input rounded-md text-xs outline-none"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="font-semibold text-sm text-[#333] truncate">
                          {p.name}
                        </div>
                        {pTags.length > 0 && (
                          <div className="flex gap-1 flex-wrap mt-1">
                            {pTags.map((t) => {
                              const isActive = activeTags.includes(t);
                              return (
                                <button
                                  key={t}
                                  onClick={() => toggleTag(t)}
                                  className="py-[1px] px-1.5 rounded-full text-micro cursor-pointer font-semibold border"
                                  style={{
                                    borderColor: isActive ? P : C.line.soft,
                                    background: isActive ? theme.light : '#f7f7f7',
                                    color: isActive ? P : '#666',
                                  }}
                                  title="クリックで絞り込み"
                                >
                                  #{t}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                    <div className="text-meta text-[#999] mt-1">
                      {new Date(p.savedAt).toLocaleString('ja-JP')}
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={confirmEdit}
                          className="py-1 px-2 border-[1.5px] rounded-md bg-transparent text-meta cursor-pointer font-semibold flex items-center gap-1"
                          style={{ borderColor: P, color: P }}
                        >
                          <Check size={12} color={P} />
                          保存
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="py-1 px-2 border-[1.5px] border-ink-soft rounded-md bg-transparent text-meta cursor-pointer font-semibold text-ink-soft"
                        >
                          取消
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleLoad(p)}
                          className="py-1 px-2.5 border-[1.5px] rounded-md bg-transparent text-meta cursor-pointer font-semibold"
                          style={{ borderColor: P, color: P }}
                        >
                          読込
                        </button>
                        <button
                          onClick={() => startEdit(p)}
                          className="py-1 px-2 border-[1.5px] border-ink-soft rounded-md bg-transparent text-meta cursor-pointer font-semibold text-ink-soft flex items-center"
                          title="名前とタグを編集"
                        >
                          <Pencil size={11} color="#888" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="py-1 px-2.5 border-[1.5px] border-ink-soft rounded-md bg-transparent text-meta cursor-pointer font-semibold text-ink-soft"
                        >
                          複製
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="py-1 px-2.5 border-[1.5px] rounded-md bg-transparent text-meta cursor-pointer font-semibold"
                          style={{ borderColor: C.delete, color: C.delete }}
                        >
                          削除
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* バージョン履歴（折りたたみ式） */}
        <div className="px-6 pb-5 border-t border-line-subtle">
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="w-full py-3 flex items-center justify-between cursor-pointer bg-transparent border-none"
          >
            <span className="flex items-center gap-2 text-label font-semibold text-ink-body">
              <History size={14} color="#666" />
              バージョン履歴（{snapshots.length}件）
            </span>
            {showHistory ? (
              <ChevronUp size={16} color="#666" />
            ) : (
              <ChevronDown size={16} color="#666" />
            )}
          </button>
          {showHistory && (
            <>
              {snapshots.length === 0 ? (
                <p className="text-ink-softest text-label text-center py-4">
                  履歴はまだありません。「現在の内容をブラウザに保存」を押すと自動的に記録されます。
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {snapshots.map((s) => {
                    const label =
                      s.data.projectName ||
                      s.data.clientName ||
                      '（無題）';
                    return (
                      <div
                        key={s.id}
                        className="py-2 px-3 border border-line-subtle rounded-md flex justify-between items-center gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-[#333] truncate">
                            {label}
                          </div>
                          <div className="text-meta text-[#999] mt-0.5">
                            {new Date(s.savedAt).toLocaleString('ja-JP')}
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleRestoreSnapshot(s)}
                            className="py-1 px-2 border-[1.5px] rounded-md bg-transparent text-meta cursor-pointer font-semibold flex items-center gap-1"
                            style={{ borderColor: P, color: P }}
                            title="この時点の状態に戻す"
                          >
                            <RotateCcw size={10} color={P} />
                            復元
                          </button>
                          <button
                            onClick={() => handleDeleteSnapshot(s.id)}
                            className="py-1 px-2 border-[1.5px] rounded-md bg-transparent text-meta cursor-pointer font-semibold"
                            style={{
                              borderColor: C.delete,
                              color: C.delete,
                            }}
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
