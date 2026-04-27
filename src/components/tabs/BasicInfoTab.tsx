'use client';

import { ProposalForm } from '@/lib/types';
import { Theme, THEMES } from '@/lib/themes';
import { SITE_TYPES, FEATURES_ALL } from '@/lib/constants';
import { C } from '@/lib/colors';
import { isValidUrl } from '@/lib/formatters';
import { inputFull as inputClass, labelClass, sectionStack } from '@/lib/ui';
import NumberStepper from '@/components/ui/NumberStepper';
import { Tag, FileText, Check } from 'lucide-react';

interface Props {
  form: ProposalForm;
  setForm: React.Dispatch<React.SetStateAction<ProposalForm>>;
  theme: Theme;
  onOpenTemplate: () => void;
}

/** 備考欄の文字数上限。PDF体裁を保つため 800 文字でハード制限。 */
const NOTES_MAX = 800;

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

  return (
    <div className={sectionStack}>
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
        <div className="flex flex-wrap gap-3 mt-1">
          {THEMES.map((t) => {
            const isSelected = form.themeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => update('themeId', t.id)}
                className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-all"
                style={{
                  background: t.primary,
                  boxShadow: isSelected
                    ? `0 0 0 2px #fff, 0 0 0 4px ${t.primary}`
                    : 'none',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                }}
                title={t.label}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <Check size={14} color="#fff" strokeWidth={3} />
                )}
              </button>
            );
          })}
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
            type="date"
            value={form.deliveryDate}
            onChange={(e) => update('deliveryDate', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* 消費税率 */}
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label className={labelClass}>消費税率</label>
          <div className="flex items-center gap-1.5">
            <NumberStepper
              min={0}
              max={30}
              step={0.5}
              value={form.taxRate ?? 10}
              onChange={(v) => update('taxRate', v)}
              style={{ width: 92 }}
            />
            <span className="text-sm text-[#666]">%</span>
            <span className="text-meta text-ink-soft ml-1">
              （通常 10%、軽減税率 8% 等）
            </span>
          </div>
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
          {form.companyUrl && !isValidUrl(form.companyUrl) && (
            <span className="warn-pill mt-1">
              ⚠ http:// または https:// から始めてください
            </span>
          )}
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
              className="py-2 px-4 rounded-lg cursor-pointer text-label font-semibold flex items-center gap-1.5 border-2 border-dashed"
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
          <span className="text-meta text-[#999]">
            表紙・フッターに表示されます
          </span>
        </div>
      </div>

      {/* 備考 */}
      <div>
        <label className={labelClass}>備考・特記事項</label>
        <textarea
          value={form.notes}
          onChange={(e) =>
            update('notes', e.target.value.slice(0, NOTES_MAX))
          }
          maxLength={NOTES_MAX}
          placeholder="特記事項があれば記入してください（800文字以内）"
          className={`${inputClass} min-h-[60px] resize-y`}
        />
        {(() => {
          const len = form.notes.length;
          const warn = len >= NOTES_MAX * 0.8 && len <= NOTES_MAX;
          const over = len > NOTES_MAX;
          const color = over
            ? C.delete
            : len === NOTES_MAX
              ? C.delete
              : warn
                ? '#d97706'
                : '#999';
          return (
            <div className="flex justify-between items-center mt-1 gap-2">
              {over ? (
                <button
                  onClick={() =>
                    update('notes', form.notes.slice(0, NOTES_MAX))
                  }
                  className="text-meta px-2 py-0.5 rounded-md border-[1.5px] cursor-pointer font-semibold"
                  style={{ borderColor: C.delete, color: C.delete }}
                  title="現在の内容を800文字までに切り詰めます"
                >
                  800文字に切り詰める
                </button>
              ) : (
                <span />
              )}
              <span
                className="text-meta font-semibold"
                style={{ color }}
              >
                {len} / {NOTES_MAX} 文字
              </span>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
