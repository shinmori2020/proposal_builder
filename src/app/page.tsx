'use client';

import { useState } from 'react';
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
import ProposalPreview from '@/components/preview/ProposalPreview';
import TemplateSelector from '@/components/modals/TemplateSelector';
import SaveLoadPanel from '@/components/modals/SaveLoadPanel';
import { exportPreviewToPdf } from '@/lib/pdfExport';
import { Link } from 'lucide-react';

export default function Home() {
  const [form, setForm] = useState<ProposalForm>(defaultForm());
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [showTemplate, setShowTemplate] = useState(true);
  const [showSave, setShowSave] = useState(false);
  const theme = getTheme(form.themeId);

  const handlePrint = async () => {
    // プレビュータブに切り替えて DOM を描画
    setActiveTab('preview');
    await new Promise((resolve) => setTimeout(resolve, 300));

    const filename =
      form.projectName ||
      form.clientName ||
      `提案書_${new Date().toLocaleDateString('ja-JP').replace(/\//g, '-')}`;

    try {
      await exportPreviewToPdf(filename);
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
        <div className="max-w-[1200px] mx-auto py-5 px-5 flex-1 w-full">
          <ProposalPreview form={form} theme={theme} />
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

          {/* 右側: 縮小ライブプレビュー */}
          <div className="border-l-2 border-line-faint bg-surface-preview p-3.5 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-105px)]">
            <span className="text-xs font-semibold text-ink-soft flex items-center gap-1.5">
              <Link size={14} color="#999" />
              ライブプレビュー
            </span>
            <div
              className="mt-2 origin-top-left"
              style={{ transform: 'scale(0.68)', width: '147%' }}
            >
              <ProposalPreview form={form} theme={theme} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
