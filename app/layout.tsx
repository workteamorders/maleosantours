import type { Metadata } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import './[locale]/globals.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
