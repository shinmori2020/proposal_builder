export interface ContractPreset {
  id: string;
  label: string;
  text: string;
}

export interface ContractPresets {
  payment: ContractPreset[];
  revision: ContractPreset[];
  copyright: ContractPreset[];
  delivery: ContractPreset[];
  notes: ContractPreset[];
}

export const CONTRACT_PRESETS: ContractPresets = {
  payment: [
    { id: 'p1', label: '着手金50%/納品時50%', text: 'ご契約時に50%を着手金、納品完了後に残り50%をお支払いいただきます。' },
    { id: 'p2', label: '着手金30%/中間30%/納品時40%', text: '着手時30%、デザイン確定時30%、納品完了時40%の3回払いです。' },
    { id: 'p3', label: '納品後一括', text: '納品完了後、請求書発行から30日以内に一括でお支払いください。' },
    { id: 'p4', label: '月額分割', text: '制作費総額を分割でお支払いいただけます。回数はご相談ください。' },
    { id: 'p5', label: 'ココナラ決済', text: 'ココナラのプラットフォームを通じて安全にお支払いいただきます。' },
  ],
  revision: [
    { id: 'r1', label: 'デザイン2回・コーディング1回', text: 'デザイン修正2回、コーディング修正1回まで無償。以降は別途費用です。' },
    { id: 'r2', label: '各工程3回まで', text: '各工程3回まで無償修正。4回目以降は別途費用です。' },
    { id: 'r3', label: '期間内無制限', text: '納品前の修正は期間内無制限。仕様変更は別途お見積もりです。' },
  ],
  copyright: [
    { id: 'c1', label: 'クライアントに譲渡', text: 'お支払い完了後、著作権はすべてクライアント様に譲渡します。' },
    { id: 'c2', label: '制作者帰属（使用権付与）', text: '著作権は制作者に帰属し、使用権を無期限で付与します。' },
  ],
  delivery: [
    { id: 'd1', label: 'サーバーアップロード', text: 'ご指定のサーバーにアップロードし公開します。' },
    { id: 'd2', label: 'データ一式納品', text: '制作データ一式をzipでお渡しします。' },
    { id: 'd3', label: 'アップロード＋データ納品', text: 'サーバー公開に加え、データ一式もお渡しします。' },
  ],
  notes: [
    { id: 'n1', label: '対応ブラウザ', text: 'Chrome / Safari / Firefox / Edge（各最新版）対応。IE非対応。' },
    { id: 'n2', label: 'サーバー費用別途', text: 'サーバー・ドメイン費用は本見積もりに含まれません。' },
    { id: 'n3', label: '素材ご提供', text: '原稿・写真・ロゴ等はクライアント様よりご支給ください。' },
    { id: 'n4', label: '納品後保守', text: '納品後1ヶ月間は無償でバグ修正に対応します。' },
    { id: 'n5', label: 'キャンセル', text: '着手後のキャンセルは進行状況に応じた費用をご請求します。' },
  ],
};

export type ContractCategory = keyof ContractPresets;
