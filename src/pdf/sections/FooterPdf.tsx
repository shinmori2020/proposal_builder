import { View, Text, Image, Link } from '@react-pdf/renderer';
import { ProposalForm } from '@/lib/types';
import { PC } from '../pdfColors';

interface Props {
  form: ProposalForm;
}

/**
 * 制作者（本提案書ビルダーの制作者）のクレジット。
 * 著作物としての主張として常時表示。
 */
const CREATOR_NAME = 'シン｜WEB制作・コーディング';
const CREATOR_URL = 'https://coconala.com/users/2033628';

export default function FooterPdf({ form }: Props) {
  return (
    <View
      style={{
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 2,
        borderTopStyle: 'solid',
        borderTopColor: PC.line.faint,
        alignItems: 'center',
      }}
    >
      {/* 提案者（クライアント向け）の情報: ロゴ / 会社名 + URL の2段 */}
      {form.companyLogo && (
        <Image
          src={form.companyLogo}
          style={{
            maxHeight: 30,
            maxWidth: 120,
            marginBottom: 4,
            objectFit: 'contain',
          }}
        />
      )}
      {(form.companyName || form.companyUrl) && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: 8,
          }}
        >
          {form.companyName && (
            <Text
              style={{
                fontSize: 8,
                fontWeight: 600,
                color: PC.ink.body,
              }}
            >
              {form.companyName}
            </Text>
          )}
          {form.companyUrl && (
            <Text style={{ fontSize: 8, color: PC.ink.soft }}>
              {form.companyUrl}
            </Text>
          )}
        </View>
      )}

      {/* 制作者クレジット（著作権表示）: 横1列 */}
      <View
        style={{
          marginTop: 8,
          paddingTop: 6,
          borderTopWidth: 0.5,
          borderTopStyle: 'solid',
          borderTopColor: PC.line.subtle,
          flexDirection: 'row',
          alignItems: 'baseline',
          gap: 5,
        }}
      >
        <Text style={{ fontSize: 7, color: PC.ink.softer }}>Produced by</Text>
        <Text
          style={{
            fontSize: 8,
            color: PC.ink.body,
            fontWeight: 600,
          }}
        >
          {CREATOR_NAME}
        </Text>
        <Link
          src={CREATOR_URL}
          style={{
            fontSize: 7,
            color: PC.ink.soft,
            textDecoration: 'none',
          }}
        >
          {CREATOR_URL}
        </Link>
      </View>
    </View>
  );
}
