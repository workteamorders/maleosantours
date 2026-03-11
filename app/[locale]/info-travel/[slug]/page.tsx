
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StaticPageHeader from '@/components/StaticPageHeader';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getLocale } from 'next-intl/server';
import { ensureInfoTravelTranslations } from '@/lib/autoTranslate';

function getYouTubeEmbedUrl(url: string): string | null {
    if (!url) return null;
    if (url.includes('youtube.com/embed/')) return url;
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    return null;
}

function getLocalizedField(item: any, field: string, locale: string): string {
    const map: Record<string, string> = {
        id: `${field}Id`,
        en: `${field}En`,
        zh: `${field}Zh`,
        'zh-CN': `${field}ZhCn`,
    };
    return item[map[locale] || `${field}En`] || item[`${field}Id`] || '';
}

export default async function InfoTravelDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { slug } = await params;
    const locale = await getLocale();

    const [item, allItems] = await Promise.all([
        prisma.infoTravel.findUnique({ where: { slug } }),
        prisma.infoTravel.findMany({
            where: { published: true },
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
            select: { slug: true, titleId: true, titleEn: true, titleZh: true, titleZhCn: true, icon: true },
        }),
    ]);

    if (!item || !item.published) {
        notFound();
    }

    // Auto-translate missing locale fields (caches to DB)
    await ensureInfoTravelTranslations(item, locale);

    const title = getLocalizedField(item, 'title', locale);
    const description = getLocalizedField(item, 'desc', locale);

    let images: string[] = [];
    try { images = JSON.parse(item.images); } catch { images = []; }

    const embedUrl = item.videoUrl ? getYouTubeEmbedUrl(item.videoUrl) : null;
    const isLocalVideo = item.videoUrl ? (item.videoUrl.startsWith('/uploads/') || item.videoUrl.startsWith('/videos/')) : false;

    return (
        <main className="bg-neutral-50 min-h-screen font-sans">
            <Navbar />
            <StaticPageHeader
                title={title}
                current={title}
                image={images[0] || '/images/default-header.jpg'}
            />

            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-serif font-bold mb-6 pb-2 border-b border-gray-100 text-gray-900">Travel Guides</h3>
                            <ul className="space-y-2">
                                {allItems.map((guide) => {
                                    const guideTitle = getLocalizedField(guide, 'title', locale);
                                    const isActive = guide.slug === slug;
                                    return (
                                        <li key={guide.slug}>
                                            <Link
                                                href={`/${locale}/info-travel/${guide.slug}`}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                                    isActive
                                                        ? 'bg-amber-50 text-amber-700 font-bold border-l-4 border-amber-500'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            >
                                                {guide.icon && <span className="text-base">{guide.icon}</span>}
                                                <span className="text-sm">{guideTitle}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white p-8 md:p-12 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100">
                            {item.icon && (
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl">
                                        {item.icon}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">{title}</h1>
                                </div>
                            )}
                            {!item.icon && (
                                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">{title}</h1>
                            )}

                            {/* Images Gallery */}
                            {images.length > 0 && (
                                <div className={`grid gap-4 mb-8 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                    {images.map((src, i) => (
                                        <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                                            <Image src={src} alt={`${title} ${i + 1}`} fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Video */}
                            {item.videoUrl && (
                                <div className="mb-8">
                                    {embedUrl ? (
                                        <div className="rounded-xl overflow-hidden border border-gray-200">
                                            <iframe
                                                src={embedUrl}
                                                className="w-full aspect-video"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : isLocalVideo ? (
                                        <video
                                            src={item.videoUrl}
                                            controls
                                            className="w-full rounded-xl border border-gray-200"
                                        />
                                    ) : null}
                                </div>
                            )}

                            {/* Description */}
                            <div className="prose prose-lg prose-amber max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                                {description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
