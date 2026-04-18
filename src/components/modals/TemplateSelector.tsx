'use client';

import { useState } from 'react';
import { Theme } from '@/lib/themes';
import { TEMPLATES } from '@/lib/templates';
import { C } from '@/lib/colors';
import {
  FileText, Building2, UtensilsCrossed, Scissors,
  Hospital, Scale, Hammer, Users, Check,
} from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { ComponentType } from 'react';

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  FileText, Building2, UtensilsCrossed, Scissors,
  Hospital, Scale, Hammer, Users,
};

interface Props {
  onSelect: (templateId: string) => void;
  onClose: () => void;
  theme: Theme;
}

export default function TemplateSelector({ onSelect, onClose, theme }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const P = theme.primary;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-[700px] w-full max-h-[85vh] overflow-auto shadow-2xl"
      >
        <div className="p-5 pb-3.5 border-b-2 border-line-muted">
          <h2 className="m-0 text-xl font-extrabold" style={{ color: P }}>
            業種テンプレートを選択
          </h2>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3">
          {TEMPLATES.map((t) => {
            const IconComponent = ICON_MAP[t.icon];
            const isSelected = selected === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
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
                <div>
                  <div
                    className="font-bold text-sm"
                    style={{ color: isSelected ? P : '#333' }}
                  >
                    {t.label}
                  </div>
                  <div className="text-xs text-ink-soft">{t.desc}</div>
                </div>
                {isSelected && (
                  <Check size={18} color={P} className="ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-3.5 pt-3 flex justify-end gap-3 border-t border-line-divider">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border-[1.5px] border-line-default bg-white text-[#666] text-sm cursor-pointer"
          >
            キャンセル
          </button>
          <button
            onClick={() => {
              if (selected) {
                onSelect(selected);
                onClose();
              }
            }}
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
