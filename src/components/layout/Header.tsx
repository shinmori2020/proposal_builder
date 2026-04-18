'use client';

import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { FileText, EyeOff, Coins, Save, Printer } from 'lucide-react';

interface Props {
  form: ProposalForm;
  setForm: React.Dispatch<React.SetStateAction<ProposalForm>>;
  theme: Theme;
  onOpenSave: () => void;
  onPrint: () => void;
}

export default function Header({ form, setForm, theme, onOpenSave, onPrint }: Props) {
  const toggleHidePrices = () => {
    setForm((prev) => ({ ...prev, hidePrices: !prev.hidePrices }));
  };

  return (
    <header
      className="px-5 py-3 flex justify-between items-center print:hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.dark} 100%)`,
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-[44px] h-[44px] rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          <FileText size={26} color="#fff" />
        </div>
        <div>
          <h1 className="text-[22px] font-extrabold text-white m-0 leading-tight">
            提案書ビルダー
          </h1>
          <p className="text-[14px] text-white/70 m-0">
            Web制作の提案書をかんたん作成
          </p>
        </div>
      </div>

      <div className="flex gap-1.5">
        <button
          onClick={toggleHidePrices}
          className="px-3.5 py-1.5 rounded-[7px] text-white text-[17px] font-semibold cursor-pointer flex items-center gap-1.5 border-2 border-white/40"
          style={{
            background: form.hidePrices
              ? 'rgba(255,255,255,0.25)'
              : 'rgba(255,255,255,0.08)',
          }}
        >
          {form.hidePrices ? <EyeOff size={19} /> : <Coins size={19} />}
          {form.hidePrices ? '金額非表示中' : '金額表示中'}
        </button>
        <button
          onClick={onOpenSave}
          className="px-3.5 py-1.5 rounded-[7px] text-white text-[17px] font-semibold cursor-pointer flex items-center gap-1.5 border-2 border-white/40"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <Save size={19} />
          保存
        </button>
        <button
          onClick={onPrint}
          className="px-3.5 py-1.5 rounded-[7px] text-white text-[17px] font-semibold cursor-pointer flex items-center gap-1.5 border-2 border-white/40"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <Printer size={19} />
          PDF
        </button>
      </div>
    </header>
  );
}
