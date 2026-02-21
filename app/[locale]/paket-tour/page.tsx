/**
 * Tour Packages Page - Public
 * REFACTORED: Now fetches data from database instead of hardcoded translations
 */

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';

// Fetch active tour packages from database
async function getTourPackages(locale: string) {
  const packages = await prisma.tourPackage.findMany({
    where: { active: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  // Map to locale-specific content
  return packages.map((pkg) => ({
    id: pkg.id,
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

                    {/* Dynamic Tour Packages from Database */}
                    {tourPackages.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {t('noPackages')}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tourPackages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    {/* 1. Judul */}
                                    <div className="px-6 pt-6 pb-2 flex items-center justify-between">
                                        <h3 className="font-serif text-2xl">{pkg.name}</h3>
                                        {pkg.featured && (
                                            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                {t('featured')}
                                            </span>
                                        )}
                                    </div>
                                    {/* 2. Gambar */}
                                    <div className="relative h-48 mx-6 rounded-lg overflow-hidden">
                                        <Image
                                            src={pkg.mainImage}
                                            alt={pkg.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {/* 3. Video */}
                                    {pkg.videoUrl && (
                                        <div className="px-6 pt-4">
                                            <video
                                                src={pkg.videoUrl}
                                                controls
                                                className="w-full rounded-lg"
                                                preload="metadata"
                                            />
                                        </div>
                                    )}
                                    {/* 4. Deskripsi */}
                                    <div className="p-6">
                                        <p className="text-gray-600 mb-4">{pkg.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">{pkg.duration}</span>
                                            {pkg.price && (
                                                <span className="text-lg font-semibold text-blue-600">
                                                    ${pkg.price} {pkg.priceUnit && <span className="text-sm text-gray-500">/ {pkg.priceUnit}</span>}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
