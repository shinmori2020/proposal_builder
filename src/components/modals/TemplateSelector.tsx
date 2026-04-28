'use client';

import { useEffect, useState } from 'react';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { TEMPLATES } from '@/lib/templates';
import { C } from '@/lib/colors';
import {
  loadCustomTemplates,
  addCustomTemplate,
  deleteCustomTemplate,
  CustomTemplate,
} from '@/lib/storage';
import {
  FileText, Building2, UtensilsCrossed, Scissors,
  Hospital, Scale, Hammer, Users, Check, Star, Plus, X, Trash2,
} from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { ComponentType } from 'react';

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  FileText, Building2, UtensilsCrossed, Scissors,
  Hospital, Scale, Hammer, Users,
};

interface Props {
  form: ProposalForm;
  onSelectBuiltIn: (templateId: string) => void;
  onSelectCustom: (template: CustomTemplate) => void;
  onClose: () => void;
  theme: Theme;
}

type Selection =
  | { kind: 'builtin'; id: string }
  | { kind: 'custom'; id: string };

export default function TemplateSelector({
  form,
  onSelectBuiltIn,
  onSelectCustom,
  onClose,
  theme,
}: Props) {
  const [selected, setSelected] = useState<Selection | null>(null);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const P = theme.primary;

  useEffect(() => {
    setCustomTemplates(loadCustomTemplates());
  }, []);

  const handleCreateTemplate = () => {
    if (!newName.trim()) return;
    const updated = addCustomTemplate(newName, form);
    setCustomTemplates(updated);
    setNewName('');
    setShowCreateForm(false);
  };

  const handleDeleteCustom = (id: string) => {
    const updated = deleteCustomTemplate(id);
    setCustomTemplates(updated);
    // 削除したテンプレートが選択されていたら選択解除
    if (selected?.kind === 'custom' && selected.id === id) {
      setSelected(null);
    }
  };

  const handleApply = () => {
    if (!selected) return;
    if (selected.kind === 'builtin') {
      onSelectBuiltIn(selected.id);
    } else {
      const tpl = customTemplates.find((t) => t.id === selected.id);
      if (tpl) onSelectCustom(tpl);
    }
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-[720px] max-h-[95vh] sm:max-h-[90vh] overflow-auto shadow-xl border border-line-subtle"
      >
        <div className="p-5 pb-3.5 border-b border-line-subtle">
          <h2 className="m-0 text-xl font-extrabold" style={{ color: P }}>
            業種テンプレートを選択
          </h2>
        </div>

        {/* 標準テンプレート */}
        <div className="px-4 pt-4">
          <p className="text-meta font-semibold text-ink-soft mb-2 tracking-wide">
            標準テンプレート
          </p>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map((t) => {
              const IconComponent = ICON_MAP[t.icon];
              const isSelected =
                selected?.kind === 'builtin' && selected.id === t.id;

              return (
                <button
                  key={t.id}
                  onClick={() => setSelected({ kind: 'builtin', id: t.id })}
                  className="p-3.5 rounded-xl cursor-pointer text-left flex gap-3 items-center"
                  style={{
                    border: isSelected ? `2.5px solid ${P}` : `1.5px solid ${C.line.soft}`,
                    background: isSelected ? theme.bg : '#fff',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{
                      background: isSelected ? P : C.surface.track,
                    }}
                  >
                    {IconComponent && (
                      <IconComponent
                        size={20}
                        color={isSelected ? '#fff' : P}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className="font-bold text-sm truncate"
                      style={{ color: isSelected ? P : '#333' }}
                    >
                      {t.label}
                    </div>
                    <div className="text-xs text-ink-soft truncate">{t.desc}</div>
                  </div>
                  {isSelected && (
                    <Check size={18} color={P} className="ml-auto shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* カスタムテンプレート */}
        <div className="px-4 pt-5">
          <p className="text-meta font-semibold text-ink-soft mb-2 tracking-wide flex items-center gap-1.5">
            <Star size={12} color={P} fill={P} />
            自分のテンプレート ({customTemplates.length}件)
          </p>

          {customTemplates.length === 0 && !showCreateForm && (
            <p className="text-ink-softest text-xs text-center py-3 bg-surface-muted rounded-md">
              まだカスタムテンプレートはありません
            </p>
          )}

          {customTemplates.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {customTemplates.map((t) => {
                const isSelected =
                  selected?.kind === 'custom' && selected.id === t.id;
                return (
                  <div
                    key={t.id}
                    className="relative rounded-xl flex"
                    style={{
                      border: isSelected ? `2.5px solid ${P}` : `1.5px solid ${C.line.soft}`,
                      background: isSelected ? theme.bg : '#fff',
                    }}
                  >
                    <button
                      onClick={() => setSelected({ kind: 'custom', id: t.id })}
                      className="p-3 cursor-pointer text-left flex gap-2.5 items-center flex-1 min-w-0 bg-transparent border-none"
                    >
                      <div
                        className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0"
                        style={{
                          background: isSelected ? P : C.surface.track,
                        }}
                      >
                        <Star
                          size={18}
                          color={isSelected ? '#fff' : P}
                          fill={isSelected ? '#fff' : P}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className="font-bold text-label truncate"
                          style={{ color: isSelected ? P : '#333' }}
                        >
                          {t.name}
                        </div>
                        <div className="text-micro text-ink-soft">
                          {new Date(t.createdAt).toLocaleDateString('ja-JP')}
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={16} color={P} className="shrink-0" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`「${t.name}」を削除しますか？`)) {
                          handleDeleteCustom(t.id);
                        }
                      }}
                      className="w-7 h-7 border-none bg-transparent cursor-pointer flex items-center justify-center shrink-0 mr-1 self-start mt-1"
                      title="削除"
                    >
                      <Trash2 size={12} color={C.delete} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* 新規テンプレート作成フォーム / ボタン */}
          <div className="mt-3">
            {showCreateForm ? (
              <div
                className="p-3 rounded-lg flex gap-2 items-center"
                style={{ background: theme.bg, border: `1.5px solid ${P}` }}
              >
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateTemplate();
                    if (e.key === 'Escape') {
                      setShowCreateForm(false);
                      setNewName('');
                    }
                  }}
                  autoFocus
                  placeholder="テンプレート名 (例: 飲食店標準プラン)"
                  className="focus-ring flex-1 px-3 py-2 border-[1.5px] border-line-input rounded-md text-sm outline-none"
                />
                <button
                  onClick={handleCreateTemplate}
                  disabled={!newName.trim()}
                  className="px-4 py-2 border-none rounded-md text-white text-sm font-bold cursor-pointer"
                  style={{ background: newName.trim() ? P : C.line.default }}
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewName('');
                  }}
                  className="px-3 py-2 border-[1.5px] border-line-default rounded-md bg-white text-[#666] text-sm cursor-pointer"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full py-2.5 border-2 border-dashed rounded-lg bg-transparent text-label font-semibold cursor-pointer flex items-center justify-center gap-1.5"
                style={{ borderColor: P, color: P }}
              >
                <Plus size={15} color={P} />
                現在の入力内容を新規テンプレートとして保存
              </button>
            )}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="p-4 pt-5 mt-2 flex justify-end gap-3 border-t border-line-divider">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border-[1.5px] border-line-default bg-white text-[#666] text-sm cursor-pointer"
          >
            キャンセル
          </button>
          <button
            onClick={handleApply}
            disabled={!selected}
            className="px-7 py-2.5 rounded-lg border-none text-sm font-bold text-white"
            style={{
              background: selected ? P : C.line.default,
              cursor: selected ? 'pointer' : 'not-allowed',
            }}
          >
            作成
          </button>
        </div>
      </div>
    </div>
  );
}
