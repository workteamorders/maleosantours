import { prisma } from '@/lib/prisma';
import type { TourPackage } from '@prisma/client';
import { ensureTourTranslations } from '@/lib/autoTranslate';

export type PublicTourPackage = {
  id: string;
  slug: string;
  name: string;
  description: string;
  duration: string;
  type: string;
  price: number | null;
  priceUnit: string | null;
  mainImage: string;
  videoUrl: string | null;
  featured: boolean;
};

function localizedValue(
  locale: string,
  values: {
    id?: string | null;
    en?: string | null;
    zh?: string | null;
    zhCn?: string | null;
    fallback?: string | null;
  }
): string {
  const value =
    locale === 'id'
      ? values.id
      : locale === 'zh'
      ? values.zh
      : locale === 'zh-CN'
      ? values.zhCn
      : values.en;

  return value || values.fallback || values.id || values.en || '';
}

export async function getPublicTourPackages(locale: string): Promise<PublicTourPackage[]> {
  let packages: TourPackage[] = [];

  try {
    packages = await prisma.tourPackage.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  } catch (error) {
    console.error('Database connection error:', error);
  }

  if (locale !== 'id') {
    for (const pkg of packages) {
      await ensureTourTranslations(pkg, locale);
    }
  }

  return packages.map((pkg) => ({
    id: pkg.id,
    slug: pkg.slug,
    name: localizedValue(locale, {
      id: pkg.nameId,
      en: pkg.nameEn,
      zh: pkg.nameZh,
      zhCn: pkg.nameZhCn,
    }),
    description: localizedValue(locale, {
      id: pkg.descId,
      en: pkg.descEn,
      zh: pkg.descZh,
      zhCn: pkg.descZhCn,
    }),
    duration: localizedValue(locale, {
      id: pkg.duration,
      en: pkg.durationEn,
      zh: pkg.durationZh,
      zhCn: pkg.durationZhCn,
      fallback: pkg.duration,
    }),
    type: pkg.type,
    price: pkg.price,
    priceUnit: localizedValue(locale, {
      id: pkg.priceUnit,
      en: pkg.priceUnitEn,
      zh: pkg.priceUnitZh,
      zhCn: pkg.priceUnitZhCn,
      fallback: pkg.priceUnit,
    }) || null,
    mainImage: pkg.mainImage,
    videoUrl: pkg.videoUrl,
    featured: pkg.featured,
  }));
}
