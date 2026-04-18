'use client';

import { useEffect, useState } from 'react';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { C } from '@/lib/colors';
import {
  loadProjects,
  saveProjects,
  makeSavedProject,
  SavedProject,
  MAX_SAVED,
} from '@/lib/storage';
import { Save, X } from 'lucide-react';

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
  const P = theme.primary;

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
    setTimeout(() => setMsg(''), 2000);
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
            {saving ? '保存中...' : '現在の内容を保存'}
          </button>
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
          <p className="text-[13px] font-semibold text-ink-soft mb-2.5">
            保存済み（{projects.length}件）
          </p>
          {projects.length === 0 && (
            <p className="text-ink-softest text-[13px] text-center py-5">
              保存された案件はありません
            </p>
          )}
          <div className="flex flex-col gap-2">
            {projects.map((p) => (
              <div
                key={p.id}
                className="py-3 px-3.5 border-[1.5px] border-line-subtle rounded-[10px] flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-sm text-[#333]">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-[#999] mt-0.5">
                    {new Date(p.savedAt).toLocaleString('ja-JP')}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleLoad(p)}
                    className="py-1 px-2.5 border-[1.5px] rounded-md bg-transparent text-[11px] cursor-pointer font-semibold"
                    style={{ borderColor: P, color: P }}
                  >
                    読込
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
