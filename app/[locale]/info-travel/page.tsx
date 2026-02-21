/**
 * Info Travel Page - Public
 * REFACTORED: Fetches content from database with images, video, and text support
 */

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    // Already an embed URL
    if (url.includes('youtube.com/embed/')) return url;
    // Standard watch URL
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  } catch {
    return url;
  }
}

function isLocalVideo(url: string): boolean {
  return url.startsWith('/uploads/') || url.startsWith('/videos/');
}

async function getInfoTravelItems(locale: string) {
  const items = await prisma.infoTravel.findMany({
    where: { published: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  return items.map((item) => ({
    id: item.id,
    slug: item.slug,
    category: item.category,
    icon: item.icon,
    title:
      locale === 'id' ? item.titleId
      : locale === 'zh' ? item.titleZh
      : locale === 'zh-CN' ? item.titleZhCn
      : item.titleEn,
    description:
      locale === 'id' ? item.descId
      : locale === 'zh' ? item.descZh
      : locale === 'zh-CN' ? item.descZhCn
      : item.descEn,
    images: (() => {
      try { return JSON.parse(item.images) as string[]; } catch { return []; }
    })(),
    videoUrl: item.videoUrl,
    featured: item.featured,
  }));
}

export default async function InfoTravelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('infoTravel');
  const items = await getInfoTravelItems(locale);

  return (
    <main className="relative bg-background">
      <Navbar />
      <div className="min-h-screen pt-32 px-10">
        {/* Hero Banner */}
        <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=600&fit=crop"
            alt="Manado Travel Info"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="font-serif text-6xl text-white">{t('title')}</h1>
          </div>
        </div>

        {/* Sidebar + Content Layout */}
        <div className="max-w-7xl mx-auto flex gap-12">
          {/* Sidebar Navigation */}
          {items.length > 0 && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-32">
                <h3 className="font-serif text-lg font-semibold text-gray-900 mb-4">
                  {t('guide')}
                </h3>
                <nav className="space-y-1">
                  {items.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.slug}`}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <p className="text-xl text-gray-600 mb-12">
              {t('description')}
            </p>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {t('noInfo')}
                </p>
              </div>
            ) : (
              <div className="space-y-20">
                {items.map((item, index) => (
                  <article key={item.id} id={item.slug} className="scroll-mt-32">
                    {/* Title */}
                    <h2 className="font-serif text-3xl mb-6">
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.title}
                    </h2>

                    {/* Images Grid */}
                    {item.images.length > 0 && (
                      <div className={`mb-6 ${
                        item.images.length === 1 
                          ? 'grid grid-cols-1' 
                          : item.images.length === 2 
                          ? 'grid grid-cols-2 gap-4' 
                          : 'grid grid-cols-2 md:grid-cols-3 gap-4'
                      }`}>
                        {item.images.map((imgUrl, imgIndex) => (
                          <div
                            key={imgIndex}
                            className={`relative rounded-lg overflow-hidden ${
                              item.images.length === 1 ? 'h-80' : 'h-52'
                            }`}
                          >
                            {imgUrl.startsWith('/uploads/') ? (
                              <img
                                src={imgUrl}
                                alt={`${item.title} ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Image
                                src={imgUrl}
                                alt={`${item.title} ${imgIndex + 1}`}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Video */}
                    {item.videoUrl && (
                      <div className="mb-6">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                          {isLocalVideo(item.videoUrl) ? (
                            <video
                              src={item.videoUrl}
                              controls
                              className="absolute inset-0 w-full h-full object-contain"
                            />
                          ) : (
                            <iframe
                              src={getYouTubeEmbedUrl(item.videoUrl) || item.videoUrl}
                              title={item.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute inset-0 w-full h-full"
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Text Content */}
                    <div className="prose prose-lg max-w-none text-gray-700">
                      {item.description.split('\n\n').map((paragraph, pIndex) => (
                        <p key={pIndex}>{paragraph}</p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
