'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * フォーム state に Undo / Redo を追加するフック。
 *
 * - form の変化を delay ミリ秒デバウンスしてスナップショットを履歴に積む
 *   （連続入力は1ステップにまとめる）
 * - undo / redo 実行時の form 変化は履歴に記録しない
 * - 履歴は最大 MAX 件まで保持（古いものから破棄）
 */
const MAX_HISTORY = 50;

export function useUndoableForm<T>(
  form: T,
  setForm: (v: T) => void,
  delay: number = 600
) {
  const historyRef = useRef<T[]>([form]);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextRef = useRef(false);
  const isFirstRenderRef = useRef(true);
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    if (skipNextRef.current) {
      skipNextRef.current = false;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // 現在位置より先の履歴は破棄してから新規追加
      historyRef.current = historyRef.current.slice(0, indexRef.current + 1);
      historyRef.current.push(form);

      if (historyRef.current.length > MAX_HISTORY) {
        const trim = historyRef.current.length - MAX_HISTORY;
        historyRef.current = historyRef.current.slice(trim);
        indexRef.current = historyRef.current.length - 1;
      } else {
        indexRef.current = historyRef.current.length - 1;
      }
      rerender();
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [form, delay]);

  const undo = useCallback(() => {
    if (indexRef.current <= 0) return;
    // デバウンス中の変更があれば履歴に確定させてから Undo
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      historyRef.current = historyRef.current.slice(0, indexRef.current + 1);
      historyRef.current.push(form);
      indexRef.current = historyRef.current.length - 1;
    }
    indexRef.current--;
    skipNextRef.current = true;
    setForm(historyRef.current[indexRef.current]);
    rerender();
  }, [form, setForm]);

  const redo = useCallback(() => {
    if (indexRef.current >= historyRef.current.length - 1) return;
    indexRef.current++;
    skipNextRef.current = true;
    setForm(historyRef.current[indexRef.current]);
    rerender();
  }, [setForm]);

  return {
    undo,
    redo,
    canUndo: indexRef.current > 0,
    canRedo: indexRef.current < historyRef.current.length - 1,
  };
}
