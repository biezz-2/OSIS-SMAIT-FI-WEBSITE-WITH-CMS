'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMediaUrl } from '@/lib/strapi';
import {
  FileText,
  DollarSign,
  ClipboardCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  Award,
  Clock,
  Sparkles
} from 'lucide-react';

interface MubesProkerFigmaViewProps {
  proker: any;
  lpj: any;
  role: string | null;
  status: string | null;
}

export default function MubesProkerFigmaView({
  proker,
  lpj,
  role,
  status,
}: MubesProkerFigmaViewProps) {
  const pAttrs = proker?.attributes || proker || {};
  const lpjAttrs = lpj?.attributes || lpj || {};

  // Formatter mata uang
  const formatCurrency = (val: number | string | undefined) => {
    if (val === undefined || val === null || val === '') return 'Rp 0';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Banner image resolution
  const bannerUrl = getStrapiMediaUrl(pAttrs.banner_image, '/images/mubes/bg-medieval.png');

  // Ketua foto resolution
  let ketuaFotoUrl = '';
  if (pAttrs.ketua_foto) {
    if (Array.isArray(pAttrs.ketua_foto)) {
      ketuaFotoUrl = getStrapiMediaUrl(pAttrs.ketua_foto[0], '');
    } else if (pAttrs.ketua_foto.data && Array.isArray(pAttrs.ketua_foto.data)) {
      ketuaFotoUrl = getStrapiMediaUrl(pAttrs.ketua_foto.data[0], '');
    } else {
      ketuaFotoUrl = getStrapiMediaUrl(pAttrs.ketua_foto, '');
    }
  }
  if (!ketuaFotoUrl && pAttrs.penanggung_jawab && pAttrs.penanggung_jawab.length > 0) {
    const pj = pAttrs.penanggung_jawab[0];
    ketuaFotoUrl = getStrapiMediaUrl(pj.foto || pj.image, '');
  }
  if (!ketuaFotoUrl) {
    ketuaFotoUrl = '/assets/panitia/Photo-Profile/azzam.png'; // fallback avatar default
  }

  // Dokumentasi images (3 kartu bawah sesuai Figma 1282:2390)
  const rawDocs: any[] = Array.isArray(pAttrs.dokumentasi)
    ? pAttrs.dokumentasi
    : (pAttrs.dokumentasi?.data || []);
  const docImages = rawDocs.slice(0, 3).map((d, idx) => {
    const url = getStrapiMediaUrl(d, '');
    const caption = d?.attributes?.caption || d?.caption || `Dokumentasi Pelaksanaan 0${idx + 1}`;
    const alt = d?.attributes?.alternativeText || d?.alternativeText || caption;
    return { url, caption, alt };
  });

  // Poin-poin tujuan (Tujuan Detail component)
  const goals: Array<{ title: string; desc: string }> = Array.isArray(pAttrs.tujuan_detail)
    ? pAttrs.tujuan_detail.map((g: any) => ({
        title: g.title || 'Sasaran Program',
        desc: g.deskripsi || g.desc || '',
      }))
    : [];

  const kategoriLabel = (pAttrs.kategori || 'rutin').toLowerCase() === 'insidental'
    ? 'Program Insidental'
    : 'Program Rutinan';

  const pjName = pAttrs.penanggung_jawab && pAttrs.penanggung_jawab.length > 0
    ? pAttrs.penanggung_jawab.map((p: any) => p.nama_lengkap || p.name).join(', ')
    : (pAttrs.ketua_nama || 'Pengurus Seksi Bidang');

  const pjLabel = pAttrs.ketua_jabatan || 'Koordinator Pelaksana';

  return (
    <div className="w-full flex flex-col font-sans">
      {/* =========================================================================
          1. HERO SECTION (Figma Node 1282:2361)
          - Background Banner Image dengan Dark Navy Directional Gradient Overlay
          - Breadcrumb Portal Sidang MUBES
          - Badge Kategori & Judul Proker
      ========================================================================= */}
      <section className="relative w-full h-[460px] sm:h-[520px] flex items-end justify-start overflow-hidden bg-[#0A111F]">
        <Image
          src={bannerUrl}
          alt={pAttrs.judul || 'Banner Program Kerja'}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient Overlay Directional (35% -> 85% opacity dark navy) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A111F]/40 via-[#0A111F]/70 to-[#0A111F] z-10" />

        <div className="relative z-20 max-w-6xl w-full mx-auto px-6 sm:px-8 pb-12 sm:pb-16 flex flex-col gap-4">
          {/* Breadcrumb & Sidang Badge */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-amber-300/90">
            <Link
              href="/portal-mubes"
              className="hover:text-amber-200 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Portal MUBES XXI</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300">Detail Pertanggungjawaban</span>
            <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              Akses Sidang Terverifikasi ({role || 'Peserta'})
            </span>
          </div>

          {/* Badge Kategori */}
          <div className="inline-flex items-center self-start px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md">
            {kategoriLabel}
          </div>

          {/* Judul Proker Utama */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-white tracking-tight drop-shadow-md">
            {pAttrs.judul || 'Detail Program Kerja'}
          </h1>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300 mt-1">
            {pAttrs.lokasi && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{pAttrs.lokasi}</span>
              </div>
            )}
            {pAttrs.jadwal_deskripsi && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{pAttrs.jadwal_deskripsi}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>{pjName}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SECTION DOKUMEN LPJ & PERTANGGUNGJAWABAN (Figma Node 1290:5959)
          - Background Warm Ivory (#FDFDFB)
          - Border Stroke Halus (#EAECEF, 1px)
          - Corner Radius 24px
          - Soft Ambient Shadow (radius 36, offset-y 16, alpha 4%)
          - Heading Outfit Bold 24px/32px (#141F2E)
          - Body Plus Jakarta Sans Regular 15px/24px (#596678)
      ========================================================================= */}
      <section className="w-full max-w-6xl mx-auto px-6 sm:px-8 py-12 -mt-8 z-30">
        <div className="w-full bg-[#FDFDFB] rounded-[24px] border border-[#EAECEF] p-8 sm:p-12 shadow-[0_16px_36px_-4px_rgba(13,20,38,0.04)] flex flex-col gap-10">

          {/* Header Bar Section LPJ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAECEF]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">
                  Sidang Komisi Pertanggungjawaban
                </span>
                <h2 className="text-2xl font-bold font-serif text-[#141F2E]">
                  Dokumen Evaluasi & Realisasi Anggaran
                </h2>
              </div>
            </div>

            {/* Status Pengesahan Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EAECEF] text-xs font-semibold text-[#141F2E] shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status Sidang: </span>
              <span className="capitalize text-emerald-700 font-bold">
                {lpjAttrs.status_pengesahan || 'Sedang Ditinjau'}
              </span>
            </div>
          </div>

          {/* Grid Konten LPJ: 2 Kolom (Profil Koordinator & Rincian Sidang) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Kolom Kiri: Kartu Koordinator & Profil (Figma Node 1282:2376 & 1282:2378) */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <div className="relative bg-[#F2C21A] p-6 rounded-[20px] text-slate-950 flex flex-col items-center text-center shadow-md">
                <div className="relative w-32 h-32 rounded-[20px] overflow-hidden bg-slate-900 border-4 border-white shadow-[0_16px_32px_-6px_rgba(13,26,46,0.16)] mb-4">
                  <Image
                    src={ketuaFotoUrl}
                    alt={pjName}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-950 leading-snug">
                  {pjName}
                </h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-800 mt-0.5">
                  {pjLabel}
                </span>
                <div className="w-full mt-4 pt-3 border-t border-black/10 flex items-center justify-around text-xs font-medium text-slate-900">
                  <span>{kategoriLabel}</span>
                  <span>•</span>
                  <span>MUBES XXI</span>
                </div>
              </div>

              {/* Rangkuman Anggaran Proker */}
              <div className="bg-white p-5 rounded-[20px] border border-[#EAECEF] shadow-xs flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Realisasi Anggaran
                </span>
                <div className="text-2xl font-black text-[#141F2E] font-serif">
                  {formatCurrency(lpjAttrs.realisasi_anggaran)}
                </div>
                <div className="text-xs text-[#596678] border-t border-slate-100 pt-2 flex justify-between">
                  <span>Sumber Dana:</span>
                  <span className="font-semibold text-slate-800">{lpjAttrs.sumber_dana || 'Kas OSIS & Sekolah'}</span>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: 8 Point Detail LPJ (Heading 24px/32px, Body 15px/24px) */}
            <div className="lg:col-span-8 flex flex-col gap-8">

              {/* Point 1: Pendahuluan & Latar Belakang */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[24px] leading-[32px] font-bold text-[#141F2E] font-serif">
                  1. Pendahuluan & Gambaran Umum
                </h3>
                <div className="text-[15px] leading-[24px] text-[#596678]">
                  {pAttrs.tujuan || 'Program kerja ini dilaksanakan dalam rangka merealisasikan program pembinaan serta menunjang tujuan organisasi OSIS SMAIT Fithrah Insani.'}
                </div>
              </div>

              {/* Point 2: Sasaran & Target Partisipan */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[24px] leading-[32px] font-bold text-[#141F2E] font-serif">
                  2. Golongan Sasaran & Peserta
                </h3>
                <div className="text-[15px] leading-[24px] text-[#596678]">
                  {pAttrs.golongan_target || 'Seluruh siswa dan siswi SMAIT Fithrah Insani beserta pengurus OSIS.'}
                </div>
              </div>

              {/* Point 3: Rincian Tujuan (Jika ada goals component) */}
              {goals.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-[24px] leading-[32px] font-bold text-[#141F2E] font-serif">
                    3. Capaian Parameter Tujuan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {goals.map((g, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-[#EAECEF] shadow-xs">
                        <div className="text-sm font-bold text-[#141F2E]">{g.title}</div>
                        <div className="text-xs text-[#596678] mt-1 leading-relaxed">{g.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Point 4: Teknis & Pelaksanaan Sidang */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[24px] leading-[32px] font-bold text-[#141F2E] font-serif">
                  4. Teknis Pelaksanaan & Alur
                </h3>
                <div className="text-[15px] leading-[24px] text-[#596678] whitespace-pre-line">
                  {pAttrs.teknis_pelaksanaan || 'Pelaksanaan kegiatan berjalan secara terstruktur dan terkoordinasi sesuai jadwal operasional yang disepakati.'}
                </div>
              </div>

              {/* Point 5: Evaluasi Internal Kepanitiaan (Khusus MUBES) */}
              <div className="flex flex-col gap-2.5 bg-amber-50/50 p-6 rounded-2xl border border-amber-200/60">
                <h3 className="text-[22px] leading-[30px] font-bold text-amber-950 font-serif flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-amber-600" />
                  <span>5. Evaluasi Internal Sidang MUBES</span>
                </h3>
                <div className="text-[15px] leading-[24px] text-amber-900/90 whitespace-pre-line">
                  {lpjAttrs.evaluasi_internal || pAttrs.evaluasi_deskripsi || 'Evaluasi menyeluruh terhadap efisiensi waktu, partisipasi peserta, dan kesesuaian anggaran sidang.'}
                </div>
              </div>

              {/* Point 6: Kendala & Solusi (Jika ada) */}
              {lpjAttrs.kendala_solusi && (
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-[24px] leading-[32px] font-bold text-[#141F2E] font-serif">
                    6. Kendala & Rekomendasi Solusi
                  </h3>
                  <div className="text-[15px] leading-[24px] text-[#596678] bg-white p-5 rounded-2xl border border-[#EAECEF]">
                    {typeof lpjAttrs.kendala_solusi === 'string'
                      ? lpjAttrs.kendala_solusi
                      : JSON.stringify(lpjAttrs.kendala_solusi, null, 2)}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SECTION DOKUMENTASI KEGIATAN (Figma Node 1282:2390)
          - Judul Playfair Display Bold 28px/36px (#141F2E)
          - Grid 3 Card Dokumentasi (#FFFFFF, border #E8EDF2, cornerRadius 16)
          - Elevation Soft Shadow (Y: 8px, blur: 20px, spread: -2px, alpha: 5%)
          - Card Title 16px/24px (#141F2E)
          - Subtitle 13.5px/20px (#6B788A)
      ========================================================================= */}
      <section className="w-full max-w-6xl mx-auto px-6 sm:px-8 pb-24 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[28px] leading-[36px] font-bold font-serif text-[#141F2E]">
              Dokumentasi Pelaksanaan Kegiatan
            </h2>
            <p className="text-sm text-[#6B788A] mt-1">
              Rekam jejak visual hasil kerja proker yang dipresentasikan pada sidang MUBES XXI.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
            {docImages.length} Dokumentasi Terlampir
          </div>
        </div>

        {/* 3 Grid Cards */}
        {docImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {docImages.map((doc, index) => (
              <div
                key={index}
                className="bg-white rounded-[16px] border border-[#E8EDF2] overflow-hidden shadow-[0_8px_20px_-2px_rgba(13,20,38,0.05)] hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Image Frame */}
                <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={doc.url}
                    alt={doc.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Card Text Content */}
                <div className="p-5 flex flex-col gap-1.5">
                  <h4 className="text-[16px] leading-[24px] font-bold text-[#141F2E] group-hover:text-amber-600 transition-colors line-clamp-1">
                    {doc.caption}
                  </h4>
                  <p className="text-[13.5px] leading-[20px] text-[#6B788A] line-clamp-2">
                    {pAttrs.judul} — Dokumentasi autentik pertanggungjawaban kepanitiaan.
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
            <p className="text-sm text-slate-500">
              Belum ada lampiran dokumentasi foto pada program kerja ini di Strapi.
            </p>
          </div>
        )}

        {/* Action Button Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <Link
            href="/portal-mubes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Agenda Sidang</span>
          </Link>
          <div className="text-xs text-slate-400">
            Portal Musyawarah Besar XXI • Dokumen Resmi Internal OSIS
          </div>
        </div>
      </section>
    </div>
  );
}
