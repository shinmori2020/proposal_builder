'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 数値入力 + 独自 ▲▼ ボタンのステッパー。
 *
 * - ネイティブスピナーは globals.css で全入力から非表示化済み
 * - フォーカスリングは wrapper の :focus-within で theme 色に反応
 * - 幅は `style={{ width }}` で呼び出し側から指定
 */
export default function NumberStepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  className = '',
  style,
}: Props) {
  const clamp = (v: number) => {
    let n = v;
    if (min !== undefined) n = Math.max(min, n);
    if (max !== undefined) n = Math.min(max, n);
    return n;
  };

  const inc = () => onChange(clamp((value || 0) + step));
  const dec = () => onChange(clamp((value || 0) - step));

  return (
    <div
      className={`stepper-wrap flex items-stretch rounded-md overflow-hidden ${className}`}
      style={style}
    >
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="flex-1 min-w-0 px-2 py-2 text-sm text-center outline-none bg-transparent font-inherit"
      />
      <div className="flex flex-col border-l border-line-input w-4 shrink-0">
        <button
          type="button"
          tabIndex={-1}
          onClick={inc}
          className="flex-1 flex items-center justify-center hover:bg-[#ececec] active:bg-[#dddddd] transition-colors cursor-pointer"
          aria-label="増やす"
        >
          <ChevronUp size={9} color="#666" strokeWidth={3} />
        </button>
        <button
          type="button"
          tabIndex={-1}
          onClick={dec}
          className="flex-1 flex items-center justify-center hover:bg-[#ececec] active:bg-[#dddddd] transition-colors cursor-pointer border-t border-line-input"
          aria-label="減らす"
        >
          <ChevronDown size={9} color="#666" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
