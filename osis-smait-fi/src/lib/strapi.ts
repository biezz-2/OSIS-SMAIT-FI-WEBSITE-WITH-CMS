export const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || 'https://osisstrapi.biezz.my.id').replace(/\/$/, '');

export type StrapiImageFormat = 'original' | 'large' | 'medium' | 'small' | 'thumbnail';

/**
 * Resolves a Strapi media object or path into a full absolute URL with fallback.
 * @param preferredFormat - Resolusi yang diinginkan. Default 'original' (file penuh HD).
 *   Gunakan 'large'/'medium'/'small' hanya untuk thumbnail/card kecil.
 *   File HD kemudian dikompres oleh /api/compress-image sesuai setting kualitas dari Strapi.
 */
export function getStrapiMediaUrl(
  media: any,
  fallbackUrl: string = '',
  preferredFormat: StrapiImageFormat = 'original'
): string {
  if (!media) return fallbackUrl;

  const sanitizeUrl = (urlStr: string) => {
    if (!urlStr) return urlStr;
    return urlStr
      .replace(/^https?:\/\/(localhost|127\.0\.0\.1):1337/, STRAPI_URL)
      .replace(/^http:\/\/osisstrapi\.biezz\.my\.id/, 'https://osisstrapi.biezz.my.id');
  };

  // Case 1: Direct string path or URL
  if (typeof media === 'string') {
    let url = sanitizeUrl(media);
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/')) return `${STRAPI_URL}${url}`;
    if (url.startsWith('/')) return url; // local static asset (e.g. /images/...)
    return `${STRAPI_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  // Case 2: External URL priority (e.g. YouTube/Drive link)
  if (media.url_external && typeof media.url_external === 'string' && media.url_external.trim() !== '') {
    return media.url_external;
  }

  // Case 3: Strapi uploaded media object (v4, v5, formats, and nested file relation)
  const target = media.file || media;
  const fileData = target.data?.attributes || target.attributes || target.data || target;
  const formats = fileData?.formats || target?.formats || media?.formats;
  const originalUrl = fileData?.url || target?.url || media?.url;

  // Pilih URL berdasarkan preferredFormat. Urutan fallback selalu naik ke resolusi lebih tinggi
  // agar gambar tidak pernah lebih buram dari yang diminta.
  let rawUrl = '';
  if (preferredFormat === 'thumbnail') {
    rawUrl = formats?.thumbnail?.url || formats?.small?.url || formats?.medium?.url || formats?.large?.url || originalUrl;
  } else if (preferredFormat === 'small') {
    rawUrl = formats?.small?.url || formats?.medium?.url || formats?.large?.url || originalUrl;
  } else if (preferredFormat === 'medium') {
    rawUrl = formats?.medium?.url || formats?.large?.url || originalUrl;
  } else if (preferredFormat === 'large') {
    rawUrl = formats?.large?.url || originalUrl;
  } else {
    // 'original' — default. Ambil file asli HD untuk hero/banner/galeri.
    // Next.js <Image /> dan /api/compress-image menangani kompresi on-the-fly.
    rawUrl = originalUrl || formats?.large?.url || formats?.medium?.url;
  }

  if (rawUrl) {
    let url = sanitizeUrl(rawUrl);
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/') || url.startsWith('/')) return `${STRAPI_URL}${url}`;
    return `${STRAPI_URL}/${url}`;
  }

  return fallbackUrl;
}

export interface FetchStrapiOptions extends RequestInit {
  isDraftMode?: boolean;
  silent404?: boolean;
}

export const STRAPI_INTERNAL_URL = typeof window === 'undefined'
  ? (process.env.STRAPI_INTERNAL_URL || 'http://127.0.0.1:1337').replace(/\/$/, '')
  : STRAPI_URL;

export async function fetchStrapiAPI<T>(endpoint: string, options: FetchStrapiOptions = {}): Promise<T | null> {
  let isDraftMode = options.isDraftMode || false;

  // Check document cookie in client browser
  if (typeof window !== 'undefined' && !isDraftMode) {
    if (document.cookie.includes('__prerender_bypass') || document.cookie.includes('__next_preview_data')) {
      isDraftMode = true;
    }
  }

  // Normalize URLs to public or internal based on environment
  let cleanEndpoint = endpoint;
  if (typeof window === 'undefined') {
    cleanEndpoint = cleanEndpoint
      .replace(/^https?:\/\/(localhost|127\.0\.0\.1):1337/, STRAPI_INTERNAL_URL)
      .replace(/^https?:\/\/osisstrapi\.biezz\.my\.id/, STRAPI_INTERNAL_URL);
  } else {
    cleanEndpoint = cleanEndpoint
      .replace(/^https?:\/\/(localhost|127\.0\.0\.1):1337/, STRAPI_URL)
      .replace(/^http:\/\/osisstrapi\.biezz\.my\.id/, 'https://osisstrapi.biezz.my.id');
  }

  const baseURL = typeof window === 'undefined' ? STRAPI_INTERNAL_URL : STRAPI_URL;
  const urlString = cleanEndpoint.startsWith('http')
    ? cleanEndpoint
    : `${baseURL}${cleanEndpoint.startsWith('/') ? '' : '/'}${cleanEndpoint}`;

  let finalUrl = urlString;
  if (isDraftMode && !finalUrl.includes('status=')) {
    const separator = finalUrl.includes('?') ? '&' : '?';
    finalUrl += `${separator}status=draft`;
  }

  try {
    const defaultCacheOptions = isDraftMode
      ? { cache: 'no-store' as const }
      : { next: { revalidate: 60, tags: ['strapi'] } };

    const signal = options.signal || AbortSignal.timeout(5000);

    const res = await fetch(finalUrl, {
      ...defaultCacheOptions,
      signal,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(isDraftMode ? { 'strapi-encode-source-maps': 'true' } : {}),
        ...options.headers,
      },
    });

    if (!res.ok) {
      if (!(res.status === 404 && options.silent404)) {
        console.warn(`[Strapi API] Request to ${endpoint} returned status ${res.status}`);
      }
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn(`[Strapi API Error] Failed to fetch ${endpoint}:`, error);
    return null;
  }
}

/**
 * Fetch a single Media Asset by its unique key
 */
export async function fetchMediaAssetByKey(
  key: string,
  fallbackUrl: string
): Promise<{ src: string; title: string; tipeMedia: string }> {
  const json: any = await fetchStrapiAPI(`/api/media-assets?filters[key][$eq]=${key}&fields[0]=judul&fields[1]=tipe_media&populate[file][fields][0]=url`);
  const items = json?.data || [];

  if (items.length > 0) {
    const item = items[0];
    const attrs = item.attributes || item;
    const resolvedUrl = getStrapiMediaUrl(attrs, fallbackUrl);
    return {
      src: resolvedUrl,
      title: attrs.judul || key,
      tipeMedia: attrs.tipe_media || 'foto',
    };
  }

  return { src: fallbackUrl, title: key, tipeMedia: 'foto' };
}

/**
 * Fetch list of Media Assets by Category
 */
export async function fetchMediaAssetsByCategory(
  category: string
): Promise<Array<{ id: number; key: string; src: string; title: string; tipeMedia: string }>> {
  const json: any = await fetchStrapiAPI(
    `/api/media-assets?filters[kategori][\$eq]=${category}&sort=urutan:asc&fields[0]=key&fields[1]=judul&fields[2]=tipe_media&populate[file][fields][0]=url&populate[files][fields][0]=url`
  );
  const items = json?.data || [];

  if (items.length > 0) {
    const results: Array<{ id: number; key: string; src: string; title: string; tipeMedia: string }> = [];

    for (const item of items) {
      const attrs = item.attributes || item;
      const multiFiles = attrs.files?.data || attrs.files;

      // 1. Handle multi-image entry: extract all images from 'files'
      if (Array.isArray(multiFiles) && multiFiles.length > 0) {
        multiFiles.forEach((fileItem: any, idx: number) => {
          const fileAttrs = fileItem.attributes || fileItem;
          const url = getStrapiMediaUrl(fileAttrs, '');
          if (url) {
            results.push({
              id: item.id * 1000 + idx,
              key: `${attrs.key}-${idx + 1}`,
              src: url,
              title: attrs.judul ? `${attrs.judul} (${idx + 1})` : attrs.key,
              tipeMedia: attrs.tipe_media || 'foto',
            });
          }
        });
      }

      // 2. Handle single-image entry: fallback or standalone 'file'
      const singleSrc = getStrapiMediaUrl(attrs, '');
      if (singleSrc && (!Array.isArray(multiFiles) || multiFiles.length === 0)) {
        results.push({
          id: item.id,
          key: attrs.key,
          src: singleSrc,
          title: attrs.judul || attrs.key,
          tipeMedia: attrs.tipe_media || 'foto',
        });
      }
    }

    return results;
  }

  return [];
}

/**
 * Fetch Sekbid and its Program Kerja list from Strapi API
 */
export async function fetchSekbidFromStrapi(sekbidIdOrNumber: string | number) {
  const isNumber = !isNaN(Number(sekbidIdOrNumber));
  const filterQuery = isNumber
    ? `filters[nomor][$eq]=${sekbidIdOrNumber}`
    : `filters[slug][$eq]=${sekbidIdOrNumber}`;

  let json: any = await fetchStrapiAPI(`/api/sekbids?${filterQuery}&populate[program_kerjas][fields][0]=judul&populate[program_kerjas][fields][1]=tujuan&populate[program_kerjas][fields][2]=slug&populate[program_kerjas][fields][3]=kategori`);
  if (!json || json?.error) {
    json = await fetchStrapiAPI(`/api/sekbids?${filterQuery}&fields[0]=judul&fields[1]=deskripsi&populate[program_kerjas][fields][0]=judul&populate[program_kerjas][fields][1]=slug&populate[program_kerjas][fields][2]=kategori`);
  }
  const items = json?.data || [];

  if (items.length > 0) {
    return items[0];
  }

  return null;
}

/**
 * Fetch Program Kerja detail by slug from Strapi API
 */
export async function fetchProgramKerjaFromStrapi(slug: string) {
  let json: any = await fetchStrapiAPI(
    `/api/program-kerjas?filters[slug][$eq]=${slug}` +
    `&populate[dokumentasi][fields][0]=url` +
    `&populate[dokumentasi][fields][1]=caption` +
    `&populate[dokumentasi][fields][2]=alternativeText` +
    `&populate[banner_image]=true` +
    `&populate[ketua_foto]=true` +
    `&populate[tujuan_detail]=true` +
    `&populate[sekbid][fields][0]=judul` +
    `&populate[penanggung_jawab][populate][foto][fields][0]=url` +
    `&populate[penanggung_jawab][fields][0]=nama_lengkap` +
    `&populate[penanggung_jawab][fields][1]=jabatan`
  );

  if (!json || json?.error) {
    json = await fetchStrapiAPI(`/api/program-kerjas?filters[slug][$eq]=${slug}&fields[0]=judul&fields[1]=deskripsi&populate[dokumentasi][fields][0]=url`);
  }

  const items = json?.data || [];

  if (items.length > 0) {
    return items[0];
  }

  return null;
}


/**
 * Fetch Page (Halaman Utama) by slug from Strapi API
 */
export async function fetchHalamanFromStrapi(slug: string) {
  const json: any = await fetchStrapiAPI(`/api/halamans?filters[slug][$eq]=${slug}&populate=*`);
  const items = json?.data || [];

  if (items.length > 0) {
    return items[0];
  }

  return null;
}

/**
 * Fetch BPH / Core Team Members from Strapi API
 */
export async function fetchBPHAnggotaFromStrapi() {
  const json: any = await fetchStrapiAPI(
    '/api/anggota-oses?filters[divisi][$eq]=BPH&sort=urutan:asc&fields[0]=nama_lengkap&fields[1]=jabatan&fields[2]=deskripsi&fields[3]=divisi&populate[foto][fields][0]=url'
  );
  return json?.data || [];
}

/**
 * Fetch Events list from Strapi API
 */
export async function fetchEventsFromStrapi(limit: number = 5) {
  let json: any;
  try {
    json = await fetchStrapiAPI(`/api/events?sort[0]=tanggal_mulai:desc&sort[1]=createdAt:desc&pagination[limit]=${limit}&populate=*`);
  } catch {
    json = await fetchStrapiAPI(`/api/events?sort[0]=createdAt:desc&pagination[limit]=${limit}&populate=*`);
  }
  return json?.data || [];
}

/**
 * Fetch all Events for the /events page
 */
export async function fetchAllEventsForPage() {
  let json: any;
  try {
    json = await fetchStrapiAPI('/api/events?sort[0]=tanggal_mulai:desc&sort[1]=createdAt:desc&pagination[limit]=100&populate=*');
  } catch {
    json = await fetchStrapiAPI('/api/events?sort[0]=createdAt:desc&pagination[limit]=100&populate=*');
  }
  return json?.data || [];
}

/**
 * Fetch single Event by slug from Strapi API
 * Supports dual-lookup: matching `slug` or `cta_url` substring
 */
export async function fetchEventBySlug(slug: string) {
  const json: any = await fetchStrapiAPI(
    `/api/events?filters[$or][0][slug][$eq]=${encodeURIComponent(slug)}&filters[$or][1][cta_url][$contains]=${encodeURIComponent(slug)}&populate=*`
  );
  const items = json?.data || [];
  if (items.length > 0) {
    return items[0];
  }
  return null;
}

/**
 * Fetch all active OSIS members from Strapi API
 */
export async function fetchAllAnggotaFromStrapi() {
  const json: any = await fetchStrapiAPI(
    '/api/anggota-oses?filters[status_aktif][$eq]=aktif&pagination[limit]=200&sort[0]=urutan:asc&sort[1]=id:asc&fields[0]=nama_lengkap&fields[1]=jabatan&fields[2]=deskripsi&fields[3]=divisi&populate[foto][fields][0]=url'
  );
  return json?.data || [];
}

/**
 * Fetch all Sekbids from Strapi API
 */
export async function fetchAllSekbidsFromStrapi() {
  const json: any = await fetchStrapiAPI(
    '/api/sekbids?sort=nomor:asc&populate=*'
  );
  return json?.data || [];
}

/**
 * Fetch Background Texture Configuration from Strapi API
 */
export async function fetchBgTextureConfig(): Promise<{
  enabled: boolean;
  variant: any;
  opacity: number;
  custom_bg_texture_url?: string;
  applied_routes: string;
} | null> {
  const json: any = await fetchStrapiAPI('/api/bg-texture-config?fields[0]=enabled&fields[1]=variant&fields[2]=opacity&fields[3]=applied_routes&populate[custom_bg_texture][fields][0]=url', { silent404: true });
  const data = json?.data;
  if (!data) return null;

  const attrs = data.attributes || data;
  const customBg = attrs.custom_bg_texture;
  const customUrl = customBg ? getStrapiMediaUrl(customBg, '') : undefined;

  return {
    enabled: attrs.enabled !== false,
    variant: attrs.variant || 'subtle-noise',
    opacity: typeof attrs.opacity === 'number' ? attrs.opacity : 0.5,
    custom_bg_texture_url: customUrl || undefined,
    applied_routes: attrs.applied_routes || '/*',
  };
}

/**
 * Fetch all Galeri Foto from Strapi API
 */
export async function fetchGaleriFotoFromStrapi() {
  const json: any = await fetchStrapiAPI(
    '/api/galeri-fotos?sort[0]=tanggal:desc&sort[1]=createdAt:desc&pagination[limit]=100&fields[0]=judul&fields[1]=deskripsi&fields[2]=tanggal&fields[3]=kategori&populate[foto][fields][0]=url&populate[foto][fields][1]=width&populate[foto][fields][2]=height&populate[foto][fields][3]=formats'
  );
  return json?.data || [];
}

export interface TeamMember {
  role: string;
  name: string;
  image: string;
  description: string;
  imageAlt?: string;
  objectPosition?: string;
}

export function formatBPHMembers(strapiMembers: any[]): TeamMember[] {
  if (!strapiMembers || !Array.isArray(strapiMembers)) return [];
  return strapiMembers.map((item: any) => {
    const attrs = item.attributes || item;
    const imgUrl = getStrapiMediaUrl(attrs.foto, '', 'medium');
    return {
      role: attrs.jabatan || 'PENGURUS OSIS',
      name: attrs.nama_lengkap || '',
      image: imgUrl,
      description: attrs.deskripsi || '',
      imageAlt: `${attrs.nama_lengkap} - ${attrs.jabatan}`,
      objectPosition: 'center 20%'
    };
  });
}

export interface SeksiBidang {
  id: number;
  number: string;
  name: string;
  description: string;
  image: string;
  highlightType: string;
  highlightTitle: string;
  highlightDesc: string;
  link: string;
}

export function formatSekbidList(items: any[]): SeksiBidang[] {
  if (!items || !Array.isArray(items)) return [];
  return items.map((item: any) => {
    const attrs = item.attributes || item;
    const num = attrs.nomor || item.id;
    const bannerUrl = getStrapiMediaUrl(attrs.banner || attrs.gambar, '');
    const prokers = attrs.program_kerjas?.data || attrs.program_kerjas || [];
    const firstProker = prokers.length > 0 ? (prokers[0].attributes || prokers[0]) : null;

    // Tentukan label highlight dengan hirarki: highlight_label -> highlight_type (upper) -> fallback berdasarkan nomor
    let label = attrs.highlight_label;
    if (!label && attrs.highlight_type && attrs.highlight_type !== 'none') {
      label = attrs.highlight_type.toUpperCase();
    }
    if (!label) {
      label = num === 1 || num === 8 ? 'TERPOPULER' : 'SHOWCASE';
    }

    return {
      id: item.id,
      number: `Seksi Bidang ${num}`,
      name: attrs.judul || attrs.nama || `Sekbid ${num}`,
      description: attrs.deskripsi || attrs.visi || '',
      image: bannerUrl,
      highlightType: label,
      highlightTitle: attrs.highlight_title || (firstProker ? firstProker.judul : 'Program Utama'),
      highlightDesc: attrs.highlight_desc || (firstProker ? (firstProker.tujuan || firstProker.deskripsi || '') : 'Program kerja unggulan.'),
      link: `/sekbid/sekbid-${num}`,
    };
  });
}

/**
 * Fetch all Program Kerja slugs and updatedAt timestamps for sitemap generation
 */
export async function fetchAllProgramKerjaForSitemap(): Promise<Array<{ slug: string; updatedAt: string }>> {
  const json: any = await fetchStrapiAPI('/api/program-kerjas?fields[0]=slug&fields[1]=updatedAt&pagination[limit]=500');
  const items = json?.data || [];
  return items.map((item: any) => {
    const attrs = item.attributes || item;
    return {
      slug: attrs.slug,
      updatedAt: attrs.updatedAt || new Date().toISOString(),
    };
  });
}

export interface PartnerData {
  id: number;
  nama: string;
  role: string;
  github_url: string;
  website_url?: string;
  deskripsi: string;
  avatar_url: string;
  tags?: string[];
}

/**
 * Fetch active Partners list from Strapi API with fallback
 */
export async function fetchPartnersFromStrapi(): Promise<PartnerData[]> {
  const json: any = await fetchStrapiAPI(
    '/api/partners?filters[is_active][$eq]=true&sort=urutan:asc&populate[avatar][fields][0]=url'
  );
  const items = json?.data || [];

  if (items.length > 0) {
    return items.map((item: any) => {
      const attrs = item.attributes || item;
      const avatarMedia = attrs.avatar;
      const resolvedAvatar = getStrapiMediaUrl(avatarMedia, attrs.avatar_url || `https://github.com/${attrs.nama}.png`, 'medium');

      return {
        id: item.id,
        nama: attrs.nama || '',
        role: attrs.role || 'Developer Partner',
        github_url: attrs.github_url || `https://github.com/${attrs.nama}`,
        website_url: attrs.website_url || '',
        deskripsi: attrs.deskripsi || '',
        avatar_url: resolvedAvatar,
        tags: attrs.tags || [],
      };
    });
  }

  // Fallback partners data for biezz-2
  return [
    {
      id: 1,
      nama: "biezz-2",
      role: "Lead Systems & Infrastructure Architect",
      github_url: "https://github.com/biezz-2",
      website_url: "https://github.com/biezz-2",
      deskripsi: "Arsitek utama infrastruktur backend, mengelola Strapi CMS, deployment server, serta integrasi sistem terpadu OSIS.",
      avatar_url: "https://github.com/biezz-2.png",
      tags: ["Lead Developer", "Strapi CMS", "Backend", "DevOps"]
    }
  ];
}

export interface NavbarConfig {
  brand_name?: string;
  brand_name_mobile?: string;
  logo_url?: string;
  nav_items?: Array<{ name: string; path: string }>;
}

export async function fetchNavbarConfigFromStrapi(): Promise<NavbarConfig | null> {
  // Try fetching singleType navbar-config first
  let json: any = await fetchStrapiAPI('/api/navbar-config?populate=*', { silent404: true });
  let item = json?.data;

  // Fallback to halamans collectionType if singleType not found
  if (!item) {
    json = await fetchStrapiAPI('/api/halamans?filters[slug][$eq]=navbar-config&populate=*', { silent404: true });
    item = json?.data?.[0];
  }

  const attrs = item?.attributes || item || {};
  const metadata = attrs.metadata_json || {};
  const logoMedia = attrs.logo || attrs.banner_image;

  return {
    brand_name: attrs.brand_name || attrs.nama_halaman || metadata.brand_name || 'OSIS SMAIT FITHRAH INSANI',
    brand_name_mobile: attrs.brand_name_mobile || metadata.brand_name_mobile || 'OSIS SMAIT FI',
    logo_url: getStrapiMediaUrl(logoMedia, ''),
    nav_items: metadata.nav_items || [
      { name: 'HOME', path: '/' },
      { name: 'ABOUT', path: '/about' },
      { name: 'EVENTS', path: '/events' },
      { name: 'ANGGOTA', path: '/anggota' },
      { name: 'MEDIA SOSIAL', path: '/media-sosial' },
      { name: 'PARTNERS', path: '/partners' }
    ],
  };
}

export interface FooterConfig {
  brand_title: string;
  slogan: string;
  slogan_sub?: string;
  periode: string;
  social_links: Array<{ platform: string; url: string; label: string }>;
  quick_links: Array<{ label: string; href: string }>;
  alamat: string;
  telepon: string;
  email: string;
  copyright_text: string;
}

export async function fetchFooterConfigFromStrapi(): Promise<FooterConfig | null> {
  // Try fetching singleType footer-config first
  let json: any = await fetchStrapiAPI('/api/footer-config?populate=*', { silent404: true });
  let item = json?.data;

  // Fallback to halamans collectionType if singleType not found
  if (!item) {
    json = await fetchStrapiAPI('/api/halamans?filters[slug][$eq]=footer-config&populate=*', { silent404: true });
    item = json?.data?.[0];
  }

  const attrs = item?.attributes || item || {};
  const metadata = attrs.metadata_json || {};

  return {
    brand_title: attrs.brand_title || attrs.nama_halaman || metadata.brand_title || 'OSIS SMAIT FI',
    slogan: attrs.slogan || attrs.sub_judul || metadata.slogan || 'Agora Acta - Dari Gagasan Menuju Aksi, Dari Partisipasi Menuju Kontribusi.',
    slogan_sub: attrs.slogan_sub || metadata.slogan_sub || '2025 - 2026',
    periode: metadata.periode || '2025 - 2026',
    social_links: metadata.social_links || [
      { platform: 'instagram', url: 'https://www.instagram.com/osissmaitfi?igsh=MTRyMW43d2psd3gwaQ==', label: 'Instagram' },
      { platform: 'youtube', url: 'https://www.youtube.com/@osissmaitfithrahinsani9481', label: 'YouTube' },
      { platform: 'tiktok', url: 'https://www.tiktok.com/@osissmaitfi?_r=1&_t=ZS-98SucgDTG2Z', label: 'TikTok' },
      { platform: 'email', url: 'mailto:osissmaitfi@gmail.com', label: 'Email' }
    ],
    quick_links: metadata.quick_links || [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Program Kerja', href: '/program-kerja' },
      { label: 'Portal Mubes', href: '/portal-mubes' },
      { label: 'Social Media', href: '/media-sosial' },
      { label: 'Foto Anggota', href: '/anggota' },
      { label: 'Partners', href: '/partners' }
    ],
    alamat: attrs.alamat || metadata.alamat || 'SMAIT Fithrah Insani, Jl. H. Gofur No. 10 Tanimulya, Ngamprah, Kab. Bandung Barat',
    telepon: attrs.telepon || metadata.telepon || '(022) 87808984',
    email: attrs.email || metadata.email || 'osissmaitfi@gmail.com',
    copyright_text: attrs.copyright_text || metadata.copyright_text || 'OSIS SMAIT Fithrah Insani. All rights reserved.'
  };
}

export * from './mubes-proker';

