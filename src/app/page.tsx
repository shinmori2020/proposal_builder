'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ProposalForm, TabId } from '@/lib/types';
import { getTheme } from '@/lib/themes';
import { defaultForm } from '@/lib/defaults';
import { TEMPLATES } from '@/lib/templates';
import Header from '@/components/layout/Header';
import TabNav from '@/components/layout/TabNav';
import MobileNotice from '@/components/layout/MobileNotice';
import BasicInfoTab from '@/components/tabs/BasicInfoTab';
import PagesTab from '@/components/tabs/PagesTab';
import EstimateTab from '@/components/tabs/EstimateTab';
import ScheduleTab from '@/components/tabs/ScheduleTab';
import TermsTab from '@/components/tabs/TermsTab';
import PdfDocument from '@/pdf/PdfDocument';
import TemplateSelector from '@/components/modals/TemplateSelector';
import SaveLoadPanel from '@/components/modals/SaveLoadPanel';
import RestoreDraftDialog from '@/components/modals/RestoreDraftDialog';
import { exportPreviewToPdf } from '@/lib/pdfExport';
import { loadDraft, clearDraft, CustomTemplate } from '@/lib/storage';
import { generateQrDataUrl } from '@/lib/qrcode';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useUndoableForm } from '@/hooks/useUndoableForm';
import { Link } from 'lucide-react';

// PDFViewer は SSR 不可のため動的インポート（プレビュータブ用）
const PDFViewer = dynamic(
  () =>
    import('@react-pdf/renderer').then((mod) => ({ default: mod.PDFViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full text-ink-soft text-sm">
        プレビューを読み込み中...
      </div>
    ),
  }
);

// 点滅しない二重バッファ方式プレビュー（ライブプレビュー用）
const PdfLivePreview = dynamic(
  () => import('@/components/preview/PdfLivePreview'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full text-ink-soft text-sm">
        プレビューを読み込み中...
      </div>
    ),
  }
);

export default function Home() {
  const [form, setForm] = useState<ProposalForm>(defaultForm());
  // プレビュー用にデバウンスされたフォーム（入力中の高頻度再レンダリングを抑制）
  const [previewForm, setPreviewForm] = useState<ProposalForm>(defaultForm());
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [showTemplate, setShowTemplate] = useState(false);
  const [showSave, setShowSave] = useState(false);

  // 自動保存・復元用
  const [draftChecked, setDraftChecked] = useState(false);
  const [draftToRestore, setDraftToRestore] = useState<{
    data: ProposalForm;
    savedAt: string;
  } | null>(null);

  const theme = getTheme(form.themeId);

  // テーマカラーを document.documentElement の CSS 変数にも反映
  // （ブラウザレベルのスクロールバー等、ラッパー div の外側にも色を伝播させる）
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
  }, [theme.primary]);

  // 初回マウント時にドラフトをチェック
  useEffect(() => {
    if (draftChecked) return;
    const draft = loadDraft();
    if (draft) {
      // ドラフトあり → 復元ダイアログを表示（テンプレート選択は一旦非表示）
      setDraftToRestore(draft);
    } else {
      // ドラフトなし → 通常の初回起動（テンプレート選択を表示）
      setShowTemplate(true);
    }
    setDraftChecked(true);
  }, [draftChecked]);

  // フォームを自動保存（復元ダイアログ表示中は保存しない）
  useAutoSave(form, draftChecked && !draftToRestore);

  // Undo / Redo（600ms デバウンスで連続入力を1ステップにまとめる）
  const { undo, redo, canUndo, canRedo } = useUndoableForm(form, setForm);

  const handleRestoreDraft = () => {
    if (draftToRestore) {
      setForm(draftToRestore.data);
      setPreviewForm(draftToRestore.data);
      setDraftToRestore(null);
    }
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setDraftToRestore(null);
    setShowTemplate(true);
  };

  // 500ms デバウンス: 入力が止まってから PDF を再生成
  useEffect(() => {
    const timer = setTimeout(() => setPreviewForm(form), 500);
    return () => clearTimeout(timer);
  }, [form]);

  // 自社 URL から QR コード data URL を生成（companyUrl 変化時のみ）
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    generateQrDataUrl(previewForm.companyUrl).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [previewForm.companyUrl]);

  // PdfDocument 要素を useMemo で安定化（previewForm/theme/qr 変化時のみ再生成）
  const previewDocument = useMemo(
    () => (
      <PdfDocument form={previewForm} theme={theme} qrDataUrl={qrDataUrl} />
    ),
    [previewForm, theme, qrDataUrl]
  );

  const handlePrint = useCallback(async () => {
    const filename =
      form.projectName ||
      form.clientName ||
      `提案書_${new Date().toLocaleDateString('ja-JP').replace(/\//g, '-')}`;

    try {
      await exportPreviewToPdf(form, theme, filename);
    } catch (err) {
      console.error('PDF 出力エラー:', err);
      alert('PDF の生成に失敗しました。ブラウザをリロードしてお試しください。');
    }
  }, [form, theme]);

  // キーボードショートカット: Ctrl+S / Ctrl+P / Ctrl+Z / Ctrl+Shift+Z
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const key = e.key.toLowerCase();

      if (key === 's' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setShowSave(true);
        return;
      }
      if (key === 'p' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        handlePrint();
        return;
      }
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault();
        redo();
        return;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePrint, undo, redo]);

  const applyTemplate = (id: string) => {
    const t = TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    setForm((prev) => ({
      ...prev,
      siteType: t.siteType,
      overview: t.overview,
      purpose: t.purpose,
      features: [...t.features],
      pages: t.pages.map((p) => ({ ...p, children: [...p.children] })),
      plans: JSON.parse(JSON.stringify(t.plans)),
      schedule: t.schedule.map((s) => ({ ...s })),
    }));
  };

  const applyCustomTemplate = (tpl: CustomTemplate) => {
    setForm((prev) => ({
      ...prev,
      siteType: tpl.data.siteType,
      overview: tpl.data.overview,
      purpose: tpl.data.purpose,
      features: [...tpl.data.features],
      pages: tpl.data.pages.map((p) => ({
        ...p,
        children: [...p.children],
      })),
      plans: JSON.parse(JSON.stringify(tpl.data.plans)),
      schedule: tpl.data.schedule.map((s) => ({ ...s })),
    }));
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ ['--theme-primary' as string]: theme.primary }}
    >
      {draftToRestore && (
        <RestoreDraftDialog
          savedAt={draftToRestore.savedAt}
          theme={theme}
          onRestore={handleRestoreDraft}
          onDiscard={handleDiscardDraft}
        />
      )}

      {showTemplate && (
        <TemplateSelector
          form={form}
          onSelectBuiltIn={applyTemplate}
          onSelectCustom={applyCustomTemplate}
          onClose={() => setShowTemplate(false)}
          theme={theme}
        />
      )}

      {showSave && (
        <SaveLoadPanel
          form={form}
          setForm={setForm}
          theme={theme}
          onClose={() => setShowSave(false)}
        />
      )}

      <Header
        form={form}
        setForm={setForm}
        theme={theme}
        onOpenSave={() => setShowSave(true)}
        onPrint={handlePrint}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <MobileNotice />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} theme={theme} />

      {activeTab === 'preview' ? (
        /* プレビュータブ: PC は PDF Viewer、モバイルはダウンロード誘導 */
        <>
          {/* PC (sm+): PDFViewer */}
          <div className="hidden sm:block flex-1 w-full px-5 py-3">
            <PDFViewer
              style={{
                width: '100%',
                height: 'calc(100vh - 140px)',
                border: 'none',
              }}
              showToolbar={true}
            >
              {previewDocument}
            </PDFViewer>
          </div>
          {/* モバイル: PDFをダウンロードして閲覧する誘導 */}
          <div className="sm:hidden flex-1 flex flex-col items-center justify-center px-6 py-12 text-center gap-4">
            <p className="text-sm text-ink-body m-0">
              スマートフォンではプレビュー表示は最適化されていません。
              <br />
              下記から PDF をダウンロードしてご確認ください。
            </p>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-lg border-none text-white text-sm font-bold cursor-pointer flex items-center gap-2"
              style={{ background: theme.primary }}
            >
              PDF をダウンロード
            </button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 flex-1 min-h-0 w-full print:hidden">
          {/* 入力フォーム（モバイルは全幅、PC は左側） */}
          <div className="p-3 sm:p-[18px_22px] overflow-y-auto max-h-[calc(100vh-105px)]">
            {activeTab === 'basic' && (
              <BasicInfoTab
                form={form}
                setForm={setForm}
                theme={theme}
                onOpenTemplate={() => setShowTemplate(true)}
              />
            )}
            {activeTab === 'pages' && (
              <PagesTab form={form} setForm={setForm} theme={theme} />
            )}
            {activeTab === 'estimate' && (
              <EstimateTab form={form} setForm={setForm} theme={theme} />
            )}
            {activeTab === 'schedule' && (
              <ScheduleTab form={form} setForm={setForm} theme={theme} />
            )}
            {activeTab === 'terms' && (
              <TermsTab form={form} setForm={setForm} theme={theme} />
            )}
          </div>

          {/* ライブプレビュー（モバイル非表示・PC のみ） */}
          <div className="hidden sm:flex border-l-2 border-line-faint bg-surface-preview flex-col max-h-[calc(100vh-105px)]">
            <span className="text-xs font-semibold text-ink-soft flex items-center gap-1.5 px-3.5 pt-2">
              <Link size={14} color="#999" />
              ライブプレビュー（実際の PDF 表示）
            </span>
            <div className="flex-1 p-2">
              <PdfLivePreview
                document={previewDocument}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
