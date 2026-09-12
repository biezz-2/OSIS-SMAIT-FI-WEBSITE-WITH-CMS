'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchProgramKerjaFromStrapi, getStrapiMediaUrl } from '@/lib/strapi';
import { useImageQuality } from '@/context/ImageQualityContext';
import { useClerk, useUser } from '@clerk/nextjs';
import MubesLpjSection from '@/components/program-kerja/MubesLpjSection';

export interface ChairPerson {
  name: string;
  role: string;
  image: string;
}

export interface DocumentationMediaItem {
  url: string;
  isVideo: boolean;
  caption?: string;
  alt?: string;
  width?: number;
  height?: number;
  orientation: 'landscape' | 'portrait' | 'square';
}

export interface ProgramDetailProps {
  title: string;
  category: 'Program Rutinan' | 'Program Insidental';
  tujuanDesc: string;
  goals: Array<{ title: string; desc: string }>;
  chairs: ChairPerson[]; // support 1 atau lebih penanggung jawab
  teknisDesc: React.ReactNode;
  evaluasiDesc: string;
  evaluasiUrl?: string;
  tampilkanEvaluasi?: boolean;
  documentationImages: DocumentationMediaItem[];
  bannerImage: string;
  enablePreviewDokumentasi?: boolean;
  modeUkuranFrame?: 'auto' | 'contain' | 'cover' | 'square';
  layoutGridDokumentasi?: 'split_landscape_portrait' | 'grid_3_col' | 'grid_2_col' | 'grid_4_col' | 'grid_1_col' | 'masonry';
}

function extractMediaList(mediaData: any): DocumentationMediaItem[] {
  if (!mediaData) return [];

  let rawList: any[] = [];
  if (Array.isArray(mediaData)) {
    rawList = mediaData;
  } else if (mediaData.data && Array.isArray(mediaData.data)) {
    rawList = mediaData.data;
  } else if (typeof mediaData === 'object') {
    rawList = [mediaData];
  }

  const result: DocumentationMediaItem[] = [];
  for (const doc of rawList) {
    const url = getStrapiMediaUrl(doc, '');
    if (!url || url.trim() === '') continue;
    const attrs = doc?.attributes || doc;
    const mime = attrs?.mime || doc?.mime || '';
    const name = attrs?.name || doc?.name || doc?.url || url;
    const caption = attrs?.caption || doc?.caption || '';
    const alt = attrs?.alternativeText || doc?.alternativeText || attrs?.caption || doc?.caption || '';
    const isVid =
      (typeof mime === 'string' && mime.startsWith('video/')) ||
      /\.(mp4|webm|ogg|mov|m4v|avi|mkv)$/i.test(name) ||
      /\.(mp4|webm|ogg|mov|m4v|avi|mkv)$/i.test(url.split('?')[0]);

    const w = typeof attrs?.width === 'number' ? attrs.width : (typeof doc?.width === 'number' ? doc.width : undefined);
    const h = typeof attrs?.height === 'number' ? attrs.height : (typeof doc?.height === 'number' ? doc.height : undefined);

    let orientation: 'landscape' | 'portrait' | 'square' = 'landscape';
    if (w && h) {
      if (w > h) {
        orientation = 'landscape';
      } else if (h > w) {
        orientation = 'portrait';
      } else {
        orientation = 'square';
      }
    }

    result.push({
      url,
      isVideo: isVid,
      caption: caption || undefined,
      alt: alt || undefined,
      width: w,
      height: h,
      orientation
    });
  }
  return result;
}

function getGridContainerClass(layout?: string): string {
  switch (layout) {
    case 'grid_1_col':
      return 'grid grid-cols-1 gap-6 w-full';
    case 'grid_2_col':
      return 'grid grid-cols-1 md:grid-cols-2 gap-6 w-full';
    case 'grid_4_col':
      return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full';
    case 'masonry':
      return 'columns-1 md:columns-2 lg:columns-3 gap-6 w-full block space-y-6';
    case 'grid_3_col':
      return 'grid grid-cols-1 md:grid-cols-3 gap-6 w-full';
    case 'split_landscape_portrait':
    default:
      return 'w-full';
  }
}

function getFrameContainerClass(mode?: string, isMasonry?: boolean): { frameClass: string; imgClass: string } {
  if (isMasonry) {
    return {
      frameClass: 'relative w-full rounded-[24px] overflow-hidden shadow-sm bg-slate-100 group border border-slate-200 transition-all duration-300 break-inside-avoid mb-6',
      imgClass: 'w-full h-auto object-contain block'
    };
  }

  switch (mode) {
    case 'contain':
      return {
        frameClass: 'relative h-72 md:h-80 rounded-[24px] overflow-hidden shadow-sm bg-slate-900 group border border-slate-800 transition-all duration-300 flex items-center justify-center p-2',
        imgClass: 'w-full h-full object-contain'
      };
    case 'cover':
      return {
        frameClass: 'relative h-64 md:h-72 rounded-[24px] overflow-hidden shadow-sm bg-slate-100 group border border-slate-200 transition-all duration-300',
        imgClass: 'w-full h-full object-cover'
      };
    case 'square':
      return {
        frameClass: 'relative aspect-square rounded-[24px] overflow-hidden shadow-sm bg-slate-100 group border border-slate-200 transition-all duration-300',
        imgClass: 'w-full h-full object-cover'
      };
    case 'auto':
    default:
      return {
        frameClass: 'relative h-auto max-h-[550px] rounded-[24px] overflow-hidden shadow-sm bg-slate-900/5 group border border-slate-200 transition-all duration-300 flex items-center justify-center p-2',
        imgClass: 'w-full h-auto max-h-[520px] object-contain rounded-[20px]'
      };
  }
}

export function formatProgramDetail(strapiData: any): ProgramDetailProps | null {
  if (!strapiData) return null;
  const attrs = strapiData.attributes || strapiData;
  const bannerUrl = getStrapiMediaUrl(attrs.banner_image, '');
  const docImages = extractMediaList(attrs.dokumentasi);

  let goalsList: Array<{ title: string; desc: string }> = [];
  if (attrs.tujuan_detail && Array.isArray(attrs.tujuan_detail) && attrs.tujuan_detail.length > 0) {
    goalsList = attrs.tujuan_detail.map((g: any) => ({
      title: g.title || g.judul || '',
      desc: g.deskripsi || g.desc || '',
    }));
  }

  // Baca ketua_foto[] (multiple media) sebagai sumber foto fallback
  const ketuaFotoList: string[] = (() => {
    const raw = attrs.ketua_foto;
    if (!raw) return [];
    // bisa berupa array langsung (Strapi v5) atau { data: [...] } (Strapi v4)
    const arr = Array.isArray(raw) ? raw : (raw?.data ? raw.data : (raw ? [raw] : []));
    return arr.map((f: any) => getStrapiMediaUrl(f, '')).filter(Boolean);
  })();

  // Baca penanggung_jawab[] (multiple relation ke anggota-osis)
  const chairs: ChairPerson[] = (() => {
    const raw = attrs.penanggung_jawab;
    if (!raw) return [];
    const arr = Array.isArray(raw) ? raw : (raw?.data ? raw.data : (raw ? [raw] : []));
    return arr.map((item: any, idx: number) => {
      const a = item.attributes || item;
      // foto: dari relasi anggota dulu, fallback ke ketua_foto[idx], fallback kosong
      const foto = getStrapiMediaUrl(a.foto, '') || ketuaFotoList[idx] || '';
      return {
        name: a.nama_lengkap || a.nama || 'Pengurus OSIS',
        role: attrs.ketua_jabatan || a.jabatan || 'Penanggung Jawab Program',
        image: foto,
      };
    });
  })();

  // Fallback: jika tidak ada relasi penanggung_jawab, gunakan ketua_foto[] saja
  const finalChairs: ChairPerson[] = chairs.length > 0
    ? chairs
    : ketuaFotoList.map((fotoUrl, idx) => ({
      name: 'Pengurus OSIS',
      role: attrs.ketua_jabatan || 'Penanggung Jawab Program',
      image: fotoUrl,
    }));

  // Jika tidak ada sama sekali, tetap tampilkan 1 placeholder
  if (finalChairs.length === 0) {
    finalChairs.push({
      name: 'Pengurus OSIS',
      role: attrs.ketua_jabatan || 'Penanggung Jawab Program',
      image: '',
    });
  }

  const isPreviewEnabled = attrs.enable_preview_dokumentasi === false ? false : true;
  const isEvaluasiEnabled = attrs.tampilkan_evaluasi === false ? false : true;

  return {
    title: attrs.judul || '',
    category: attrs.kategori === 'insidental' ? 'Program Insidental' : 'Program Rutinan',
    tujuanDesc: attrs.tujuan || '',
    goals: goalsList,
    chairs: finalChairs,
    teknisDesc: attrs.teknis_pelaksanaan ? <>{attrs.teknis_pelaksanaan}</> : '',
    evaluasiDesc: attrs.evaluasi_deskripsi || '',
    evaluasiUrl: attrs.evaluasi_form_url || '',
    tampilkanEvaluasi: isEvaluasiEnabled,
    bannerImage: bannerUrl,
    documentationImages: docImages,
    enablePreviewDokumentasi: isPreviewEnabled,
    modeUkuranFrame: attrs.mode_ukuran_frame || 'auto',
    layoutGridDokumentasi: attrs.layout_grid_dokumentasi || 'split_landscape_portrait',
  };
}

export default function ProgramKerjaDetailPage({ slug, initialData }: { slug: string; initialData?: any }) {
  const [detail, setDetail] = useState<ProgramDetailProps | null>(() => {
    return initialData ? formatProgramDetail(initialData) : null;
  });
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; isVideo: boolean; caption?: string } | null>(null);
  const { getOptimizedImageUrl } = useImageQuality();

  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const [mubesPayload, setMubesPayload] = useState<{ allowed: boolean; role: string | null; lpj: any } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMedia(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        e.preventDefault();
        openSignIn();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSignIn]);

  useEffect(() => {
    if (!isSignedIn || !slug) {
      setMubesPayload(null);
      return;
    }

    let isMounted = true;
    async function fetchMubesLpj() {
      try {
        const res = await fetch(`/api/mubes/lpj/${encodeURIComponent(slug)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.allowed && data?.lpj) {
            setMubesPayload(data);
          }
        }
      } catch (err) {
        console.error('[MUBES In-place Overlay] Fetch failed:', err);
      }
    }

    fetchMubesLpj();
    return () => {
      isMounted = false;
    };
  }, [isSignedIn, slug]);

  useEffect(() => {
    if (initialData) {
      setDetail(formatProgramDetail(initialData));
      setLoading(false);
      return;
    }

    async function loadFromStrapi() {
      setLoading(true);
      const strapiData = await fetchProgramKerjaFromStrapi(slug);
      if (strapiData) {
        setDetail(formatProgramDetail(strapiData));
      }
      setLoading(false);
    }

    if (slug) {
      loadFromStrapi();
    }
  }, [slug, initialData]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex flex-col font-sans justify-center items-center">
        <Navbar />
        <div className="py-24 animate-pulse text-slate-400 text-base font-medium">
          Memuat rincian program kerja...
        </div>
        <Footer />
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="min-h-screen bg-white flex flex-col font-sans justify-center items-center">
        <Navbar />
        <div className="py-24 text-slate-500 text-base font-medium">
          Program kerja tidak ditemukan atau belum dipublikasi di Strapi.
        </div>
        <Footer />
      </main>
    );
  }

  const isSplitLayout = detail.layoutGridDokumentasi === 'split_landscape_portrait';
  const isMasonry = detail.layoutGridDokumentasi === 'masonry';
  const gridContainerClass = getGridContainerClass(detail.layoutGridDokumentasi);

  const landscapeDocs = detail.documentationImages.filter(item => item.orientation === 'landscape' || item.orientation === 'square');
  const portraitDocs = detail.documentationImages.filter(item => item.orientation === 'portrait');

  const renderMediaCard = (item: DocumentationMediaItem, index: number, customFrameClass?: string, customImgClass?: string) => {
    const rawUrl = item.url;
    const isVid = item.isVideo;
    const isPreviewActive = detail.enablePreviewDokumentasi !== false;
    const { frameClass, imgClass } = getFrameContainerClass(detail.modeUkuranFrame, isMasonry);
    const optUrl = getOptimizedImageUrl(rawUrl);
    const captionText = item.caption || item.alt;

    const resolvedFrame = customFrameClass || frameClass;
    const resolvedImg = customImgClass || imgClass;

    return (
      <div key={`${item.url}-${index}`} className="flex flex-col gap-3 group w-full">
        <div
          onClick={() => {
            if (isPreviewActive) {
              setSelectedMedia({ url: rawUrl, isVideo: isVid, caption: captionText });
            }
          }}
          className={`${resolvedFrame} ${isPreviewActive ? 'cursor-pointer' : ''}`}
        >
          {isVid ? (
            <video
              src={rawUrl}
              controls
              className={resolvedImg}
            />
          ) : (
            <img
              src={optUrl}
              alt={captionText || `Dokumentasi ${index + 1}`}
              className={resolvedImg}
            />
          )}
        </div>
        {captionText && (
          <div className="bg-white rounded-[20px] border border-slate-100 p-4 shadow-xs transition-all duration-200 group-hover:border-slate-200">
            <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
              {captionText}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative w-full h-[380px] md:h-[480px] flex items-center justify-center overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A]">
        {detail.bannerImage ? (
          <>
            <img
              src={getOptimizedImageUrl(detail.bannerImage)}
              alt={detail.title}
              className="absolute inset-0 w-full h-full object-cover filter blur-[2px] scale-105"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
          </>
        ) : (
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px]" />
        )}

        <div className="relative z-10 max-w-4xl px-4 text-center flex flex-col items-center gap-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20 backdrop-blur-md">
            {detail.category}
          </span>
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight drop-shadow-md">
            {detail.title}
          </h1>
        </div>
      </section>

      {/* Section 2: Tujuan Program & Chair Cards */}
      <section className="w-full bg-white py-16 md:py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-16">

          {/* Left: Chair Cards — support 1 atau lebih penanggung jawab */}
          <div className="w-full lg:w-auto flex-shrink-0 flex flex-col gap-4">
            {/* Label */}
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              {detail.chairs.length > 1 ? 'Penanggung Jawab' : 'Penanggung Jawab'}
            </p>

            {/* Row kartu — side by side jika > 1 */}
            <div className={`flex flex-row flex-wrap gap-5 ${detail.chairs.length === 1 ? 'justify-center' : 'justify-start'
              }`}>
              {detail.chairs.map((chair, idx) => (
                <div
                  key={idx}
                  className="relative flex-shrink-0 w-[200px] md:w-[220px] h-[280px] md:h-[300px]"
                >
                  {/* Slight rotation offset per card for visual interest */}
                  <div
                    className="absolute inset-0 bg-[#FACC15] rounded-[24px] shadow-md"
                    style={{ transform: idx % 2 === 0 ? 'rotate(-2.8deg)' : 'rotate(2.8deg)' }}
                  />
                  <div
                    className="relative w-full h-full rounded-[24px] overflow-hidden shadow-xl bg-slate-900 border border-white/20 flex flex-col justify-end"
                    style={{ transform: idx % 2 === 0 ? 'rotate(1.8deg)' : 'rotate(-1.8deg)' }}
                  >
                    {chair.image ? (
                      <img
                        src={getOptimizedImageUrl(chair.image)}
                        alt={chair.name}
                        className="w-full h-full object-cover object-top absolute inset-0"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 p-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-700/60 border border-slate-600 flex items-center justify-center text-yellow-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    {/* Name & Role Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 z-10">
                      <h3 className="text-white text-sm font-bold leading-tight">{chair.name}</h3>
                      <p className="text-gray-300 text-xs font-medium mt-0.5">{chair.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-8">
            <h2 className="text-[#111827] text-3xl md:text-4xl font-bold font-sans text-center lg:text-left">
              Tujuan Program
            </h2>

            <p className="text-[#475569] text-base md:text-lg leading-relaxed text-center lg:text-left max-w-xl">
              {detail.tujuanDesc}
            </p>

            {detail.goals && detail.goals.length > 0 && (
              <div className="w-full flex flex-col gap-4">
                {detail.goals.map((goal, idx) => (
                  <div
                    key={idx}
                    className="w-full p-6 rounded-[24px] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(145,145,145,0.12)] flex items-start gap-4 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 text-blue-600 font-bold">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-[#111827] font-bold text-base md:text-lg">{goal.title}</h4>
                      <p className="text-[#64748B] text-sm md:text-base leading-relaxed">{goal.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Teknis Pelaksanaan Card */}
      {detail.teknisDesc && (
        <section className="w-full bg-white pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="w-full bg-white rounded-[24px] p-8 md:p-12 border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] flex flex-col md:flex-row items-start gap-8">
              <div className="w-16 h-16 rounded-2xl bg-[#DCFCE7] flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-[#16A34A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>

              <div className="flex flex-col gap-4 flex-grow">
                <h3 className="text-[#111827] text-2xl md:text-3xl font-bold font-serif">
                  Teknis Pelaksanaan
                </h3>

                <div className="text-[#475569] text-base leading-relaxed">
                  {detail.teknisDesc}
                </div>

                {detail.tampilkanEvaluasi !== false && Boolean(detail.evaluasiDesc && detail.evaluasiDesc.trim()) && (
                  <p className="text-[#475569] text-base leading-relaxed border-t border-gray-100 pt-4 mt-2">
                    <span className="font-semibold text-slate-900">Evaluasi & Catatan: </span>
                    {detail.evaluasiDesc}
                  </p>
                )}

                {/* MUBES In-place Overlay Section */}
                {mubesPayload?.lpj && (
                  <MubesLpjSection
                    lpj={mubesPayload.lpj}
                    role={mubesPayload.role}
                    onPreviewImage={(url, caption) => setSelectedMedia({ url, isVideo: false, caption })}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Dokumentasi & Hasil */}
      {detail.documentationImages && detail.documentationImages.length > 0 && (
        <section className="w-full bg-white pb-24 px-4">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F1F3F4] flex items-center justify-center text-[#9333EA]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-[#111827] text-2xl md:text-3xl font-bold font-serif">
                Dokumentasi & Hasil
              </h3>
            </div>

            {isSplitLayout ? (
              <div className="w-full flex flex-col gap-10">
                {landscapeDocs.length > 0 && portraitDocs.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
                    {/* Sisi Kiri: Foto Landscape / Horizontal */}
                    <div className="lg:col-span-7 flex flex-col gap-5 w-full">
                      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                        <span className="w-3 h-3 rounded-full bg-blue-500 shadow-xs" />
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                          Foto Landscape / Horizontal
                        </h4>
                        <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {landscapeDocs.length} Media
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                        {landscapeDocs.map((item, index) =>
                          renderMediaCard(
                            item,
                            index,
                            'relative aspect-[16/10] rounded-[24px] overflow-hidden shadow-xs bg-slate-100 group border border-slate-200 transition-all duration-300 flex items-center justify-center',
                            'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                          )
                        )}
                      </div>
                    </div>

                    {/* Sisi Kanan: Foto Portrait / Vertikal */}
                    <div className="lg:col-span-5 flex flex-col gap-5 w-full">
                      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" />
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                          Foto Portrait / Vertikal & Poster
                        </h4>
                        <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {portraitDocs.length} Media
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 w-full">
                        {portraitDocs.map((item, index) =>
                          renderMediaCard(
                            item,
                            index,
                            'relative aspect-[3/4] rounded-[24px] overflow-hidden shadow-xs bg-slate-100 group border border-slate-200 transition-all duration-300 flex items-center justify-center',
                            'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : landscapeDocs.length > 0 ? (
                  /* Fallback: Hanya Foto Landscape */
                  <div className="flex flex-col gap-5 w-full">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                      <span className="w-3 h-3 rounded-full bg-blue-500 shadow-xs" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                        Foto Landscape / Horizontal
                      </h4>
                      <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {landscapeDocs.length} Media
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                      {landscapeDocs.map((item, index) =>
                        renderMediaCard(
                          item,
                          index,
                          'relative aspect-[16/10] rounded-[24px] overflow-hidden shadow-xs bg-slate-100 group border border-slate-200 transition-all duration-300 flex items-center justify-center',
                          'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  /* Fallback: Hanya Foto Portrait */
                  <div className="flex flex-col gap-5 w-full">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                        Foto Portrait / Vertikal & Poster
                      </h4>
                      <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {portraitDocs.length} Media
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 w-full">
                      {portraitDocs.map((item, index) =>
                        renderMediaCard(
                          item,
                          index,
                          'relative aspect-[3/4] rounded-[24px] overflow-hidden shadow-xs bg-slate-100 group border border-slate-200 transition-all duration-300 flex items-center justify-center',
                          'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={gridContainerClass}>
                {detail.documentationImages.map((item, index) => renderMediaCard(item, index))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Modal Preview Media */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.isVideo ? (
              <video src={selectedMedia.url} controls autoPlay className="w-full h-auto max-h-[80vh] rounded-2xl" />
            ) : (
              <img src={getOptimizedImageUrl(selectedMedia.url)} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain rounded-2xl" />
            )}
            {selectedMedia.caption && (
              <div className="w-full bg-slate-900/90 text-white text-sm md:text-base px-4 py-3 text-center mt-2 rounded-xl backdrop-blur-sm border border-slate-700/50">
                {selectedMedia.caption}
              </div>
            )}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-3 right-3 text-white bg-black/60 rounded-full p-2 hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
