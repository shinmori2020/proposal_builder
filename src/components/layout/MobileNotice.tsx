'use client';

import { useEffect, useState } from 'react';
import { Monitor, X } from 'lucide-react';

const DISMISS_KEY = 'mobile-notice-dismissed';

/**
 * モバイル幅（< 640px）のときのみ表示する PC 推奨バナー。
 * dismiss 状態は localStorage に保存。
 */
export default function MobileNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = localStorage.getItem(DISMISS_KEY) === '1';
    if (dismissed) return;
    setShow(true);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore quota/blocked errors
    }
  };

  if (!show) return null;

  return (
    <div className="sm:hidden bg-amber-50 border-b border-amber-200 px-3 py-2 flex items-start gap-2">
      <Monitor size={14} color="#92400e" className="shrink-0 mt-0.5" />
      <p className="flex-1 text-meta text-amber-900 leading-relaxed m-0">
        本ツールは <strong>PC・タブレット</strong> でのご利用を推奨します。スマートフォンでは表示・操作が制限されます。
      </p>
      <button
        onClick={handleDismiss}
        className="shrink-0 w-5 h-5 border-none bg-transparent cursor-pointer flex items-center justify-center"
        aria-label="閉じる"
      >
        <X size={14} color="#92400e" />
      </button>
    </div>
  );
}
