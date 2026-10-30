/**
 * SEO Configuration & Helpers
 * Centralized SEO management for multi-language travel website
 * Target markets: Indonesia (id), English (en), China Simplified (zh), Taiwan Traditional (zh-CN)
 */

import type { Metadata } from 'next';

// ============================================================
// SITE CONFIGURATION
// ============================================================

export const SITE_URL = 'https://www.maleosantoursmanado.com';
export const SITE_NAME = 'Maleosan Travel';

export const LOCALES = ['id', 'en', 'zh', 'zh-CN'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'id';

// Locale to HTML lang attribute mapping
export const LOCALE_LANG_MAP: Record<Locale, string> = {
    id: 'id',
    en: 'en',
    zh: 'zh-Hans',     // Simplified Chinese (China mainland)
    'zh-CN': 'zh-Hant', // Traditional Chinese (Taiwan)
};

// Locale to hreflang attribute mapping (Google standard)
// Google only accepts: language codes like 'id', 'en', 'zh-CN', 'zh-TW'
export const LOCALE_HREFLANG_MAP: Record<Locale, string> = {
    id: 'id',
    en: 'en',
    zh: 'zh-CN',      // Simplified Chinese (China) — Google standard
    'zh-CN': 'zh-TW', // Traditional Chinese (Taiwan) — Google standard
};

// ============================================================
// PER-PAGE SEO DATA (multi-language)
// ============================================================

interface PageSEO {
    title: Record<Locale, string>;
    description: Record<Locale, string>;
    keywords: Record<Locale, string[]>;
}

export const PAGE_SEO: Record<string, PageSEO> = {
    home: {
        title: {
            id: 'Manado Tours - Maleosan Tours Manado | Tour & Travel Terbaik Sulawesi Utara',
            en: 'Manado Tours - Maleosan Tours Manado | Best Tour & Travel North Sulawesi',
            zh: 'Manado Tours - Maleosan Tours 万鸦老 | 北苏拉威西最佳旅行社',
            'zh-CN': 'Manado Tours - Maleosan Tours 萬鴉老 | 北蘇拉威西最佳旅行社',
        },
        description: {
            id: 'Manado Tours oleh Maleosan Travel - paket tour terbaik: Bunaken, Likupang, Minahasa. Sewa mobil, hotel & wisata Sulawesi Utara. Pesan sekarang!',
            en: 'Manado Tours by Maleosan Travel - best tour packages: Bunaken, Likupang, Minahasa. Car rental & hotels in North Sulawesi. Book now!',
            zh: 'Manado Tours - Maleosan Travel 提供万鸦老最佳旅游套餐，布纳肯浮潜、利库邦海滩游、租车及北苏拉威西酒店预订。立即预订！',
            'zh-CN': 'Manado Tours - Maleosan Travel 提供萬鴉老最佳旅遊套裝，布納肯浮潛、利庫邦海灘遊、租車及北蘇拉威西酒店預訂。立即預訂！',
        },
        keywords: {
            id: ['manado tours', 'maleosan tours', 'maleosan tours manado', 'tour manado', 'paket wisata manado', 'travel manado', 'bunaken tour', 'sewa mobil manado', 'hotel manado', 'wisata sulawesi utara', 'likupang', 'minahasa tour', 'paket tour bunaken', 'manado tour package'],
            en: ['manado tours', 'maleosan tours', 'maleosan tours manado', 'manado tour', 'north sulawesi tour', 'bunaken snorkeling', 'manado travel agent', 'likupang beach', 'manado hotel', 'car rental manado', 'minahasa highland tour', 'indonesia travel', 'sulawesi tour', 'manado tour package'],
            zh: ['万鸦老旅游', '北苏拉威西旅游', '布纳肯浮潜', '万鸦老旅行社', '印尼旅游', '万鸦老酒店', '万鸦老租车', '美娜多旅游', '苏拉威西旅游套餐', '印度尼西亚旅行', 'manado tours'],
            'zh-CN': ['萬鴉老旅遊', '北蘇拉威西旅遊', '布納肯浮潛', '萬鴉老旅行社', '印尼旅遊', '萬鴉老酒店', '萬鴉老租車', '美娜多旅遊', '蘇拉威西旅遊套裝', '印度尼西亞旅行', 'manado tours'],
        },
    },
    'paket-tour': {
        title: {
            id: 'Paket Tour Manado & Sulawesi Utara - Bunaken, Likupang, Minahasa | Maleosan Tours',
            en: 'Manado Tour Packages - Bunaken, Likupang, Minahasa | Maleosan Tours Manado',
            zh: '万鸦老旅游套餐 - 布纳肯、利库邦、美娜多 | Maleosan Tours',
            'zh-CN': '萬鴉老旅遊套裝 - 布納肯、利庫邦、美娜多 | Maleosan Tours',
        },
        description: {
            id: 'Pilih paket tour Manado terbaik: Bunaken Snorkeling, Minahasa Highland, Likupang Beach, City Tour & Custom Trip. Harga terjangkau, pelayanan profesional.',
            en: 'Best Manado tours packages: Bunaken Snorkeling, Minahasa Highland, Likupang Beach, City Tour & Custom Trip. Affordable prices, professional service.',
            zh: '选择最佳万鸦老旅游套餐：布纳肯浮潜、美娜哈萨高地、利库邦海滩、城市观光及定制行程。价格实惠，专业服务。',
            'zh-CN': '選擇最佳萬鴉老旅遊套裝：布納肯浮潛、美娜哈薩高地、利庫邦海灘、城市觀光及定制行程。價格實惠，專業服務。',
        },
        keywords: {
            id: ['paket tour manado', 'manado tours', 'paket wisata bunaken', 'tour minahasa', 'paket liburan sulawesi utara', 'tour likupang', 'city tour manado', 'paket snorkeling bunaken', 'wisata manado murah', 'maleosan tours'],
            en: ['manado tours', 'manado tour package', 'bunaken snorkeling tour', 'minahasa tour', 'north sulawesi holiday', 'likupang beach tour', 'manado city tour', 'indonesia adventure tour', 'sulawesi travel package', 'maleosan tours manado'],
            zh: ['万鸦老旅游套餐', '布纳肯浮潜之旅', '美娜多旅行套餐', '北苏拉威西度假', '印尼潜水旅游', '万鸦老一日游', 'manado tours'],
            'zh-CN': ['萬鴉老旅遊套裝', '布納肯浮潛之旅', '美娜多旅行套裝', '北蓇拉威西度假', '印尼潛水旅遊', '萬鴉老一日遊', 'manado tours'],
        },
    },
    hotels: {
        title: {
            id: 'Hotel & Resort Terbaik di Manado - Booking Akomodasi | Maleosan Tours Manado',
            en: 'Best Hotels & Resorts in Manado - Accommodation Booking | Maleosan Tours',
            zh: '万鸦老最佳酒店与度假村 - 住宿预订 | Maleosan Tours',
            'zh-CN': '萬鴉老最佳酒店與度假村 - 住宿預訂 | Maleosan Tours',
        },
        description: {
            id: 'Temukan hotel & resort terbaik di Manado: hotel bintang 5, boutique hotel, beach resort, dan penginapan budget. Booking mudah dengan Maleosan Travel.',
            en: 'Find the best hotels & resorts in Manado: 5-star luxury, boutique hotels, beach resorts & budget accommodation. Easy booking with Maleosan Travel.',
            zh: '发现万鸦老最佳酒店与度假村：五星级豪华酒店、精品酒店、海滩度假村及经济型住宿。通过Maleosan Travel轻松预订。',
            'zh-CN': '發現萬鴉老最佳酒店與度假村：五星級豪華酒店、精品酒店、海灘度假村及經濟型住宿。透過Maleosan Travel輕鬆預訂。',
        },
        keywords: {
            id: ['hotel manado', 'resort manado', 'hotel bunaken', 'penginapan manado', 'hotel bintang 5 manado', 'beach resort sulawesi utara', 'booking hotel manado'],
            en: ['manado hotel', 'manado resort', 'bunaken hotel', 'north sulawesi accommodation', 'manado 5 star hotel', 'beach resort manado', 'hotel booking manado'],
            zh: ['万鸦老酒店', '万鸦老度假村', '布纳肯酒店', '万鸦老住宿', '美娜多酒店预订'],
            'zh-CN': ['萬鴉老酒店', '萬鴉老度假村', '布納肯酒店', '萬鴉老住宿', '美娜多酒店預訂'],
        },
    },
    'info-travel': {
        title: {
            id: 'Info Travel Manado - Panduan Wisata Sulawesi Utara Lengkap | Maleosan Tours',
            en: 'Manado Travel Guide - Complete North Sulawesi Tourism Info | Maleosan Tours',
            zh: '万鸦老旅游指南 - 北苏拉威西完整旅游信息 | Maleosan Tours',
            'zh-CN': '萬鴉老旅遊指南 - 北蘇拉威西完整旅遊資訊 | Maleosan Tours',
        },
        description: {
            id: 'Panduan wisata lengkap Manado & Sulawesi Utara: destinasi, sejarah, budaya Minahasa, kuliner khas, dan tips transportasi. Semua yang perlu Anda ketahui.',
            en: 'Complete Manado & North Sulawesi travel guide: destinations, history, Minahasa culture, local cuisine & transport tips. Everything you need to know.',
            zh: '万鸦老和北苏拉威西完整旅游指南：目的地、历史、米纳哈萨文化、当地美食和交通贴士。您需要了解的一切。',
            'zh-CN': '萬鴉老和北蘇拉威西完整旅遊指南：目的地、歷史、米納哈薩文化、當地美食和交通貼士。您需要了解的一切。',
        },
        keywords: {
            id: ['info travel manado', 'panduan wisata manado', 'destinasi sulawesi utara', 'budaya minahasa', 'kuliner manado', 'transportasi manado'],
            en: ['manado travel guide', 'north sulawesi tourism', 'minahasa culture', 'manado food guide', 'manado transport', 'things to do manado'],
            zh: ['万鸦老旅游攻略', '北苏拉威西旅游指南', '米纳哈萨文化', '万鸦老美食', '万鸦老交通'],
            'zh-CN': ['萬鴉老旅遊攻略', '北蘇拉威西旅遊指南', '米納哈薩文化', '萬鴉老美食', '萬鴉老交通'],
        },
    },
    transport: {
        title: {
            id: 'Sewa Mobil & Transportasi di Manado - Rental Kendaraan | Maleosan Tours',
            en: 'Car Rental & Transport Services in Manado | Maleosan Tours Manado',
            zh: '万鸦老租车与交通服务 | Maleosan Tours',
            'zh-CN': '萬鴉老租車與交通服務 | Maleosan Tours',
        },
        description: {
            id: 'Sewa mobil, bus pariwisata, antar jemput bandara & motor rental di Manado. Supir berpengalaman, kendaraan nyaman, harga terjangkau. Pesan sekarang!',
            en: 'Car rental, tourist bus, airport transfer & motorcycle rental in Manado. Experienced drivers, comfortable vehicles, affordable prices. Book now!',
            zh: '万鸦老租车、旅游巴士、机场接送及摩托车租赁。经验丰富的司机、舒适的车辆、实惠的价格。立即预订！',
            'zh-CN': '萬鴉老租車、旅遊巴士、機場接送及摩托車租賃。經驗豐富的司機、舒適的車輛、實惠的價格。立即預訂！',
        },
        keywords: {
            id: ['sewa mobil manado', 'rental mobil manado', 'bus pariwisata manado', 'antar jemput bandara manado', 'transportasi manado', 'sewa motor manado'],
            en: ['car rental manado', 'manado transport', 'airport transfer manado', 'tourist bus manado', 'motorcycle rental manado', 'driver service manado'],
            zh: ['万鸦老租车', '万鸦老交通', '万鸦老机场接送', '万鸦老旅游巴士', '美娜多租车'],
            'zh-CN': ['萬鴉老租車', '萬鴉老交通', '萬鴉老機場接送', '萬鴉老旅遊巴士', '美娜多租車'],
        },
    },
    testimoni: {
        title: {
            id: 'Testimoni Pelanggan - Review Wisata Manado | Maleosan Tours',
            en: 'Customer Testimonials - Manado Tours Reviews | Maleosan Tours Manado',
            zh: '客户评价 - 万鸦老旅游评论 | Maleosan Tours',
            'zh-CN': '客戶評價 - 萬鴉老旅遊評論 | Maleosan Tours',
        },
        description: {
            id: 'Baca testimoni pelanggan Maleosan Travel. Pengalaman wisata nyata di Bunaken, Likupang, Minahasa dari traveler Indonesia dan internasional.',
            en: 'Read Maleosan Travel customer testimonials. Real travel experiences in Bunaken, Likupang, Minahasa from Indonesian and international travelers.',
            zh: '阅读Maleosan Travel客户评价。来自印尼和国际旅客在布纳肯、利库邦、美娜哈萨的真实旅行体验。',
            'zh-CN': '閱讀Maleosan Travel客戶評價。來自印尼和國際旅客在布納肯、利庫邦、美娜哈薩的真實旅行體驗。',
        },
        keywords: {
            id: ['testimoni maleosan travel', 'review wisata manado', 'pengalaman wisata bunaken', 'ulasan travel manado'],
            en: ['maleosan travel review', 'manado travel testimonials', 'bunaken tour review', 'north sulawesi travel experience'],
            zh: ['万鸦老旅游评价', '美娜多旅行评论', 'Maleosan Travel评价'],
            'zh-CN': ['萬鴉老旅遊評價', '美娜多旅行評論', 'Maleosan Travel評價'],
        },
    },
    kontak: {
        title: {
            id: 'Hubungi Kami - Kontak Maleosan Tours Manado | Booking & Informasi',
            en: 'Contact Us - Maleosan Tours Manado | Booking & Information',
            zh: '联系我们 - Maleosan Tours 万鸦老 | 预订与咨询',
            'zh-CN': '聯繫我們 - Maleosan Tours 萬鴉老 | 預訂與諮詢',
        },
        description: {
            id: 'Hubungi Maleosan Travel untuk booking tour, hotel, dan transportasi di Manado. WhatsApp, email, atau kunjungi kantor kami di Manado, Sulawesi Utara.',
            en: 'Contact Maleosan Travel for tour, hotel & transport booking in Manado. WhatsApp, email or visit our office in Manado, North Sulawesi.',
            zh: '联系Maleosan Travel预订万鸦老旅游、酒店和交通。WhatsApp、电子邮件或访问我们在万鸦老的办公室。',
            'zh-CN': '聯繫Maleosan Travel預訂萬鴉老旅遊、酒店和交通。WhatsApp、電子郵件或訪問我們在萬鴉老的辦公室。',
        },
        keywords: {
            id: ['kontak maleosan travel', 'booking tour manado', 'travel agent manado', 'telepon maleosan travel', 'whatsapp travel manado'],
            en: ['contact maleosan travel', 'book manado tour', 'manado travel agent contact', 'maleosan travel phone', 'whatsapp manado travel'],
            zh: ['联系万鸦老旅行社', '预订万鸦老旅游', 'Maleosan Travel电话', '万鸦老旅行社微信'],
            'zh-CN': ['聯繫萬鴉老旅行社', '預訂萬鴉老旅遊', 'Maleosan Travel電話', '萬鴉老旅行社微信'],
        },
    },
};

// ============================================================
// METADATA GENERATORS
// ============================================================

/**
 * Generate full Next.js Metadata for a page
 */
export function generatePageMetadata(
    pageKey: string,
    locale: Locale,
    options?: {
        path?: string;
        images?: string[];
        noIndex?: boolean;
    }
): Metadata {
    const seo = PAGE_SEO[pageKey];
    if (!seo) return {};

    const lang = LOCALE_LANG_MAP[locale];
    const path = options?.path !== undefined ? options.path : pageKey === 'home' ? '' : pageKey;
    const canonicalUrl = `${SITE_URL}/${locale}${path ? `/${path}` : ''}`;

    // Generate alternate language URLs for hreflang
    const alternates: Record<string, string> = {};
    for (const loc of LOCALES) {
        const hreflang = LOCALE_HREFLANG_MAP[loc];
        alternates[hreflang] = `${SITE_URL}/${loc}${path ? `/${path}` : ''}`;
    }
    alternates['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${path ? `/${path}` : ''}`;

    const ogImages = options?.images?.length
        ? options.images.map((img) => ({
            url: img.startsWith('http') ? img : `${SITE_URL}${img}`,
            width: 1200,
            height: 630,
            alt: seo.title[locale],
        }))
        : [
            {
                url: `${SITE_URL}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: seo.title[locale],
            },
        ];

    return {
        title: seo.title[locale],
        description: seo.description[locale],
        keywords: seo.keywords[locale],
        authors: [{ name: SITE_NAME, url: SITE_URL }],
        creator: SITE_NAME,
        publisher: SITE_NAME,
        metadataBase: new URL(SITE_URL),
        icons: {
            icon: '/logo.png',
            apple: '/logo.png',
        },
        alternates: {
            canonical: canonicalUrl,
            languages: alternates,
        },
        openGraph: {
            type: pageKey === 'home' ? 'website' : 'article',
            locale: lang,
            url: canonicalUrl,
            title: seo.title[locale],
            description: seo.description[locale],
            siteName: SITE_NAME,
            images: ogImages,
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.title[locale],
            description: seo.description[locale],
            images: ogImages.map((img) => img.url),
        },
        robots: options?.noIndex
            ? { index: false, follow: false }
            : {
                index: true,
                follow: true,
                'max-image-preview': 'large' as const,
                'max-snippet': -1,
                'max-video-preview': -1,
            },
        other: {
            // Baidu verification (replace with actual verification code)
            // 'baidu-site-verification': 'YOUR_BAIDU_CODE',
            // Additional meta for Chinese search engines
            'applicable-device': 'pc,mobile',
            'mobile-agent': `format=html5; url=${canonicalUrl}`,
        },
    };
}

/**
 * Generate dynamic metadata for a tour package detail page
 */
export function generateTourDetailMetadata(
    locale: Locale,
    tour: {
        name: string;
        description: string;
        slug: string;
        mainImage: string;
        duration?: string;
    }
): Metadata {
    const path = `paket-tour/${tour.slug}`;
    const canonicalUrl = `${SITE_URL}/${locale}/${path}`;

    const titleSuffix: Record<Locale, string> = {
        id: `${tour.name} - Paket Tour Manado | Maleosan Tours`,
        en: `${tour.name} - Manado Tour Package | Maleosan Tours`,
        zh: `${tour.name} - 万鸦老旅游套餐 | Maleosan Tours`,
        'zh-CN': `${tour.name} - 萬鴉老旅遊套裝 | Maleosan Tours`,
    };

    const alternates: Record<string, string> = {};
    for (const loc of LOCALES) {
        alternates[LOCALE_HREFLANG_MAP[loc]] = `${SITE_URL}/${loc}/${path}`;
    }
    alternates['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}/${path}`;

    const description = tour.description?.slice(0, 160) || '';

    return {
        title: titleSuffix[locale],
        description,
        metadataBase: new URL(SITE_URL),
        icons: {
            icon: '/logo.png',
            apple: '/logo.png',
        },
        alternates: {
            canonical: canonicalUrl,
            languages: alternates,
        },
        openGraph: {
            type: 'article',
            locale: LOCALE_LANG_MAP[locale],
            url: canonicalUrl,
            title: titleSuffix[locale],
            description,
            siteName: SITE_NAME,
            images: [
                {
                    url: tour.mainImage.startsWith('http') ? tour.mainImage : `${SITE_URL}${tour.mainImage}`,
                    width: 1200,
                    height: 630,
                    alt: tour.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: titleSuffix[locale],
            description,
            images: [tour.mainImage.startsWith('http') ? tour.mainImage : `${SITE_URL}${tour.mainImage}`],
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large' as const,
            'max-snippet': -1,
        },
    };
}

/**
 * Generate dynamic metadata for a hotel detail page
 */
export function generateHotelDetailMetadata(
    locale: Locale,
    hotel: {
        name: string;
        description: string;
        slug: string;
        mainImage: string;
        location?: string;
        rating?: number;
    }
): Metadata {
    const path = `hotels/${hotel.slug}`;
    const canonicalUrl = `${SITE_URL}/${locale}/${path}`;

    const titleSuffix: Record<Locale, string> = {
        id: `${hotel.name} - Hotel di Manado | Maleosan Tours`,
        en: `${hotel.name} - Hotel in Manado | Maleosan Tours`,
        zh: `${hotel.name} - 万鸦老酒店 | Maleosan Tours`,
        'zh-CN': `${hotel.name} - 萬鴉老酒店 | Maleosan Tours`,
    };

    const alternates: Record<string, string> = {};
    for (const loc of LOCALES) {
        alternates[LOCALE_HREFLANG_MAP[loc]] = `${SITE_URL}/${loc}/${path}`;
    }
    alternates['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}/${path}`;

    const description = hotel.description?.slice(0, 160) || '';

    return {
        title: titleSuffix[locale],
        description,
        metadataBase: new URL(SITE_URL),
        icons: {
            icon: '/logo.png',
            apple: '/logo.png',
        },
        alternates: {
            canonical: canonicalUrl,
            languages: alternates,
        },
        openGraph: {
            type: 'article',
            locale: LOCALE_LANG_MAP[locale],
            url: canonicalUrl,
            title: titleSuffix[locale],
            description,
            siteName: SITE_NAME,
            images: [
                {
                    url: hotel.mainImage?.startsWith('http') ? hotel.mainImage : `${SITE_URL}${hotel.mainImage || '/og-image.jpg'}`,
                    width: 1200,
                    height: 630,
                    alt: hotel.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: titleSuffix[locale],
            description,
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large' as const,
            'max-snippet': -1,
        },
    };
}

// ============================================================
// JSON-LD STRUCTURED DATA
// ============================================================

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'TravelAgency',
        name: 'Maleosan Travel',
        alternateName: ['Maleosan Tours Manado', 'Maleosan Travel Manado'],
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        image: `${SITE_URL}/og-image.jpg`,
        description:
            'Maleosan Travel is a professional tour and travel operator in Manado, North Sulawesi, Indonesia. Offering tour packages, hotel booking, car rental, and transportation services.',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Manado',
            addressRegion: 'North Sulawesi',
            addressCountry: 'ID',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 1.4748,
            longitude: 124.8421,
        },
        areaServed: [
            { '@type': 'City', name: 'Manado' },
            { '@type': 'AdministrativeArea', name: 'North Sulawesi' },
            { '@type': 'Place', name: 'Bunaken' },
            { '@type': 'Place', name: 'Likupang' },
            { '@type': 'Place', name: 'Tomohon' },
        ],
        sameAs: [
            // Add social links here
            // 'https://www.facebook.com/maleosantravel',
            // 'https://www.instagram.com/maleosantravel',
        ],
        priceRange: '$$',
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '08:00',
            closes: '21:00',
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Travel Services',
            itemListElement: [
                {
                    '@type': 'OfferCatalog',
                    name: 'Tour Packages',
                    itemListElement: [
                        { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'Bunaken Snorkeling Tour' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'Minahasa Highland Tour' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'TouristTrip', name: 'Likupang Beach Tour' } },
                    ],
                },
                {
                    '@type': 'OfferCatalog',
                    name: 'Transportation',
                    itemListElement: [
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Car Rental with Driver' } },
                        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Airport Transfer' } },
                    ],
                },
            ],
        },
    };
}

export function generateWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        alternateName: ['Maleosan Tours Manado', 'Manado Tours', 'Maleosan Tours'],
        url: SITE_URL,
        inLanguage: ['id', 'en', 'zh-Hans', 'zh-Hant'],
    };
}

export function generateBreadcrumbSchema(
    items: Array<{ name: string; url: string }>
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function generateTourProductSchema(tour: {
    name: string;
    description: string;
    image: string;
    price?: number;
    currency?: string;
    duration?: string;
    slug: string;
    locale: Locale;
    rating?: number;
    reviewCount?: number;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: tour.name,
        description: tour.description,
        image: tour.image.startsWith('http') ? tour.image : `${SITE_URL}${tour.image}`,
        url: `${SITE_URL}/${tour.locale}/paket-tour/${tour.slug}`,
        touristType: 'Adventure',
        itinerary: {
            '@type': 'ItemList',
            description: tour.description,
        },
        ...(tour.duration && {
            duration: tour.duration,
        }),
        offers: tour.price
            ? {
                '@type': 'Offer',
                price: tour.price,
                priceCurrency: tour.currency || 'IDR',
                availability: 'https://schema.org/InStock',
                seller: {
                    '@type': 'TravelAgency',
                    name: 'Maleosan Travel',
                },
            }
            : undefined,
        ...(tour.rating && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: tour.rating,
                reviewCount: tour.reviewCount || 10,
                bestRating: 5,
            },
        }),
        provider: {
            '@type': 'TravelAgency',
            name: 'Maleosan Travel',
            url: SITE_URL,
        },
    };
}

export function generateHotelSchema(hotel: {
    name: string;
    description: string;
    image: string;
    slug: string;
    locale: Locale;
    rating?: number;
    location?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Hotel',
        name: hotel.name,
        description: hotel.description,
        image: hotel.image?.startsWith('http') ? hotel.image : `${SITE_URL}${hotel.image || ''}`,
        url: `${SITE_URL}/${hotel.locale}/hotels/${hotel.slug}`,
        starRating: hotel.rating
            ? {
                '@type': 'Rating',
                ratingValue: hotel.rating,
            }
            : undefined,
        address: {
            '@type': 'PostalAddress',
            addressLocality: hotel.location || 'Manado',
            addressRegion: 'North Sulawesi',
            addressCountry: 'ID',
        },
    };
}

export function generateFAQSchema(
    faqs: Array<{ question: string; answer: string }>
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}
