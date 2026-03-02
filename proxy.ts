import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// Locale to lang mapping for Content-Language header
const LOCALE_LANG: Record<string, string> = {
  id: 'id',
  en: 'en',
  zh: 'zh-Hans',
  'zh-CN': 'zh-Hant',
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const sessionToken = request.cookies.get('admin_session')?.value;
    if (!sessionToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // For all other routes, apply i18n middleware
  const response = intlMiddleware(request);

  // Set Content-Language header for search engines
  const localeMatch = pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//)
    || pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)$/);
  const detectedLocale = localeMatch ? localeMatch[1] : 'id';
  const lang = LOCALE_LANG[detectedLocale] || detectedLocale;

  if (response) {
    response.headers.set('Content-Language', lang);
    // Cache control for SEO - allow CDN caching
    if (!response.headers.has('Cache-Control')) {
      response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
