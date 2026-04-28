'use client';

import { TabId } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { TABS } from '@/lib/constants';
import { C } from '@/lib/colors';
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
    <nav className="flex bg-white border-b-2 border-line-faint px-1.5 sm:px-2.5 overflow-x-auto print:hidden">
      {TABS.map((tab) => {
        const IconComponent = ICON_MAP[tab.icon];
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="px-2.5 sm:px-4 py-2.5 sm:py-3.5 border-none bg-transparent text-sm sm:text-[18px] cursor-pointer font-inherit whitespace-nowrap flex items-center gap-1.5 sm:gap-2"
            style={{
              borderBottom: isActive
                ? `3px solid ${theme.primary}`
                : '3px solid transparent',
              color: isActive ? theme.primary : C.ink.soft,
              fontWeight: isActive ? 700 : 400,
            }}
          >
            {IconComponent && (
              <IconComponent
                size={18}
                color={isActive ? theme.primary : C.ink.softer}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
