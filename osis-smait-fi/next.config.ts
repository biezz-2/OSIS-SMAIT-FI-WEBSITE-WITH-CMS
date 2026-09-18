import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['100.100.68.83'],
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'osisstrapi.biezz.my.id' },
      { protocol: 'http', hostname: 'localhost', port: '1337' },
    ],
    localPatterns: [
      {
        pathname: '/api/compress-image',
        search: '?*',
      },
      {
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2400, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, max-age=0' },
          { key: 'Clear-Site-Data', value: '"cache", "storage"' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=10800' },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '</.well-known/api-catalog>; rel="api-catalog", </openapi.json>; rel="service-desc", </docs>; rel="service-doc", </.well-known/oauth-protected-resource>; rel="describedby", </.well-known/mcp/server-card.json>; rel="describedby"',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com https://www.youtube.com https://s.ytimg.com https://static.cloudflareinsights.com https://www.instagram.com https://*.instagram.com https://www.tiktok.com https://*.tiktok.com https://open.spotify.com https://apis.google.com https://accounts.google.com",
              "style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com https://accounts.google.com",
              "img-src 'self' data: blob: https://*.clerk.com https://img.clerk.com https://*.clerk.accounts.dev https://osisstrapi.biezz.my.id https: https://i.ytimg.com https://*.cdninstagram.com https://*.tiktokcdn.com https://*.googleusercontent.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.clerk.accounts.dev https://clerk.accounts.dev https://*.clerk.com https://*.clerk-telemetry.com https://clerk-telemetry.com https://api.clerk.com https://challenges.cloudflare.com https://osisstrapi.biezz.my.id https://www.youtube.com https://cloudflareinsights.com https://www.instagram.com https://*.instagram.com https://www.tiktok.com https://*.tiktok.com https://open.spotify.com https://cdn.jsdelivr.net https://accounts.google.com",
              "media-src 'self' https://d8j0ntlcm91z4.cloudfront.net https://osisstrapi.biezz.my.id blob:",
              "frame-src 'self' https://challenges.cloudflare.com https://*.clerk.accounts.dev https://*.clerk.com https://accounts.google.com https://www.youtube.com https://www.youtube-nocookie.com https://open.spotify.com https://*.spotify.com https://www.tiktok.com https://*.tiktok.com https://www.instagram.com https://*.instagram.com https://www.google.com https://maps.google.com",
              "worker-src 'self' blob:",
              "frame-ancestors 'self' https://osisstrapi.biezz.my.id http://localhost:1337",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
