import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://osissmaitfi.biezz.my.id';

  const aiCrawlersAllowed = [
    'GPTBot',
    'ClaudeBot',
    'Claude-Web',
    'OAI-SearchBot',
    'PerplexityBot',
    'Applebot-Extended',
    'Google-Extended',
    'Cohere-ai',
  ];

  const aiCrawlersBlocked = [
    'Bytespider',
    'CCBot',
    'Diffbot',
  ];

  const publicAllowedPaths = [
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
    '/edufest-infinity/*',
    '/privacy-policy',
    '/docs',
    '/.well-known/*',
  ];

  const internalDisallowedPaths = [
    '/portal-mubes',
    '/portal-mubes/*',
    '/api/*',
    '/sso-callback',
    '/*?*preview=*',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: internalDisallowedPaths,
      },
      // Izinkan AI Search & Retrieval Crawlers mengakses halaman publik sekolah
      {
        userAgent: aiCrawlersAllowed,
        allow: publicAllowedPaths,
        disallow: internalDisallowedPaths,
      },
      // Blokir bot scraper agresif & non-compliant bulk scrapers
      {
        userAgent: aiCrawlersBlocked,
        disallow: ['/'],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml\nAgentmap: ${baseUrl}/.well-known/ai-catalog.json\n\n# ====================================================================\n# RFC 9309 & AI Content Signals Specification\n# https://content-signals.org\n# ====================================================================\nContent-Signal: ai-train=no, search=yes, ai-input=no, use=reference`,
    ],
  };
}
