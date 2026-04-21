import { View, Text, Svg, Path } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme, shades } from '@/lib/themes';
import { pdfStyles } from '../pdfStyles';
import { PC } from '../pdfColors';
import {
  itemDays,
  addDaysToDate,
  formatDate,
  formatDuration,
} from '@/lib/schedule';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function FlowPdf({ form, theme }: Props) {
  const P = theme.primary;
  const cl = shades(P);
  const items = form.schedule;

  if (items.length <= 1) return null;

  const hasStart = !!form.scheduleStart;
  const startD = hasStart ? new Date(form.scheduleStart) : null;

  let dOff = 0;

  return (
    <View style={pdfStyles.section}>
      <Text
        style={[
          pdfStyles.sectionHeading,
          { color: P, borderBottomColor: P },
        ]}
      >
        制作フロー
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          paddingVertical: 4,
        }}
      >
        {items.map((s, i) => {
          const fd = hasStart && startD ? addDaysToDate(startD, dOff) : null;
          dOff += itemDays(s);

          return (
            <View
              key={i}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <View
                style={{
                  alignItems: 'center',
                  width: 65,
                }}
              >
                {/* 円と番号 */}
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: cl[i % cl.length],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: PC.white,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {i + 1}
                  </Text>
                </View>
                {/* フェーズ名 */}
                <Text
                  style={{
                    fontSize: 8,
                    fontWeight: 600,
                    color: PC.ink.label,
                    textAlign: 'center',
                    marginTop: 4,
                  }}
                >
                  {s.phase}
                </Text>
                {/* 期間 or 日付 */}
                <Text
                  style={{
                    fontSize: 7,
                    color: PC.ink.faint,
                    marginTop: 1,
                  }}
                >
                  {hasStart && fd ? `${formatDate(fd)}〜` : formatDuration(s)}
                </Text>
              </View>

              {/* 矢印（最後以外） */}
              {i < items.length - 1 && (
                <View style={{ marginBottom: 20 }}>
                  <Svg width="14" height="8" viewBox="0 0 18 9">
                    <Path
                      d="M0 4.5h14m-3-3l3 3-3 3"
                      stroke={P}
                      strokeWidth="1.4"
                      fill="none"
                    />
                  </Svg>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
