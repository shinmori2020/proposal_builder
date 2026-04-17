import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { calcPlan, formatPrice } from '@/lib/calculations';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function EstimateSection({ form, theme }: Props) {
  const P = theme.primary;
  const L = theme.light;
  const hp = form.hidePrices;
  const plans = form.plans || [];

  if (plans.length === 0) return null;

  return (
    <div>
      <h2
        className="text-sm font-extrabold mb-2 pb-1 border-b-2 tracking-wide"
        style={{ color: P, borderBottomColor: P }}
      >
        お見積もり
      </h2>

      {/* 金額非表示モード */}
      {hp ? (
        <div
          className="text-center py-6 px-4 rounded-[10px] border-[1.5px] border-[#e0e4e2]"
          style={{ background: '#f8faf9' }}
        >
          <div className="text-[13px] text-[#555] mb-1.5">
            お見積もり金額につきましては、別途ご案内させていただきます。
          </div>
          <div className="text-[11px] text-[#999]">
            詳細はお気軽にお問い合わせください。
          </div>
          {plans.length > 0 && (
            <div className="mt-3.5 flex flex-col gap-1.5 text-left">
              <div className="text-[11px] font-semibold text-[#777] mb-0.5">
                含まれる作業項目：
              </div>
              {plans.map((plan, pi) => (
                <div key={pi}>
                  {plans.length > 1 && (
                    <div
                      className="text-[11px] font-bold mb-1"
                      style={{ color: P }}
                    >
                      {plan.recommended && '★ '}
                      {plan.name}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {plan.items.map((it, i) => (
                      <span
                        key={i}
                        className="py-0.5 px-2 rounded-[10px] text-[10px] font-medium"
                        style={{ background: L, color: P }}
                      >
                        {it.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : plans.length > 1 ? (
        /* 複数プラン: カード比較 */
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${plans.length}, 1fr)` }}
        >
          {plans.map((plan, pi) => {
            const { sub, disc, total } = calcPlan(plan);
            return (
              <div
                key={pi}
                className="rounded-[10px] overflow-hidden relative"
                style={{
                  border: plan.recommended
                    ? `2.5px solid ${P}`
                    : '1.5px solid #ddd',
                }}
              >
                {plan.recommended && (
                  <div
                    className="text-center text-[10px] font-bold py-0.5 text-white"
                    style={{ background: P }}
                  >
                    おすすめ
                  </div>
                )}
                <div className="p-3">
                  <h3
                    className="m-0 mb-2 text-sm font-extrabold text-center"
                    style={{ color: P }}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex flex-col gap-0.5">
                    {plan.items.map((it, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-[10px] border-b border-[#f0f0f0] py-0.5"
                      >
                        <span className="text-[#555]">{it.name}</span>
                        <span className="font-semibold">
                          ¥{formatPrice(it.qty * it.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="mt-2 pt-2 text-right"
                    style={{ borderTop: `2px solid ${P}` }}
                  >
                    <div className="text-[10px] text-[#888]">
                      小計: ¥{formatPrice(sub)}
                    </div>
                    {disc > 0 && (
                      <div className="text-[10px] text-[#c33]">
                        {plan.discount?.label || '割引'}: -¥{formatPrice(disc)}
                      </div>
                    )}
                    <div className="text-[10px] text-[#888]">税込</div>
                    <div
                      className="text-[18px] font-extrabold mt-0.5"
                      style={{ color: P }}
                    >
                      ¥{formatPrice(total)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 1プラン: 詳細テーブル */
        <SinglePlanTable plan={plans[0]} theme={theme} />
      )}
    </div>
  );
}

function SinglePlanTable({
  plan,
  theme,
}: {
  plan: ProposalForm['plans'][0];
  theme: Theme;
}) {
  const { sub, disc, tax, total } = calcPlan(plan);
  const P = theme.primary;
  const L = theme.light;

  const th = 'py-1.5 px-1.5 text-left text-[10px] font-semibold';
  const td = 'py-1 px-1.5 border-b border-[#e8ece9]';

  return (
    <table className="w-full border-collapse text-[11px]">
      <thead>
        <tr style={{ background: P, color: '#fff' }}>
          <th className={th}>項目</th>
          <th className={th} style={{ width: 40 }}>
            単位
          </th>
          <th className={th} style={{ width: 35 }}>
            数量
          </th>
          <th className={`${th} text-right`} style={{ width: 70 }}>
            単価
          </th>
          <th className={`${th} text-right`} style={{ width: 80 }}>
            小計
          </th>
        </tr>
      </thead>
      <tbody>
        {plan.items.map((it, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8faf9' }}>
            <td className={td}>{it.name || '—'}</td>
            <td className={`${td} text-center`}>{it.unit}</td>
            <td className={`${td} text-center`}>{it.qty}</td>
            <td className={`${td} text-right`}>¥{formatPrice(it.price)}</td>
            <td className={`${td} text-right font-semibold`}>
              ¥{formatPrice(it.qty * it.price)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={4} className={`${td} text-right font-semibold`}>
            小計
          </td>
          <td className={`${td} text-right`}>¥{formatPrice(sub)}</td>
        </tr>
        {disc > 0 && (
          <tr style={{ color: '#c33' }}>
            <td colSpan={4} className={`${td} text-right font-semibold`}>
              {plan.discount?.label || '割引'}
            </td>
            <td className={`${td} text-right font-semibold`}>
              -¥{formatPrice(disc)}
            </td>
          </tr>
        )}
        <tr>
          <td colSpan={4} className={`${td} text-right`}>
            消費税
          </td>
          <td className={`${td} text-right`}>¥{formatPrice(tax)}</td>
        </tr>
        <tr style={{ background: L }}>
          <td
            colSpan={4}
            className={`${td} text-right font-extrabold text-[13px]`}
            style={{ color: P }}
          >
            合計（税込）
          </td>
          <td
            className={`${td} text-right font-extrabold text-[13px]`}
            style={{ color: P }}
          >
            ¥{formatPrice(total)}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
