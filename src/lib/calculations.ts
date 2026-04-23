import { Plan } from './types';

export interface PlanCalculation {
  sub: number;
  disc: number;
  tax: number;
  total: number;
}

export function calcPlan(plan: Plan, taxRate: number = 10): PlanCalculation {
  const sub = plan.items.reduce((s, it) => s + it.qty * it.price, 0);
  const d = plan.discount || { type: 'none', value: 0, label: '' };
  const disc =
    d.type === 'percent'
      ? Math.floor(sub * (d.value / 100))
      : d.type === 'fixed'
        ? d.value
        : 0;
  const after = sub - disc;
  const tax = Math.floor(after * (taxRate / 100));
  return { sub, disc, tax, total: after + tax };
}

export function formatPrice(n: number): string {
  return n.toLocaleString('ja-JP');
}

export function makePlan(
  name = 'スタンダードプラン',
  items: Plan['items'] = [{ name: 'ディレクション費', unit: '式', qty: 1, price: 50000 }],
  recommended = false
): Plan {
  return {
    name,
    items,
    discount: { type: 'none', value: 0, label: '' },
    recommended,
  };
}
