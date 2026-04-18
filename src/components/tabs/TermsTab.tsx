'use client';

import { ProposalForm, ContractTerms } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { C } from '@/lib/colors';
import {
  CONTRACT_PRESETS,
  ContractPreset,
} from '@/lib/contracts';
import {
  Coins, Wrench, Shield, File, FileText, Check,
} from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { ComponentType } from 'react';

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  Coins, Wrench, Shield, File, FileText,
};

interface Props {
  form: ProposalForm;
  setForm: React.Dispatch<React.SetStateAction<ProposalForm>>;
  theme: Theme;
}

type SingleCategory = 'payment' | 'revision' | 'copyright' | 'delivery';

export default function TermsTab({ form, setForm, theme }: Props) {
  const P = theme.primary;
  const terms = form.contractTerms;

  const update = <K extends keyof ProposalForm>(key: K, value: ProposalForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setTerms = (newTerms: ContractTerms) => update('contractTerms', newTerms);

  const selectPreset = (cat: SingleCategory, item: ContractPreset) => {
    setTerms({
      ...terms,
      [cat]: terms[cat] === item.id ? null : item.id,
    });
  };

  const toggleNote = (id: string) => {
    const notes = terms.extraNotes || [];
    setTerms({
      ...terms,
      extraNotes: notes.includes(id)
        ? notes.filter((x) => x !== id)
        : [...notes, id],
    });
  };

  const renderRadioCategory = (
    title: string,
    cat: SingleCategory,
    presets: ContractPreset[],
    icon: string
  ) => {
    const IconComponent = ICON_MAP[icon];
    return (
      <div className="mb-[18px]">
        <label
          className="block text-[13px] font-semibold text-ink-label mb-2 flex items-center gap-1"
        >
          {IconComponent && <IconComponent size={15} color={P} />}
          {title}
        </label>
        <div className="flex flex-col gap-2">
          {presets.map((item) => {
            const isSelected = terms[cat] === item.id;
            return (
              <button
                key={item.id}
                onClick={() => selectPreset(cat, item)}
                className="py-2.5 px-3.5 rounded-[9px] cursor-pointer text-left border-[1.5px]"
                style={{
                  borderColor: isSelected ? P : C.line.subtle,
                  borderWidth: isSelected ? 2 : 1.5,
                  background: isSelected ? theme.bg : '#fff',
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0"
                    style={{
                      border: `2px solid ${isSelected ? P : C.line.default}`,
                      background: isSelected ? P : '#fff',
                    }}
                  >
                    {isSelected && <Check size={10} color="#fff" />}
                  </div>
                  <div>
                    <div className="font-semibold text-[13px]">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#666] mt-0.5 leading-[1.5]">
                      {item.text}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[#666] text-[13px] m-0 mb-1.5">
        選択した条件がプレビューに反映されます。
      </p>

      {renderRadioCategory('お支払い条件', 'payment', CONTRACT_PRESETS.payment, 'Coins')}
      {renderRadioCategory('修正回数', 'revision', CONTRACT_PRESETS.revision, 'Wrench')}
      {renderRadioCategory('著作権', 'copyright', CONTRACT_PRESETS.copyright, 'Shield')}
      {renderRadioCategory('納品形式', 'delivery', CONTRACT_PRESETS.delivery, 'File')}

      {/* その他（複数選択可） */}
      <div className="mb-[18px]">
        <label
          className="block text-[13px] font-semibold text-ink-label mb-2 flex items-center gap-1"
        >
          <FileText size={15} color={P} />
          その他（複数選択可）
        </label>
        <div className="flex flex-col gap-2">
          {CONTRACT_PRESETS.notes.map((item) => {
            const isActive = (terms.extraNotes || []).includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleNote(item.id)}
                className="py-2.5 px-3.5 rounded-[9px] cursor-pointer text-left border-[1.5px]"
                style={{
                  borderColor: isActive ? P : C.line.subtle,
                  borderWidth: isActive ? 2 : 1.5,
                  background: isActive ? theme.bg : '#fff',
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-[18px] h-[18px] rounded-[3px] flex items-center justify-center shrink-0"
                    style={{
                      border: `2px solid ${isActive ? P : C.line.default}`,
                      background: isActive ? P : '#fff',
                    }}
                  >
                    {isActive && <Check size={10} color="#fff" />}
                  </div>
                  <div>
                    <div className="font-semibold text-[13px]">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#666] mt-0.5">
                      {item.text}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
