/**
 * Dynamic XML Sitemap Generator
 * Generates sitemap for all locales: id, en, zh, zh-CN
 * Includes static pages + dynamic tour packages, hotels, and info-travel
 */

import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL, LOCALES, DEFAULT_LOCALE, LOCALE_HREFLANG_MAP, type Locale } from '@/lib/seo';

// Static pages with their change frequencies and priorities
const STATIC_PAGES = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/hotels', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/info-travel', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/transport', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/testimoni', changeFrequency: 'weekly' as const, priority: 0.6 },
    { path: '/kontak', changeFrequency: 'monthly' as const, priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = [];

    // ============================================================
    // 1. STATIC PAGES (all locales)
    // ============================================================
    for (const page of STATIC_PAGES) {
        for (const locale of LOCALES) {
            const url = `${SITE_URL}/${locale}${page.path}`;

            // Build alternates (hreflang)
            const languages: Record<string, string> = {};
            for (const loc of LOCALES) {
                languages[LOCALE_HREFLANG_MAP[loc as Locale]] = `${SITE_URL}/${loc}${page.path}`;
            }
            languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${page.path}`;

            entries.push({
                url,
                lastModified: new Date(),
                changeFrequency: page.changeFrequency,
                priority: page.priority,
                alternates: { languages },
            });
        }
    }

    // ============================================================
    // 2. DYNAMIC TOUR PACKAGES
    // ============================================================
    try {
        const tours = await prisma.tourPackage.findMany({
            where: { active: true },
            select: { slug: true, updatedAt: true },
        });

        for (const tour of tours) {
            for (const locale of LOCALES) {
                const url = `${SITE_URL}/${locale}/paket-tour/${tour.slug}`;
                const languages: Record<string, string> = {};
                for (const loc of LOCALES) {
                    languages[LOCALE_HREFLANG_MAP[loc as Locale]] = `${SITE_URL}/${loc}/paket-tour/${tour.slug}`;
                }
                languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}/paket-tour/${tour.slug}`;

                entries.push({
                    url,
                    lastModified: tour.updatedAt,
                    changeFrequency: 'weekly',
                    priority: 0.8,
                    alternates: { languages },
                });
            }
        }
    } catch (error) {
        console.error('Error fetching tours for sitemap:', error);
    }

    // ============================================================
    // 3. DYNAMIC HOTELS
    // ============================================================
    try {
        const hotels = await prisma.hotel.findMany({
            where: { active: true },
            select: { slug: true, updatedAt: true },
        });

        for (const hotel of hotels) {
            for (const locale of LOCALES) {
                const url = `${SITE_URL}/${locale}/hotels/${hotel.slug}`;
                const languages: Record<string, string> = {};
                for (const loc of LOCALES) {
                    languages[LOCALE_HREFLANG_MAP[loc as Locale]] = `${SITE_URL}/${loc}/hotels/${hotel.slug}`;
                }
                languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}/hotels/${hotel.slug}`;

                entries.push({
                    url,
                    lastModified: hotel.updatedAt,
                    changeFrequency: 'weekly',
                    priority: 0.7,
                    alternates: { languages },
                });
            }
        }
    } catch (error) {
        console.error('Error fetching hotels for sitemap:', error);
    }

    // ============================================================
    // 4. DYNAMIC INFO TRAVEL
    // ============================================================
    try {
        const infoItems = await prisma.infoTravel.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
        });

        for (const item of infoItems) {
            for (const locale of LOCALES) {
                const url = `${SITE_URL}/${locale}/info-travel/${item.slug}`;
                const languages: Record<string, string> = {};
                for (const loc of LOCALES) {
                    languages[LOCALE_HREFLANG_MAP[loc as Locale]] = `${SITE_URL}/${loc}/info-travel/${item.slug}`;
                }
                languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}/info-travel/${item.slug}`;

                entries.push({
                    url,
                    lastModified: item.updatedAt,
                    changeFrequency: 'weekly',
                    priority: 0.7,
                    alternates: { languages },
                });
            }
        }
    } catch (error) {
        console.error('Error fetching info travel for sitemap:', error);
    }

    return entries;
}
