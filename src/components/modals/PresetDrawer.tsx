'use client';

import { useState } from 'react';
import { EstimateItem } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { C } from '@/lib/colors';
import { ESTIMATE_PRESETS } from '@/lib/presets';
import { formatPrice } from '@/lib/calculations';
import {
  Compass, Palette, Code2, Wrench, Mail,
  TrendingUp, Shield, CheckCircle2, X, Check, Plus,
} from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { ComponentType } from 'react';

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  Compass, Palette, Code2, Wrench, Mail,
  TrendingUp, Shield, CheckCircle2,
};

interface Props {
  onAdd: (item: EstimateItem) => void;
  onClose: () => void;
  theme: Theme;
}

export default function PresetDrawer({ onAdd, onClose, theme }: Props) {
  const [activeCategory, setActiveCategory] = useState(ESTIMATE_PRESETS[0].category);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const P = theme.primary;

  const handleAdd = (item: EstimateItem) => {
    onAdd({ ...item });
    setAdded((prev) => new Set(prev).add(item.name));
    setTimeout(() => {
      setAdded((prev) => {
        const next = new Set(prev);
        next.delete(item.name);
        return next;
      });
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      {/* 左側の余白クリックで閉じる */}
      <div onClick={onClose} className="flex-1" />

      {/* ドロワー本体（モバイルは全幅） */}
      <div
        className="w-full sm:w-[420px] bg-white flex flex-col h-full border-l border-line-subtle"
        style={{ boxShadow: '-4px 0 20px rgba(0,0,0,0.08)' }}
      >
        {/* ヘッダー */}
        <div className="px-5 py-4 border-b border-line-subtle flex justify-between items-center">
          <h2 className="m-0 text-[17px] font-extrabold" style={{ color: P }}>
            項目プリセット
          </h2>
          <button
            onClick={onClose}
            className="w-[30px] h-[30px] border-none bg-line-divider rounded-lg cursor-pointer flex items-center justify-center"
          >
            <X size={14} color="#666" />
          </button>
        </div>

        {/* カテゴリタブ */}
        <div className="flex flex-wrap gap-1.5 px-[18px] py-2.5 border-b border-line-divider bg-surface-faint">
          {ESTIMATE_PRESETS.map((c) => {
            const IconComponent = ICON_MAP[c.icon];
            const isActive = activeCategory === c.category;

            return (
              <button
                key={c.category}
                onClick={() => setActiveCategory(c.category)}
                className="py-1 px-2.5 rounded-[14px] text-meta cursor-pointer flex items-center gap-1 border-[1.5px]"
                style={{
                  borderColor: isActive ? P : C.line.soft,
                  background: isActive ? theme.light : '#fff',
                  color: isActive ? P : '#666',
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                {IconComponent && (
                  <IconComponent size={13} color={isActive ? P : '#999'} />
                )}
                {c.category}
              </button>
            );
          })}
        </div>

        {/* アイテムリスト */}
        <div className="flex-1 overflow-y-auto px-[18px] py-2.5">
          {ESTIMATE_PRESETS.filter((c) => c.category === activeCategory).map((c) => (
            <div key={c.category} className="flex flex-col gap-[7px]">
              {c.items.map((item, i) => {
                const isAdded = added.has(item.name);

                return (
                  <button
                    key={i}
                    onClick={() => handleAdd(item)}
                    className="flex justify-between items-center py-2.5 px-3.5 rounded-[9px] cursor-pointer text-left border-[1.5px]"
                    style={{
                      borderColor: isAdded ? P : C.line.subtle,
                      background: isAdded ? theme.light : '#fff',
                    }}
                  >
                    <div>
                      <div className="font-semibold text-label text-[#333]">
                        {item.name}
                      </div>
                      <div className="text-meta text-ink-soft mt-px">
                        {item.qty}
                        {item.unit} × ¥{formatPrice(item.price)} ={' '}
                        <strong style={{ color: P }}>
                          ¥{formatPrice(item.qty * item.price)}
                        </strong>
                      </div>
                    </div>
                    <span
                      className="text-meta font-bold flex items-center gap-0.5"
                      style={{ color: isAdded ? P : C.ink.softer }}
                    >
                      {isAdded ? (
                        <>
                          <Check size={13} color={P} /> 済
                        </>
                      ) : (
                        <>
                          <Plus size={13} color={C.ink.softer} /> 追加
                        </>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
