'use client';

import { Theme } from '@/lib/themes';
import { RefreshCw, X } from 'lucide-react';

interface Props {
  savedAt: string;
  theme: Theme;
  onRestore: () => void;
  onDiscard: () => void;
}

export default function RestoreDraftDialog({
  savedAt,
  theme,
  onRestore,
  onDiscard,
}: Props) {
  const P = theme.primary;
  const dateText = new Date(savedAt).toLocaleString('ja-JP');

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-5"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="bg-white rounded-xl max-w-[460px] w-full shadow-xl border border-line-subtle">
        <div className="p-5 pb-3 border-b border-line-subtle flex items-center gap-2">
          <RefreshCw size={20} color={P} />
          <h2 className="m-0 text-lg font-extrabold" style={{ color: P }}>
            未保存の作業があります
          </h2>
        </div>

        <div className="px-5 py-4">
          <p className="text-sm text-[#333] m-0 mb-3 leading-relaxed">
            前回の編集内容（自動保存）が残っています。
            <br />
            続きから編集しますか？
          </p>
          <p className="text-xs text-ink-soft m-0">
            最終更新: {dateText}
          </p>
        </div>

        <div className="p-4 pt-3 flex justify-end gap-3 border-t border-line-divider">
          <button
            onClick={onDiscard}
            className="px-5 py-2 rounded-lg border-[1.5px] border-line-default bg-white text-[#666] text-sm cursor-pointer font-semibold flex items-center gap-1.5"
          >
            <X size={14} color="#666" />
            破棄して最初から
          </button>
          <button
            onClick={onRestore}
            className="px-5 py-2 rounded-lg border-none text-white text-sm font-bold cursor-pointer flex items-center gap-1.5"
            style={{ background: P }}
          >
            <RefreshCw size={14} color="#fff" />
            続きから編集
          </button>
        </div>
      </div>
    </div>
  );
}
