import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { PC } from '../pdfColors';
import { calcPlan, formatPrice } from '@/lib/calculations';
import { totalWeeksLabel } from '@/lib/schedule';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

const styles = StyleSheet.create({
  cover: {
    flex: 1,
    paddingVertical: 60,
    paddingHorizontal: 55,
    backgroundColor: PC.white,
  },

  /* ヘッダー */
  topBar: {
    height: 2,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 9,
    letterSpacing: 5,
    color: PC.ink.faint,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: PC.ink.primary,
    marginBottom: 14,
  },
  bottomBar: {
    height: 0.8,
    marginBottom: 40,
  },

  /* 提出先情報 */
  metaRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: PC.ink.muted,
    width: 90,
    letterSpacing: 2,
  },
  metaValue: {
    fontSize: 11,
    color: PC.ink.primary,
    flex: 1,
  },
  metaGap: {
    marginBottom: 40,
  },

  /* 見積もり情報ボックス */
  infoBox: {
    paddingVertical: 20,
    paddingHorizontal: 28,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderRadius: 4,
  },
  totalLabel: {
    fontSize: 9,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: 600,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 800,
    textAlign: 'center',
  },
  totalNote: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
    color: PC.ink.soft,
  },
  hidePriceText: {
    fontSize: 12,
    textAlign: 'center',
    color: PC.ink.body,
    paddingVertical: 8,
  },
  divider: {
    height: 0.8,
    backgroundColor: PC.line.subtle,
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  infoLabel: {
    fontSize: 10,
    color: PC.ink.muted,
    fontWeight: 600,
  },
  infoValue: {
    fontSize: 10,
    color: PC.ink.primary,
    fontWeight: 600,
  },

  /* フッター */
  footerWrap: {
    marginTop: 'auto',
    paddingTop: 30,
    borderTopWidth: 0.8,
    borderTopStyle: 'solid',
    borderTopColor: PC.line.subtle,
    alignItems: 'flex-end',
  },
  logo: {
    maxHeight: 36,
    maxWidth: 140,
    objectFit: 'contain',
    marginBottom: 5,
  },
  company: {
    fontSize: 10,
    color: PC.ink.primary,
    fontWeight: 600,
  },
  companyUrl: {
    fontSize: 9,
    color: PC.ink.soft,
    marginTop: 1,
  },
});

export default function CoverPdf({ form, theme }: Props) {
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const plan = form.plans.find((p) => p.recommended) || form.plans[0];
  const total = plan ? calcPlan(plan).total : 0;
  const totalPages = form.pages.reduce(
    (s, p) => s + 1 + p.children.length,
    0
  );
  const period = totalWeeksLabel(form.schedule);
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
        {form.companyName && (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>提 案 者</Text>
            <Text style={styles.metaValue}>{form.companyName}</Text>
          </View>
        )}
      </View>

      <View style={styles.metaGap} />

      {/* 見積もり情報ボックス */}
      <View style={[styles.infoBox, { borderColor: P }]}>
        {hp ? (
          <Text style={styles.hidePriceText}>
            お見積もり総額は別途ご案内いたします
          </Text>
        ) : (
          <>
            <Text style={[styles.totalLabel, { color: P }]}>
              お見積もり総額
            </Text>
            <Text style={[styles.totalValue, { color: P }]}>
              ¥{formatPrice(total)}
            </Text>
            <Text style={styles.totalNote}>
              {plan?.recommended && form.plans.length > 1
                ? `（${plan.name} / 税込）`
                : '（税込）'}
            </Text>
          </>
        )}

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>制作期間</Text>
          <Text style={styles.infoValue}>{period}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>総ページ数</Text>
          <Text style={styles.infoValue}>{totalPages}ページ</Text>
        </View>
        {form.deliveryDate && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>納品希望日</Text>
            <Text style={styles.infoValue}>{form.deliveryDate}</Text>
          </View>
        )}
      </View>

      {/* 右下フッター */}
      <View style={styles.footerWrap}>
        {form.companyLogo && (
          <Image src={form.companyLogo} style={styles.logo} />
        )}
        {form.companyName && (
          <Text style={styles.company}>{form.companyName}</Text>
        )}
        {form.companyUrl && (
          <Text style={styles.companyUrl}>{form.companyUrl}</Text>
        )}
      </View>
    </View>
  );
}
