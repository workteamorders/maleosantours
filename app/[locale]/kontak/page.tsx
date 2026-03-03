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
    return generatePageMetadata('kontak', locale as Locale);
}

/**
 * Ensure a Google Maps URL is in embed-compatible format.
 * Handles sharing links and regular Maps URLs at render time.
 */
function ensureEmbedUrl(url: string): string {
    if (!url) return '';
    // Already embed format
    if (url.includes('/maps/embed') || url.includes('output=embed')) {
        return url;
    }
    // Extract coordinates from /@lat,lng pattern
    const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),?(\d+)?/);
    if (coordMatch) {
        return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=${coordMatch[3] || '15'}&output=embed`;
    }
    // Extract place name
    const placeMatch = url.match(/\/place\/([^\/\?@]+)/);
    if (placeMatch) {
        const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
        return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&z=15&output=embed`;
    }
    // Fallback: use URL as search query
    return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&z=15&output=embed`;
}

export default async function KontakPage() {
    const t = await getTranslations('kontak');
    const locale = await getLocale();
    const headerImage = await getPageHeaderImage('kontak');
    let companyInfo = null;
    try {
        companyInfo = await prisma.companyInfo.findFirst();
    } catch (error) {
        console.error('Database connection error:', error);
    }

    // Determine address based on locale
    const address = locale === 'id' ? companyInfo?.addressId : companyInfo?.addressEn;

    return (
        <main className="relative bg-background">
            <Navbar />
            <div className="min-h-screen pt-32 px-10">
                <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
                    <Image
                        src={headerImage}
                        alt="Contact"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="font-serif text-3xl mb-6">{t('contactInfo')}</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{t('phone')}</h3>
                                    <a href={`tel:${companyInfo?.phone || ''}`} className="text-gray-600 hover:text-blue-600">
                                        {companyInfo?.phoneDisplay || companyInfo?.phone || '-'}
                                    </a>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{t('email')}</h3>
                                    <a href={`mailto:${companyInfo?.email || ''}`} className="text-gray-600 hover:text-blue-600">
                                        {companyInfo?.email || '-'}
                                    </a>
                                </div>

                                {companyInfo?.whatsapp && (
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
                                        <a href={`https://wa.me/${companyInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600">
                                            +{companyInfo.whatsapp}
                                        </a>
                                    </div>
                                )}

                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{t('address')}</h3>
                                    <p className="text-gray-600 whitespace-pre-line">
                                        {address || '-'}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-4">{t('social')}</h3>
                                    <div className="flex gap-4">
                                        {companyInfo?.facebook && (
                                            <a href={companyInfo.facebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 hover:text-blue-600">
                                                Facebook
                                            </a>
                                        )}
                                        {companyInfo?.youtube && (
                                            <a href={companyInfo.youtube}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 hover:text-red-600">
                                                YouTube
                                            </a>
                                        )}
                                        {companyInfo?.instagram && (
                                            <a href={companyInfo.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 hover:text-pink-600">
                                                Instagram
                                            </a>
                                        )}
                                        {companyInfo?.twitter && (
                                            <a href={companyInfo.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 hover:text-black">
                                                TikTok
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="font-serif text-3xl mb-6">{t('sendMessage')}</h2>

                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('name')}</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
                                        placeholder={t('namePlaceholder')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('email')}</label>
                                    <input
                                        type="email"
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
                                        placeholder={t('emailPlaceholder')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('subject')}</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
                                        placeholder={t('subjectPlaceholder')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('message')}</label>
                                    <textarea
                                        rows={5}
                                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
                                        placeholder={t('messagePlaceholder')}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition-colors"
                                >
                                    {t('sendButton')}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Google Maps embed */}
                    {companyInfo?.googleMaps && (
                        <div className="mt-12">
                            <h2 className="font-serif text-3xl mb-6">{t('address')}</h2>
                            <div className="w-full h-96 rounded-lg overflow-hidden">
                                <iframe
                                    src={ensureEmbedUrl(companyInfo.googleMaps)}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
