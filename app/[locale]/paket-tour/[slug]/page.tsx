/**
 * Tour Package Detail Page - Dynamic from Database
 * Displays tour info like a brochure: images, itinerary, pricing tiers, inclusions/exclusions
 */

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getTranslations, getLocale } from 'next-intl/server';
import { Clock, MapPin, ArrowLeft, Check, X, Phone, Info, Users } from 'lucide-react';
import {
    generateTourDetailMetadata,
    generateTourProductSchema,
    generateBreadcrumbSchema,
    SITE_URL,
    type Locale,
} from '@/lib/seo';
import type { Metadata } from 'next';

interface PriceTier {
    label: string;
    price: string;
}

interface ItineraryItem {
    time: string;
    activity: string;
}

async function getTourBySlug(slug: string) {
    return prisma.tourPackage.findUnique({ where: { slug } });
}

function parseJSON<T>(str: string | null | undefined, fallback: T): T {
    if (!str) return fallback;
    try { return JSON.parse(str); } catch { return fallback; }
}

function getLocalizedName(tour: any, locale: string): string {
    return locale === 'id' ? tour.nameId : locale === 'zh' ? tour.nameZh : locale === 'zh-CN' ? tour.nameZhCn : tour.nameEn;
}

function getLocalizedDesc(tour: any, locale: string): string {
    return locale === 'id' ? tour.descId : locale === 'zh' ? tour.descZh : locale === 'zh-CN' ? tour.descZhCn : tour.descEn;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;
    const tour = await getTourBySlug(slug);
    if (!tour || !tour.active) return {};

    const name = getLocalizedName(tour, locale);
    const desc = getLocalizedDesc(tour, locale);

    return generateTourDetailMetadata(locale as Locale, {
        name,
        description: desc,
        slug: tour.slug,
        mainImage: tour.mainImage,
        duration: tour.duration || undefined,
    });
}

export default async function TourDetailPage({
    params,
}: {
    params: Promise<{ locale: string; category: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const t = await getTranslations('paketTour');
    const tour = await getTourBySlug(slug);

    if (!tour || !tour.active) {
        notFound();
    }

    // Pick locale-specific content
    const name = locale === 'id' ? tour.nameId : locale === 'zh' ? tour.nameZh : locale === 'zh-CN' ? tour.nameZhCn : tour.nameEn;
    const desc = locale === 'id' ? tour.descId : locale === 'zh' ? tour.descZh : locale === 'zh-CN' ? tour.descZhCn : tour.descEn;

    // Itinerary
    const itineraryRaw = locale === 'id' ? tour.itineraryId : locale === 'zh' ? tour.itineraryZh : locale === 'zh-CN' ? tour.itineraryZhCn : tour.itineraryEn;
    const itinerary: ItineraryItem[] = parseJSON(itineraryRaw, []);

    // Inclusions / Exclusions
    const includedRaw = locale === 'id' ? tour.includedId : tour.includedEn;
    const excludedRaw = locale === 'id' ? tour.excludedId : tour.excludedEn;
    const inclusions: string[] = parseJSON(includedRaw, []);
    const exclusions: string[] = parseJSON(excludedRaw, []);

    // Price tiers
    const priceTiers: PriceTier[] = parseJSON(tour.priceTiers, []);

    // Images gallery
    const images: string[] = parseJSON(tour.images, []);
    const allImages = [tour.mainImage, ...images.filter(img => img !== tour.mainImage)];

    // Structured data
    const tourSchema = generateTourProductSchema({
        name,
        description: desc,
        image: tour.mainImage,
        price: tour.price || undefined,
        currency: 'IDR',
        duration: tour.duration || undefined,
        slug: tour.slug,
        locale: locale as Locale,
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: locale === 'id' ? 'Beranda' : 'Home', url: `${SITE_URL}/${locale}` },
        { name: locale === 'id' ? 'Paket Tour' : 'Tour Packages', url: `${SITE_URL}/${locale}/paket-tour` },
        { name, url: `${SITE_URL}/${locale}/paket-tour/${tour.slug}` },
    ]);

    return (
        <main className="bg-white min-h-screen font-sans">
            <Navbar />
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(tourSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Hero Banner */}
            <div className="relative h-[50vh] md:h-[60vh] w-full">
                <Image
                    src={tour.mainImage}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="container mx-auto max-w-6xl">
                        <Link href={`/${locale}/paket-tour`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-4 transition-colors">
                            <ArrowLeft size={16} />
                            {locale === 'id' ? 'Kembali ke Paket Tur' : 'Back to Tour Packages'}
                        </Link>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">{name}</h1>
                        <div className="flex flex-wrap gap-3 mt-4">
                            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                                <Clock size={14} /> {tour.duration}
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                                <MapPin size={14} /> North Sulawesi
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-12 md:py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-10">

                        {/* Left Content */}
                        <div className="lg:w-2/3">

                            {/* Description */}
                            <div className="mb-10">
                                <p className="text-lg text-gray-700 leading-relaxed border-l-4 border-amber-500 pl-6 whitespace-pre-line">
                                    {desc}
                                </p>
                            </div>

                            {/* Gallery */}
                            {allImages.length > 1 && (
                                <div className="mb-10">
                                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                                        {locale === 'id' ? 'Galeri' : 'Gallery'}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {allImages.slice(0, 6).map((img, i) => (
                                            <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                                                <Image
                                                    src={img}
                                                    alt={`${name} - ${i + 1}`}
                                                    fill
                                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Itinerary */}
                            {itinerary.length > 0 && (
                                <div className="mb-10">
                                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                            <MapPin size={18} />
                                        </div>
                                        {locale === 'id' ? 'Rencana Perjalanan' : 'Itinerary'}
                                    </h3>
                                    <div className="space-y-0 relative border-l-2 border-amber-200 ml-4 pl-8">
                                        {itinerary.map((item, i) => (
                                            <div key={i} className="mb-8 relative">
                                                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full border-[3px] border-white bg-amber-500 shadow-sm" />
                                                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1.5">{item.time}</span>
                                                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">{item.activity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Pricing Table */}
                            {priceTiers.length > 0 && (
                                <div className="mb-10">
                                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Users size={18} />
                                        </div>
                                        {locale === 'id' ? 'Harga' : 'Pricing'}
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr>
                                                    {priceTiers.map((tier, i) => (
                                                        <th key={i} className="border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm font-bold text-gray-700">
                                                            {tier.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {priceTiers.map((tier, i) => (
                                                        <td key={i} className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-amber-700">
                                                            {tier.price}
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Inclusions / Exclusions */}
                            {(inclusions.length > 0 || exclusions.length > 0) && (
                                <div className="grid md:grid-cols-2 gap-6 mb-10">
                                    {inclusions.length > 0 && (
                                        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <Check size={18} className="text-green-500" />
                                                {locale === 'id' ? 'Termasuk' : 'Price Included'}
                                            </h4>
                                            <ul className="space-y-2.5">
                                                {inclusions.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {exclusions.length > 0 && (
                                        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <X size={18} className="text-red-400" />
                                                {locale === 'id' ? 'Tidak Termasuk' : 'Price Not Included'}
                                            </h4>
                                            <ul className="space-y-2.5">
                                                {exclusions.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                                                        <span className="w-1.5 h-1.5 bg-red-300 rounded-full mt-1.5 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar - Booking CTA */}
                        <div className="lg:w-1/3">
                            <div className="sticky top-24 space-y-6">
                                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
                                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                                        {locale === 'id' ? 'Pesan Tur Ini' : 'Book This Tour'}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-6">
                                        {locale === 'id' ? 'Hubungi kami untuk harga terbaik sesuai ukuran grup Anda.' : 'Contact us for the best price tailored to your group size.'}
                                    </p>

                                    {/* Single price display if no tiers */}
                                    {tour.price && priceTiers.length === 0 && (
                                        <div className="mb-4 text-center">
                                            <span className="text-3xl font-bold text-amber-600">
                                                Rp {tour.price.toLocaleString('id-ID')}
                                            </span>
                                            {tour.priceUnit && <span className="text-gray-500 text-sm">/{tour.priceUnit}</span>}
                                        </div>
                                    )}

                                    <a
                                        href={`https://wa.me/6285241085050?text=${encodeURIComponent(`Halo, saya tertarik dengan paket ${name}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3.5 rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 mb-3"
                                    >
                                        <Phone size={18} />
                                        {locale === 'id' ? 'Chat WhatsApp' : 'Chat on WhatsApp'}
                                    </a>

                                    <a
                                        href="mailto:info@maleosan.com"
                                        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-900 font-bold py-3.5 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        {locale === 'id' ? 'Kirim Email' : 'Send Email Inquiry'}
                                    </a>

                                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                                        <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold block mb-1">
                                            {locale === 'id' ? 'Butuh Bantuan?' : 'Need Help?'}
                                        </span>
                                        <p className="text-lg font-bold text-gray-900">+62 852-4108-5050</p>
                                    </div>
                                </div>

                                <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                                    <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2"><Info size={16} />
                                        {locale === 'id' ? 'Catatan' : 'Note'}
                                    </h4>
                                    <p className="text-sm text-amber-700 leading-relaxed">
                                        {locale === 'id'
                                            ? 'Itinerary bersifat fleksibel dan dapat disesuaikan berdasarkan lalu lintas, cuaca, dan permintaan khusus Anda.'
                                            : 'Itinerary is flexible and can be customized based on traffic, weather, and your specific requests.'}
                                    </p>
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
