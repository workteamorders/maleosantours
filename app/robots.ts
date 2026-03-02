/**
 * Dynamic robots.txt Generator
 * Allows search engines to crawl public pages, blocks admin and API routes
 */

import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/admin',
                    '/api/',
                    '/_next/',
                    '/uploads/videos/',
                ],
            },
            {
                // Googlebot specific - allow everything public
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
            {
                // Baiduspider - important for Chinese market
                userAgent: 'Baiduspider',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
            {
                // Bing
                userAgent: 'bingbot',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
