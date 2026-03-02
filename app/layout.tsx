import type { Metadata, Viewport } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import './[locale]/globals.css';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Maleosan Tours Manado - Tour & Travel Terbaik di Manado | North Sulawesi',
    template: '%s | Maleosan Travel',
  },
  description:
    'Maleosan Travel - Tour operator terbaik di Manado, Sulawesi Utara. Paket tour Bunaken, Likupang, Minahasa, sewa mobil, hotel, dan aktivitas wisata.',
  keywords: [
    'maleosan tours manado', 'maleosan tour manado', 'tour manado', 'travel manado', 'paket wisata manado', 'bunaken tour',
    'manado tour operator', 'north sulawesi tour', 'likupang beach',
    '万鸦老旅游', '美娜多旅行社', 'maleosan travel',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'id_ID',
    alternateLocale: ['en_US', 'zh_CN', 'zh_TW'],
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Maleosan Travel - Best Tour & Travel in Manado',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maleosan Travel - Tour & Travel Manado',
    description: 'Paket tour Bunaken, Likupang, Minahasa. Sewa mobil, hotel & wisata di Sulawesi Utara.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // verification: {
  //   google: 'PASTE_YOUR_GOOGLE_VERIFICATION_CODE_HERE',
  //   other: { 'baidu-site-verification': 'PASTE_YOUR_BAIDU_CODE_HERE' },
  // },
  category: 'travel',
};

export const viewport: Viewport = {
  themeColor: '#B07D62',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${manrope.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.baidu.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
