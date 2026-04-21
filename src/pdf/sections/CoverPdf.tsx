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
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 40,
    color: PC.white,
  },
  subtitle: {
    fontSize: 8,
    letterSpacing: 4,
    opacity: 0.6,
    marginBottom: 12,
    color: PC.white,
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 6,
    color: PC.white,
  },
  client: {
    fontSize: 12,
    opacity: 0.85,
    color: PC.white,
  },
  date: {
    marginTop: 16,
    fontSize: 10,
    opacity: 0.5,
    color: PC.white,
  },
  infoBox: {
    marginTop: 30,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderStyle: 'solid',
    borderRadius: 6,
    minWidth: 280,
  },
  totalLabel: {
    fontSize: 9,
    letterSpacing: 2,
    textAlign: 'center',
    opacity: 0.75,
    marginBottom: 4,
    color: PC.white,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 800,
    textAlign: 'center',
    color: PC.white,
  },
  totalNote: {
    fontSize: 8,
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 2,
    color: PC.white,
  },
  hidePriceText: {
    fontSize: 11,
    textAlign: 'center',
    color: PC.white,
    opacity: 0.85,
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  infoLabel: {
    fontSize: 9,
    opacity: 0.7,
    color: PC.white,
  },
  infoValue: {
    fontSize: 9,
    fontWeight: 600,
    color: PC.white,
  },
  logo: {
    maxHeight: 40,
    maxWidth: 140,
    marginTop: 30,
    objectFit: 'contain',
  },
  company: {
    marginTop: 4,
    fontSize: 10,
    opacity: 0.65,
    color: PC.white,
  },
});

export default function CoverPdf({ form, theme }: Props) {
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // おすすめプランを優先、なければ先頭のプランを使用
  const plan = form.plans.find((p) => p.recommended) || form.plans[0];
  const total = plan ? calcPlan(plan).total : 0;
  const totalPages = form.pages.reduce(
    (s, p) => s + 1 + p.children.length,
    0
  );
  const period = totalWeeksLabel(form.schedule);
  const hp = form.hidePrices;

  return (
    <View style={[styles.cover, { backgroundColor: theme.primary }]}>
      <Text style={styles.subtitle}>WEB SITE PROPOSAL</Text>
      <Text style={styles.title}>
        {form.projectName || 'Webサイト制作のご提案'}
      </Text>
      {form.clientName && (
        <Text style={styles.client}>{form.clientName} 様</Text>
      )}
      <Text style={styles.date}>{today}</Text>

      {/* 見積もり情報ボックス */}
      <View style={styles.infoBox}>
        {hp ? (
          <Text style={styles.hidePriceText}>
            お見積もり総額は別途ご案内いたします
          </Text>
        ) : (
          <>
            <Text style={styles.totalLabel}>お見積もり総額</Text>
            <Text style={styles.totalValue}>¥{formatPrice(total)}</Text>
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

      {form.companyLogo && <Image src={form.companyLogo} style={styles.logo} />}
      {form.companyName && (
        <Text style={styles.company}>{form.companyName}</Text>
      )}
    </View>
  );
}
