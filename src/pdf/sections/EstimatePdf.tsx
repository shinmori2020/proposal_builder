import { View, Text } from '@react-pdf/renderer';
import { ProposalForm, Plan, EstimateItem } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { pdfStyles } from '../pdfStyles';
import { PC } from '../pdfColors';
import { calcPlan, formatPrice } from '@/lib/calculations';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

/**
 * 表示対象の項目だけを取得（名前と単価がどちらも空の行は除外）
 */
function getVisibleItems(items: EstimateItem[]): EstimateItem[] {
  return items.filter((it) => it.name.trim() !== '' || it.price !== 0);
}

/**
 * 配列を N 件ずつのチャンクに分割
 */
function chunk<T>(arr: T[], size: number): T[][] {
  if (arr.length === 0) return [[]];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export default function EstimatePdf({ form, theme }: Props) {
  const P = theme.primary;
  const L = theme.light;
  const hp = form.hidePrices;
  const plans = form.plans || [];
  const taxRate = form.taxRate ?? 10;

  if (plans.length === 0) return null;

  const isMulti = plans.length > 1 && !hp;
  return (
    <View style={pdfStyles.section}>
      <Text
        style={[
          pdfStyles.sectionHeading,
          { color: P, borderBottomColor: P },
        ]}
        minPresenceAhead={400}
      >
        {isMulti ? 'プラン比較・お見積もり' : 'お見積もり'}
      </Text>

      {isMulti && (
        <Text
          style={{
            fontSize: 9,
            color: PC.ink.body,
            marginBottom: 8,
            lineHeight: 1.5,
          }}
        >
          下記からご希望のプランをお選びください。
          {plans.some((p) => p.recommended) &&
            ' 当方より「おすすめ」のプランをご提示しております。'}
        </Text>
      )}

      {hp ? (
        <HidePricesView plans={plans} P={P} L={L} />
      ) : plans.length > 1 ? (
        <MultiPlanCards plans={plans} P={P} taxRate={taxRate} />
      ) : (
        <SinglePlanTable plan={plans[0]} P={P} L={L} taxRate={taxRate} />
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

      {plans.map((plan, pi) => {
        const visible = getVisibleItems(plan.items);
        return (
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
              {visible.map((it, i) => (
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
        );
      })}
    </View>
  );
}

/* ========== 複数プラン比較 ========== */
function MultiPlanCards({
  plans,
  P,
  taxRate,
}: {
  plans: Plan[];
  P: string;
  taxRate: number;
}) {
  return (
    <View style={{ flexDirection: 'column', gap: 12 }}>
      {plans.map((plan, pi) => {
        const visible = getVisibleItems(plan.items);
        const { sub, disc, total } = calcPlan(plan, taxRate);
        const recommended = plan.recommended;

        return (
          <View
            key={pi}
            style={{
              borderWidth: recommended ? 2 : 1,
              borderColor: recommended ? P : PC.line.soft,
              borderStyle: 'solid',
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: PC.white,
            }}
          >
            {recommended && (
              <Text
                style={{
                  backgroundColor: P,
                  color: PC.white,
                  textAlign: 'center',
                  fontSize: 9,
                  fontWeight: 800,
                  paddingVertical: 4,
                  letterSpacing: 1,
                }}
              >
                ★ おすすめ
              </Text>
            )}
            <View style={{ padding: 10 }}>
              {/* プラン名 + 税込合計 + 「含まれる項目」見出しは一塊で */}
              <View wrap={false}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: P,
                    marginBottom: 6,
                  }}
                >
                  {plan.name}
                </Text>

                {/* 合計（左:ラベル / 右:金額 で項目リストと整合） */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    paddingVertical: 6,
                    marginBottom: 8,
                    borderBottomWidth: 1.5,
                    borderBottomColor: P,
                    borderBottomStyle: 'solid',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: PC.ink.muted,
                    }}
                  >
                    税込合計
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: P,
                    }}
                  >
                    ¥{formatPrice(total)}
                  </Text>
                </View>

                {/* 含まれる項目 */}
                <Text
                  style={{
                    fontSize: 8,
                    fontWeight: 600,
                    color: PC.ink.muted,
                    marginBottom: 3,
                  }}
                >
                  含まれる項目
                </Text>
              </View>
              <View style={{ marginBottom: 4 }}>
                {visible.map((it, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      borderBottomWidth: 0.5,
                      borderBottomColor: PC.line.divider,
                      borderBottomStyle: 'solid',
                      paddingVertical: 2,
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

              {/* 内訳サマリー */}
              <View
                style={{
                  borderTopWidth: 0.8,
                  borderTopColor: PC.line.subtle,
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
  taxRate,
}: {
  plan: Plan;
  P: string;
  L: string;
  taxRate: number;
}) {
  const { sub, disc, tax, total } = calcPlan(plan, taxRate);
  const visibleItems = getVisibleItems(plan.items);

  /**
   * 動的チャンクサイズ：
   * - 20件以下は単一チャンク（分割しない）
   * - それ以上は可能な限り均等に分散（小さな最終チャンクを避ける）
   */
  const MAX_SINGLE_CHUNK = 20;
  const PREFERRED_CHUNK = 18;
  const totalItems = visibleItems.length;
  let chunks: EstimateItem[][];
  if (totalItems <= MAX_SINGLE_CHUNK) {
    chunks = [visibleItems];
  } else {
    const numChunks = Math.ceil(totalItems / PREFERRED_CHUNK);
    const perChunk = Math.ceil(totalItems / numChunks);
    chunks = chunk(visibleItems, perChunk);
  }
  const isMulti = chunks.length > 1;

  return (
    <View>
      {/* 各チャンク（ヘッダー付き、2つ目以降は強制改ページ） */}
      {chunks.map((items, chunkIdx) => {
        // ゼブラ縞は全チャンクを通して連続させる
        const priorItems = chunks
          .slice(0, chunkIdx)
          .reduce((sum, c) => sum + c.length, 0);

        return (
          <View
            key={chunkIdx}
            wrap={false}
            break={isMulti && chunkIdx > 0}
          >
            {/* 継続ページの表示 */}
            {chunkIdx > 0 && (
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: PC.ink.soft,
                  marginBottom: 3,
                }}
              >
                お見積もり（つづき）
              </Text>
            )}

            {/* ヘッダー行 */}
            <TableHeaderRow P={P} />

            {/* データ行 */}
            {items.map((it, i) => (
              <TableBodyRow
                key={i}
                item={it}
                zebra={(priorItems + i) % 2 === 0}
              />
            ))}
          </View>
        );
      })}

      {/* 合計ブロック（前の行から離れすぎないように minPresenceAhead） */}
      <View wrap={false} minPresenceAhead={80}>
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
            消費税（{taxRate}%）
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

function TableHeaderRow({ P }: { P: string }) {
  return (
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
  );
}

function TableBodyRow({
  item,
  zebra,
}: {
  item: EstimateItem;
  zebra: boolean;
}) {
  const cellBase = {
    paddingVertical: 3,
    paddingHorizontal: 4,
    fontSize: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: PC.line.muted,
    borderBottomStyle: 'solid' as const,
  };

  return (
    <View
      wrap={false}
      style={{
        flexDirection: 'row',
        backgroundColor: zebra ? PC.white : PC.surface.panel,
      }}
    >
      <Text style={{ ...cellBase, flex: 2, color: PC.ink.primary }}>
        {item.name || '—'}
      </Text>
      <Text
        style={{
          ...cellBase,
          width: 40,
          textAlign: 'center',
          color: PC.ink.primary,
        }}
      >
        {item.unit}
      </Text>
      <Text
        style={{
          ...cellBase,
          width: 35,
          textAlign: 'center',
          color: PC.ink.primary,
        }}
      >
        {item.qty}
      </Text>
      <Text
        style={{
          ...cellBase,
          width: 65,
          textAlign: 'right',
          color: PC.ink.primary,
        }}
      >
        ¥{formatPrice(item.price)}
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
        ¥{formatPrice(item.qty * item.price)}
      </Text>
    </View>
  );
}
