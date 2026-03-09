import path from 'path';
import { fileURLToPath } from 'url';
import createNextIntlPlugin from 'next-intl/plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Meningkatkan batas upload ke 10MB
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maleosantoursmanado.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'maleosantoursmanado.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
  },
  // www redirect - ensures canonical URL consistency (non-www -> www)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'maleosantoursmanado.com' }],
        destination: 'https://www.maleosantoursmanado.com/:path*',
        permanent: true, // 301 redirect
      },
    ];
  },
  // Security and SEO headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/uploads/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache OG images and icons (remove noindex - sitemap/robots should be crawlable!)
        source: '/(opengraph-image|icon|apple-icon|manifest.webmanifest)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=604800' },
        ],
      },
    ];
  },
  // Webpack config
  webpack: (config, { isServer }) => {
    return config;
  },
};

export default withNextIntl(nextConfig);