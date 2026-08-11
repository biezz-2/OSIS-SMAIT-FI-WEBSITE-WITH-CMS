export const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || 'https://osisstrapi.biezz.my.id').replace(/\/$/, '');

/**
 * Resolves a Strapi media object or path into a full absolute URL with fallback.
 */
export function getStrapiMediaUrl(media: any, fallbackUrl: string = ''): string {
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

  // Case 3: Strapi uploaded media object (v4, v5, formats)
  const fileData = media.file || media.url ? media : (media.data?.attributes || media.attributes || media.data);
  const rawUrl = fileData?.url || media?.url || media?.attributes?.url || media?.formats?.medium?.url || media?.formats?.large?.url;

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

// In-memory cache structures for server-side deduplication and short-term query caching
interface ServerCacheEntry {
  data: any;
  timestamp: number;
}
const serverResponseCache = new Map<string, ServerCacheEntry>();
const serverInflightRequests = new Map<string, Promise<any>>();

/**
 * Generic safe fetch helper for Strapi REST API (Client and Server safe)
 */
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
  let urlString = cleanEndpoint.startsWith('http')
    ? cleanEndpoint
    : `${baseURL}${cleanEndpoint.startsWith('/') ? '' : '/'}${cleanEndpoint}`;

  if (isDraftMode && !urlString.includes('status=')) {
    const separator = urlString.includes('?') ? '&' : '?';
    urlString += `${separator}status=draft`;
  }

  const isServer = typeof window === 'undefined';
  const cacheKey = `${urlString}::${isDraftMode}::${options.method || 'GET'}::${JSON.stringify(options.headers || {})}`;

  // Helper fetch function to perform the actual network request
  const performFetch = async () => {
    try {
      const defaultCacheOptions = isDraftMode
        ? { cache: 'no-store' as const }
        : { next: { revalidate: 60 } };

      const signal = options.signal || AbortSignal.timeout(5000);

      const res = await fetch(urlString, {
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

      const data = await res.json();
      return data;
    } catch (error) {
      console.warn(`[Strapi API Error] Failed to fetch ${endpoint}:`, error);
      return null;
    }
  };

  // On server, deduplicate active/in-flight requests and query short-term memory cache
  if (isServer && !isDraftMode && (options.method === 'GET' || !options.method)) {
    // 1. Check in-memory cache
    const cached = serverResponseCache.get(cacheKey);
    const now = Date.now();
    if (cached) {
      const cacheDuration = cached.data === null ? 30000 : 60000; // 30s for null/404, 60s for successful responses
      if (now - cached.timestamp < cacheDuration) {
        return cached.data;
      } else {
        serverResponseCache.delete(cacheKey);
      }
    }

    // 2. Check in-flight requests (deduplication)
    const inFlight = serverInflightRequests.get(cacheKey);
    if (inFlight) {
      return inFlight;
    }

    // 3. Initiate request and record in-flight
    const fetchPromise = performFetch().then((result) => {
      serverResponseCache.set(cacheKey, { data: result, timestamp: Date.now() });
      serverInflightRequests.delete(cacheKey);
      return result;
    }).catch((err) => {
      serverResponseCache.set(cacheKey, { data: null, timestamp: Date.now() });
      serverInflightRequests.delete(cacheKey);
      return null;
    });

    serverInflightRequests.set(cacheKey, fetchPromise);
    return fetchPromise;
  }

  // Client-side execution or cache bypass
  return performFetch();
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
  const json: any = await fetchStrapiAPI(`/api/media-assets?filters[kategori][$eq]=${category}&sort=urutan:asc&fields[0]=key&fields[1]=judul&fields[2]=tipe_media&populate[file][fields][0]=url`);
  const items = json?.data || [];

  if (items.length > 0) {
    return items.map((item: any) => {
      const attrs = item.attributes || item;
      return {
        id: item.id,
        key: attrs.key,
        src: getStrapiMediaUrl(attrs, ''),
        title: attrs.judul || attrs.key,
        tipeMedia: attrs.tipe_media || 'foto',
      };
    });
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

  let json: any = await fetchStrapiAPI(`/api/sekbids?${filterQuery}&populate[program_kerjas][fields][0]=judul&populate[program_kerjas][fields][1]=tujuan`);
  if (!json || json?.error) {
    json = await fetchStrapiAPI(`/api/sekbids?${filterQuery}&fields[0]=judul&fields[1]=deskripsi&populate[program_kerjas][fields][0]=judul`);
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
    `&populate[dokumentasi]=true` +
    `&populate[banner_image]=true` +
    `&populate[ketua_foto]=true` +
    `&populate[tujuan_detail]=true` +
    `&populate[sekbid][fields][0]=judul` +
    `&populate[penanggung_jawab][fields][0]=nama_lengkap`
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
  const json: any = await fetchStrapiAPI(`/api/events?sort=tanggal_mulai:desc&pagination[limit]=${limit}&fields[0]=judul&fields[1]=tanggal_mulai&fields[2]=deskripsi&populate[image][fields][0]=url`);
  return json?.data || [];
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
    '/api/sekbids?sort=nomor:asc&fields[0]=nomor&fields[1]=judul&fields[2]=deskripsi&fields[3]=visi&populate[icon][fields][0]=url&populate[banner][fields][0]=url&populate[program_kerjas][fields][0]=judul&populate[program_kerjas][fields][1]=tujuan'
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
    variant: attrs.variant || 'fabric-of-squares',
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
    '/api/galeri-fotos?sort=createdAt:desc&pagination[limit]=100&fields[0]=judul&fields[1]=deskripsi&populate[foto][fields][0]=url&populate[foto][fields][1]=width&populate[foto][fields][2]=height'
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
    const imgUrl = getStrapiMediaUrl(attrs.foto, '');
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
  highlightType: 'SHOWCASE' | 'TERPOPULER';
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

    return {
      id: item.id,
      number: `Seksi Bidang ${num}`,
      name: attrs.judul || attrs.nama || `Sekbid ${num}`,
      description: attrs.deskripsi || attrs.visi || '',
      image: bannerUrl,
      highlightType: num === 1 || num === 8 ? 'TERPOPULER' : 'SHOWCASE',
      highlightTitle: firstProker ? firstProker.judul : 'Program Utama',
      highlightDesc: firstProker ? (firstProker.tujuan || firstProker.deskripsi || '') : 'Program kerja unggulan.',
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
