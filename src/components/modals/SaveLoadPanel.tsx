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
  SavedProject,
  MAX_SAVED,
} from '@/lib/storage';
import { exportFormAsJson, importFormFromJson } from '@/lib/jsonTransfer';
import {
  Save,
  X,
  Pencil,
  Check,
  Search,
  Download,
  Upload,
  Tag,
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const P = theme.primary;

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
  }, []);

  const handleSave = () => {
    setSaving(true);
    const project = makeSavedProject(form);
    const updated = [project, ...projects].slice(0, MAX_SAVED);
    saveProjects(updated);
    setProjects(updated);
    setSaving(false);
    setMsg('保存しました');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);
    setProjects(updated);
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

  const handleExportJson = () => {
    const filename =
      form.projectName ||
      form.clientName ||
      `提案書_${new Date().toLocaleDateString('ja-JP').replace(/\//g, '-')}`;
    exportFormAsJson(form, filename);
    setMsg('JSON をダウンロードしました');
    setTimeout(() => setMsg(''), 3000);
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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-[540px] w-full max-h-[80vh] overflow-auto shadow-2xl"
      >
        {/* ヘッダー */}
        <div className="px-6 py-5 pb-3.5 border-b-2 border-line-muted flex justify-between items-center">
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
              className="flex-1 py-2 border-[1.5px] rounded-md bg-transparent text-[12px] cursor-pointer font-semibold flex items-center justify-center gap-1.5"
              style={{ borderColor: P, color: P }}
              title="現在の内容を JSON ファイルとしてダウンロード（バックアップ・他PCへ移行用）"
            >
              <Download size={13} color={P} />
              JSON ダウンロード
            </button>
            <button
              onClick={handleImportClick}
              className="flex-1 py-2 border-[1.5px] rounded-md bg-transparent text-[12px] cursor-pointer font-semibold flex items-center justify-center gap-1.5"
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

          {msg && (
            <div
              className="text-center font-semibold text-[13px] mt-2"
              style={{ color: P }}
            >
              {msg}
            </div>
          )}
        </div>

        {/* 保存済み一覧 */}
        <div className="px-6 pb-5">
          <div className="flex items-center justify-between mb-2.5 gap-2">
            <p className="text-[13px] font-semibold text-ink-soft m-0 shrink-0">
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
                  className="flex-1 border-none outline-none text-[12px] font-inherit bg-transparent"
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
                    className="py-0.5 px-2 rounded-full text-[11px] cursor-pointer font-semibold border-[1.5px] transition-colors"
                    style={{
                      borderColor: isActive ? P : C.line.default,
                      background: isActive ? theme.light : '#fff',
                      color: isActive ? P : '#666',
                    }}
                    title={`${count}件`}
                  >
                    #{tag}
                    <span className="ml-1 text-[10px] opacity-60">
                      {count}
                    </span>
                  </button>
                );
              })}
              {activeTags.length > 0 && (
                <button
                  onClick={() => setActiveTags([])}
                  className="py-0.5 px-2 rounded-full text-[11px] cursor-pointer font-semibold text-ink-soft border-none bg-transparent underline"
                >
                  フィルタ解除
                </button>
              )}
            </div>
          )}

          {projects.length === 0 && (
            <p className="text-ink-softest text-[13px] text-center py-5">
              保存された案件はありません
            </p>
          )}
          {projects.length > 0 && filteredProjects.length === 0 && (
            <p className="text-ink-softest text-[13px] text-center py-5">
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
                          className="focus-ring w-full px-2 py-1 border-[1.5px] border-line-input rounded-md text-[12px] outline-none"
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
                                  className="py-[1px] px-1.5 rounded-full text-[10px] cursor-pointer font-semibold border"
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
                    <div className="text-[11px] text-[#999] mt-1">
                      {new Date(p.savedAt).toLocaleString('ja-JP')}
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={confirmEdit}
                          className="py-1 px-2 border-[1.5px] rounded-md bg-transparent text-[11px] cursor-pointer font-semibold flex items-center gap-1"
                          style={{ borderColor: P, color: P }}
                        >
                          <Check size={12} color={P} />
                          保存
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="py-1 px-2 border-[1.5px] border-ink-soft rounded-md bg-transparent text-[11px] cursor-pointer font-semibold text-ink-soft"
                        >
                          取消
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleLoad(p)}
                          className="py-1 px-2.5 border-[1.5px] rounded-md bg-transparent text-[11px] cursor-pointer font-semibold"
                          style={{ borderColor: P, color: P }}
                        >
                          読込
                        </button>
                        <button
                          onClick={() => startEdit(p)}
                          className="py-1 px-2 border-[1.5px] border-ink-soft rounded-md bg-transparent text-[11px] cursor-pointer font-semibold text-ink-soft flex items-center"
                          title="名前とタグを編集"
                        >
                          <Pencil size={11} color="#888" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="py-1 px-2.5 border-[1.5px] border-ink-soft rounded-md bg-transparent text-[11px] cursor-pointer font-semibold text-ink-soft"
                        >
                          複製
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="py-1 px-2.5 border-[1.5px] rounded-md bg-transparent text-[11px] cursor-pointer font-semibold"
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
      </div>
    </div>
  );
}
