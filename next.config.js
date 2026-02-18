import path from 'path';
import { fileURLToPath } from 'url';
import createNextIntlPlugin from 'next-intl/plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Tambahkan blok ini untuk memastikan Webpack selalu digunakan
  webpack: (config, { isServer }) => {
    // Anda bisa membiarkannya kosong atau menambahkan kustomisasi di sini
    return config;
  },
};

export default withNextIntl(nextConfig);