import { MetadataRoute } from 'next';
import { fetchAllSekbidsFromStrapi, fetchAllProgramKerjaForSitemap } from '@/lib/strapi';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://osissmaitfithrahinsani.sch.id';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/program-kerja`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/anggota`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/media-sosial`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/edufest-infinity`,
      lastModified: new Date(),
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
          lastModified: attrs.updatedAt ? new Date(attrs.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        };
      });
    }
  } catch (e) {
    console.error('Failed to fetch sekbids for sitemap', e);
  }

  let prokerRoutes: MetadataRoute.Sitemap = [];
  try {
    const prokers = await fetchAllProgramKerjaForSitemap();
    if (prokers && Array.isArray(prokers)) {
      prokerRoutes = prokers
        .filter((item) => item.slug)
        .map((item) => ({
          url: `${baseUrl}/program-kerja/${item.slug}`,
          lastModified: new Date(item.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
    }
  } catch (e) {
    console.error('Failed to fetch program kerjas for sitemap', e);
  }

  return [...staticRoutes, ...sekbidRoutes, ...prokerRoutes];
}
