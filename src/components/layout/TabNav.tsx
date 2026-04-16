'use client';

import { TabId } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { TABS } from '@/lib/constants';
import {
  ClipboardList,
  Folder,
  Coins,
  Calendar,
  FileText,
  Eye,
} from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { ComponentType } from 'react';

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  ClipboardList,
  Folder,
  Coins,
  Calendar,
  FileText,
  Eye,
};

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  theme: Theme;
}

export default function TabNav({ activeTab, onTabChange, theme }: Props) {
  return (
    <nav className="flex bg-white border-b-2 border-[#e0e8e4] px-2.5 overflow-x-auto">
      {TABS.map((tab) => {
        const IconComponent = ICON_MAP[tab.icon];
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="px-3.5 py-3 border-none bg-transparent text-sm cursor-pointer font-inherit whitespace-nowrap flex items-center gap-1.5"
            style={{
              borderBottom: isActive
                ? `3px solid ${theme.primary}`
                : '3px solid transparent',
              color: isActive ? theme.primary : '#888',
              fontWeight: isActive ? 700 : 400,
            }}
          >
            {IconComponent && (
              <IconComponent
                size={17}
                color={isActive ? theme.primary : '#aaa'}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
