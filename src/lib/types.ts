export interface Page {
  name: string;
  children: string[];
}

export interface EstimateItem {
  name: string;
  unit: '式' | 'ページ' | '点' | '時間' | '月';
  qty: number;
  price: number;
}

export interface Discount {
  type: 'none' | 'percent' | 'fixed';
  value: number;
  label: string;
}

export interface Plan {
  name: string;
  recommended: boolean;
  items: EstimateItem[];
  discount: Discount;
}

export interface SchedulePhase {
  phase: string;
  weeks: number;
  extraDays: number;
}

export interface ContractTerms {
  payment: string | null;
  revision: string | null;
  copyright: string | null;
  delivery: string | null;
  extraNotes: string[];
}

export interface ProposalForm {
  clientName: string;
  projectName: string;
  siteType: string;
  overview: string;
  purpose: string;
  features: string[];
  pages: Page[];
  plans: Plan[];
  schedule: SchedulePhase[];
  scheduleStart: string;
  companyName: string;
  companyUrl: string;
  companyLogo: string;
  deliveryDate: string;
  notes: string;
  contractTerms: ContractTerms;
  themeId: string;
  hidePrices: boolean;
}

export type TabId = 'basic' | 'pages' | 'estimate' | 'schedule' | 'terms' | 'preview';

export interface TabDef {
  id: TabId;
  label: string;
  icon: string;
}
