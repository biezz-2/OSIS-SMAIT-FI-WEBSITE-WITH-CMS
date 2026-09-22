'use client';

import React, { useState } from 'react';
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
  Sparkles,
  Maximize2,
  X
} from 'lucide-react';

interface MubesProkerFigmaViewProps {
  proker: any;
  lpj: any;
  role: string | null;
  status: string | null;
}

interface ChairPerson {
  name: string;
  role: string;
  image: string;
}

export default function MubesProkerFigmaView({
  proker,
  lpj,
  role,
  status,
}: MubesProkerFigmaViewProps) {
  const pAttrs = proker?.attributes || proker || {};
  const lpjAttrs = lpj?.attributes || lpj || {};

  const [selectedMedia, setSelectedMedia] = useState<{ url: string; caption?: string; alt?: string } | null>(null);

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

  // Baca ketua_foto[] (multiple media) sebagai fallback
  const rawKetuaFoto = pAttrs.ketua_foto;
  const ketuaFotoList: string[] = (() => {
    if (!rawKetuaFoto) return [];
    const arr = Array.isArray(rawKetuaFoto)
      ? rawKetuaFoto
      : (rawKetuaFoto?.data ? rawKetuaFoto.data : [rawKetuaFoto]);
    return arr.map((f: any) => getStrapiMediaUrl(f, '')).filter(Boolean);
  })();

  // Baca penanggung_jawab[] (multiple relation ke anggota-osis)
  const rawPj = pAttrs.penanggung_jawab;
  const chairs: ChairPerson[] = (() => {
    if (!rawPj) return [];
    const arr = Array.isArray(rawPj) ? rawPj : (rawPj?.data ? rawPj.data : [rawPj]);
    return arr.map((item: any, idx: number) => {
      const a = item.attributes || item;
      const fotoRel = a.foto?.data || a.foto;
      const foto = getStrapiMediaUrl(fotoRel, '') || ketuaFotoList[idx] || '';
      return {
        name: a.nama_lengkap || a.nama || 'Pengurus OSIS',
        role: pAttrs.ketua_jabatan || a.jabatan || 'Penanggung Jawab Program',
        image: foto,
      };
    });
  })();

  // Fallback: jika tidak ada relasi penanggung_jawab, gunakan ketua_foto[]
  const finalChairs: ChairPerson[] = chairs.length > 0
    ? chairs
    : ketuaFotoList.map((fotoUrl) => ({
        name: 'Pengurus OSIS',
        role: pAttrs.ketua_jabatan || 'Penanggung Jawab Program',
        image: fotoUrl,
      }));

  // Jika tidak ada data sama sekali, 1 default placeholder
  if (finalChairs.length === 0) {
    finalChairs.push({
      name: pAttrs.ketua_nama || 'Pengurus Seksi Bidang',
      role: pAttrs.ketua_jabatan || 'Penanggung Jawab Program',
      image: '/assets/panitia/Photo-Profile/azzam.png',
    });
  }

  // Dokumentasi images (seluruh media dokumentasi dari Strapi tanpa batasan 3 foto)
  const rawDocs: any[] = Array.isArray(pAttrs.dokumentasi)
    ? pAttrs.dokumentasi
    : (pAttrs.dokumentasi?.data || []);
  const docImages = rawDocs.map((d, idx) => {
    const url = getStrapiMediaUrl(d, '');
    const caption = d?.attributes?.caption || d?.caption || `Dokumentasi Pelaksanaan 0${idx + 1}`;
    const alt = d?.attributes?.alternativeText || d?.alternativeText || caption;
    return { url, caption, alt };
  }).filter((d) => Boolean(d.url));

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

  const pjNamesJoined = finalChairs.map(c => c.name).join(', ');

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
              href="/program-kerja-mubes"
              className="hover:text-amber-200 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Program Kerja [MUBES]</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href="/portal-mubes"
              className="hover:text-amber-200 transition-colors"
            >
              Portal MUBES XXI
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
              <span>{pjNamesJoined}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SECTION DOKUMEN LPJ & PERTANGGUNGJAWABAN (Figma Node 1290:5959)
          - Background Warm Ivory (#FDFDFB)
          - Border Stroke Halus (#EAECEF, 1px)
          - Corner Radius 24px
          - Soft Ambient Shadow
          - Layout Frame Penanggung Jawab Bergaya Website Utama (Rotated Double Cards)
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
                  {lpjAttrs.label_judul_sidang || 'Sidang Komisi Pertanggungjawaban'}
                </span>
                <h2 className="text-2xl font-bold font-serif text-[#141F2E]">
                  {lpjAttrs.label_dokumen_evaluasi || 'Dokumen Evaluasi & Realisasi Anggaran'}
                </h2>
              </div>
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

          {/* Grid Konten LPJ: 2 Kolom (Profil Penanggung Jawab Website Utama Frame & Rincian Sidang) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Kolom Kiri: Kartu Penanggung Jawab (Frame Rotated Card persis Website Utama) */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start gap-6">
              <div className="w-full flex flex-col items-center lg:items-start">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                  {finalChairs.length > 1 ? 'Penanggung Jawab Proker' : 'Penanggung Jawab Proker'}
                </p>

                {/* Container Kartu Foto Penanggung Jawab */}
                <div className={`flex flex-row flex-wrap gap-6 ${finalChairs.length === 1 ? 'justify-center' : 'justify-center lg:justify-start'} w-full`}>
                  {finalChairs.map((chair, idx) => (
                    <div
                      key={idx}
                      className="relative flex-shrink-0 w-[200px] md:w-[220px] h-[280px] md:h-[300px]"
                    >
                      {/* Outer Card Background Kuning (#FACC15) dengan rotasi */}
                      <div
                        className="absolute inset-0 bg-[#FACC15] rounded-[24px] shadow-md transition-transform duration-300"
                        style={{ transform: idx % 2 === 0 ? 'rotate(-2.8deg)' : 'rotate(2.8deg)' }}
                      />
                      {/* Inner Card Konten dengan rotasi berlawanan & frame gambar */}
                      <div
                        className="relative w-full h-full rounded-[24px] overflow-hidden shadow-xl bg-slate-900 border border-white/20 flex flex-col justify-end transition-transform duration-300"
                        style={{ transform: idx % 2 === 0 ? 'rotate(1.8deg)' : 'rotate(-1.8deg)' }}
                      >
                        {chair.image ? (
                          <img
                            src={chair.image}
                            alt={chair.name}
                            className="w-full h-full object-cover object-top absolute inset-0"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 p-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-700/60 border border-slate-600 flex items-center justify-center text-yellow-400">
                              <Users className="w-8 h-8" />
                            </div>
                          </div>
                        )}
                        {/* Overlay Gradien Nama & Jabatan */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-4 z-10">
                          <h3 className="text-white text-sm font-bold leading-tight drop-shadow-sm">{chair.name}</h3>
                          <p className="text-amber-300 text-xs font-medium mt-0.5">{chair.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rangkuman Anggaran Proker */}
              <div className="w-full bg-white p-5 rounded-[20px] border border-[#EAECEF] shadow-xs flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {lpjAttrs.label_total_anggaran || 'Total Realisasi Anggaran'}
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

              {/* Additional Dynamic Sections from Strapi */}
              {Array.isArray(lpjAttrs.additional_sections) && lpjAttrs.additional_sections.map((section: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-2.5">
                  <h3 className="text-[24px] leading-[32px] font-bold text-[#141F2E] font-serif">
                    {idx + 6}. {section.judul || section.attributes?.judul || 'Section Tambahan'}
                  </h3>
                  <div className="text-[15px] leading-[24px] text-[#596678] whitespace-pre-line">
                    {section.isi || section.attributes?.isi || ''}
                  </div>
                </div>
              ))}

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
          - Menampilkan seluruh dokumentasi foto dari Strapi
          - Grid adaptif dan Lightbox Preview saat diklik
      ========================================================================= */}
      <section className="w-full max-w-6xl mx-auto px-6 sm:px-8 pb-24 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[28px] leading-[36px] font-bold font-serif text-[#141F2E]">
              Dokumentasi Pelaksanaan Kegiatan
            </h2>
            <p className="text-sm text-[#6B788A] mt-1">
              Rekam jejak visual hasil kerja proker yang dipresentasikan pada sidang MUBES XXI.
            </p>
          </div>
          <div className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto">
            {docImages.length} Dokumentasi Terlampir
          </div>
        </div>

        {/* Dynamic Grid Cards Dokumentasi */}
        {docImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {docImages.map((doc, index) => (
              <div
                key={index}
                onClick={() => setSelectedMedia(doc)}
                className="bg-white rounded-[16px] border border-[#E8EDF2] overflow-hidden shadow-[0_8px_20px_-2px_rgba(13,20,38,0.05)] hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
              >
                {/* Image Frame */}
                <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                  <img
                    src={doc.url}
                    alt={doc.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="p-5 flex flex-col gap-1.5">
                  <h4 className="text-[16px] leading-[24px] font-bold text-[#141F2E] group-hover:text-amber-600 transition-colors line-clamp-1">
                    {doc.caption}
                  </h4>
                  <p className="text-[13.5px] leading-[20px] text-[#6B788A] line-clamp-2">
                    {pAttrs.judul} — Dokumentasi resmi pertanggungjawaban kepanitiaan.
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

      {/* Modal Lightbox Preview Media */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedMedia.url}
              alt={selectedMedia.alt || 'Dokumentasi'}
              className="w-full h-auto max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            {selectedMedia.caption && (
              <div className="w-full bg-slate-900/90 text-white text-sm md:text-base px-5 py-3 text-center mt-3 rounded-xl backdrop-blur-md border border-slate-700/50">
                {selectedMedia.caption}
              </div>
            )}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-3 right-3 text-white bg-black/60 rounded-full p-2 hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
