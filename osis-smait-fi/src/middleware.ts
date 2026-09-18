import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default clerkMiddleware(async (_auth, request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const response = NextResponse.next();

  // Static assets - cache immutable 1 year
  if (pathname.startsWith('/_next/static/') || pathname.startsWith('/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }

  // Handle /.well-known/ agent and protocol discovery requests
  if (pathname.startsWith('/.well-known/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return response;
  }

  // Handle /api/premium/* routes (x402 Payment Required enforcement)
  if (pathname.startsWith('/api/premium')) {
    return NextResponse.json(
      {
        error: 'Payment Required',
        message: 'This endpoint requires payment authorization under x402 specification.',
        details: 'OSIS SMAIT FI portal does not host commercial premium endpoints. All features are free and non-profit.',
        discovery_url: 'https://osissmaitfi.biezz.my.id/.well-known/x402.json',
      },
      {
        status: 402,
        headers: {
          'Content-Type': 'application/json',
          'X-Payment-Required': 'true',
          'X-Discovery-URL': 'https://osissmaitfi.biezz.my.id/.well-known/x402.json',
        },
      }
    );
  }

  // Handle MUBES Proker rewrites:
  // Browser requests literal bracket URL /program-kerja[mubes] or /program-kerja%5Bmubes%5D
  // Rewrite internally to /program-kerja-mubes while preserving URL bar
  let decodedPath = pathname;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    decodedPath = pathname;
  }
  if (decodedPath === '/program-kerja[mubes]') {
    const url = request.nextUrl.clone();
    url.pathname = '/program-kerja-mubes';
    const rewriteResponse = NextResponse.rewrite(url);
    rewriteResponse.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    rewriteResponse.headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0');
    return rewriteResponse;
  }
  if (decodedPath.startsWith('/program-kerja[mubes]/')) {
    const subSlug = decodedPath.slice('/program-kerja[mubes]/'.length);
    const url = request.nextUrl.clone();
    url.pathname = `/program-kerja-mubes/${encodeURIComponent(subSlug)}`;
    const rewriteResponse = NextResponse.rewrite(url);
    rewriteResponse.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    rewriteResponse.headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0');
    return rewriteResponse;
  }

  // AI & Crawler Shield untuk rute internal & MUBES:
  // Cegah crawler search engine atau bot AI liar mengekspos sidang MUBES
  const isInternalOrMubes =
    pathname.startsWith('/portal-mubes') ||
    pathname.startsWith('/program-kerja-mubes') ||
    decodedPath.startsWith('/program-kerja[mubes]') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/sso-callback');
  if (isInternalOrMubes) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    response.headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0');

    // Jika bot AI mencoba langsung request ke endpoint internal MUBES, tolak
    const isAiBot = /GPTBot|ClaudeBot|CCBot|PerplexityBot|Bytespider|Diffbot/i.test(userAgent);
    if (isAiBot && pathname.startsWith('/portal-mubes')) {
      return new NextResponse('Access Denied for automated scrapers on internal session.', { status: 403 });
    }

    return response;
  }

  // Markdown Content Negotiation (Cloudflare Markdown for Agents & isitagentready standard):
  // When an AI agent or client requests Accept: text/markdown on public routes,
  // internally rewrite to /api/markdown?path=<path> to return clean markdown with x-markdown-tokens
  const acceptHeader = request.headers.get('accept') || '';
  const wantsMarkdown = acceptHeader.split(',').some((mime) => mime.trim().startsWith('text/markdown'));

  if (wantsMarkdown && !pathname.startsWith('/api/') && !pathname.startsWith('/.well-known/') && pathname !== '/auth.md' && !isInternalOrMubes) {
    const markdownUrl = request.nextUrl.clone();
    markdownUrl.pathname = '/api/markdown';
    markdownUrl.search = `?path=${encodeURIComponent(pathname)}`;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-markdown-path', pathname);
    const rewriteResponse = NextResponse.rewrite(markdownUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    rewriteResponse.headers.set('x-markdown-route', pathname);
    return rewriteResponse;
  }

  // Machine-readable discovery Link headers for root path (RFC 8288 & RFC 9727)
  if (pathname === '/') {
    response.headers.set(
      'Link',
      '</.well-known/api-catalog>; rel="api-catalog", </openapi.json>; rel="service-desc", </docs>; rel="service-doc", </.well-known/oauth-protected-resource>; rel="describedby", </.well-known/mcp/server-card.json>; rel="describedby"'
    );
  }

  // HTML Pages Publik - short edge cache with stale-while-revalidate
  response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=10, stale-while-revalidate=60');
  response.headers.set('CDN-Cache-Control', 'public, s-maxage=10, stale-while-revalidate=60');

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};

