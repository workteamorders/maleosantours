
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Star, MapPin, Wifi, Check, Info, Phone, Mail, ArrowLeft, Coffee, Waves, Wind, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getLocale } from 'next-intl/server';

function parseJSON(str: string | null): any[] {
    if (!str) return [];
    try { return JSON.parse(str); } catch { return []; }
}

function getLocalizedField(hotel: any, field: string, locale: string): string {
    const localeMap: Record<string, string> = { id: 'Id', en: 'En', zh: 'Zh', 'zh-CN': 'ZhCn' };
    const suffix = localeMap[locale] || 'Id';
    return hotel[`${field}${suffix}`] || hotel[`${field}Id`] || hotel[`${field}En`] || '';
}

const categoryLabels: Record<string, Record<string, string>> = {
    luxury:   { id: 'Mewah',        en: 'Luxury',       zh: '豪华',      'zh-CN': '豪华' },
    boutique: { id: 'Boutique',     en: 'Boutique',     zh: '精品',      'zh-CN': '精品' },
    beach:    { id: 'Beach Resort', en: 'Beach Resort', zh: '海滩度假村', 'zh-CN': '海滩度假村' },
    budget:   { id: 'Ekonomis',     en: 'Budget',       zh: '经济型',    'zh-CN': '经济型' },
    family:   { id: 'Keluarga',     en: 'Family',       zh: '家庭',      'zh-CN': '家庭' },
    business: { id: 'Bisnis',       en: 'Business',     zh: '商务',      'zh-CN': '商务' },
};

export default async function HotelDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;

    let hotel: any = null;
    try {
        hotel = await prisma.hotel.findUnique({ where: { slug } });
    } catch (e) {
        console.error('DB error:', e);
    }

    if (!hotel || !hotel.active) notFound();

    const name = getLocalizedField(hotel, 'name', locale);
    const desc = getLocalizedField(hotel, 'desc', locale);
    const facilities: string[] = parseJSON(hotel.facilities);
    const images: string[] = parseJSON(hotel.images);
    const allImages = [hotel.mainImage, ...images.filter((img: string) => img !== hotel.mainImage)];
    const catLabel = categoryLabels[hotel.category]?.[locale] || hotel.category;

    const backLabel = locale === 'id' ? 'Kembali ke Hotel'
        : locale === 'zh' || locale === 'zh-CN' ? '返回酒店'
        : 'Back to Hotels';
    const aboutLabel = locale === 'id' ? 'Tentang Hotel'
        : locale === 'zh' || locale === 'zh-CN' ? '关于酒店'
        : 'About the Hotel';
    const facilitiesLabel = locale === 'id' ? 'Fasilitas'
        : locale === 'zh' || locale === 'zh-CN' ? '设施'
        : 'Facilities';
    const galleryLabel = locale === 'id' ? 'Galeri Foto'
        : locale === 'zh' || locale === 'zh-CN' ? '图片库'
        : 'Photo Gallery';
    const bookWaLabel = locale === 'id' ? 'Pesan via WhatsApp'
        : locale === 'zh' || locale === 'zh-CN' ? '通过WhatsApp预订'
        : 'Book via WhatsApp';
    const emailLabel = locale === 'id' ? 'Kirim Email' : 'Email Inquiry';

    return (
        <main className="bg-neutral-50 min-h-screen font-sans">
            <Navbar />

            {/* Hero Banner */}
            <div className="relative h-[50vh] w-full">
                <Image src={hotel.mainImage} alt={name} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="container mx-auto max-w-6xl">
                        <Link href={`/${locale}/hotels`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-4 transition-colors">
                            <ArrowLeft size={16} /> {backLabel}
                        </Link>
                        <div className="flex items-center gap-1 text-amber-400 mb-2">
                            {[...Array(hotel.stars)].map((_, i) => <Star key={i} size={18} fill="currentColor" strokeWidth={0} />)}
                            <span className="ml-2 text-white/80 text-sm">{catLabel}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white">{name}</h1>
                        <div className="flex items-center gap-2 mt-2 text-white/80 text-sm">
                            <MapPin size={14} /> {hotel.location}
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-10">

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">

                            {/* Description */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">{aboutLabel}</h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{desc}</p>
                                {hotel.priceRange && (
                                    <div className="mt-4 inline-block bg-emerald-50 text-emerald-700 font-bold px-4 py-1.5 rounded-full text-sm">
                                        {hotel.priceRange}
                                    </div>
                                )}
                            </div>

                            {/* Facilities */}
                            {facilities.length > 0 && (
                                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
                                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">{facilitiesLabel}</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {facilities.map((f: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-700">
                                                {f.toLowerCase().includes('wi-fi') || f.toLowerCase().includes('wifi') ? <Wifi size={18} className="text-amber-500 flex-shrink-0" /> :
                                                    f.toLowerCase().includes('pool') || f.toLowerCase().includes('kolam') ? <Waves size={18} className="text-amber-500 flex-shrink-0" /> :
                                                        f.toLowerCase().includes('restaurant') || f.toLowerCase().includes('makan') ? <Coffee size={18} className="text-amber-500 flex-shrink-0" /> :
                                                            f.toLowerCase().includes('air') || f.toLowerCase().includes('ac') ? <Wind size={18} className="text-amber-500 flex-shrink-0" /> :
                                                                <Check size={18} className="text-amber-500 flex-shrink-0" />}
                                                <span className="text-sm font-medium">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Photo Gallery */}
                            {allImages.length > 1 && (
                                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
                                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">{galleryLabel}</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {allImages.map((img: string, i: number) => (
                                            <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                                                <Image
                                                    src={img}
                                                    alt={`${name} ${i + 1}`}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Video */}
                            {hotel.videoUrl && (
                                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
                                    <div className="rounded-xl overflow-hidden border border-gray-200">
                                        <iframe
                                            src={hotel.videoUrl.replace('watch?v=', 'embed/')}
                                            className="w-full aspect-video"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Booking Sidebar */}
                        <div className="lg:w-80 flex-shrink-0">
                            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm sticky top-24">
                                <div className="text-center mb-6">
                                    {hotel.priceRange && (
                                        <div className="text-3xl font-bold text-emerald-600 mb-1">{hotel.priceRange}</div>
                                    )}
                                    <div className="bg-amber-50 inline-block px-4 py-1 rounded-full text-amber-700 font-bold text-sm">
                                        Best Rate Guarantee
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {hotel.bookingUrl ? (
                                        <a
                                            href={hotel.bookingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <ExternalLink size={16} />
                                            {locale === 'id' ? 'Pesan Sekarang' : locale === 'zh' || locale === 'zh-CN' ? '立即预订' : 'Book Now'}
                                        </a>
                                    ) : null}
                                    <a
                                        href={`https://wa.me/6282173738822?text=${encodeURIComponent(`Halo, saya tertarik dengan ${name}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-green-600 text-white font-bold py-3.5 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Phone size={16} /> {bookWaLabel}
                                    </a>
                                    <a
                                        href="mailto:info@maleosan.com"
                                        className="w-full bg-gray-100 text-gray-900 font-bold py-3.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Mail size={16} /> {emailLabel}
                                    </a>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <div className="flex items-start gap-3">
                                        <Info size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            {locale === 'id'
                                                ? 'Harga dan ketersediaan dapat berubah. Disarankan memesan lebih awal, terutama saat musim liburan.'
                                                : locale === 'zh' || locale === 'zh-CN'
                                                ? '价格和可用性可能会变化，建议提前预订，尤其是在旺季。'
                                                : 'Prices and availability are subject to change. Book in advance, especially during peak seasons.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
