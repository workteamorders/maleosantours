import type { Metadata } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import './globals.css';
import SmoothScroll from '../../components/SmoothScroll';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Maleosan Travel - Best Tour & Travel Operator in Manado',
  description: 'Maleosan Travel - menawarkan paket tour manado, penerbangan, hotel, sewa mobil / Bus, juga aktivitas wisata tour di manado.',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={`${manrope.variable} ${playfair.variable}`}>
      <body className="antialiased bg-background text-foreground">
        <NextIntlClientProvider messages={messages} locale={locale} timeZone="Asia/Makassar">
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
