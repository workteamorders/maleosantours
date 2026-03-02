/**
 * Tour Packages Page - Public
 * REFACTORED: Now fetches data from database instead of hardcoded translations
 */

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import TourPackagesClient from './TourPackagesClient';
import { generatePageMetadata, type Locale } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata('paket-tour', locale as Locale);
}

// Fetch active tour packages from database
async function getTourPackages(locale: string) {
  let packages: any[] = [];
  try {
    packages = await prisma.tourPackage.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  } catch (error) {
    console.error('Database connection error:', error);
  }

  // Map to locale-specific content
  return packages.map((pkg) => ({
    id: pkg.id,
    slug: pkg.slug,
    name: locale === 'id' ? pkg.nameId : locale === 'zh' ? pkg.nameZh : locale === 'zh-CN' ? pkg.nameZhCn : pkg.nameEn,
    description: locale === 'id' ? pkg.descId : locale === 'zh' ? pkg.descZh : locale === 'zh-CN' ? pkg.descZhCn : pkg.descEn,
    duration: pkg.duration,
    type: pkg.type,
    price: pkg.price,
    priceUnit: pkg.priceUnit,
    mainImage: pkg.mainImage,
    videoUrl: pkg.videoUrl,
    featured: pkg.featured,
  }));
}

export default async function PaketTourPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('paketTour');

  // Fetch tour packages from database
  const tourPackages = await getTourPackages(locale);

  // Separate by type
  const dayTours = tourPackages.filter((pkg) => pkg.type === 'day-tour');
  const multiDayTours = tourPackages.filter((pkg) => pkg.type === 'multi-day' || pkg.type === 'custom');

  return (
    <main className="relative bg-background">
      <Navbar />
      <div className="min-h-screen pt-32 px-10">
        <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=600&fit=crop"
            alt="Tour Package"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="font-serif text-6xl text-white">{t('title')}</h1>
          </div>
        </div>

        <div className="max-w-6xl">
          <p className="text-xl text-gray-600 mb-12">
            {t('description')}
          </p>

          <TourPackagesClient
            locale={locale}
            dayTours={dayTours}
            multiDayTours={multiDayTours}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}
