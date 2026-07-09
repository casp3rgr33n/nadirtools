import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  let hasModifiedUrl = false;

  // 1. Force HTTPS
  if (url.protocol === 'http:' && process.env.NODE_ENV === 'production') {
    url.protocol = 'https:';
    url.port = '443';
    hasModifiedUrl = true;
  }

  // If we changed the URL (e.g. HTTP to HTTPS), redirect with 301
  if (hasModifiedUrl) {
    return NextResponse.redirect(url, 301);
  }

  // 3. Security Headers
  const response = NextResponse.next();
  const headers = response.headers;

  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://static.cloudflareinsights.com https://challenges.cloudflare.com https://partner.googleadservices.com https://tpc.googlesyndication.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://pagead2.googlesyndication.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google; " +
    "frame-src 'self' https://googleads.g.doubleclick.net https://challenges.cloudflare.com https://tpc.googlesyndication.com;"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
