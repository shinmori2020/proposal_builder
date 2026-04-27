import { pdf } from '@react-pdf/renderer';
import { ProposalForm } from './types';
import { Theme } from './themes';
import PdfDocument from '@/pdf/PdfDocument';
import { registerPdfFonts } from '@/pdf/fonts';
import { generateQrDataUrl } from './qrcode';

/**
 * @react-pdf/renderer でプレビュー内容を PDF ファイルとしてダウンロードする。
 * テキストは本物の PDF テキスト（選択・検索可能）として出力される。
 */
export async function exportPreviewToPdf(
  form: ProposalForm,
  theme: Theme,
  filename: string
): Promise<void> {
  registerPdfFonts();

  const qrDataUrl = await generateQrDataUrl(form.companyUrl);
  const blob = await pdf(
    <PdfDocument form={form} theme={theme} qrDataUrl={qrDataUrl} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // メモリ解放（少し遅延させてダウンロード完了を待つ）
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
