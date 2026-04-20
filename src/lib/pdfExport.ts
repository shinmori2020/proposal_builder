import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * #proposal-preview の内容を PDF ファイルとしてダウンロードする。
 * html2canvas で DOM をキャプチャし、jsPDF で A4 複数ページに分割して保存する。
 */
export async function exportPreviewToPdf(filename: string): Promise<void> {
  const el = document.getElementById('proposal-preview');
  if (!el) {
    throw new Error('プレビュー要素が見つかりません');
  }

  // 高解像度でキャプチャ（scale: 2 で Retina 相当）
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (clonedDoc) => {
      // html2canvas は line-height 1.8 を継承した短いテキストを
      // 誤って下寄せにしてしまうため、中央寄せ要素と小さいバッジ類の
      // line-height を正規化する
      const style = clonedDoc.createElement('style');
      style.textContent = `
        #proposal-preview,
        #proposal-preview * {
          line-height: 1.5;
        }
        #proposal-preview p,
        #proposal-preview textarea {
          line-height: 1.7;
        }
        #proposal-preview [class*="rounded-full"],
        #proposal-preview [class*="rounded-"][class*="px-"][class*="py-"] {
          line-height: 1 !important;
        }
      `;
      clonedDoc.head.appendChild(style);
    },
  });

  // A4 サイズ (mm)
  const a4Width = 210;
  const a4Height = 297;
  const margin = 0; // プレビュー側の padding で調整済み

  const imgWidth = a4Width - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const pageContentHeight = a4Height - margin * 2;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  // 1ページに収まる場合
  if (imgHeight <= pageContentHeight) {
    pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
  } else {
    // 複数ページに分割
    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
    heightLeft -= pageContentHeight;

    while (heightLeft > 0) {
      position = margin - (imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= pageContentHeight;
    }
  }

  pdf.save(`${filename}.pdf`);
}
