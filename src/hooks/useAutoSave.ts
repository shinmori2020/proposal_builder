'use client';

import { useEffect, useRef } from 'react';
import { ProposalForm } from '@/lib/types';
import { saveDraft } from '@/lib/storage';

/**
 * フォームの変更を監視して自動的に localStorage のドラフトに保存する。
 *
 * - 変更から delay ミリ秒後に保存（連続入力を1回にまとめる）
 * - enabled が false の間は保存しない（復元ダイアログ表示中など）
 */
export function useAutoSave(
  form: ProposalForm,
  enabled: boolean = true,
  delay: number = 2000
) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 初回マウント時は保存しない（復元済みデータの上書きを防止）
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!enabled) return;

    const timer = setTimeout(() => {
      saveDraft(form);
    }, delay);

    return () => clearTimeout(timer);
  }, [form, enabled, delay]);
}
