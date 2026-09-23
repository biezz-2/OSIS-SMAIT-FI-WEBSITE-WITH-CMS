import { fetchStrapiAPI } from "./strapi";

export interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  category: "Navigasi" | "Sekbid" | "Program Kerja" | "Anggota" | "Event" | "MUBES";
  href: string;
  icon?: string;
}

export interface SearchOptions {
  /** Prefer /portal-mubes/proker/* links (when user is on portal MUBES). */
  preferMubes?: boolean;
}

const STATIC_PAGES: SearchResultItem[] = [
  { id: "nav-home", title: "Beranda / Home", description: "Halaman utama OSIS SMAIT Fithrah Insani", category: "Navigasi", href: "/" },
  { id: "nav-about", title: "Tentang OSIS (About)", description: "Profil, visi, misi, dan struktur OSIS", category: "Navigasi", href: "/about" },
  { id: "nav-events", title: "Agenda & Events", description: "Jadwal dan daftar kegiatan OSIS", category: "Navigasi", href: "/events" },
  { id: "nav-sosmed", title: "Media Sosial", description: "Akun media sosial dan informasi publik OSIS", category: "Navigasi", href: "/media-sosial" },
  { id: "nav-anggota", title: "Daftar Anggota OSIS", description: "Daftar pengurus inti dan anggota sekbid", category: "Navigasi", href: "/anggota" },
  { id: "nav-proker", title: "Program Kerja", description: "Daftar seluruh program kerja OSIS", category: "Navigasi", href: "/program-kerja" },
  { id: "nav-galeri", title: "Galeri & Dokumentasi", description: "Dokumentasi foto dan video kegiatan OSIS", category: "Navigasi", href: "/galeri/galeri-preview-infinity" },
  {
    id: "nav-mubes",
    title: "Portal MUBES / Musyawarah Besar",
    description: "Sidang LPJ program kerja, evaluasi sekbid, dan pengesahan ketetapan MUBES XXI",
    category: "MUBES",
    href: "/portal-mubes",
  },
  {
    id: "nav-mubes-sidang",
    title: "Sidang LPJ Program Kerja",
    description: "Presentasi dan dokumen LPJ proker per sekbid di portal MUBES",
    category: "MUBES",
    href: "/portal-mubes",
  },
];

function publicProkerHref(
  sekbidNum: number | string | undefined,
  kategori: string | undefined,
  slug: string | undefined,
  id: string | number
): string {
  const kat = kategori === "insidental" ? "insidental" : "rutinan";
  if (sekbidNum && slug) return `/sekbid/sekbid-${sekbidNum}/${kat}/${slug}`;
  return `/program-kerja/${slug || id}`;
}

function mubesProkerHref(slug: string | undefined, id: string | number): string {
  return `/portal-mubes/proker/${encodeURIComponent(slug || String(id))}`;
}

export async function searchGlobalContent(
  rawQuery: string,
  options: SearchOptions = {}
): Promise<SearchResultItem[]> {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const preferMubes = Boolean(options.preferMubes);

  // 1. Static navigation search
  const staticMatches = STATIC_PAGES.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
  );

  // 2. Strapi dynamic search in parallel
  const encoded = encodeURIComponent(rawQuery.trim());
  const [prokerRes, sekbidRes, anggotaRes, eventRes] = await Promise.all([
    fetchStrapiAPI<any>(
      `/api/program-kerjas?populate[sekbid][fields][0]=nomor&populate[penanggung_jawab][fields][0]=nama_lengkap&pagination[limit]=100`
    ).catch(() => null),
    fetchStrapiAPI<any>(
      `/api/sekbids?filters[$or][0][judul][$containsi]=${encoded}&filters[$or][1][visi][$containsi]=${encoded}&fields[0]=nomor&fields[1]=judul&fields[2]=visi&fields[3]=deskripsi&pagination[limit]=5`
    ).catch(() => null),
    fetchStrapiAPI<any>(
      `/api/anggota-oses?filters[nama_lengkap][$containsi]=${encoded}&fields[0]=nama_lengkap&fields[1]=jabatan&fields[2]=divisi&populate[sekbid][fields][0]=nomor&pagination[limit]=10`
    ).catch(() => null),
    fetchStrapiAPI<any>(
      `/api/events?filters[$or][0][judul][$containsi]=${encoded}&filters[$or][1][deskripsi][$containsi]=${encoded}&fields[0]=judul&fields[1]=deskripsi&fields[2]=tanggal_mulai&fields[3]=lokasi&fields[4]=slug&pagination[limit]=5`
    ).catch(() => null),
  ]);

  // Map to link PJ (Anggota ID or Name) -> Proker Href & Title
  const pjProkerMap = new Map<number | string, { href: string; title: string }>();

  const allProkers: SearchResultItem[] = [];
  (prokerRes?.data || []).forEach((item: any) => {
    const attrs = item.attributes || item;
    const judul = attrs.judul || "";
    const deskripsi = attrs.deskripsi || attrs.tujuan || "";
    const sekbidData = attrs.sekbid?.data || attrs.sekbid;
    const sekbidAttrs = Array.isArray(sekbidData)
      ? (sekbidData[0]?.attributes || sekbidData[0])
      : (sekbidData?.attributes || sekbidData);
    const sekbidNum = sekbidAttrs?.nomor;
    const slug = attrs.slug as string | undefined;
    const pubHref = publicProkerHref(sekbidNum, attrs.kategori, slug, item.id);
    const mubesHref = mubesProkerHref(slug, item.id);
    const href = preferMubes ? mubesHref : pubHref;

    const pjList = attrs.penanggung_jawab?.data || attrs.penanggung_jawab || [];
    const pjArray = Array.isArray(pjList) ? pjList : [pjList];
    const pjNames: string[] = [];

    pjArray.forEach((pj: any) => {
      if (!pj) return;
      const pjId = pj.id;
      const pjAttrs = pj.attributes || pj;
      if (pjAttrs?.nama_lengkap) {
        pjNames.push(pjAttrs.nama_lengkap);
        if (pjId) pjProkerMap.set(pjId, { href, title: judul || "Program Kerja" });
        pjProkerMap.set(pjAttrs.nama_lengkap.toLowerCase(), { href, title: judul || "Program Kerja" });
      }
    });

    const isMatch =
      judul.toLowerCase().includes(query) ||
      deskripsi.toLowerCase().includes(query) ||
      pjNames.some((n) => n.toLowerCase().includes(query)) ||
      (slug && slug.toLowerCase().includes(query)) ||
      (sekbidNum != null && `sekbid ${sekbidNum}`.includes(query));

    if (isMatch) {
      const descParts: string[] = [];
      if (preferMubes) descParts.push("Sidang MUBES");
      if (sekbidNum != null) descParts.push(`Sekbid ${sekbidNum}`);
      if (pjNames.length > 0) descParts.push(`PJ: ${pjNames.join(", ")}`);
      if (deskripsi) descParts.push(deskripsi);

      allProkers.push({
        id: preferMubes ? `mubes-proker-${item.id}` : `proker-${item.id}`,
        title: judul || "Program Kerja",
        description: descParts.join(" · ") || "Program Kerja OSIS",
        category: preferMubes ? "MUBES" : "Program Kerja",
        href,
      });
    }
  });

  const sekbidItems: SearchResultItem[] = (sekbidRes?.data || []).map((item: any) => {
    const attrs = item.attributes || item;
    const num = attrs.nomor || item.id;
    return {
      id: `sekbid-${item.id}`,
      title: attrs.judul || `Seksi Bidang ${num}`,
      description: attrs.visi || attrs.deskripsi || `Sekbid ${num}`,
      category: "Sekbid" as const,
      // Di portal MUBES, sekbid mengarah ke daftar sidang (filter lokal di viewer)
      href: preferMubes ? "/portal-mubes" : `/sekbid/sekbid-${num}`,
    };
  });

  const anggotaItems: SearchResultItem[] = (anggotaRes?.data || []).map((item: any) => {
    const attrs = item.attributes || item;
    const sekbidData = attrs.sekbid?.data || attrs.sekbid;
    const sekbidAttrs = sekbidData?.attributes || sekbidData;
    const sekbidNum = sekbidAttrs?.nomor || (attrs.divisi && attrs.divisi.startsWith("Sekbid_") ? attrs.divisi.replace("Sekbid_", "") : null);

    const matchedProker = pjProkerMap.get(item.id) || (attrs.nama_lengkap ? pjProkerMap.get(attrs.nama_lengkap.toLowerCase()) : null);

    const fallbackHref = attrs.jabatan && attrs.jabatan.toLowerCase().includes("ketua osis")
      ? "/anggota#ketua-osis"
      : sekbidNum
      ? `/anggota#sekbid-${sekbidNum}`
      : attrs.divisi === "BPH"
      ? "/anggota#bph"
      : "/anggota";

    const href = matchedProker ? matchedProker.href : fallbackHref;

    const description = matchedProker
      ? `PJ Proker: ${matchedProker.title} (${attrs.jabatan || "Pengurus"})`
      : `${attrs.jabatan || "Pengurus"} - ${attrs.divisi || "OSIS"}`;

    return {
      id: `anggota-${item.id}`,
      title: attrs.nama_lengkap || "Anggota OSIS",
      description,
      category: "Anggota" as const,
      href,
    };
  });

  const eventItems: SearchResultItem[] = (eventRes?.data || []).map((item: any) => {
    const attrs = item.attributes || item;
    return {
      id: `event-${item.id}`,
      title: attrs.judul || "Event OSIS",
      description: attrs.deskripsi || attrs.lokasi || "Kegiatan OSIS",
      category: "Event" as const,
      href: `/events`,
    };
  });

  // Di portal MUBES: prioritaskan hasil MUBES/proker sidang di atas
  if (preferMubes) {
    return [...staticMatches.filter((s) => s.category === "MUBES"), ...allProkers, ...sekbidItems, ...staticMatches.filter((s) => s.category !== "MUBES"), ...eventItems, ...anggotaItems];
  }

  return [...staticMatches, ...sekbidItems, ...allProkers, ...eventItems, ...anggotaItems];
}
