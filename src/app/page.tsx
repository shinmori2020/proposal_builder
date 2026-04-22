'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ProposalForm, TabId } from '@/lib/types';
import { getTheme } from '@/lib/themes';
import { defaultForm } from '@/lib/defaults';
import { TEMPLATES } from '@/lib/templates';
import Header from '@/components/layout/Header';
import TabNav from '@/components/layout/TabNav';
import BasicInfoTab from '@/components/tabs/BasicInfoTab';
import PagesTab from '@/components/tabs/PagesTab';
import EstimateTab from '@/components/tabs/EstimateTab';
import ScheduleTab from '@/components/tabs/ScheduleTab';
import TermsTab from '@/components/tabs/TermsTab';
import PdfDocument from '@/pdf/PdfDocument';
import TemplateSelector from '@/components/modals/TemplateSelector';
import SaveLoadPanel from '@/components/modals/SaveLoadPanel';
import { exportPreviewToPdf } from '@/lib/pdfExport';
import { Link } from 'lucide-react';

// PDFViewer は SSR 不可のため動的インポート
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

export default function Home() {
  const [form, setForm] = useState<ProposalForm>(defaultForm());
  // プレビュー用にデバウンスされたフォーム（入力中の高頻度再レンダリングを抑制）
  const [previewForm, setPreviewForm] = useState<ProposalForm>(defaultForm());
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [showTemplate, setShowTemplate] = useState(true);
  const [showSave, setShowSave] = useState(false);
  const theme = getTheme(form.themeId);

  // 500ms デバウンス: 入力が止まってから PDF を再生成
  useEffect(() => {
    const timer = setTimeout(() => setPreviewForm(form), 500);
    return () => clearTimeout(timer);
  }, [form]);

  const handlePrint = async () => {
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
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      {showTemplate && (
        <TemplateSelector
          onSelect={applyTemplate}
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
      />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} theme={theme} />

      {activeTab === 'preview' ? (
        /* プレビュータブ: 大画面 PDF Viewer */
        <div className="flex-1 w-full px-5 py-3">
          <PDFViewer
            style={{
              width: '100%',
              height: 'calc(100vh - 140px)',
              border: 'none',
            }}
            showToolbar={true}
          >
            <PdfDocument form={previewForm} theme={theme} />
          </PDFViewer>
        </div>
      ) : (
        <div className="grid grid-cols-2 flex-1 min-h-0 w-full print:hidden">
          {/* 左側: 入力フォーム */}
          <div className="p-[18px_22px] overflow-y-auto max-h-[calc(100vh-105px)]">
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

          {/* 右側: PDFViewer ライブプレビュー */}
          <div className="border-l-2 border-line-faint bg-surface-preview flex flex-col max-h-[calc(100vh-105px)]">
            <span className="text-xs font-semibold text-ink-soft flex items-center gap-1.5 px-3.5 pt-2">
              <Link size={14} color="#999" />
              ライブプレビュー（実際の PDF 表示）
            </span>
            <div className="flex-1 p-2">
              <PDFViewer
                style={{ width: '100%', height: '100%', border: 'none' }}
                showToolbar={false}
              >
                <PdfDocument form={previewForm} theme={theme} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
