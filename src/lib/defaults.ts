import { ProposalForm } from './types';

export function defaultForm(): ProposalForm {
  return {
    clientName: '',
    projectName: '',
    siteType: 'コーポレートサイト',
    overview: '',
    purpose: '',
    features: ['レスポンシブ対応', 'SSL対応'],
    pages: [{ name: 'トップページ', children: [] }],
    plans: [
      {
        name: 'スタンダードプラン',
        recommended: true,
        items: [{ name: 'ディレクション費', unit: '式', qty: 1, price: 50000 }],
        discount: { type: 'none', value: 0, label: '' },
      },
    ],
    schedule: [
      { phase: 'ヒアリング', weeks: 1, extraDays: 0 },
      { phase: 'デザイン', weeks: 2, extraDays: 0 },
      { phase: 'コーディング', weeks: 2, extraDays: 0 },
      { phase: '納品', weeks: 0, extraDays: 4 },
    ],
    scheduleStart: '',
    companyName: '',
    companyUrl: '',
    companyLogo: '',
    deliveryDate: '',
    notes: '',
    contractTerms: {
      payment: null,
      revision: null,
      copyright: null,
      delivery: null,
      extraNotes: [],
    },
    themeId: 'green',
    hidePrices: false,
    taxRate: 10,
  };
}
