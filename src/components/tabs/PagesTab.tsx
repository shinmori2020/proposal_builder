'use client';

import { ProposalForm, Page } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { C } from '@/lib/colors';
import { Plus, X } from 'lucide-react';

interface Props {
  form: ProposalForm;
  setForm: React.Dispatch<React.SetStateAction<ProposalForm>>;
  theme: Theme;
}

export default function PagesTab({ form, setForm, theme }: Props) {
  const P = theme.primary;
  const pages = form.pages;

  const update = <K extends keyof ProposalForm>(key: K, value: ProposalForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setPages = (p: Page[]) => update('pages', p);

  const updatePageName = (i: number, name: string) => {
    setPages(pages.map((p, idx) => (idx === i ? { ...p, name } : p)));
  };

  const addChild = (i: number) => {
    setPages(
      pages.map((p, idx) =>
        idx === i ? { ...p, children: [...p.children, ''] } : p
      )
    );
  };

  const updateChild = (i: number, ci: number, value: string) => {
    setPages(
      pages.map((p, idx) =>
        idx === i
          ? { ...p, children: p.children.map((x, j) => (j === ci ? value : x)) }
          : p
      )
    );
  };

  const removeChild = (i: number, ci: number) => {
    setPages(
      pages.map((p, idx) =>
        idx === i
          ? { ...p, children: p.children.filter((_, j) => j !== ci) }
          : p
      )
    );
  };

  const removePage = (i: number) => {
    setPages(pages.filter((_, idx) => idx !== i));
  };

  const addPage = () => {
    setPages([...pages, { name: '', children: [] }]);
  };

  const inputClass =
    'w-full px-3 py-2 border-[1.5px] border-line-input rounded-md text-sm font-inherit outline-none box-border';

  return (
    <div className="flex flex-col gap-3.5">
      <p className="text-[#666] text-sm m-0">
        ページ名を入力するとサイトマップが自動生成されます。
      </p>

      {pages.map((pg, i) => (
        <div
          key={i}
          className="bg-surface-panel rounded-[10px] p-3 border border-line-faint"
        >
          <div className="flex gap-2 items-center">
            <span
              className="font-bold text-sm min-w-[18px]"
              style={{ color: P }}
            >
              {i + 1}.
            </span>
            <input
              value={pg.name}
              onChange={(e) => updatePageName(i, e.target.value)}
              className={`${inputClass} flex-1`}
              placeholder="ページ名"
            />
            <button
              onClick={() => addChild(i)}
              className="px-2.5 py-1 rounded-md border-[1.5px] bg-transparent text-xs cursor-pointer font-semibold flex items-center gap-1 whitespace-nowrap"
              style={{ borderColor: P, color: P }}
            >
              <Plus size={12} color={P} />
              子
            </button>
            <button
              onClick={() => removePage(i)}
              className="px-2.5 py-1 rounded-md border-[1.5px] bg-transparent text-xs cursor-pointer font-semibold flex items-center"
              style={{ borderColor: C.delete, color: C.delete }}
            >
              <X size={12} color={C.delete} />
            </button>
          </div>

          {pg.children.map((c, ci) => (
            <div key={ci} className="flex gap-2 items-center mt-2 ml-7">
              <span className="text-ink-softest">└</span>
              <input
                value={c}
                onChange={(e) => updateChild(i, ci, e.target.value)}
                className={`${inputClass} flex-1 text-[13px]`}
                placeholder="子ページ"
              />
              <button
                onClick={() => removeChild(i, ci)}
                className="px-2 py-0.5 rounded-md border-[1.5px] bg-transparent text-xs cursor-pointer font-semibold flex items-center"
                style={{ borderColor: C.delete, color: C.delete }}
              >
                <X size={11} color={C.delete} />
              </button>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={addPage}
        className="self-start px-4 py-2 rounded-lg border-none text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5"
        style={{ background: P }}
      >
        <Plus size={14} color="#fff" />
        ページ追加
      </button>
    </div>
  );
}
