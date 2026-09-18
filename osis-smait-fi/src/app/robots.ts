import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://osissmaitfi.biezz.my.id';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/portal-mubes',
          '/portal-mubes/*',
          '/api/*',
          '/sso-callback',
          '/*?*preview=*',
        ],
      },
      // Izinkan AI crawlers hanya membaca halaman publik yang aman
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Applebot-Extended'],
        allow: [
          '/',
          '/about',
          '/events',
          '/events/*',
          '/program-kerja',
          '/program-kerja/*',
          '/sekbid/*',
          '/galeri',
          '/media-sosial',
          '/partners',
          '/edufest-infinity',
        ],
        disallow: [
          '/portal-mubes',
          '/portal-mubes/*',
          '/api/*',
          '/sso-callback',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
