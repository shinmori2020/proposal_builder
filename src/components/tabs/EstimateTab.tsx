'use client';

import { useState } from 'react';
import { ProposalForm, Plan, EstimateItem } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { C } from '@/lib/colors';
import { calcPlan, formatPrice, makePlan } from '@/lib/calculations';
import { formatNumberWithCommas, parseNumberFromString } from '@/lib/formatters';
import { inputFull as inputClass } from '@/lib/ui';
import NumberStepper from '@/components/ui/NumberStepper';
import PresetDrawer from '@/components/modals/PresetDrawer';
import { Star, Copy, X, Plus, Package, Percent, GripVertical } from 'lucide-react';

interface Props {
  form: ProposalForm;
  setForm: React.Dispatch<React.SetStateAction<ProposalForm>>;
  theme: Theme;
}

const UNITS: EstimateItem['unit'][] = ['式', 'ページ', '点', '時間', '月'];

export default function EstimateTab({ form, setForm, theme }: Props) {
  const [showPreset, setShowPreset] = useState(false);
  const [activePlanIdx, setActivePlanIdx] = useState(0);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dropTargetIdx, setDropTargetIdx] = useState<number | null>(null);
  const P = theme.primary;

  const plans = form.plans;
  const plan = plans[activePlanIdx] || plans[0];
  const items = plan.items;
  const disc = plan.discount;
  const taxRate = form.taxRate ?? 10;
  const { sub, disc: discAmt, tax } = calcPlan(plan, taxRate);

  const update = <K extends keyof ProposalForm>(key: K, value: ProposalForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setPlans = (newPlans: Plan[]) => update('plans', newPlans);

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

  /** 指定位置のアイテムをその直後に複製 */
  const duplicateItem = (i: number) => {
    const copy: EstimateItem = { ...items[i] };
    setItems([...items.slice(0, i + 1), copy, ...items.slice(i + 1)]);
  };

  /** from → to へ並び替え */
  const moveItem = (from: number, to: number) => {
    if (from === to) return;
    const updated = [...items];
    const [removed] = updated.splice(from, 1);
    updated.splice(to, 0, removed);
    setItems(updated);
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

  const smallBtn =
    'px-2.5 py-1 rounded-md border-[1.5px] bg-transparent text-meta cursor-pointer font-semibold flex items-center gap-1 transition-colors';

  return (
    <div className="flex flex-col gap-3">
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
              className="py-1.5 px-3.5 rounded-lg text-label cursor-pointer flex items-center gap-1"
              style={{
                border: isActive ? `2px solid ${P}` : `1.5px solid ${C.line.soft}`,
                background: isActive ? theme.light : '#fff',
                color: isActive ? P : '#666',
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {p.recommended && (
                <Star size={13} color={isActive ? P : C.line.default} />
              )}
              {p.name || `プラン${i + 1}`}
            </button>
          );
        })}
        <button
          onClick={addPlan}
          className="w-8 h-8 rounded-lg border-[1.5px] border-dashed border-ink-softest bg-surface-subtle cursor-pointer flex items-center justify-center"
        >
          <Plus size={15} color="#999" />
        </button>
      </div>

      {/* プランヘッダー */}
      <div className="flex gap-2 items-center bg-surface-muted rounded-[10px] py-2.5 px-3.5">
        <input
          value={plan.name}
          onChange={(e) => updatePlan({ ...plan, name: e.target.value })}
          className={`${inputClass} flex-1 font-bold`}
          placeholder="プラン名"
        />
        <button
          onClick={toggleRecommended}
          className="py-1 px-2.5 rounded-md text-meta cursor-pointer font-semibold flex items-center gap-1 whitespace-nowrap border-[1.5px]"
          style={{
            borderColor: plan.recommended ? P : C.line.default,
            background: plan.recommended ? theme.light : '#fff',
            color: plan.recommended ? P : '#999',
          }}
        >
          <Star size={13} color={plan.recommended ? P : C.line.default} />
          おすすめ
        </button>
        <button
          onClick={() => duplicatePlan(activePlanIdx)}
          className={smallBtn + ' whitespace-nowrap'}
          style={{ borderColor: P, color: P }}
        >
          <Copy size={13} color={P} />
          複製
        </button>
        {plans.length > 1 && (
          <button
            onClick={() => removePlan(activePlanIdx)}
            className={smallBtn + ' whitespace-nowrap'}
            style={{ borderColor: C.delete, color: C.delete }}
          >
            <X size={13} color={C.delete} />
            削除
          </button>
        )}
      </div>

      {/* プリセット追加ボタン */}
      <button
        onClick={() => setShowPreset(true)}
        className="py-2.5 px-[18px] rounded-[10px] text-label cursor-pointer font-semibold flex items-center justify-center gap-2 border-2 border-dashed"
        style={{ borderColor: P, background: theme.bg, color: P }}
      >
        <Package size={16} color={P} />
        プリセットから追加
      </button>

      {/* 見積もり項目 */}
      <div
        className="grid gap-[7px] font-semibold text-xs text-ink-body px-1"
        style={{ gridTemplateColumns: '32px 2fr 88px 68px 95px 28px 28px' }}
      >
        <span></span>
        <span>項目名</span>
        <span>単位</span>
        <span>数量</span>
        <span>単価</span>
        <span></span>
        <span></span>
      </div>

      {items.map((item, i) => {
        const isDraggedOver = dropTargetIdx === i && dragIdx !== null && dragIdx !== i;
        return (
          <div
            key={i}
            className="grid gap-[7px] items-center transition-colors"
            style={{
              gridTemplateColumns: '32px 2fr 88px 68px 95px 28px 28px',
              opacity: dragIdx === i ? 0.4 : 1,
              borderTop: isDraggedOver ? `2px solid ${P}` : '2px solid transparent',
              background: isDraggedOver ? theme.light : 'transparent',
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragIdx !== null && dragIdx !== i) setDropTargetIdx(i);
            }}
            onDragLeave={() => {
              if (dropTargetIdx === i) setDropTargetIdx(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIdx !== null && dragIdx !== i) {
                moveItem(dragIdx, i);
              }
              setDragIdx(null);
              setDropTargetIdx(null);
            }}
          >
            {/* ドラッグハンドル */}
            <div
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragEnd={() => {
                setDragIdx(null);
                setDropTargetIdx(null);
              }}
              className="cursor-grab active:cursor-grabbing flex items-center justify-center h-full rounded-md hover:bg-line-divider transition-colors"
              title="ドラッグで並び替え"
            >
              <GripVertical size={18} color="#888" />
            </div>

            <input
              value={item.name}
              onChange={(e) => updateItem(i, 'name', e.target.value)}
              className={inputClass}
              placeholder="項目名"
            />
            <select
              value={item.unit}
              onChange={(e) =>
                updateItem(i, 'unit', e.target.value as EstimateItem['unit'])
              }
              className={inputClass}
            >
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
            <NumberStepper
              min={0}
              value={item.qty}
              onChange={(v) => updateItem(i, 'qty', v)}
            />
            <input
              type="text"
              inputMode="numeric"
              value={item.price === 0 ? '' : formatNumberWithCommas(item.price)}
              onChange={(e) =>
                updateItem(i, 'price', parseNumberFromString(e.target.value))
              }
              placeholder="0"
              className={`${inputClass} text-right`}
            />
            {/* 複製ボタン */}
            <button
              onClick={() => duplicateItem(i)}
              className="rounded-md border-[1.5px] bg-transparent cursor-pointer flex items-center justify-center py-1"
              style={{ borderColor: P, color: P }}
              title="この行を複製"
            >
              <Copy size={12} color={P} />
            </button>
            {/* 削除ボタン */}
            <button
              onClick={() => setItems(items.filter((_, idx) => idx !== i))}
              className="rounded-md border-[1.5px] bg-transparent cursor-pointer flex items-center justify-center py-1"
              style={{ borderColor: C.delete, color: C.delete }}
              title="削除"
            >
              <X size={12} color={C.delete} />
            </button>
          </div>
        );
      })}

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
      <div className="bg-surface-muted rounded-[10px] p-3 border border-line-subtle">
        <label
          className="block text-label font-semibold text-ink-label mb-2 flex items-center gap-1"
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
                type="text"
                inputMode="numeric"
                value={
                  disc.value === 0
                    ? ''
                    : disc.type === 'fixed'
                      ? formatNumberWithCommas(disc.value)
                      : String(disc.value)
                }
                onChange={(e) => {
                  const val =
                    disc.type === 'fixed'
                      ? parseNumberFromString(e.target.value)
                      : Number(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                  updateDiscount('value', val);
                }}
                placeholder="0"
                className={`${inputClass} text-right`}
                style={{ width: 90 }}
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
        <div className="text-label text-ink-body">
          小計: <strong>¥{formatPrice(sub)}</strong>
        </div>
        {discAmt > 0 && (
          <div className="text-label" style={{ color: C.delete }}>
            {disc.label || '割引'}: <strong>-¥{formatPrice(discAmt)}</strong>
          </div>
        )}
        <div className="text-label text-ink-body">
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
