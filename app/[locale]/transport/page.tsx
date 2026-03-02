/**
 * Transport Page - Public
 * Fetches data from database (admin-managed)
 */

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { PriceDisplay } from '../../../components/CurrencyProvider';
import { generatePageMetadata, type Locale } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata('transport', locale as Locale);
}

async function getTransports(locale: string) {
  let transports: any[] = [];
  try {
    transports = await prisma.transport.findMany({
      where: { available: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  } catch (error) {
    console.error('Database connection error:', error);
  }

  return transports.map((t) => ({
    id: t.id,
    name: locale === 'id' ? t.nameId : locale === 'zh' ? t.nameZh : locale === 'zh-CN' ? t.nameZhCn : t.nameEn,
    description: locale === 'id' ? t.descId : locale === 'zh' ? t.descZh : locale === 'zh-CN' ? t.descZhCn : t.descEn,
    type: t.type,
    capacity: t.capacity,
    price: t.price,
    priceUnit: t.priceUnit,
    includes: locale === 'id' ? t.includesId : t.includesEn,
    mainImage: t.mainImage,
    videoUrl: t.videoUrl,
    driverIncluded: t.driverIncluded,
  }));
}

export default async function TransportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('transport');
  const transports = await getTransports(locale);

  return (
    <main className="relative bg-background">
      <Navbar />
      <div className="min-h-screen pt-32 px-10">
        <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&h=600&fit=crop"
            alt="Transportation"
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

          {transports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {locale === 'id' ? 'Belum ada transportasi tersedia.' : locale === 'zh' || locale === 'zh-CN' ? '暂无可用交通工具。' : 'No transport options available yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {transports.map((transport) => (
                <div
                  key={transport.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Name */}
                  <div className="px-8 pt-8 pb-2 flex items-center justify-between">
                    <h3 className="font-serif text-3xl">{transport.name}</h3>
                    {transport.capacity && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {transport.capacity} {locale === 'id' ? 'orang' : locale === 'zh' || locale === 'zh-CN' ? '人' : 'pax'}
                      </span>
                    )}
                  </div>

                  {/* Image */}
                  <div className="relative h-48 mx-8 rounded-lg overflow-hidden">
                    <Image
                      src={transport.mainImage}
                      alt={transport.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Video */}
                  {transport.videoUrl && (
                    <div className="px-8 pt-4">
                      <video
                        src={transport.videoUrl}
                        controls
                        className="w-full rounded-lg"
                        preload="metadata"
                      />
                    </div>
                  )}

                  {/* Description & Details */}
                  <div className="p-8 pt-4">
                    <p className="text-gray-600 mb-4">{transport.description}</p>

                    {/* Includes */}
                    {transport.includes && (
                      <div className="mb-4">
                        <ul className="space-y-1 text-gray-700">
                          {transport.includes.split(/[,\n]/).filter(Boolean).map((item: string, i: number) => (
                            <li key={i}>• {item.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Price & Driver */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        {transport.driverIncluded && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ {locale === 'id' ? 'Termasuk Sopir' : locale === 'zh' || locale === 'zh-CN' ? '含司机' : 'Driver Included'}
                          </span>
                        )}
                      </div>
                      {transport.price && (
                        <PriceDisplay priceIDR={transport.price} priceUnit={transport.priceUnit} />
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
