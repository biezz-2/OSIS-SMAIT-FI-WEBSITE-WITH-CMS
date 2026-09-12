/**
 * Lifecycles hook for Event Content Type
 * Standardisasi format cta_url: https://osissmaitfi.biezz.my.id/events/[nama-event]
 * Otomatisasi sinkronisasi dua arah antara `slug` dan `cta_url`.
 */

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function syncSlugAndCta(data: any) {
  if (!data) return;

  const baseUrl = 'https://osissmaitfi.biezz.my.id';

  // 1. Jika cta_url diisi (misal: "https://osissmaitfi.biezz.my.id/events/nama-event" atau "/events/nama-event" atau "nama-event")
  if (data.cta_url && typeof data.cta_url === 'string') {
    const rawCta = data.cta_url.trim();

    // Khusus edufest-infinity: biarkan /edufest-infinity/ jika disengaja
    if (rawCta.includes('edufest-infinity') || data.slug === 'edufest-infinity' || data.nama?.toLowerCase().includes('edufest')) {
      if (!data.slug) data.slug = 'edufest-infinity';
      data.cta_url = `${baseUrl}/edufest-infinity/`;
      return;
    }

    // Ekstrak nama event dari cta_url
    // Format yang didukung:
    // - https://osissmaitfi.biezz.my.id/events/:slug
    // - /events/:slug
    // - :slug
    const eventsMatch = rawCta.match(/\/events\/([^\/?#]+)/i);
    let extractedSlug = '';

    if (eventsMatch && eventsMatch[1]) {
      extractedSlug = slugify(eventsMatch[1]);
    } else if (!rawCta.startsWith('http://') && !rawCta.startsWith('https://')) {
      extractedSlug = slugify(rawCta.replace(/^\/+/, ''));
    }

    if (extractedSlug) {
      data.slug = extractedSlug;
      data.cta_url = `${baseUrl}/events/${extractedSlug}`;
      return;
    }
  }

  // 2. Jika cta_url belum ada atau formatnya belum terstandarisasi, tapi slug atau nama ada
  let eventSlug = data.slug ? slugify(data.slug) : (data.nama ? slugify(data.nama) : '');

  if (eventSlug === 'edufest-infinity') {
    data.slug = 'edufest-infinity';
    data.cta_url = `${baseUrl}/edufest-infinity/`;
    return;
  }

  if (eventSlug) {
    data.slug = eventSlug;
    data.cta_url = `${baseUrl}/events/${eventSlug}`;
  }
}

export default {
  beforeCreate(event: any) {
    const { data } = event.params;
    syncSlugAndCta(data);
  },

  beforeUpdate(event: any) {
    const { data } = event.params;
    syncSlugAndCta(data);
  },
};
