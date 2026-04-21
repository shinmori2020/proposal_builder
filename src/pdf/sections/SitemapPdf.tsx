import { View, Text } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { pdfStyles } from '../pdfStyles';
import { PC } from '../pdfColors';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

export default function SitemapPdf({ form, theme }: Props) {
  const P = theme.primary;

  if (form.pages.length === 0) return null;

  return (
    <View style={pdfStyles.section}>
      <Text
        style={[
          pdfStyles.sectionHeading,
          { color: P, borderBottomColor: P },
        ]}
      >
        サイトマップ
      </Text>
      <View style={{ alignItems: 'center' }}>
        {/* TOP ノード */}
        <View
          style={{
            backgroundColor: P,
            paddingVertical: 4,
            paddingHorizontal: 14,
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              color: PC.white,
              fontWeight: 800,
              fontSize: 10,
            }}
          >
            {form.clientName || 'サイト'} TOP
          </Text>
        </View>

        {/* TOP から下への縦線 */}
        <View style={{ width: 1.5, height: 8, backgroundColor: P }} />

        {/* 横線 + ページノード群 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            position: 'relative',
          }}
        >
          {/* 複数ページ時の横つなぎ線 */}
          {form.pages.length > 1 && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: 1.5,
                backgroundColor: P,
              }}
            />
          )}

          {form.pages.map((pg, i) => (
            <View
              key={i}
              style={{
                alignItems: 'center',
                marginHorizontal: 2,
                minWidth: 60,
              }}
            >
              {/* 縦線 */}
              <View style={{ width: 1.5, height: 8, backgroundColor: P }} />

              {/* ページノード */}
              <View
                style={{
                  backgroundColor: theme.bg,
                  borderWidth: 1.5,
                  borderColor: P,
                  borderStyle: 'solid',
                  paddingVertical: 2,
                  paddingHorizontal: 6,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 8,
                    fontWeight: 600,
                    color: P,
                  }}
                >
                  {pg.name || '—'}
                </Text>
              </View>

              {/* 子ページ */}
              {pg.children.map((c, ci) => (
                <View key={ci} style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 1,
                      height: 5,
                      backgroundColor: P,
                      opacity: 0.4,
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: PC.white,
                      borderWidth: 1,
                      borderColor: P,
                      borderStyle: 'solid',
                      paddingVertical: 1,
                      paddingHorizontal: 5,
                      borderRadius: 3,
                      opacity: 0.85,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 7,
                        color: P,
                      }}
                    >
                      {c || '—'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
