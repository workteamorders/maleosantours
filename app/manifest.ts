import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Maleosan Travel - Tour & Travel Manado',
        short_name: 'Maleosan Travel',
        description:
            'Tour operator terbaik di Manado, Sulawesi Utara. Paket tour Bunaken, Likupang, Minahasa, sewa mobil, hotel.',
        start_url: '/',
        display: 'standalone',
        background_color: '#F2F0E9',
        theme_color: '#B07D62',
        orientation: 'portrait-primary',
        categories: ['travel', 'tourism', 'lifestyle'],
        lang: 'id',
        icons: [
            {
                src: '/icon',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                src: '/apple-icon',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    };
}
