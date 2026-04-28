'use client';

import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { FileText, EyeOff, Coins, Save, Printer, Undo2, Redo2 } from 'lucide-react';

interface Props {
  form: ProposalForm;
  setForm: React.Dispatch<React.SetStateAction<ProposalForm>>;
  theme: Theme;
  onOpenSave: () => void;
  onPrint: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function Header({
  form,
  setForm,
  theme,
  onOpenSave,
  onPrint,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: Props) {
  const toggleHidePrices = () => {
    setForm((prev) => ({ ...prev, hidePrices: !prev.hidePrices }));
  };

  return (
    <header
      className="px-3 sm:px-5 py-2.5 sm:py-3 flex justify-between items-center gap-2 print:hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.dark} 100%)`,
      }}
    >
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <div
          className="w-9 h-9 sm:w-[44px] sm:h-[44px] rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          <FileText size={22} color="#fff" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-[22px] font-extrabold text-white m-0 leading-tight truncate">
            提案書ビルダー
          </h1>
          {/* サブタイトルはモバイルで非表示 */}
          <p className="hidden sm:block text-[14px] text-white/70 m-0">
            Web制作の提案書をかんたん作成
          </p>
        </div>
      </div>

      <div className="flex gap-1 sm:gap-1.5 shrink-0">
        {/* Undo/Redo はモバイルで非表示（PC のショートカット前提） */}
        <div className="hidden sm:flex gap-1 mr-1.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="元に戻す (Ctrl+Z)"
            className="w-9 h-9 rounded-[7px] text-white cursor-pointer flex items-center justify-center border-2 border-white/40 transition-opacity hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:border-white/20 disabled:hover:bg-transparent"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <Undo2 size={18} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="やり直す (Ctrl+Shift+Z)"
            className="w-9 h-9 rounded-[7px] text-white cursor-pointer flex items-center justify-center border-2 border-white/40 transition-opacity hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:border-white/20 disabled:hover:bg-transparent"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <Redo2 size={18} />
          </button>
        </div>
        <button
          onClick={toggleHidePrices}
          aria-label={form.hidePrices ? '金額を表示する' : '金額を非表示にする'}
          className="w-9 h-9 sm:w-auto sm:h-auto sm:px-3.5 sm:py-1.5 rounded-[7px] text-white text-[17px] font-semibold cursor-pointer flex items-center justify-center sm:gap-1.5 border-2 border-white/40"
          style={{
            background: form.hidePrices
              ? 'rgba(255,255,255,0.25)'
              : 'rgba(255,255,255,0.08)',
          }}
        >
          {form.hidePrices ? <EyeOff size={18} /> : <Coins size={18} />}
          <span className="hidden sm:inline">
            {form.hidePrices ? '金額非表示中' : '金額表示中'}
          </span>
        </button>
        <button
          onClick={onOpenSave}
          title="保存 (Ctrl+S)"
          aria-label="保存"
          className="w-9 h-9 sm:w-auto sm:h-auto sm:px-3.5 sm:py-1.5 rounded-[7px] text-white text-[17px] font-semibold cursor-pointer flex items-center justify-center sm:gap-1.5 border-2 border-white/40"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <Save size={18} />
          <span className="hidden sm:inline">保存</span>
        </button>
        <button
          onClick={onPrint}
          title="PDF 出力 (Ctrl+P)"
          aria-label="PDF 出力"
          className="w-9 h-9 sm:w-auto sm:h-auto sm:px-3.5 sm:py-1.5 rounded-[7px] text-white text-[17px] font-semibold cursor-pointer flex items-center justify-center sm:gap-1.5 border-2 border-white/40"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <Printer size={18} />
          <span className="hidden sm:inline">PDF</span>
        </button>
      </div>
    </header>
  );
}
