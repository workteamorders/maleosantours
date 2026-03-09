import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip i18n middleware for admin routes and static files
    if (pathname.startsWith('/admin') || pathname.startsWith('/uploads')) {
        return NextResponse.next();
    }

    // Apply i18n middleware for all other routes
    // This ensures /hotels/... gets redirected to /id/hotels/... (default locale)
    // preventing Google from finding locale-less duplicate URLs
    return intlMiddleware(request);
}

export const config = {
    // Match all paths except: api, _next, static files, and files with extensions
    matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
