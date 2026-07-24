import type { Metadata } from 'next';
import { IBM_Plex_Sans_JP, Manrope } from 'next/font/google';
import { type ReactNode } from 'react';
import { Providers } from '@/app/providers';
import '@/app/globals.css';

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const sansJp = IBM_Plex_Sans_JP({
  subsets: ['latin'],
  variable: '--font-jp',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'English Learning Tool',
  description: 'FSRS based English vocabulary learning platform',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${sans.variable} ${sansJp.variable} font-[var(--font-jp),var(--font-sans)] antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
