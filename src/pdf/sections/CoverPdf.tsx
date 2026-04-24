import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { PC } from '../pdfColors';
import { calcPlan, formatPrice } from '@/lib/calculations';
import { totalWeeksLabel } from '@/lib/schedule';
import { formatDeliveryDate } from '@/lib/formatters';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

const styles = StyleSheet.create({
  cover: {
    flex: 1,
    paddingVertical: 45,
    paddingHorizontal: 50,
    backgroundColor: PC.white,
  },

  /* ヘッダー */
  topBar: {
    height: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 8,
    letterSpacing: 5,
    color: PC.ink.faint,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: PC.ink.primary,
    marginBottom: 10,
  },
  bottomBar: {
    height: 0.8,
    marginBottom: 22,
  },

  /* 提出先情報 */
  metaRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: PC.ink.muted,
    width: 80,
    letterSpacing: 2,
  },
  metaValue: {
    fontSize: 10,
    color: PC.ink.primary,
    flex: 1,
  },

  /* セクション */
  section: {
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: 800,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1.5,
    borderBottomStyle: 'solid',
    letterSpacing: 1,
  },
  paragraph: {
    fontSize: 10,
    color: PC.ink.label,
    lineHeight: 1.7,
    marginBottom: 3,
  },
  /* 制作概要 - 縦並び */
  summaryGrid: {
    flexDirection: 'column',
  },
  summaryItem: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: PC.ink.muted,
    width: 70,
  },
  summaryValue: {
    fontSize: 10,
    color: PC.ink.primary,
    flex: 1,
  },

  /* 見積もり */
  estimateBox: {
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: 600,
  },
  totalValueWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 800,
  },
  totalNote: {
    fontSize: 9,
    marginLeft: 4,
    color: PC.ink.soft,
  },
  hidePriceText: {
    fontSize: 11,
    color: PC.ink.body,
    textAlign: 'center',
    flex: 1,
  },

});

export default function CoverPdf({ form, theme }: Props) {
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const plan = form.plans.find((p) => p.recommended) || form.plans[0];
  const taxRate = form.taxRate ?? 10;
  const total = plan ? calcPlan(plan, taxRate).total : 0;
  const totalPages = form.pages.reduce(
    (s, p) => s + 1 + p.children.length,
    0
  );
  const period = totalWeeksLabel(form.schedule);
  const deliveryText = formatDeliveryDate(form.deliveryDate);
  const hp = form.hidePrices;
  const P = theme.primary;

  return (
    <View style={styles.cover}>
      {/* ヘッダー */}
      <View style={[styles.topBar, { backgroundColor: P }]} />
      <Text style={styles.subtitle}>WEB SITE PROPOSAL</Text>
      <Text style={styles.title}>
        {form.projectName || 'Webサイト制作のご提案'}
      </Text>
      <View style={[styles.bottomBar, { backgroundColor: P }]} />

      {/* 提出先情報 */}
      <View>
        {form.clientName && (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>提 出 先</Text>
            <Text style={styles.metaValue}>{form.clientName} 様</Text>
          </View>
        )}
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>提 案 日</Text>
          <Text style={styles.metaValue}>{today}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>有 効 期 限</Text>
          <Text style={styles.metaValue}>発行日より30日間</Text>
        </View>
        {form.companyName && (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>提 案 者</Text>
            <Text style={styles.metaValue}>{form.companyName}</Text>
          </View>
        )}
      </View>

      {/* 提案概要 */}
      {form.overview && (
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionHeading,
              { color: P, borderBottomColor: P },
            ]}
          >
            提案概要
          </Text>
          <Text style={styles.paragraph}>{form.overview}</Text>
        </View>
      )}

      {/* 制作方針・目的 */}
      {form.purpose && (
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionHeading,
              { color: P, borderBottomColor: P },
            ]}
          >
            制作方針・目的
          </Text>
          <Text style={styles.paragraph}>{form.purpose}</Text>
        </View>
      )}

      {/* 制作概要 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionHeading,
            { color: P, borderBottomColor: P },
          ]}
        >
          制作概要
        </Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>サイト種別</Text>
            <Text style={styles.summaryValue}>{form.siteType}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>総ページ数</Text>
            <Text style={styles.summaryValue}>{totalPages}ページ</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>制作期間</Text>
            <Text style={styles.summaryValue}>{period}</Text>
          </View>
          {deliveryText && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>納品希望日</Text>
              <Text style={styles.summaryValue}>{deliveryText}</Text>
            </View>
          )}
        </View>
      </View>

      {/* 見積もり総額 */}
      <View style={[styles.estimateBox, { borderColor: P }]}>
        {hp ? (
          <Text style={styles.hidePriceText}>
            お見積もり総額は別途ご案内いたします
          </Text>
        ) : (
          <>
            <Text style={[styles.totalLabel, { color: P }]}>
              お見積もり総額
            </Text>
            <View style={styles.totalValueWrap}>
              <Text style={[styles.totalValue, { color: P }]}>
                ¥{formatPrice(total)}
              </Text>
              <Text style={styles.totalNote}>
                {plan?.recommended && form.plans.length > 1
                  ? `(${plan.name} / 税込)`
                  : '(税込)'}
              </Text>
            </View>
          </>
        )}
      </View>

    </View>
  );
}
