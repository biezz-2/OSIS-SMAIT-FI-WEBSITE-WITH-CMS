'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MubesLpjSectionBlock, MubesProgramKerja } from '@/lib/mubes-proker';
import { getStrapiMediaUrl } from '@/lib/strapi';
import {
  FileText,
  DollarSign,
  ClipboardCheck,
  AlertCircle,
  Paperclip,
  Target,
  Trophy,
  ClipboardList,
  Images,
  X,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';

interface MubesProkerPresentationProps {
  proker: MubesProgramKerja;
  /** modal = overlay di portal; full = satu halaman scroll /portal-mubes/proker/[slug] */
  variant: 'modal' | 'full';
  role?: string | null;
  onClose?: () => void;
  /** @deprecated tabs dihapus — single scroll LPJ order */
  initialTab?: string;
}

function findSection(
  sections: MubesLpjSectionBlock[] | undefined | null,
  ...names: string[]
): MubesLpjSectionBlock | undefined {
  if (!sections?.length) return undefined;
  const n = names.map((s) => s.toLowerCase());
  return sections.find((s) => n.some((x) => (s.judul || '').toLowerCase().includes(x)));
}

function formatKendalaSolusi(raw: unknown): string | null {
  if (!raw) return null;
  if (typeof raw === 'string') return raw.trim() || null;
  if (Array.isArray(raw)) {
    const lines = raw
      .map((row: { kendala?: string; solusi?: string }, i: number) => {
        const k = row?.kendala?.trim();
        const s = row?.solusi?.trim();
        if (!k && !s) return null;
        return `${i + 1}. Kendala: ${k || '—'}\n   Solusi: ${s || '—'}`;
      })
      .filter(Boolean);
    return lines.length ? lines.join('\n\n') : null;
  }
  try {
    return JSON.stringify(raw, null, 2);
  } catch {
    return null;
  }
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

function ProseBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-800/60 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line break-words">
      {children}
    </div>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return <span className="text-slate-400 italic">{children}</span>;
}

function PjInitials(name?: string) {
  const parts = (name || 'PJ').trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || 'P';
  const b = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0]?.[1] || 'J');
  return `${a}${b}`.toUpperCase();
}

function MetaStrip({ proker }: { proker: MubesProgramKerja }) {
  const pjs = proker.penanggung_jawab?.length
    ? proker.penanggung_jawab
    : [{ nama_lengkap: 'Pengurus Sekbid', jabatan: undefined, foto: undefined }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <span className="text-xs text-slate-400 font-semibold block uppercase">Kategori</span>
        <span className="text-base font-bold capitalize mt-1 block">{proker.kategori}</span>
      </div>
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <span className="text-xs text-slate-400 font-semibold block uppercase">Lokasi</span>
        <span className="text-base font-bold mt-1 block break-words">{proker.lokasi || 'SMAIT FI'}</span>
      </div>
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <span className="text-xs text-slate-400 font-semibold block uppercase mb-2">Penanggung Jawab</span>
        <ul className="flex flex-col gap-2.5">
          {pjs.map((p, i) => {
            const name = p.nama_lengkap || 'Pengurus Sekbid';
            return (
              <li key={`${name}-${i}`} className="flex items-center gap-2.5 min-w-0">
                {p.foto ? (
                  <span className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden ring-2 ring-amber-500/40 bg-slate-200 dark:bg-slate-700">
                    <Image src={p.foto} alt={name} fill className="object-cover" sizes="36px" />
                  </span>
                ) : (
                  <span
                    className="w-9 h-9 shrink-0 rounded-full bg-amber-600 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-amber-500/30"
                    aria-hidden
                  >
                    {PjInitials(name)}
                  </span>
                )}
                <span className="min-w-0 flex flex-col">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{name}</span>
                  {p.jabatan ? (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{p.jabatan}</span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function AnggaranNotaBlock({ proker }: { proker: MubesProgramKerja }) {
  const lpj = proker.lpj;
  if (!lpj) return null;

  const hasAnggaran =
    lpj.realisasi_anggaran != null &&
    lpj.realisasi_anggaran !== '' &&
    Number(lpj.realisasi_anggaran) !== 0;
  const hasSumber = Boolean(lpj.sumber_dana?.trim());
  const notas = lpj.nota_kwitansi || [];
  const hasNota = Array.isArray(notas) && notas.length > 0;

  if (!hasAnggaran && !hasSumber && !hasNota) return null;

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 sm:p-5">
      <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
        <DollarSign className="w-4 h-4" />
        Anggaran &amp; Nota
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(hasAnggaran || hasSumber) && (
          <>
            <div className="bg-white/70 dark:bg-slate-900/40 border border-emerald-200/60 dark:border-emerald-800/40 p-4 rounded-xl">
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase block">
                Realisasi Anggaran
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-1 block">
                {hasAnggaran
                  ? `Rp ${Number(lpj.realisasi_anggaran).toLocaleString('id-ID')}`
                  : 'Rp 0 / Swadaya'}
              </span>
            </div>
            <div className="bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase block">
                Sumber Dana
              </span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1 block break-words">
                {lpj.sumber_dana || 'Kas OSIS / Sekolah'}
              </span>
            </div>
          </>
        )}
      </div>
      {hasNota ? (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
            <Paperclip className="w-3.5 h-3.5 text-amber-500" />
            Nota &amp; Kwitansi
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {notas.map((item: unknown, idx: number) => {
              const notaUrl = getStrapiMediaUrl(item, '');
              if (!notaUrl) return null;
              return (
                <a
                  key={idx}
                  href={notaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition flex items-center gap-2 text-xs"
                >
                  <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-medium break-words">Nota_{idx + 1}</span>
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DokumentasiGallery({ proker }: { proker: MubesProgramKerja }) {
  const docs =
    proker.dokumentasi_items && proker.dokumentasi_items.length > 0
      ? proker.dokumentasi_items
      : [];

  if (docs.length === 0) {
    return (
      <ProseBlock>
        <EmptyHint>Belum ada item dokumentasi yang diunggah untuk program kerja ini.</EmptyHint>
      </ProseBlock>
    );
  }

  return (
    <div className="overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:thin]">
      <div
        className="grid gap-4 sm:gap-5"
        style={{
          gridTemplateRows: 'repeat(2, auto)',
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(min(70vw, 240px), calc((100% - 3 * 1.25rem) / 4))',
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
  );
}

function LpjOrderedBody({ proker }: { proker: MubesProgramKerja }) {
  const sections = proker.lpj?.sections;

  const tujuan =
    findSection(sections, 'tujuan')?.isi ||
    proker.tujuan ||
    null;

  const teknis =
    findSection(sections, 'teknis', 'waktu')?.isi ||
    proker.teknis_pelaksanaan ||
    null;

  const capaian = findSection(sections, 'capaian')?.isi || null;

  const evaluasi =
    findSection(sections, 'evaluasi')?.isi ||
    proker.lpj?.evaluasi_internal ||
    proker.evaluasi_deskripsi ||
    null;

  const kendalaText = formatKendalaSolusi(proker.lpj?.kendala_solusi ?? null);
  const formUrl = proker.evaluasi_form_url?.trim() || '';

  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      {/* 1. Tujuan */}
      <section className="flex flex-col gap-4">
        <SectionHeading n={1} title="Tujuan" icon={<Target className="w-5 h-5 text-amber-600" />} />
        <ProseBlock>
          {tujuan || (
            <EmptyHint>Mendukung visi misi kepengurusan OSIS SMAIT Fithrah Insani.</EmptyHint>
          )}
        </ProseBlock>
      </section>

      {/* 2. Teknis & Waktu */}
      <section className="flex flex-col gap-4">
        <SectionHeading
          n={2}
          title="Teknis & Waktu"
          icon={<ClipboardCheck className="w-5 h-5 text-amber-600" />}
        />
        <ProseBlock>
          {teknis || (
            <EmptyHint>
              Belum ada dokumen teknis rinci. Pelaksanaan mengacu pada TOR Seksi Bidang.
            </EmptyHint>
          )}
        </ProseBlock>
      </section>

      {/* 3. Capaian (+ optional Anggaran) */}
      <section className="flex flex-col gap-4">
        <SectionHeading n={3} title="Capaian" icon={<Trophy className="w-5 h-5 text-amber-600" />} />
        <ProseBlock>{capaian || <EmptyHint>—</EmptyHint>}</ProseBlock>
        <AnggaranNotaBlock proker={proker} />
      </section>

      {/* 4. Evaluasi & Solusi */}
      <section className="flex flex-col gap-4">
        <SectionHeading
          n={4}
          title="Evaluasi & Solusi"
          icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
        />
        <ProseBlock>
          {evaluasi || (
            <EmptyHint>
              Program berjalan sesuai dengan target indikator keberhasilan yang telah ditetapkan.
            </EmptyHint>
          )}
        </ProseBlock>
        {kendalaText ? (
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
              Kendala &amp; Solusi
            </h4>
            <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-sm sm:text-base leading-relaxed whitespace-pre-line break-words">
              {kendalaText}
            </div>
          </div>
        ) : null}
      </section>

      {/* 5. Kuisioner */}
      <section className="flex flex-col gap-4">
        <SectionHeading
          n={5}
          title="Kuisioner"
          icon={<ClipboardList className="w-5 h-5 text-amber-600" />}
        />
        {formUrl ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 flex-1 break-words">
              Form evaluasi / kuisioner peserta tersedia secara daring.
            </p>
            <a
              href={formUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              Buka Kuisioner
            </a>
          </div>
        ) : (
          <ProseBlock>
            <EmptyHint>Belum ada tautan kuisioner untuk program kerja ini.</EmptyHint>
          </ProseBlock>
        )}
      </section>

      {/* 6. Dokumentasi */}
      <section className="flex flex-col gap-4">
        <SectionHeading
          n={6}
          title="Dokumentasi"
          icon={<Images className="w-5 h-5 text-amber-600" />}
        />
        <DokumentasiGallery proker={proker} />
      </section>
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
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif leading-tight drop-shadow break-words">
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
  onClose,
}: MubesProkerPresentationProps) {
  const isFull = variant === 'full';
  const fullHref = proker.slug
    ? `/portal-mubes/proker/${encodeURIComponent(proker.slug)}`
    : null;

  const body = (
    <>
      <MetaStrip proker={proker} />
      <LpjOrderedBody proker={proker} />
    </>
  );

  if (isFull) {
    return (
      <article className="bg-white dark:bg-slate-900 w-full rounded-none sm:rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
        <ProkerBanner proker={proker} />
        <div className="p-5 sm:p-8 lg:p-10 xl:px-12 flex flex-col gap-8 sm:gap-10 text-slate-800 dark:text-slate-200">
          {body}
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

      <div className="p-5 sm:p-8 overflow-y-auto flex-1 flex flex-col gap-8 text-slate-800 dark:text-slate-200">
        {body}
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
