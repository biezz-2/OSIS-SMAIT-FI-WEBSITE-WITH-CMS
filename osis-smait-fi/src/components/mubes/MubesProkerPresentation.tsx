'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { findLpjSectionIsi, MubesProgramKerja } from '@/lib/mubes-proker';
import { getStrapiMediaUrl } from '@/lib/strapi';
import {
  FileText,
  BadgeCheck,
  CircleDollarSign,
  Paperclip,
  AlertTriangle,
  ClipboardList,
  Images,
  X,
  ExternalLink,
  ArrowLeft,
  UserRound,
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

function firstText(...candidates: Array<string | null | undefined>): string | null {
  for (const c of candidates) {
    const t = typeof c === 'string' ? c.trim() : '';
    if (t) return t;
  }
  return null;
}

type CapaianChip = { title: string; subtitle?: string };

/** Parse capaian into title+subtitle pairs (mockup chips) or fall back to prose. */
function parseCapaianChips(text: string): CapaianChip[] | null {
  const lines = text
    .split(/\n+/)
    .map((l) => l.replace(/^[-•*\d.)]+\s*/, '').trim())
    .filter(Boolean);
  if (lines.length < 2) return null;

  // Explicit pairs: "Title — subtitle" / "Title: subtitle" on one line
  const pairOnLine: CapaianChip[] = [];
  for (const l of lines) {
    const m = l.match(/^(.{1,48}?)\s*[—–\-:|]\s+(.+)$/);
    if (!m) continue;
    pairOnLine.push({ title: m[1].trim(), subtitle: m[2].trim() });
  }
  if (pairOnLine.length >= 2 && pairOnLine.length === lines.length) return pairOnLine;

  // Alternating title / subtitle rows (even count, short titles)
  if (lines.length >= 2 && lines.length % 2 === 0 && lines.length <= 12) {
    const pairs: CapaianChip[] = [];
    let ok = true;
    for (let i = 0; i < lines.length; i += 2) {
      const title = lines[i];
      const subtitle = lines[i + 1];
      if (title.length > 48 || subtitle.length > 120) {
        ok = false;
        break;
      }
      pairs.push({ title, subtitle });
    }
    if (ok && pairs.length >= 1) return pairs;
  }

  // Short single-line chips (≤48 chars each)
  if (lines.length <= 8 && lines.every((l) => l.length <= 48)) {
    return lines.map((title) => ({ title }));
  }
  return null;
}

/** Chip grid without outer box (H3); prose stays plain block. */
function CapaianBody({ text }: { text: string }) {
  const chips = parseCapaianChips(text);
  if (chips?.length) {
    return (
      <div className="flex flex-wrap gap-2.5">
        {chips.map((chip, i) => (
          <div
            key={`${chip.title}-${i}`}
            className="min-w-[140px] max-w-[220px] rounded-xl border border-[#DDDDDD] bg-white px-3.5 py-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-xs font-bold leading-snug text-slate-900 dark:text-slate-50">
              {chip.title}
            </p>
            {chip.subtitle ? (
              <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                {chip.subtitle}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    );
  }
  return <ProseBlock>{text}</ProseBlock>;
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
}: {
  n: number;
  title: string;
}) {
  return (
    <h2 className="font-serif text-base font-bold leading-snug text-slate-950 dark:text-slate-50 sm:text-lg">
      <span aria-hidden="true">{n}. </span>
      {title}
    </h2>
  );
}

function ProseBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="whitespace-pre-line break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
      {children}
    </div>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return <p className="text-sm italic text-slate-400 dark:text-slate-500">{children}</p>;
}

/** Kartu PJ mirror public `/program-kerja/[slug]` (ProgramKerjaDetailPage chairs). */
function PjPortraitCard({
  name,
  role,
  foto,
  idx,
}: {
  name: string;
  role?: string;
  foto?: string;
  idx: number;
}) {
  return (
    <article className="relative mx-auto aspect-[3/4] w-full max-w-[230px]">
      <div
        className="absolute inset-y-1 -left-1.5 right-1.5 rounded-[20px] bg-amber-300 dark:bg-amber-500"
        style={{ transform: idx % 2 === 0 ? 'rotate(-1.5deg)' : 'rotate(1.5deg)' }}
        aria-hidden
      />
      <div
        className="relative flex h-full w-full flex-col justify-end overflow-hidden rounded-[20px] border border-slate-300 bg-slate-200 shadow-lg dark:border-slate-700 dark:bg-slate-900"
      >
        {foto ? (
          <Image
            src={foto}
            alt={name}
            fill
            className="absolute inset-0 object-cover object-top"
            sizes="(max-width: 640px) 70vw, 230px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 text-slate-500 dark:from-slate-800 dark:to-slate-950 dark:text-slate-400">
            <UserRound className="h-14 w-14" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/65 to-transparent px-4 pb-4 pt-12">
          <h3 className="break-words text-sm font-bold leading-tight text-white">{name}</h3>
          {role ? (
            <p className="mt-1 break-words text-xs font-medium text-slate-200">{role}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function MetaStrip({ proker }: { proker: MubesProgramKerja }) {
  const pjs = proker.penanggung_jawab || [];

  return (
    <section aria-labelledby="pj-heading" className="flex flex-col gap-4">
      <h2
        id="pj-heading"
        className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400"
      >
        Penanggung Jawab Proker
      </h2>
      {pjs.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-5">
          {pjs.map((p, i) => (
            <PjPortraitCard
              key={`${p.nama_lengkap || 'pj'}-${i}`}
              name={p.nama_lengkap || 'Penanggung Jawab'}
              role={p.jabatan}
              foto={p.foto}
              idx={i}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Data penanggung jawab belum tersedia.
        </p>
      )}
    </section>
  );
}

function AnggaranNotaBlock({ proker }: { proker: MubesProgramKerja }) {
  const lpj = proker.lpj;
  const numericBudget = Number(lpj?.realisasi_anggaran ?? 0);
  const budget = Number.isFinite(numericBudget) ? numericBudget : 0;
  const hasSumber = Boolean(lpj?.sumber_dana?.trim());
  const notas = lpj?.nota_kwitansi || [];
  const hasNota = Array.isArray(notas) && notas.length > 0;

  return (
    <section
      aria-labelledby="anggaran-heading"
      className="rounded-2xl border border-[#DDDDDD] bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <CircleDollarSign className="h-4 w-4" aria-hidden="true" />
        <h2 id="anggaran-heading" className="text-[10px] font-bold uppercase tracking-[0.14em]">
          Total Realisasi Anggaran
        </h2>
      </div>
      <p className="mt-2 font-mono text-2xl font-bold text-slate-950 dark:text-white">
        Rp {budget.toLocaleString('id-ID')}
      </p>
      {hasSumber ? (
        <p className="mt-1 break-words text-xs text-slate-500 dark:text-slate-400">
          Sumber Dana: <span className="font-medium text-slate-700 dark:text-slate-200">{lpj?.sumber_dana}</span>
        </p>
      ) : null}
      {hasNota ? (
        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
          <h3 className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
            Nota &amp; Kwitansi
          </h3>
          <div className="flex flex-col gap-2">
            {notas.map((item: unknown, idx: number) => {
              const notaUrl = getStrapiMediaUrl(item, '');
              if (!notaUrl) return null;
              const nota = (item as { attributes?: Record<string, unknown> })?.attributes ||
                (item as Record<string, unknown>);
              const notaTitle = String(
                nota?.caption || nota?.alternativeText || nota?.name || `Lampiran ${idx + 1}`
              );
              return (
                <a
                  key={idx}
                  href={notaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 transition hover:border-sky-400 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:text-sky-300"
                >
                  <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="break-all font-medium">{notaTitle}</span>
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}

type DocCard = {
  id?: string | number;
  url: string;
  judul: string;
  deskripsi?: string;
  isVideo?: boolean;
};

function resolveDokumentasi(proker: MubesProgramKerja): DocCard[] {
  if (proker.dokumentasi_items?.length) return proker.dokumentasi_items;
  const raw = proker.dokumentasi;
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw
    .map((item: unknown, i: number): DocCard | null => {
      const url = getStrapiMediaUrl(item, '');
      if (!url) return null;
      const node =
        (item as { attributes?: Record<string, unknown> })?.attributes ||
        (item as Record<string, unknown>);
      const mime = String(node?.mime || '');
      const name = String(
        node?.caption || node?.alternativeText || node?.name || `Dokumentasi ${i + 1}`
      );
      return {
        id: (node?.id as string | number) ?? i,
        url,
        judul: name,
        isVideo: mime.startsWith('video/'),
      };
    })
    .filter((x): x is DocCard => Boolean(x));
}

function DokumentasiGallery({ docs }: { docs: DocCard[] }) {
  if (docs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#DDDDDD] px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Belum ada dokumentasi yang tersedia.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {docs.map((item, i) => (
        <figure
          key={item.id ?? i}
          className="min-w-0 overflow-hidden rounded-2xl border border-[#DDDDDD] bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="relative aspect-[4/3] w-full bg-slate-900">
            {item.isVideo ? (
              <video
                src={item.url}
                controls
                preload="metadata"
                aria-label={item.judul}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={item.url}
                alt={item.judul}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
          </div>
          <figcaption className="flex flex-col gap-1 p-4">
            <h3 className="break-words text-sm font-bold leading-snug text-slate-900 dark:text-slate-100">
              {item.judul}
            </h3>
            {item.deskripsi ? (
              <p className="whitespace-pre-line break-words text-xs leading-5 text-slate-600 dark:text-slate-300">
                {item.deskripsi}
              </p>
            ) : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function LpjOrderedBody({ proker }: { proker: MubesProgramKerja }) {
  const sections = proker.lpj?.sections;

  const pendahuluan = firstText(
    findLpjSectionIsi(sections, ['pendahuluan', 'tujuan'], ['pendahuluan', 'gambaran umum', 'tujuan']),
    proker.lpj?.pendahuluan,
    proker.tujuan
  );

  const golonganTarget = firstText(
    findLpjSectionIsi(
      sections,
      ['golongan_sasaran'],
      ['golongan', 'sasaran', 'peserta']
    ),
    proker.lpj?.golongan_target,
    proker.golongan_target
  );

  const capaian = firstText(
    findLpjSectionIsi(sections, ['capaian'], ['capaian', 'parameter tujuan']),
    proker.capaian
  );

  const teknis = firstText(
    findLpjSectionIsi(sections, ['teknis_waktu'], ['teknis', 'waktu', 'alur']),
    proker.lpj?.teknis_pelaksanaan,
    proker.teknis_pelaksanaan
  );

  const evaluasi = firstText(
    findLpjSectionIsi(sections, ['evaluasi_internal'], ['evaluasi']),
    proker.lpj?.evaluasi_internal,
    proker.evaluasi_deskripsi
  );

  const kendalaFromSection = findLpjSectionIsi(
    sections,
    ['kendala_solusi'],
    ['kendala', 'solusi']
  );
  const kendalaText =
    formatKendalaSolusi(proker.lpj?.kendala_solusi ?? null) || kendalaFromSection;
  const formUrl = proker.evaluasi_form_url?.trim() || '';

  return (
    <div className="flex flex-col gap-7">
      <section className="flex flex-col gap-2">
        <SectionHeading n={1} title="Pendahuluan & Gambaran Umum" />
        {pendahuluan ? <ProseBlock>{pendahuluan}</ProseBlock> : <EmptyHint>Belum diisi.</EmptyHint>}
      </section>

      <section className="flex flex-col gap-2">
        <SectionHeading n={2} title="Golongan Sasaran & Peserta" />
        {golonganTarget ? (
          <ProseBlock>{golonganTarget}</ProseBlock>
        ) : (
          <EmptyHint>Belum diisi.</EmptyHint>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeading n={3} title="Capaian Parameter Tujuan" />
        {capaian ? <CapaianBody text={capaian} /> : <EmptyHint>Belum diisi.</EmptyHint>}
      </section>

      <section className="flex flex-col gap-2">
        <SectionHeading n={4} title="Teknis Pelaksanaan & Alur" />
        {teknis ? <ProseBlock>{teknis}</ProseBlock> : <EmptyHint>Belum diisi.</EmptyHint>}
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-800/60 dark:bg-amber-950/20">
        <div className="flex items-start gap-2">
          <ClipboardList
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400"
            aria-hidden="true"
          />
          <SectionHeading n={5} title="Evaluasi Internal Sidang MUBES" />
        </div>
        {evaluasi ? <ProseBlock>{evaluasi}</ProseBlock> : <EmptyHint>Belum diisi.</EmptyHint>}
      </section>

      {kendalaText ? (
        <section
          aria-labelledby="kendala-heading"
          className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-900/60 dark:bg-rose-950/20"
        >
          <h2
            id="kendala-heading"
            className="mb-2 flex items-center gap-2 text-sm font-bold text-rose-900 dark:text-rose-200"
          >
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            Kendala &amp; Solusi
          </h2>
          <div className="whitespace-pre-line break-words text-sm leading-6 text-slate-700 dark:text-slate-200">
            {kendalaText}
          </div>
        </section>
      ) : null}

      {formUrl ? (
        <section
          aria-labelledby="kuesioner-heading"
          className="flex flex-col gap-3 rounded-xl border border-sky-200 bg-sky-50/70 p-4 dark:border-sky-900/60 dark:bg-sky-950/20 sm:flex-row sm:items-center"
        >
          <div className="min-w-0 flex-1">
            <h2 id="kuesioner-heading" className="text-sm font-bold text-slate-900 dark:text-white">
              Kuesioner Evaluasi
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Tautan kuesioner program kerja.
            </p>
          </div>
          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:bg-sky-600 dark:hover:bg-sky-500"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Buka Kuesioner
          </a>
        </section>
      ) : null}
    </div>
  );
}

function ProkerBanner({ proker }: { proker: MubesProgramKerja }) {
  const status = proker.lpj?.status_pengesahan || 'draft';
  const statusConfig = {
    disahkan: {
      label: 'Disahkan',
      dot: 'bg-emerald-600',
      badge:
        'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200',
    },
    ditinjau: {
      label: 'Sedang Ditinjau',
      dot: 'bg-emerald-500',
      badge:
        'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200',
    },
    draft: {
      label: 'Draft',
      dot: 'bg-slate-500',
      badge:
        'border-slate-200 bg-white/80 text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200',
    },
  }[status] || {
    label: status,
    dot: 'bg-slate-500',
    badge:
      'border-slate-200 bg-white/80 text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200',
  };

  return (
    <header className="border-b border-sky-100 bg-[#E3F2FD] px-5 py-5 dark:border-sky-900/50 dark:bg-sky-950/40 sm:px-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
            <BadgeCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-300">
              Sidang Komisi Pertanggungjawaban
            </p>
            <h1 className="mt-1 font-serif text-lg font-bold leading-tight text-slate-950 dark:text-white sm:text-xl">
              Dokumen Evaluasi &amp; Realisasi Anggaran
            </h1>
            <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">
              {proker.judul}
              {proker.sekbid_judul ? ` · ${proker.sekbid_judul}` : ''}
            </p>
          </div>
        </div>
        <div
          className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${statusConfig.badge}`}
        >
          <span className={`h-2 w-2 rounded-full ${statusConfig.dot}`} aria-hidden="true" />
          <span>Status Sidang: {statusConfig.label}</span>
        </div>
      </div>
    </header>
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
  const docs = resolveDokumentasi(proker);

  const body = (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] lg:gap-10">
        <aside className="flex min-w-0 flex-col gap-5">
          <MetaStrip proker={proker} />
          <AnggaranNotaBlock proker={proker} />
        </aside>
        <LpjOrderedBody proker={proker} />
      </div>

      <section
        aria-labelledby="dokumentasi-heading"
        className="flex flex-col gap-4 border-t border-[#DDDDDD] pt-7 dark:border-slate-800"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="dokumentasi-heading"
              className="flex items-center gap-2 font-serif text-xl font-bold text-slate-950 dark:text-white"
            >
              <Images className="h-5 w-5 text-sky-700 dark:text-sky-400" aria-hidden="true" />
              Dokumentasi Pelaksanaan Kegiatan
            </h2>
            <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">
              Rekaman jejak visual hasil kerja proker yang dipresentasikan pada sidang MUBES.
            </p>
          </div>
          {docs.length > 0 ? (
            <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
              {docs.length} Dokumentasi Tertampil
            </span>
          ) : null}
        </div>
        <DokumentasiGallery docs={docs} />
      </section>
    </div>
  );

  if (isFull) {
    return (
      <article className="flex w-full flex-col overflow-hidden rounded-none border border-[#DDDDDD] bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:rounded-2xl">
        <ProkerBanner proker={proker} />
        <div className="bg-white p-5 text-slate-800 dark:bg-slate-950 dark:text-slate-200 sm:p-7 lg:p-9">
          {body}
        </div>
        <div className="flex flex-col gap-2 border-t border-[#DDDDDD] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 dark:border-slate-800 dark:bg-slate-900">
          <Link
            href="/portal-mubes"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Kembali ke Agenda Sidang</span>
          </Link>
          <p className="text-[10px] leading-snug text-slate-400 dark:text-slate-500 sm:text-right">
            Portal Musyawarah Besar · Dokumen Resmi Internal OSIS
          </p>
        </div>
      </article>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Dokumen evaluasi ${proker.judul}`}
      className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-[#DDDDDD] bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="relative shrink-0">
        <ProkerBanner proker={proker} />
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto p-5 text-slate-800 dark:text-slate-200 sm:p-7">
        {body}
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-white p-4 px-6 text-xs dark:border-slate-800 dark:bg-slate-900">
        {fullHref ? (
          <Link
            href={fullHref}
            className="flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-2 font-semibold text-white transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka Tampilan Penuh Sidang</span>
          </Link>
        ) : null}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Tutup Layar
          </button>
        ) : null}
      </div>
    </div>
  );
}
