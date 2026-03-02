'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PriceDisplay } from '../../../components/CurrencyProvider';

type TourPackage = {
  id: string;
  slug: string;
  name: string;
  description: string;
  duration: string;
  type: string;
  price: number | null;
  priceUnit: string | null;
  mainImage: string;
  featured: boolean;
};

type Props = {
  locale: string;
  dayTours: TourPackage[];
  multiDayTours: TourPackage[];
};

export default function TourPackagesClient({ locale, dayTours, multiDayTours }: Props) {
  const [activeTab, setActiveTab] = useState<'day' | 'multi'>('day');

  const viewDetailsLabel =
    locale === 'id' ? 'Lihat Detail →' : locale === 'zh' || locale === 'zh-CN' ? '查看详情 →' : 'View Details →';

  const dayTabLabel =
    locale === 'id' ? 'Tur Harian' : locale === 'zh' || locale === 'zh-CN' ? '一日游' : 'Day Tour';

  const multiTabLabel =
    locale === 'id' ? 'Tur Multi-Hari' : locale === 'zh' || locale === 'zh-CN' ? '多日游' : 'Multi-Day Tour';

  const daySubtitle =
    locale === 'id'
      ? 'Jelajahi destinasi terbaik dalam satu hari'
      : locale === 'zh' || locale === 'zh-CN'
      ? '在一天内探索最佳目的地'
      : 'Explore the best destinations in a single day';

  const multiSubtitle =
    locale === 'id'
      ? 'Paket perjalanan lengkap untuk pengalaman mendalam'
      : locale === 'zh' || locale === 'zh-CN'
      ? '完整的旅行套餐，深度体验'
      : 'Complete travel packages for an immersive experience';

  const featuredLabel = locale === 'id' ? 'Unggulan' : locale === 'zh' || locale === 'zh-CN' ? '精选' : 'Featured';

  function renderTourCard(pkg: TourPackage) {
    return (
      <Link
        key={pkg.id}
        href={`/${locale}/paket-tour/${pkg.slug}`}
        className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
      >
        {/* Judul */}
        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          <h3 className="font-serif text-2xl group-hover:text-blue-600 transition-colors">{pkg.name}</h3>
          {pkg.featured && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {featuredLabel}
            </span>
          )}
        </div>
        {/* Gambar */}
        <div className="relative h-48 mx-6 rounded-lg overflow-hidden">
          <Image
            src={pkg.mainImage}
            alt={pkg.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Deskripsi */}
        <div className="p-6">
          <p className="text-gray-600 mb-4 line-clamp-3">{pkg.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{pkg.duration}</span>
            {pkg.price && (
              <PriceDisplay priceIDR={pkg.price} priceUnit={pkg.priceUnit} />
            )}
          </div>
          <span className="inline-block mt-3 text-sm text-blue-600 font-medium group-hover:underline">
            {viewDetailsLabel}
          </span>
        </div>
      </Link>
    );
  }

  const currentPackages = activeTab === 'day' ? dayTours : multiDayTours;
  const currentSubtitle = activeTab === 'day' ? daySubtitle : multiSubtitle;
  const accentColor = activeTab === 'day' ? 'bg-blue-500' : 'bg-green-500';

  return (
    <div>
      {/* Tab Toggle Buttons */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex rounded-full border border-gray-200 bg-white shadow-sm p-1">
          <button
            onClick={() => setActiveTab('day')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeTab === 'day'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {dayTabLabel}
          </button>
          <button
            onClick={() => setActiveTab('multi')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeTab === 'multi'
                ? 'bg-green-600 text-white shadow'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            {multiTabLabel}
          </button>
        </div>
      </div>

      {/* Section Header */}
      <div className="mb-8">
        <h2 className="font-serif text-4xl text-gray-900 mb-2">
          {activeTab === 'day' ? dayTabLabel : multiTabLabel}
        </h2>
        <p className="text-gray-500">{currentSubtitle}</p>
        <div className={`w-20 h-1 ${accentColor} mt-4`}></div>
      </div>

      {/* Cards Grid */}
      {currentPackages.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {locale === 'id' ? 'Belum ada paket tersedia.' : locale === 'zh' || locale === 'zh-CN' ? '暂无套餐。' : 'No packages available yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPackages.map(renderTourCard)}
        </div>
      )}
    </div>
  );
}
