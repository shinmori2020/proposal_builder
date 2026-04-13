import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  title: '提案書ビルダー',
  description: 'Web制作の提案書をブラウザ上でかんたん作成',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[var(--font-noto-sans-jp)]">
        {children}
      </body>
    </html>
  );
}
