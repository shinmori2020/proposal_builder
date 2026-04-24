import { View, Text } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { Theme } from '@/lib/themes';
import { pdfStyles } from '../pdfStyles';
import { PC } from '../pdfColors';

interface Props {
  form: ProposalForm;
  theme: Theme;
}

function truncate(text: string, maxLen: number): string {
  if (!text) return '—';
  if (text.length > maxLen) return text.slice(0, maxLen) + '…';
  return text;
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

      {/* TOP ヘッダー */}
      <View
        style={{
          backgroundColor: P,
          paddingVertical: 4,
          paddingHorizontal: 12,
          borderRadius: 4,
          alignSelf: 'flex-start',
          marginBottom: 6,
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

      {/* ページリスト */}
      <View>

        {form.pages.map((pg, i) => (
          <View key={i} style={{ marginBottom: 3 }} wrap={false}>
            {/* 親ページ */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 2,
              }}
            >
              <View
                style={{
                  width: 4,
                  height: 4,
                  backgroundColor: P,
                  borderRadius: 2,
                  marginRight: 6,
                }}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: PC.ink.primary,
                  flex: 1,
                }}
              >
                {truncate(pg.name, 45)}
              </Text>
            </View>

            {/* 子ページ */}
            {pg.children.map((c, ci) => (
              <View
                key={ci}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 16,
                  paddingVertical: 1.5,
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    color: P,
                    marginRight: 4,
                  }}
                >
                  └
                </Text>
                <Text
                  style={{
                    fontSize: 9,
                    color: PC.ink.body,
                    flex: 1,
                  }}
                >
                  {truncate(c, 40)}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
