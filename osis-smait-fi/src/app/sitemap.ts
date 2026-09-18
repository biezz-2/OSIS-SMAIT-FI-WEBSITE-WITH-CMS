import { MetadataRoute } from 'next';
import { fetchAllSekbidsFromStrapi, fetchAllProgramKerjaForSitemap, fetchAllEventsForPage } from '@/lib/strapi';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://osissmaitfi.biezz.my.id';
  const staticBuildDate = new Date('2026-09-01');

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: staticBuildDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: staticBuildDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: staticBuildDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/program-kerja`,
      lastModified: staticBuildDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/anggota`,
      lastModified: staticBuildDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: staticBuildDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: staticBuildDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/galeri/galeri-preview-infinity`,
      lastModified: staticBuildDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/media-sosial`,
      lastModified: staticBuildDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/edufest-infinity`,
      lastModified: staticBuildDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  let sekbidRoutes: MetadataRoute.Sitemap = [];
  try {
    const sekbids = await fetchAllSekbidsFromStrapi();
    if (sekbids && Array.isArray(sekbids)) {
      sekbidRoutes = sekbids.map((item: any) => {
        const attrs = item.attributes || item;
        const num = attrs.nomor || item.id;
        return {
          url: `${baseUrl}/sekbid/sekbid-${num}`,
          lastModified: attrs.updatedAt ? new Date(attrs.updatedAt) : staticBuildDate,
          changeFrequency: 'weekly',
          priority: 0.7,
        };
      });
    }
  } catch (e) {
    console.error('Failed to fetch sekbids for sitemap', e);
  }

  const sanitizeSlug = (slug: string) => encodeURIComponent(slug.trim().replace(/^\/+|\/+$/g, ''));

  let prokerRoutes: MetadataRoute.Sitemap = [];
  try {
    const prokers = await fetchAllProgramKerjaForSitemap();
    if (prokers && Array.isArray(prokers)) {
      prokerRoutes = prokers
        .filter((item) => item.slug && typeof item.slug === 'string')
        .map((item) => ({
          url: `${baseUrl}/program-kerja/${sanitizeSlug(item.slug)}`,
          lastModified: item.updatedAt ? new Date(item.updatedAt) : staticBuildDate,
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
    }
  } catch (e) {
    console.error('Failed to fetch program kerjas for sitemap', e);
  }

  let eventRoutes: MetadataRoute.Sitemap = [];
  try {
    const events = await fetchAllEventsForPage();
    if (events && Array.isArray(events)) {
      eventRoutes = events
        .map((e: any) => e?.attributes || e)
        .filter((item: any) => item.slug && typeof item.slug === 'string' && item.slug.trim() !== 'edufest-infinity')
        .map((item) => ({
          url: `${baseUrl}/events/${sanitizeSlug(item.slug)}`,
          lastModified: item.updatedAt ? new Date(item.updatedAt) : staticBuildDate,
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
    }
  } catch (e) {
    console.error('Failed to fetch events for sitemap', e);
  }

  return [...staticRoutes, ...sekbidRoutes, ...prokerRoutes, ...eventRoutes];
}
