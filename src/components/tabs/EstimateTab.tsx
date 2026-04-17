'use client';

import { useState } from 'react';
import { ProposalForm, Plan, EstimateItem } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { calcPlan, formatPrice, makePlan } from '@/lib/calculations';
import PresetDrawer from '@/components/modals/PresetDrawer';
import { Star, Copy, X, Plus, Package, Percent } from 'lucide-react';

interface Props {
  form: ProposalForm;
  setForm: React.Dispatch<React.SetStateAction<ProposalForm>>;
  theme: Theme;
}

const UNITS: EstimateItem['unit'][] = ['式', 'ページ', '点', '時間', '月'];

export default function EstimateTab({ form, setForm, theme }: Props) {
  const [showPreset, setShowPreset] = useState(false);
  const [activePlanIdx, setActivePlanIdx] = useState(0);
  const P = theme.primary;

  const plans = form.plans;
  const plan = plans[activePlanIdx] || plans[0];
  const items = plan.items;
  const disc = plan.discount;
  const { sub, disc: discAmt, tax } = calcPlan(plan);

  const setPlans = (newPlans: Plan[]) => {
    setForm((f) => ({ ...f, plans: newPlans }));
  };

  const updatePlan = (updated: Plan) => {
    setPlans(plans.map((p, i) => (i === activePlanIdx ? updated : p)));
  };

  const setItems = (newItems: EstimateItem[]) => {
    updatePlan({ ...plan, items: newItems });
  };

  const updateItem = <K extends keyof EstimateItem>(
    i: number,
    key: K,
    value: EstimateItem[K]
  ) => {
    setItems(items.map((item, idx) => (idx === i ? { ...item, [key]: value } : item)));
  };

  const updateDiscount = <K extends keyof Plan['discount']>(
    key: K,
    value: Plan['discount'][K]
  ) => {
    updatePlan({ ...plan, discount: { ...disc, [key]: value } });
  };

  const addPlan = () => {
    const newPlans = [...plans, makePlan(`プラン${plans.length + 1}`)];
    setPlans(newPlans);
    setActivePlanIdx(newPlans.length - 1);
  };

  const removePlan = (i: number) => {
    if (plans.length <= 1) return;
    const newPlans = plans.filter((_, idx) => idx !== i);
    setPlans(newPlans);
    setActivePlanIdx(Math.min(activePlanIdx, newPlans.length - 1));
  };

  const duplicatePlan = (i: number) => {
    const newPlans = [...plans];
    newPlans.splice(i + 1, 0, {
      ...JSON.parse(JSON.stringify(plans[i])),
      name: plans[i].name + '（コピー）',
      recommended: false,
    });
    setPlans(newPlans);
    setActivePlanIdx(i + 1);
  };

  const toggleRecommended = () => {
    updatePlan({ ...plan, recommended: !plan.recommended });
  };

  const inputClass =
    'w-full px-3 py-2 border-[1.5px] border-[#d0d8d4] rounded-md text-sm font-inherit outline-none box-border';

  const smallBtn = (color: string) =>
    `px-2.5 py-1 rounded-md border-[1.5px] bg-transparent text-[11px] cursor-pointer font-semibold flex items-center gap-1`;

  return (
    <div className="flex flex-col gap-2.5">
      {showPreset && (
        <PresetDrawer
          onAdd={(item) => setItems([...items, item])}
          onClose={() => setShowPreset(false)}
          theme={theme}
        />
      )}

      {/* プランタブ */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {plans.map((p, i) => {
          const isActive = i === activePlanIdx;
          return (
            <button
              key={i}
              onClick={() => setActivePlanIdx(i)}
              className="py-1.5 px-3.5 rounded-lg text-[13px] cursor-pointer flex items-center gap-1"
              style={{
                border: isActive ? `2px solid ${P}` : '1.5px solid #ddd',
                background: isActive ? theme.light : '#fff',
                color: isActive ? P : '#666',
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {p.recommended && (
                <Star size={13} color={isActive ? P : '#ccc'} />
              )}
              {p.name || `プラン${i + 1}`}
            </button>
          );
        })}
        <button
          onClick={addPlan}
          className="w-8 h-8 rounded-lg border-[1.5px] border-dashed border-[#bbb] bg-[#fafafa] cursor-pointer flex items-center justify-center"
        >
          <Plus size={15} color="#999" />
        </button>
      </div>

      {/* プランヘッダー */}
      <div className="flex gap-2 items-center bg-[#f8f9fa] rounded-[10px] py-2.5 px-3.5">
        <input
          value={plan.name}
          onChange={(e) => updatePlan({ ...plan, name: e.target.value })}
          className={`${inputClass} flex-1 font-bold`}
          placeholder="プラン名"
        />
        <button
          onClick={toggleRecommended}
          className="py-1 px-2.5 rounded-md text-[11px] cursor-pointer font-semibold flex items-center gap-1 whitespace-nowrap border-[1.5px]"
          style={{
            borderColor: plan.recommended ? P : '#ccc',
            background: plan.recommended ? theme.light : '#fff',
            color: plan.recommended ? P : '#999',
          }}
        >
          <Star size={13} color={plan.recommended ? P : '#ccc'} />
          おすすめ
        </button>
        <button
          onClick={() => duplicatePlan(activePlanIdx)}
          className={smallBtn(P) + ' whitespace-nowrap'}
          style={{ borderColor: P, color: P }}
        >
          <Copy size={13} color={P} />
          複製
        </button>
        {plans.length > 1 && (
          <button
            onClick={() => removePlan(activePlanIdx)}
            className={smallBtn('#c33') + ' whitespace-nowrap'}
            style={{ borderColor: '#c33', color: '#c33' }}
          >
            <X size={13} color="#c33" />
            削除
          </button>
        )}
      </div>

      {/* プリセット追加ボタン */}
      <button
        onClick={() => setShowPreset(true)}
        className="py-2.5 px-[18px] rounded-[10px] text-[13px] cursor-pointer font-semibold flex items-center justify-center gap-2 border-2 border-dashed"
        style={{ borderColor: P, background: theme.bg, color: P }}
      >
        <Package size={16} color={P} />
        プリセットから追加
      </button>

      {/* 見積もり項目 */}
      <div
        className="grid gap-[7px] font-semibold text-xs text-[#555] px-1"
        style={{ gridTemplateColumns: '2fr 65px 55px 95px 32px' }}
      >
        <span>項目名</span>
        <span>単位</span>
        <span>数量</span>
        <span>単価</span>
        <span></span>
      </div>

      {items.map((item, i) => (
        <div
          key={i}
          className="grid gap-[7px] items-center"
          style={{ gridTemplateColumns: '2fr 65px 55px 95px 32px' }}
        >
          <input
            value={item.name}
            onChange={(e) => updateItem(i, 'name', e.target.value)}
            className={inputClass}
            placeholder="項目名"
          />
          <select
            value={item.unit}
            onChange={(e) => updateItem(i, 'unit', e.target.value as EstimateItem['unit'])}
            className={inputClass}
          >
            {UNITS.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            value={item.qty}
            onChange={(e) => updateItem(i, 'qty', Number(e.target.value))}
            className={`${inputClass} text-center`}
          />
          <input
            type="number"
            min={0}
            step={1000}
            value={item.price}
            onChange={(e) => updateItem(i, 'price', Number(e.target.value))}
            className={`${inputClass} text-right`}
          />
          <button
            onClick={() => setItems(items.filter((_, idx) => idx !== i))}
            className="rounded-md border-[1.5px] border-[#c33] text-[#c33] bg-transparent cursor-pointer flex items-center justify-center py-1"
          >
            <X size={12} color="#c33" />
          </button>
        </div>
      ))}

      <button
        onClick={() =>
          setItems([...items, { name: '', unit: '式', qty: 1, price: 0 }])
        }
        className="self-start py-1.5 px-[18px] rounded-lg border-none text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5"
        style={{ background: P }}
      >
        <Plus size={14} color="#fff" />
        手動追加
      </button>

      {/* 割引・値引き */}
      <div className="bg-[#f8f9fa] rounded-[10px] p-3 border border-[#e0e4e2]">
        <label
          className="block text-[13px] font-semibold text-[#444] mb-2 flex items-center gap-1"
        >
          <Percent size={15} color={P} />
          割引・値引き
        </label>
        <div className="flex gap-2 items-center flex-wrap">
          <select
            value={disc.type}
            onChange={(e) => updateDiscount('type', e.target.value as typeof disc.type)}
            className={inputClass}
            style={{ width: 120 }}
          >
            <option value="none">なし</option>
            <option value="percent">％割引</option>
            <option value="fixed">金額値引き</option>
          </select>
          {disc.type !== 'none' && (
            <>
              <input
                type="number"
                min={0}
                value={disc.value}
                onChange={(e) => updateDiscount('value', Number(e.target.value))}
                className={`${inputClass} text-right`}
                style={{ width: 80 }}
              />
              <span className="text-xs text-[#666]">
                {disc.type === 'percent' ? '%' : '円'}
              </span>
              <input
                value={disc.label}
                onChange={(e) => updateDiscount('label', e.target.value)}
                className={`${inputClass} flex-1`}
                style={{ minWidth: 100 }}
                placeholder="割引名"
              />
            </>
          )}
        </div>
      </div>

      {/* 合計表示 */}
      <div
        className="mt-1 pt-2.5 flex flex-col gap-1 items-end"
        style={{ borderTop: `2px solid ${P}` }}
      >
        <div className="text-[13px] text-[#555]">
          小計: <strong>¥{formatPrice(sub)}</strong>
        </div>
        {discAmt > 0 && (
          <div className="text-[13px] text-[#c33]">
            {disc.label || '割引'}: <strong>-¥{formatPrice(discAmt)}</strong>
          </div>
        )}
        <div className="text-[13px] text-[#555]">
          消費税: <strong>¥{formatPrice(tax)}</strong>
        </div>
        <div
          className="text-[19px] font-extrabold"
          style={{ color: P }}
        >
          合計: ¥{formatPrice(sub - discAmt + tax)}
        </div>
      </div>
    </div>
  );
}
