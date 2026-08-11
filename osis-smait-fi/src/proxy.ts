import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Static assets - cache immutable 1 year
  if (pathname.startsWith('/_next/static/') || pathname.startsWith('/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }

  // API routes - no cache
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  // HTML Pages - short edge cache with stale-while-revalidate, force browser to always check edge server
  response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=10, stale-while-revalidate=60');
  response.headers.set('CDN-Cache-Control', 'public, s-maxage=10, stale-while-revalidate=60');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/image|favicon.ico).*)',
  ],
};
