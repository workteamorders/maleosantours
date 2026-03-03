import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata, type Locale } from '@/lib/seo';
import type { Metadata } from 'next';
import { getPageHeaderImage } from '@/lib/pageHeaders';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    return generatePageMetadata('testimoni', locale as Locale);
}

async function getTestimonials(locale: string) {
    let testimonials: any[] = [];
    try {
        testimonials = await prisma.testimonial.findMany({
            where: { approved: true },
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        });
    } catch (error) {
        console.error('Database connection error:', error);
    }

    return testimonials.map((t) => ({
        id: t.id,
        customerName: t.customerName,
        country: t.country,
        rating: t.rating,
        review:
            locale === 'id' ? t.reviewId
                : locale === 'zh' ? (t.reviewZh || t.reviewEn)
                    : locale === 'zh-CN' ? (t.reviewZhCn || t.reviewEn)
                        : t.reviewEn,
        photo: t.photo,
        featured: t.featured,
    }));
}

export default async function TestimoniPage() {
    const t = await getTranslations('testimoni');
    const locale = await getLocale();
    const testimonials = await getTestimonials(locale);
    const headerImage = await getPageHeaderImage('testimoni');

    return (
        <main className="relative bg-background">
            <Navbar />
            <div className="min-h-screen pt-32 px-10">
                <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
                    <Image
                        src={headerImage}
                        alt={t('title')}
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

                    {testimonials.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Belum ada testimoni.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((item) => (
                                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                    {item.photo && (
                                        <div className="relative h-48">
                                            <img
                                                src={item.photo}
                                                alt={item.customerName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center overflow-hidden">
                                                <span className="text-gray-500 font-semibold">{item.customerName.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{item.customerName}</h3>
                                                <p className="text-sm text-gray-500">{item.country}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 italic">
                                            &ldquo;{item.review}&rdquo;
                                        </p>
                                        <div className="mt-4 text-yellow-500">
                                            {'⭐'.repeat(item.rating)}
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
