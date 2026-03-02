import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import SmoothScroll from '../../components/SmoothScroll';
import { CurrencyProvider } from '../../components/CurrencyProvider';
import {
  LOCALE_LANG_MAP,
  generateOrganizationSchema,
  generateWebsiteSchema,
  type Locale,
} from '@/lib/seo';

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
  const lang = LOCALE_LANG_MAP[locale as Locale] || locale;

  // Structured data for the whole site
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone="Asia/Makassar">
      <CurrencyProvider>
        {/* Set document language for search engines and accessibility */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.lang="${lang}";`,
          }}
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </CurrencyProvider>
    </NextIntlClientProvider>
  );
}
