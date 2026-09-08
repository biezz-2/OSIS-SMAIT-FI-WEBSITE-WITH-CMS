import { fetchStrapiAPI, getStrapiMediaUrl } from './strapi';

export interface MubesLpjData {
  id?: number | string;
  documentId?: string;
  realisasi_anggaran?: number | string;
  sumber_dana?: string;
  evaluasi_internal?: string;
  kendala_solusi?: Array<{ kendala?: string; solusi?: string }> | string;
  nota_kwitansi?: any[];
  status_pengesahan?: 'draft' | 'ditinjau' | 'disahkan';
}

export interface MubesProgramKerja {
  id: number | string;
  documentId?: string;
  judul: string;
  slug: string;
  kategori: 'rutin' | 'insidental';
  tujuan?: string;
  golongan_target?: string;
  teknis_pelaksanaan?: string;
  evaluasi_form_url?: string;
  evaluasi_deskripsi?: string;
  lokasi?: string;
  status?: string;
  banner_image?: any;
  dokumentasi?: any[];
  sekbid_nomor?: number;
  sekbid_judul?: string;
  sekbid_nama?: string;
  penanggung_jawab?: Array<{
    nama_lengkap?: string;
    jabatan?: string;
  }>;
  lpj?: MubesLpjData | null;
}

export interface MubesSekbidGroup {
  nomor: number;
  judul: string;
  deskripsi?: string;
  prokerList: MubesProgramKerja[];
}

const DEFAULT_SEKBIDS_META: Record<number, { judul: string; deskripsi: string }> = {
  1: { judul: 'Kerohanian', deskripsi: 'Pembinaan keimanan, ketakwaan, dan ibadah.' },
  2: { judul: 'Kaderisasi', deskripsi: 'Kedisiplinan, kepemimpinan, dan tata tertib.' },
  3: { judul: 'Edukasi', deskripsi: 'Pengembangan potensi akademik dan riset ilmiah.' },
  4: { judul: 'Bahasa', deskripsi: 'Pengembangan literasi, bilingual, dan sastra.' },
  5: { judul: 'Minat & Bakat', deskripsi: 'Wadah apresiasi seni, olahraga, dan kreativitas.' },
  6: { judul: 'Kesehatan & Lingkungan', deskripsi: 'Kebersihan, kelestarian alam, dan kesehatan.' },
  7: { judul: 'Kewirausahaan', deskripsi: 'Kemandirian finansial dan ekonomi kreatif.' },
  8: { judul: 'Kominfo', deskripsi: 'Komunikasi media publikasi, dokumentasi, dan teknologi.' },
};

/**
 * Fetch combined Program Kerja with MUBES LPJ data
 */
export async function fetchMubesProkerData(): Promise<MubesSekbidGroup[]> {
  try {
    const [prokerRes, lpjRes, sekbidRes]: [any, any, any] = await Promise.all([
      fetchStrapiAPI('/api/program-kerjas?populate=*&pagination[limit]=100').catch(() => null),
      fetchStrapiAPI('/api/mubes-lpjs?populate=*&pagination[limit]=100').catch(() => null),
      fetchStrapiAPI('/api/sekbids?populate=*&sort=nomor:asc').catch(() => null),
    ]);

    const prokerData = prokerRes?.data || [];
    const lpjList = lpjRes?.data || [];
    const sekbidList = sekbidRes?.data || [];

    // Map LPJ by program_kerja ID or slug
    const lpjByProkerId = new Map<string, MubesLpjData>();
    lpjList.forEach((item: any) => {
      const attrs = item.attributes || item;
      const pkRel = attrs.program_kerja?.data || attrs.program_kerja;
      if (pkRel) {
        const pkId = String(pkRel.id || pkRel.documentId || '');
        const pkSlug = pkRel.attributes?.slug || pkRel.slug;
        const lpjPayload: MubesLpjData = {
          id: item.id,
          documentId: item.documentId,
          realisasi_anggaran: attrs.realisasi_anggaran,
          sumber_dana: attrs.sumber_dana,
          evaluasi_internal: attrs.evaluasi_internal,
          kendala_solusi: attrs.kendala_solusi,
          nota_kwitansi: attrs.nota_kwitansi?.data || attrs.nota_kwitansi || [],
          status_pengesahan: attrs.status_pengesahan || 'draft',
        };
        if (pkId) lpjByProkerId.set(pkId, lpjPayload);
        if (pkSlug) lpjByProkerId.set(pkSlug, lpjPayload);
      }
    });

    // Group prokers by sekbid 1-8
    const groupedMap: Record<number, MubesProgramKerja[]> = {
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: []
    };

    prokerData.forEach((item: any) => {
      const attrs = item.attributes || item;
      const sekbidRel = attrs.sekbid?.data || attrs.sekbid;
      let sekbidNum = 1;
      let sekbidJudul = 'Kerohanian';

      if (Array.isArray(sekbidRel) && sekbidRel.length > 0) {
        const s = sekbidRel[0].attributes || sekbidRel[0];
        sekbidNum = s.nomor || 1;
        sekbidJudul = s.judul || DEFAULT_SEKBIDS_META[sekbidNum]?.judul || '';
      } else if (sekbidRel && typeof sekbidRel === 'object') {
        const s = sekbidRel.attributes || sekbidRel;
        sekbidNum = s.nomor || 1;
        sekbidJudul = s.judul || DEFAULT_SEKBIDS_META[sekbidNum]?.judul || '';
      }

      if (!groupedMap[sekbidNum]) {
        groupedMap[sekbidNum] = [];
      }

      const pId = String(item.id || item.documentId);
      const pSlug = attrs.slug || '';
      const matchedLpj = lpjByProkerId.get(pId) || (pSlug ? lpjByProkerId.get(pSlug) : null) || null;

      // Extract penanggung jawab
      const pjList: Array<{ nama_lengkap?: string; jabatan?: string }> = [];
      const rawPj = attrs.penanggung_jawab?.data || attrs.penanggung_jawab;
      if (Array.isArray(rawPj)) {
        rawPj.forEach((p: any) => {
          const pAttr = p.attributes || p;
          pjList.push({
            nama_lengkap: pAttr.nama_lengkap || pAttr.nama,
            jabatan: pAttr.jabatan,
          });
        });
      }

      const prokerItem: MubesProgramKerja = {
        id: item.id,
        documentId: item.documentId,
        judul: attrs.judul,
        slug: attrs.slug || `proker-${item.id}`,
        kategori: attrs.kategori || 'rutin',
        tujuan: attrs.tujuan,
        golongan_target: attrs.golongan_target,
        teknis_pelaksanaan: attrs.teknis_pelaksanaan || attrs.deskripsi || 'Sesuai dengan SOP dan petunjuk teknis sekbid.',
        evaluasi_form_url: attrs.evaluasi_form_url,
        evaluasi_deskripsi: attrs.evaluasi_deskripsi,
        lokasi: attrs.lokasi || 'SMAIT Fithrah Insani',
        status: attrs.status || 'published',
        banner_image: attrs.banner_image,
        dokumentasi: attrs.dokumentasi?.data || attrs.dokumentasi || [],
        sekbid_nomor: sekbidNum,
        sekbid_judul: sekbidJudul,
        penanggung_jawab: pjList,
        lpj: matchedLpj,
      };

      groupedMap[sekbidNum].push(prokerItem);
    });

    // Build final Sekbid groups
    const result: MubesSekbidGroup[] = [];
    for (let num = 1; num <= 8; num++) {
      const matchedSekbid = sekbidList.find((s: any) => {
        const sAttr = s.attributes || s;
        return sAttr.nomor === num;
      });
      const sAttr = matchedSekbid?.attributes || matchedSekbid;
      result.push({
        nomor: num,
        judul: sAttr?.judul || DEFAULT_SEKBIDS_META[num].judul,
        deskripsi: sAttr?.deskripsi || DEFAULT_SEKBIDS_META[num].deskripsi,
        prokerList: groupedMap[num] || [],
      });
    }

    return result;
  } catch (err) {
    console.error('Failed to fetch Mubes Proker data:', err);
    // Return empty fallback groups
    return [1, 2, 3, 4, 5, 6, 7, 8].map(num => ({
      nomor: num,
      judul: DEFAULT_SEKBIDS_META[num]?.judul || `Sekbid ${num}`,
      deskripsi: DEFAULT_SEKBIDS_META[num]?.deskripsi || '',
      prokerList: [],
    }));
  }
}
