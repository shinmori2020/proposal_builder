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
    // 必要最低限の契約条件をデフォルトで選択。
    // ユーザーは案件ごとに変更・追加・解除できる。
    contractTerms: {
      payment: 'p1', // 着手金50%／納品時50%
      revision: 'r1', // デザイン2回・コーディング1回（標準）
      copyright: 'c2', // 制作者帰属（使用権付与）
      delivery: 'd3', // アップロード＋データ納品
      extraNotes: [
        'n1', // 対応ブラウザ
        'n3', // 素材のご提供
        'n4', // 納品後の無償保守期間
        'n6', // 検収期間（重要：トラブル予防の最重要項目）
        'n7', // 修正と仕様変更の区別
        'n8', // 公開後のサポート範囲
      ],
    },
    themeId: 'green',
    hidePrices: false,
    taxRate: 10,
  };
}
