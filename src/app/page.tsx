'use client';

import { useState } from 'react';
import { ProposalForm, TabId } from '@/lib/types';
import { getTheme } from '@/lib/themes';
import { defaultForm } from '@/lib/defaults';
import Header from '@/components/layout/Header';
import TabNav from '@/components/layout/TabNav';
import ProposalPreview from '@/components/preview/ProposalPreview';
import { Link } from 'lucide-react';

export default function Home() {
  const [form, setForm] = useState<ProposalForm>(defaultForm());
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const theme = getTheme(form.themeId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        form={form}
        setForm={setForm}
        theme={theme}
        onOpenSave={() => {
          /* Step 8 で実装 */
        }}
      />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} theme={theme} />

      {activeTab === 'preview' ? (
        /* プレビュータブ: フルサイズプレビュー中央表示 */
        <div className="max-w-[800px] mx-auto py-5 px-3.5 flex-1">
          <ProposalPreview form={form} theme={theme} />
        </div>
      ) : (
        /* タブ1〜5: 左=入力フォーム、右=縮小ライブプレビュー */
        <div className="grid grid-cols-2 flex-1 min-h-0 w-full">
          {/* 左側: 入力フォーム */}
          <div className="p-[18px_22px] overflow-y-auto max-h-[calc(100vh-105px)]">
            {activeTab === 'basic' && (
              <div className="text-sm text-[#999] py-8 text-center">
                基本情報タブは Step 2 で実装されます
              </div>
            )}
            {activeTab === 'pages' && (
              <div className="text-sm text-[#999] py-8 text-center">
                ページ構成タブは Step 3 で実装されます
              </div>
            )}
            {activeTab === 'estimate' && (
              <div className="text-sm text-[#999] py-8 text-center">
                見積もりタブは Step 4 で実装されます
              </div>
            )}
            {activeTab === 'schedule' && (
              <div className="text-sm text-[#999] py-8 text-center">
                スケジュールタブは Step 5 で実装されます
              </div>
            )}
            {activeTab === 'terms' && (
              <div className="text-sm text-[#999] py-8 text-center">
                契約条件タブは Step 6 で実装されます
              </div>
            )}
          </div>

          {/* 右側: 縮小ライブプレビュー */}
          <div className="border-l-2 border-[#e0e8e4] bg-[#eef2f0] p-3.5 overflow-y-auto max-h-[calc(100vh-105px)]">
            <span className="text-xs font-semibold text-[#888] flex items-center gap-1.5">
              <Link size={14} color="#aaa" />
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
