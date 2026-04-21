import { View, Text } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme, shades } from '@/lib/themes';
import { pdfStyles } from '../pdfStyles';
import { PC } from '../pdfColors';
import {
  itemDays,
  totalDays,
  totalWeeksLabel,
  addDaysToDate,
  formatDate,
  formatDateFull,
  formatDuration,
} from '@/lib/schedule';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function SchedulePdf({ form, theme }: Props) {
  const P = theme.primary;
  const cl = shades(P);
  const items = form.schedule;

  if (items.length === 0) return null;

  const td = totalDays(items);
  const twLabel = totalWeeksLabel(items);
  const hasStart = !!form.scheduleStart;
  const startD = hasStart ? new Date(form.scheduleStart) : null;

  let offset = 0;

  return (
    <View style={pdfStyles.section}>
      <Text
        style={[
          pdfStyles.sectionHeading,
          { color: P, borderBottomColor: P },
        ]}
      >
        制作スケジュール
      </Text>

      <View>
        {items.map((item, i) => {
          const d = itemDays(item);
          const percent = td > 0 ? (d / td) * 100 : 0;
          const left = td > 0 ? (offset / td) * 100 : 0;
          const fromD =
            hasStart && startD ? addDaysToDate(startD, offset) : null;
          const toD =
            hasStart && startD ? addDaysToDate(startD, offset + d) : null;
          offset += d;

          return (
            <View
              key={i}
              wrap={false}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 16,
                marginBottom: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  color: PC.ink.body,
                  textAlign: 'right',
                  width: 90,
                  marginRight: 5,
                }}
              >
                {item.phase || '—'}
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 11,
                  backgroundColor: PC.surface.track,
                  borderRadius: 2,
                  position: 'relative',
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    left: `${left}%`,
                    width: `${percent}%`,
                    height: '100%',
                    backgroundColor: cl[i % cl.length],
                    borderRadius: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 6,
                      color: PC.white,
                      fontWeight: 600,
                    }}
                  >
                    {hasStart && fromD && toD
                      ? `${formatDate(fromD)}–${formatDate(toD)}`
                      : formatDuration(item)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <Text
        style={{
          textAlign: 'right',
          fontSize: 8,
          color: PC.ink.soft,
          marginTop: 4,
        }}
      >
        {hasStart && startD
          ? `${formatDateFull(startD)}〜${formatDateFull(
              addDaysToDate(startD, td)
            )}（${twLabel}）`
          : twLabel}
      </Text>
    </View>
  );
}
