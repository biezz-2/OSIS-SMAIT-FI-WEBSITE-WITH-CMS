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
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=10800' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://challenges.cloudflare.com https://www.youtube.com https://s.ytimg.com https://static.cloudflareinsights.com https://www.instagram.com https://*.instagram.com https://www.tiktok.com https://*.tiktok.com https://open.spotify.com",
              "style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev",
              "img-src 'self' data: blob: https://*.clerk.com https://img.clerk.com https://*.clerk.accounts.dev https://osisstrapi.biezz.my.id https: https://i.ytimg.com https://*.cdninstagram.com https://*.tiktokcdn.com",
              "font-src 'self' data:",
              "connect-src 'self' https://*.clerk.accounts.dev https://clerk.accounts.dev https://api.clerk.com https://challenges.cloudflare.com https://osisstrapi.biezz.my.id https://www.youtube.com https://cloudflareinsights.com https://www.instagram.com https://*.instagram.com https://www.tiktok.com https://*.tiktok.com https://open.spotify.com https://cdn.jsdelivr.net",
              "media-src 'self' https://d8j0ntlcm91z4.cloudfront.net https://osisstrapi.biezz.my.id blob:",
              "frame-src 'self' https://challenges.cloudflare.com https://*.clerk.accounts.dev https://www.youtube.com https://www.youtube-nocookie.com https://open.spotify.com https://*.spotify.com https://www.tiktok.com https://*.tiktok.com https://www.instagram.com https://*.instagram.com https://www.google.com https://maps.google.com",
              "worker-src 'self' blob:",
              "frame-ancestors 'self' https://osisstrapi.biezz.my.id http://localhost:1337",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
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
