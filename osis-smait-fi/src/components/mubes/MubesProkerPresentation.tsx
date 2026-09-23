'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MubesProgramKerja } from '@/lib/mubes-proker';
import { getStrapiMediaUrl } from '@/lib/strapi';
import MubesLpjSection from '@/components/program-kerja/MubesLpjSection';
import {
  FileText,
  DollarSign,
  ClipboardCheck,
  AlertCircle,
  Paperclip,
  X,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';

export type MubesPresentationTab = 'overview' | 'teknis' | 'lpj' | 'evaluasi';

interface MubesProkerPresentationProps {
  proker: MubesProgramKerja;
  /** modal = overlay tab di portal; full = satu halaman scroll /portal-mubes/proker/[slug] */
  variant: 'modal' | 'full';
  role?: string | null;
  onClose?: () => void;
  initialTab?: MubesPresentationTab;
}

function SectionHeading({
  n,
  title,
  icon,
}: {
  n: number;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-slate-100 flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
      <span className="w-8 h-8 rounded-lg bg-amber-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
        {n}
      </span>
      <span className="flex items-center gap-2">
        {icon}
        {title}
      </span>
    </h2>
  );
}

function OverviewBody({ proker }: { proker: MubesProgramKerja }) {
  const docs =
    proker.dokumentasi_items && proker.dokumentasi_items.length > 0
      ? proker.dokumentasi_items
      : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-400 font-semibold block uppercase">Kategori Program</span>
          <span className="text-base font-bold capitalize mt-1 block">{proker.kategori}</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-400 font-semibold block uppercase">Lokasi Pelaksanaan</span>
          <span className="text-base font-bold mt-1 block">{proker.lokasi || 'SMAIT FI'}</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-400 font-semibold block uppercase">Penanggung Jawab</span>
          <span className="text-base font-bold mt-1 block break-words">
            {proker.penanggung_jawab?.map((p) => p.nama_lengkap).join(', ') || 'Pengurus Sekbid'}
          </span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
          Tujuan Program Kerja
        </h4>
        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line break-words bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
          {proker.tujuan || 'Mendukung visi misi kepengurusan OSIS SMAIT Fithrah Insani.'}
        </p>
      </div>

      {docs.length > 0 && (
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
            Dokumentasi Pelaksanaan ({docs.length})
          </h4>
          {/* 2 baris × 4 kolom visible; item ekstra di-scroll horizontal — semua dokumentasi_items Strapi */}
          <div className="overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:thin]">
            <div
              className="grid gap-4 sm:gap-5"
              style={{
                gridTemplateRows: 'repeat(2, auto)',
                gridAutoFlow: 'column',
                gridAutoColumns:
                  'minmax(min(70vw, 240px), calc((100% - 3 * 1.25rem) / 4))',
              }}
            >
              {docs.map((item, i) => (
                <figure
                  key={item.id ?? i}
                  className="flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-sm snap-start min-w-0"
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-900">
                    {item.isVideo ? (
                      <video
                        src={item.url}
                        controls
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={item.url}
                        alt={item.judul}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 70vw, 25vw"
                      />
                    )}
                  </div>
                  <figcaption className="p-3 sm:p-4 flex flex-col gap-1">
                    <h5 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug break-words">
                      {item.judul}
                    </h5>
                    {item.deskripsi ? (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line break-words">
                        {item.deskripsi}
                      </p>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TeknisBody({ proker }: { proker: MubesProgramKerja }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Rincian tahapan pra-acara, pelaksanaan hari-H, alur koordinasi, dan pasca-kegiatan.
      </p>
      <div className="prose dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 leading-relaxed text-sm whitespace-pre-line">
        {proker.teknis_pelaksanaan || (
          <div className="text-slate-400 italic">
            Belum ada dokumen teknis rinci yang diunggah untuk program kerja ini. Pelaksanaan mengacu
            pada TOR Seksi Bidang.
          </div>
        )}
      </div>
    </div>
  );
}

function LpjBody({ proker, role }: { proker: MubesProgramKerja; role: string | null }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-5 rounded-2xl">
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase block">
            Realisasi Anggaran Terpakai
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-2 block">
            {proker.lpj?.realisasi_anggaran
              ? `Rp ${Number(proker.lpj.realisasi_anggaran).toLocaleString('id-ID')}`
              : 'Rp 0 / Swadaya'}
          </span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase block">
            Sumber Pendanaan
          </span>
          <span className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-2 block">
            {proker.lpj?.sumber_dana || 'Kas OSIS / Sekolah'}
          </span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between gap-3">
        <div>
          <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold block uppercase">
            Status Ketetapan Sidang
          </span>
          <span className="text-sm font-bold text-amber-950 dark:text-amber-100 capitalize">
            {proker.lpj?.status_pengesahan || 'Menunggu Pengesahan Presidium'}
          </span>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shrink-0">
          Dokumen Sah
        </span>
      </div>

      {proker.lpj ? <MubesLpjSection lpj={proker.lpj} role={role} /> : null}

      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-amber-500" />
          <span>Lampiran Berkas Nota & Bukti Keuangan</span>
        </h4>
        {proker.lpj?.nota_kwitansi && proker.lpj.nota_kwitansi.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {proker.lpj.nota_kwitansi.map((item: unknown, idx: number) => {
              const notaUrl = getStrapiMediaUrl(item, '');
              if (!notaUrl) return null;
              return (
                <a
                  key={idx}
                  href={notaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition flex items-center gap-3 text-xs"
                >
                  <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="truncate font-medium">Nota_{idx + 1}</span>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
            Tidak ada berkas nota/kwitansi tambahan. Semua rekapan telah tertera dalam buku besar
            bendahara.
          </p>
        )}
      </div>
    </div>
  );
}

function EvaluasiBody({ proker }: { proker: MubesProgramKerja }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
          Evaluasi Internal Sekbid
        </h4>
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm leading-relaxed whitespace-pre-line">
          {proker.lpj?.evaluasi_internal ||
            proker.evaluasi_deskripsi ||
            'Program berjalan sesuai dengan target indikator keberhasilan yang telah ditetapkan.'}
        </div>
      </div>

      {proker.lpj?.kendala_solusi ? (
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
            Kendala Lapangan & Rekomendasi Solusi
          </h4>
          <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-sm leading-relaxed whitespace-pre-line">
            {typeof proker.lpj.kendala_solusi === 'string'
              ? proker.lpj.kendala_solusi
              : Array.isArray(proker.lpj.kendala_solusi)
                ? proker.lpj.kendala_solusi
                    .map(
                      (row: { kendala?: string; solusi?: string }, i: number) =>
                        `${i + 1}. Kendala: ${row.kendala || '—'}\n   Solusi: ${row.solusi || '—'}`
                    )
                    .join('\n\n')
                : JSON.stringify(proker.lpj.kendala_solusi, null, 2)}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProkerBanner({ proker }: { proker: MubesProgramKerja }) {
  const bannerMedia = proker.banner_image || (proker.dokumentasi && proker.dokumentasi[0]);
  const bannerUrl = getStrapiMediaUrl(bannerMedia, '/images/mubes/bg-medieval.png');

  return (
    <div className="relative w-full aspect-[21/9] min-h-[200px] max-h-[420px] bg-slate-900 overflow-hidden">
      <Image
        src={bannerUrl}
        alt={proker.judul}
        fill
        priority
        className="object-cover object-center"
        sizes="(max-width: 1600px) 100vw, 1600px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/20" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end gap-3">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-500/25 text-amber-300 flex items-center justify-center font-bold text-sm border border-amber-500/40 backdrop-blur-sm">
          {proker.sekbid_nomor}
        </div>
        <div className="min-w-0 text-white">
          <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold block">
            SEKBID {proker.sekbid_nomor} • {proker.sekbid_judul}
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif leading-tight drop-shadow">
            {proker.judul}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default function MubesProkerPresentation({
  proker,
  variant,
  role = null,
  onClose,
  initialTab = 'overview',
}: MubesProkerPresentationProps) {
  const [activeTab, setActiveTab] = useState<MubesPresentationTab>(initialTab);
  const isFull = variant === 'full';
  const fullHref = proker.slug
    ? `/portal-mubes/proker/${encodeURIComponent(proker.slug)}`
    : null;

  const tabs: { id: MubesPresentationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: '1. Ikhtisar & Visual', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'teknis', label: '2. Teknis Pelaksanaan', icon: <ClipboardCheck className="w-3.5 h-3.5" /> },
    { id: 'lpj', label: '3. Realisasi & Nota LPJ', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'evaluasi', label: '4. Evaluasi & Solusi', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  ];

  /* ── Full page: single scroll, banner, no tabs, no meta labels ── */
  if (isFull) {
    return (
      <article className="bg-white dark:bg-slate-900 w-full rounded-none sm:rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
        <ProkerBanner proker={proker} />

        <div className="p-5 sm:p-8 lg:p-10 xl:px-12 flex flex-col gap-12 text-slate-800 dark:text-slate-200">
          <section className="flex flex-col gap-5">
            <SectionHeading n={1} title="Ikhtisar & Visual" icon={<FileText className="w-5 h-5 text-amber-600" />} />
            <OverviewBody proker={proker} />
          </section>

          <section className="flex flex-col gap-5">
            <SectionHeading
              n={2}
              title="Teknis Pelaksanaan"
              icon={<ClipboardCheck className="w-5 h-5 text-amber-600" />}
            />
            <TeknisBody proker={proker} />
          </section>

          <section className="flex flex-col gap-5">
            <SectionHeading
              n={3}
              title="Realisasi & Nota LPJ"
              icon={<DollarSign className="w-5 h-5 text-amber-600" />}
            />
            <LpjBody proker={proker} role={role} />
          </section>

          <section className="flex flex-col gap-5">
            <SectionHeading
              n={4}
              title="Evaluasi & Solusi"
              icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
            />
            <EvaluasiBody proker={proker} />
          </section>
        </div>

        <div className="p-4 px-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <Link
            href="/portal-mubes"
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Portal</span>
          </Link>
        </div>
      </article>
    );
  }

  /* ── Modal overlay: keep tabs for quick PPT-style jumps ── */
  return (
    <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800">
      <div className="relative shrink-0">
        <ProkerBanner proker={proker} />
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition z-10"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        ) : null}
      </div>

      <div className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 overflow-x-auto shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
        {activeTab === 'overview' && <OverviewBody proker={proker} />}
        {activeTab === 'teknis' && <TeknisBody proker={proker} />}
        {activeTab === 'lpj' && <LpjBody proker={proker} role={role} />}
        {activeTab === 'evaluasi' && <EvaluasiBody proker={proker} />}
      </div>

      <div className="p-4 px-6 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 flex-wrap text-xs shrink-0">
        {fullHref ? (
          <Link
            href={fullHref}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition flex items-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka Tampilan Penuh Sidang</span>
          </Link>
        ) : null}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-semibold hover:bg-slate-800 transition"
          >
            Tutup Layar
          </button>
        ) : null}
      </div>
    </div>
  );
}
