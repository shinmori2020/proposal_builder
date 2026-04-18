'use client';

import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import SitemapSection from './SitemapSection';
import EstimateSection from './EstimateSection';
import FlowSection from './FlowSection';
import ScheduleSection from './ScheduleSection';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function ProposalPreview({ form, theme }: Props) {
  const P = theme.primary;
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      id="proposal-preview"
      className="bg-white text-[#222] text-[13px] leading-[1.8]"
      style={{ fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif" }}
    >
      {/* 表紙 */}
      <div
        className="min-h-[300px] flex flex-col justify-center items-center text-white p-9 text-center rounded-t-lg"
        style={{
          background: `linear-gradient(135deg, ${P} 0%, ${theme.dark} 100%)`,
        }}
      >
        <div className="text-[10px] tracking-[6px] uppercase opacity-60 mb-3">
          Web Site Proposal
        </div>
        <h1 className="text-[22px] font-extrabold m-0 mb-1.5">
          {form.projectName || 'Webサイト制作のご提案'}
        </h1>
        <div className="text-[13px] opacity-85">
          {form.clientName ? `${form.clientName} 様` : ''}
        </div>
        <div className="mt-4 text-[11px] opacity-50">{today}</div>
        {form.companyLogo && (
          <img
            src={form.companyLogo}
            alt=""
            className="max-h-10 max-w-[140px] object-contain mt-3 opacity-90"
          />
        )}
        {form.companyName && (
          <div className="mt-1 text-xs opacity-65">{form.companyName}</div>
        )}
      </div>

      {/* コンテンツ（Step 7で全セクション統合予定） */}
      <div className="p-6 flex flex-col gap-6">
        <FlowSection form={form} theme={theme} />
        <SitemapSection form={form} theme={theme} />
        <EstimateSection form={form} theme={theme} />
        <ScheduleSection form={form} theme={theme} />
      </div>
    </div>
  );
}
