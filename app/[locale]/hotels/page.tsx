import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { MapPin, ExternalLink } from 'lucide-react';
import { generatePageMetadata, type Locale } from '@/lib/seo';
import type { Metadata } from 'next';
import { getPageHeaderImage } from '@/lib/pageHeaders';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return generatePageMetadata('hotels', locale as Locale);
}

function parseJSON(str: string): any[] {
  try { return JSON.parse(str); } catch { return []; }
}

function getLocalizedField(hotel: any, field: string, locale: string): string {
  const localeMap: Record<string, string> = {
    id: 'Id',
    en: 'En',
    zh: 'Zh',
    'zh-CN': 'ZhCn',
  };
  const suffix = localeMap[locale] || 'Id';
  return hotel[`${field}${suffix}`] || hotel[`${field}Id`] || hotel[`${field}En`] || '';
}

const categoryLabels: Record<string, Record<string, string>> = {
  luxury: { id: 'Mewah', en: 'Luxury', zh: '豪华', 'zh-CN': '豪华' },
  boutique: { id: 'Boutique', en: 'Boutique', zh: '精品', 'zh-CN': '精品' },
  beach: { id: 'Beach Resort', en: 'Beach Resort', zh: '海滩度假村', 'zh-CN': '海滩度假村' },
  budget: { id: 'Ekonomis', en: 'Budget', zh: '经济型', 'zh-CN': '经济型' },
  family: { id: 'Keluarga', en: 'Family', zh: '家庭', 'zh-CN': '家庭' },
  business: { id: 'Bisnis', en: 'Business', zh: '商务', 'zh-CN': '商务' },
};

export default async function HotelsPage() {
  const t = await getTranslations('hotels');
  const locale = await getLocale();
  const headerImage = await getPageHeaderImage('hotels');

  let hotels: any[] = [];
  try {
    hotels = await prisma.hotel.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  } catch (error) {
    console.error('Database connection error:', error);
  }

  return (
    <main className="relative bg-background">
      <Navbar />
      <div className="min-h-screen pt-32 px-10">
        <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
          <Image
            src={headerImage}
            alt="Luxury Hotel"
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

          {hotels.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">{locale === 'id' ? 'Belum ada hotel tersedia.' : locale === 'en' ? 'No hotels available yet.' : '暂无酒店。'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel) => {
                const name = getLocalizedField(hotel, 'name', locale);
                const desc = getLocalizedField(hotel, 'desc', locale);
                const facilities = parseJSON(hotel.facilities);
                const catLabel = categoryLabels[hotel.category]?.[locale] || hotel.category;

                return (
                  <div key={hotel.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
                    <div className="px-6 pt-6 pb-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-2xl">{name}</h3>
                        {hotel.featured && (
                          <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">★</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-yellow-500">{'⭐'.repeat(hotel.stars)}</span>
                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{catLabel}</span>
                      </div>
                    </div>
                    <div className="relative h-48 mx-6 rounded-lg overflow-hidden">
                      <Image
                        src={hotel.mainImage}
                        alt={name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-3 line-clamp-3">{desc}</p>

                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        {hotel.location}
                      </div>

                      {facilities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {facilities.slice(0, 4).map((f: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{f}</span>
                          ))}
                          {facilities.length > 4 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                              +{facilities.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        {hotel.priceRange && (
                          <span className="text-emerald-600 font-bold text-lg">{hotel.priceRange}</span>
                        )}
                        {hotel.bookingUrl && (
                          <a
                            href={hotel.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {locale === 'id' ? 'Pesan' : locale === 'en' ? 'Book Now' : '预订'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
