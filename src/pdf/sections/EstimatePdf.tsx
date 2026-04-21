import { View, Text } from '@react-pdf/renderer';
import { ProposalForm, Plan } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { pdfStyles } from '../pdfStyles';
import { PC } from '../pdfColors';
import { calcPlan, formatPrice } from '@/lib/calculations';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function EstimatePdf({ form, theme }: Props) {
  const P = theme.primary;
  const L = theme.light;
  const hp = form.hidePrices;
  const plans = form.plans || [];

  if (plans.length === 0) return null;

  return (
    <View style={pdfStyles.section}>
      <Text
        style={[
          pdfStyles.sectionHeading,
          { color: P, borderBottomColor: P },
        ]}
      >
        お見積もり
      </Text>

      {hp ? (
        <HidePricesView plans={plans} P={P} L={L} />
      ) : plans.length > 1 ? (
        <MultiPlanCards plans={plans} P={P} />
      ) : (
        <SinglePlanTable plan={plans[0]} P={P} L={L} />
      )}
    </View>
  );
}

/* ========== 金額非表示モード ========== */
function HidePricesView({
  plans,
  P,
  L,
}: {
  plans: Plan[];
  P: string;
  L: string;
}) {
  return (
    <View
      wrap={false}
      style={{
        paddingVertical: 18,
        paddingHorizontal: 14,
        backgroundColor: PC.surface.panel,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: PC.line.subtle,
        borderStyle: 'solid',
      }}
    >
      <Text
        style={{
          fontSize: 10,
          color: PC.ink.body,
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        お見積もり金額につきましては、別途ご案内させていただきます。
      </Text>
      <Text
        style={{
          fontSize: 8,
          color: PC.ink.faint,
          marginBottom: 10,
          textAlign: 'center',
        }}
      >
        詳細はお気軽にお問い合わせください。
      </Text>

      <Text
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: PC.ink.muted,
          marginBottom: 4,
        }}
      >
        含まれる作業項目：
      </Text>

      {plans.map((plan, pi) => (
        <View key={pi} style={{ marginBottom: plans.length > 1 ? 6 : 0 }}>
          {plans.length > 1 && (
            <Text
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: P,
                marginBottom: 3,
              }}
            >
              {plan.recommended ? '★ ' : ''}
              {plan.name}
            </Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 3,
            }}
          >
            {plan.items.map((it, i) => (
              <Text
                key={i}
                style={{
                  paddingVertical: 1,
                  paddingHorizontal: 6,
                  borderRadius: 8,
                  fontSize: 8,
                  fontWeight: 600,
                  backgroundColor: L,
                  color: P,
                }}
              >
                {it.name}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

/* ========== 複数プラン比較 ========== */
function MultiPlanCards({ plans, P }: { plans: Plan[]; P: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {plans.map((plan, pi) => {
        const { sub, disc, total } = calcPlan(plan);

        return (
          <View
            key={pi}
            wrap={false}
            style={{
              flex: 1,
              borderWidth: plan.recommended ? 2 : 1,
              borderColor: plan.recommended ? P : PC.line.soft,
              borderStyle: 'solid',
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            {plan.recommended && (
              <Text
                style={{
                  backgroundColor: P,
                  color: PC.white,
                  textAlign: 'center',
                  fontSize: 8,
                  fontWeight: 800,
                  paddingVertical: 2,
                }}
              >
                おすすめ
              </Text>
            )}
            <View style={{ padding: 8 }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: P,
                  textAlign: 'center',
                  marginBottom: 6,
                }}
              >
                {plan.name}
              </Text>
              <View style={{ marginBottom: 6 }}>
                {plan.items.map((it, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      fontSize: 8,
                      borderBottomWidth: 0.5,
                      borderBottomColor: PC.line.divider,
                      borderBottomStyle: 'solid',
                      paddingVertical: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 8,
                        color: PC.ink.body,
                        flex: 1,
                      }}
                    >
                      {it.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 8,
                        fontWeight: 600,
                        color: PC.ink.primary,
                      }}
                    >
                      ¥{formatPrice(it.qty * it.price)}
                    </Text>
                  </View>
                ))}
              </View>
              <View
                style={{
                  borderTopWidth: 1.5,
                  borderTopColor: P,
                  borderTopStyle: 'solid',
                  paddingTop: 4,
                  alignItems: 'flex-end',
                }}
              >
                <Text style={{ fontSize: 7, color: PC.ink.soft }}>
                  小計: ¥{formatPrice(sub)}
                </Text>
                {disc > 0 && (
                  <Text style={{ fontSize: 7, color: PC.delete }}>
                    {plan.discount?.label || '割引'}: -¥{formatPrice(disc)}
                  </Text>
                )}
                <Text style={{ fontSize: 7, color: PC.ink.soft }}>税込</Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: P,
                    marginTop: 1,
                  }}
                >
                  ¥{formatPrice(total)}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

/* ========== 1プラン詳細テーブル ========== */
function SinglePlanTable({
  plan,
  P,
  L,
}: {
  plan: Plan;
  P: string;
  L: string;
}) {
  const { sub, disc, tax, total } = calcPlan(plan);

  const cellBase = {
    paddingVertical: 3,
    paddingHorizontal: 4,
    fontSize: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: PC.line.muted,
    borderBottomStyle: 'solid' as const,
  };

  return (
    <View>
      {/* ヘッダー */}
      <View
        wrap={false}
        style={{
          flexDirection: 'row',
          backgroundColor: P,
        }}
      >
        <Text
          style={{
            flex: 2,
            paddingVertical: 4,
            paddingHorizontal: 4,
            color: PC.white,
            fontSize: 9,
            fontWeight: 800,
          }}
        >
          項目
        </Text>
        <Text
          style={{
            width: 40,
            paddingVertical: 4,
            paddingHorizontal: 4,
            color: PC.white,
            fontSize: 9,
            fontWeight: 800,
            textAlign: 'center',
          }}
        >
          単位
        </Text>
        <Text
          style={{
            width: 35,
            paddingVertical: 4,
            paddingHorizontal: 4,
            color: PC.white,
            fontSize: 9,
            fontWeight: 800,
            textAlign: 'center',
          }}
        >
          数量
        </Text>
        <Text
          style={{
            width: 65,
            paddingVertical: 4,
            paddingHorizontal: 4,
            color: PC.white,
            fontSize: 9,
            fontWeight: 800,
            textAlign: 'right',
          }}
        >
          単価
        </Text>
        <Text
          style={{
            width: 75,
            paddingVertical: 4,
            paddingHorizontal: 4,
            color: PC.white,
            fontSize: 9,
            fontWeight: 800,
            textAlign: 'right',
          }}
        >
          小計
        </Text>
      </View>

      {/* データ */}
      {plan.items.map((it, i) => (
        <View
          key={i}
          wrap={false}
          style={{
            flexDirection: 'row',
            backgroundColor: i % 2 === 0 ? PC.white : PC.surface.panel,
          }}
        >
          <Text style={{ ...cellBase, flex: 2, color: PC.ink.primary }}>
            {it.name || '—'}
          </Text>
          <Text
            style={{
              ...cellBase,
              width: 40,
              textAlign: 'center',
              color: PC.ink.primary,
            }}
          >
            {it.unit}
          </Text>
          <Text
            style={{
              ...cellBase,
              width: 35,
              textAlign: 'center',
              color: PC.ink.primary,
            }}
          >
            {it.qty}
          </Text>
          <Text
            style={{
              ...cellBase,
              width: 65,
              textAlign: 'right',
              color: PC.ink.primary,
            }}
          >
            ¥{formatPrice(it.price)}
          </Text>
          <Text
            style={{
              ...cellBase,
              width: 75,
              textAlign: 'right',
              fontWeight: 600,
              color: PC.ink.primary,
            }}
          >
            ¥{formatPrice(it.qty * it.price)}
          </Text>
        </View>
      ))}

      {/* 合計ブロック（小計・割引・消費税・合計）は一体で表示させる */}
      <View wrap={false}>
        {/* 小計行 */}
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 4,
          }}
        >
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              paddingHorizontal: 4,
              fontSize: 9,
              fontWeight: 600,
              color: PC.ink.body,
            }}
          >
            小計
          </Text>
          <Text
            style={{
              width: 75,
              textAlign: 'right',
              paddingHorizontal: 4,
              fontSize: 9,
              color: PC.ink.primary,
            }}
          >
            ¥{formatPrice(sub)}
          </Text>
        </View>

        {/* 割引行 */}
        {disc > 0 && (
          <View style={{ flexDirection: 'row', paddingTop: 2 }}>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                paddingHorizontal: 4,
                fontSize: 9,
                fontWeight: 600,
                color: PC.delete,
              }}
            >
              {plan.discount?.label || '割引'}
            </Text>
            <Text
              style={{
                width: 75,
                textAlign: 'right',
                paddingHorizontal: 4,
                fontSize: 9,
                fontWeight: 600,
                color: PC.delete,
              }}
            >
              -¥{formatPrice(disc)}
            </Text>
          </View>
        )}

        {/* 消費税行 */}
        <View style={{ flexDirection: 'row', paddingTop: 2 }}>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              paddingHorizontal: 4,
              fontSize: 9,
              color: PC.ink.body,
            }}
          >
            消費税
          </Text>
          <Text
            style={{
              width: 75,
              textAlign: 'right',
              paddingHorizontal: 4,
              fontSize: 9,
              color: PC.ink.primary,
            }}
          >
            ¥{formatPrice(tax)}
          </Text>
        </View>

        {/* 合計行 */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: 4,
            paddingVertical: 6,
            backgroundColor: L,
          }}
        >
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              paddingHorizontal: 4,
              fontSize: 11,
              fontWeight: 800,
              color: P,
            }}
          >
            合計（税込）
          </Text>
          <Text
            style={{
              width: 75,
              textAlign: 'right',
              paddingHorizontal: 4,
              fontSize: 11,
              fontWeight: 800,
              color: P,
            }}
          >
            ¥{formatPrice(total)}
          </Text>
        </View>
      </View>
    </View>
  );
}
