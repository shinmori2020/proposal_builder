'use client';

import { ReactElement, useEffect, useState } from 'react';
import { usePDF, DocumentProps } from '@react-pdf/renderer';

interface Props {
  document: ReactElement<DocumentProps>;
  className?: string;
  style?: React.CSSProperties;
  showUpdating?: boolean;
}

/**
 * 二重バッファ方式の PDF ライブプレビュー
 *
 * PDFViewer は src を毎回差し替えるため iframe が点滅するが、
 * このコンポーネントは iframe を2枚常駐させ、新しい PDF が
 * onLoad で読込完了してから表示を切り替えるので点滅しない。
 */
export default function PdfLivePreview({
  document,
  className,
  style,
  showUpdating = true,
}: Props) {
  const [instance, updateInstance] = usePDF({ document });

  // 2つのスロットに交互に URL を書き込み、読込完了したらアクティブ化する
  const [slotA, setSlotA] = useState<string | null>(null);
  const [slotB, setSlotB] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<'A' | 'B'>('A');

  // document が変わったら PDF 再生成を指示
  useEffect(() => {
    updateInstance(document);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document]);

  // 新しい URL が確定したら、非表示側のスロットに書き込む
  useEffect(() => {
    if (!instance.url || instance.loading) return;

    if (activeSlot === 'A') {
      if (instance.url !== slotB) setSlotB(instance.url);
    } else {
      if (instance.url !== slotA) setSlotA(instance.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance.url, instance.loading]);

  const baseIframeStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    transition: 'opacity 250ms ease',
  };

  const showInitialLoader = !slotA && !slotB;

  return (
    <div
      className={className}
      style={{ position: 'relative', ...style }}
    >
      {/* スロットA */}
      {slotA && (
        <iframe
          src={slotA}
          onLoad={() => {
            // B が現在アクティブ → A の読込が済んだので A に切り替え
            if (activeSlot === 'B') setActiveSlot('A');
          }}
          style={{
            ...baseIframeStyle,
            opacity: activeSlot === 'A' ? 1 : 0,
            pointerEvents: activeSlot === 'A' ? 'auto' : 'none',
          }}
        />
      )}

      {/* スロットB */}
      {slotB && (
        <iframe
          src={slotB}
          onLoad={() => {
            if (activeSlot === 'A') setActiveSlot('B');
          }}
          style={{
            ...baseIframeStyle,
            opacity: activeSlot === 'B' ? 1 : 0,
            pointerEvents: activeSlot === 'B' ? 'auto' : 'none',
          }}
        />
      )}

      {/* 初回ロード中 */}
      {showInitialLoader && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            color: '#888',
            fontSize: 13,
          }}
        >
          プレビューを読み込み中...
        </div>
      )}

      {/* 更新中の控えめなインジケータ */}
      {showUpdating && instance.loading && !showInitialLoader && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            padding: '3px 10px',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            fontSize: 10,
            borderRadius: 4,
            pointerEvents: 'none',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          更新中...
        </div>
      )}
    </div>
  );
}
