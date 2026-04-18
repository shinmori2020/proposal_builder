'use client';

import { ProposalForm } from '@/lib/types';
import { Theme, THEMES } from '@/lib/themes';
import { SITE_TYPES, FEATURES_ALL } from '@/lib/constants';
import { C } from '@/lib/colors';
import { Tag, FileText, Check } from 'lucide-react';

interface Props {
  form: ProposalForm;
  setForm: React.Dispatch<React.SetStateAction<ProposalForm>>;
  theme: Theme;
  onOpenTemplate: () => void;
}

export default function BasicInfoTab({ form, setForm, theme, onOpenTemplate }: Props) {
  const P = theme.primary;

  const update = <K extends keyof ProposalForm>(key: K, value: ProposalForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFeature = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => update('companyLogo', ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const labelClass = 'block text-[13px] font-semibold text-ink-label mb-1';
  const inputClass =
    'w-full px-3 py-2 border-[1.5px] border-line-input rounded-md text-sm font-inherit outline-none box-border';

  return (
    <div className="flex flex-col gap-5">
      {/* 業種テンプレートボタン */}
      <button
        onClick={onOpenTemplate}
        className="py-3 px-5 rounded-[10px] text-sm cursor-pointer font-semibold flex items-center justify-center gap-2 border-2 border-dashed"
        style={{ borderColor: P, background: theme.bg, color: P }}
      >
        <Tag size={18} color={P} />
        業種テンプレート
      </button>

      {/* テーマカラー */}
      <div>
        <label className={labelClass}>テーマカラー</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => update('themeId', t.id)}
              className="w-[30px] h-[30px] rounded-full cursor-pointer flex items-center justify-center transition-transform"
              style={{
                background: t.primary,
                border: form.themeId === t.id ? '3px solid #333' : '3px solid transparent',
                transform: form.themeId === t.id ? 'scale(1.15)' : 'scale(1)',
              }}
              title={t.label}
            >
              {form.themeId === t.id && <Check size={11} color="#fff" />}
            </button>
          ))}
        </div>
      </div>

      {/* クライアント名・案件名 */}
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label className={labelClass}>クライアント名</label>
          <input
            value={form.clientName}
            onChange={(e) => update('clientName', e.target.value)}
            className={inputClass}
            placeholder="株式会社〇〇"
          />
        </div>
        <div>
          <label className={labelClass}>案件名</label>
          <input
            value={form.projectName}
            onChange={(e) => update('projectName', e.target.value)}
            className={inputClass}
            placeholder="サイトリニューアル"
          />
        </div>
      </div>

      {/* サイト種別・納品希望日 */}
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label className={labelClass}>サイト種別</label>
          <select
            value={form.siteType}
            onChange={(e) => update('siteType', e.target.value)}
            className={inputClass}
          >
            {SITE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>納品希望日</label>
          <input
            value={form.deliveryDate}
            onChange={(e) => update('deliveryDate', e.target.value)}
            className={inputClass}
            placeholder="2026年6月末"
          />
        </div>
      </div>

      {/* 案件概要 */}
      <div>
        <label className={labelClass}>案件概要・提案の背景</label>
        <textarea
          value={form.overview}
          onChange={(e) => update('overview', e.target.value)}
          className={`${inputClass} min-h-[65px] resize-y`}
          placeholder="目的・課題など..."
        />
      </div>

      {/* 制作方針 */}
      <div>
        <label className={labelClass}>制作方針・目的</label>
        <textarea
          value={form.purpose}
          onChange={(e) => update('purpose', e.target.value)}
          className={`${inputClass} min-h-[45px] resize-y`}
          placeholder="方向性..."
        />
      </div>

      {/* 実装機能 */}
      <div>
        <label className={labelClass}>実装機能</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {FEATURES_ALL.map((f) => {
            const isActive = form.features.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFeature(f)}
                className="py-1.5 px-3 rounded-[18px] text-xs cursor-pointer flex items-center gap-1"
                style={{
                  border: `1.5px solid ${isActive ? P : C.line.default}`,
                  background: isActive ? theme.light : '#fff',
                  color: isActive ? P : '#666',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {isActive && <Check size={12} color={P} />}
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* 自社名・自社URL */}
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label className={labelClass}>自社名</label>
          <input
            value={form.companyName}
            onChange={(e) => update('companyName', e.target.value)}
            className={inputClass}
            placeholder="制作会社名"
          />
        </div>
        <div>
          <label className={labelClass}>自社URL</label>
          <input
            value={form.companyUrl}
            onChange={(e) => update('companyUrl', e.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* 自社ロゴ */}
      <div>
        <label className={labelClass}>自社ロゴ</label>
        <div className="flex items-center gap-3 mt-1">
          {form.companyLogo ? (
            <div className="relative">
              <img
                src={form.companyLogo}
                alt="logo"
                className="max-h-12 max-w-[160px] object-contain rounded-md border border-line-subtle p-1 bg-white"
              />
              <button
                onClick={() => update('companyLogo', '')}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-none text-white cursor-pointer flex items-center justify-center text-xs"
                style={{ background: C.delete }}
              >
                ×
              </button>
            </div>
          ) : (
            <label
              className="py-2 px-4 rounded-lg cursor-pointer text-[13px] font-semibold flex items-center gap-1.5 border-2 border-dashed"
              style={{ borderColor: P, background: theme.bg, color: P }}
            >
              <FileText size={15} color={P} />
              ロゴ画像を選択
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </label>
          )}
          <span className="text-[11px] text-[#999]">
            表紙・フッターに表示されます
          </span>
        </div>
      </div>

      {/* 備考 */}
      <div>
        <label className={labelClass}>備考・特記事項</label>
        <textarea
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          className={`${inputClass} min-h-[40px] resize-y`}
        />
      </div>
    </div>
  );
}
