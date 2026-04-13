'use client';

import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { FileText, EyeOff, Coins, Save, Printer } from 'lucide-react';

interface Props {
  form: ProposalForm;
  setForm: React.Dispatch<React.SetStateAction<ProposalForm>>;
  theme: Theme;
  onOpenSave: () => void;
}

export default function Header({ form, setForm, theme, onOpenSave }: Props) {
  const toggleHidePrices = () => {
    setForm((prev) => ({ ...prev, hidePrices: !prev.hidePrices }));
  };

  const handlePrint = () => {
    const el = document.getElementById('proposal-preview');
    if (!el) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${form.projectName || '提案書'}</title><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>body{margin:0;padding:20px;font-family:'Noto Sans JP',sans-serif}@media print{body{padding:0}}</style></head><body>${el.outerHTML}</body></html>`
    );
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  return (
    <header
      className="px-5 py-3 flex justify-between items-center"
      style={{
        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.dark} 100%)`,
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-[34px] h-[34px] rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          <FileText size={18} color="#fff" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-white m-0 leading-tight">
            提案書ビルダー
          </h1>
          <p className="text-[10px] text-white/70 m-0">
            Web制作の提案書をかんたん作成
          </p>
        </div>
      </div>

      <div className="flex gap-1.5">
        <button
          onClick={toggleHidePrices}
          className="px-3.5 py-1.5 rounded-[7px] text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 border-2 border-white/40"
          style={{
            background: form.hidePrices
              ? 'rgba(255,255,255,0.25)'
              : 'rgba(255,255,255,0.08)',
          }}
        >
          {form.hidePrices ? <EyeOff size={14} /> : <Coins size={14} />}
          {form.hidePrices ? '金額非表示中' : '金額表示中'}
        </button>
        <button
          onClick={onOpenSave}
          className="px-3.5 py-1.5 rounded-[7px] text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 border-2 border-white/40"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <Save size={14} />
          保存
        </button>
        <button
          onClick={handlePrint}
          className="px-3.5 py-1.5 rounded-[7px] text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 border-2 border-white/40"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <Printer size={14} />
          PDF
        </button>
      </div>
    </header>
  );
}
