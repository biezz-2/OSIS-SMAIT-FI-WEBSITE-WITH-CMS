'use client';

import React, { useMemo, useState } from 'react';
import { getStrapiMediaUrl } from '@/lib/strapi';

export interface LpjSectionBlock {
  id?: string | number;
  judul: string;
  isi: string;
  order?: number;
}

export interface MubesLpjData {
  realisasi_anggaran?: number | string | null;
  sumber_dana?: string | null;
  evaluasi_internal?: string | null;
  kendala_solusi?: Array<{ kendala: string; solusi: string }> | unknown;
  nota_kwitansi?: unknown[];
  status_pengesahan?: 'draft' | 'ditinjau' | 'disahkan';
  sections?: LpjSectionBlock[] | null;
}

interface MubesLpjSectionProps {
  lpj: MubesLpjData | Record<string, unknown>;
  role: string | null;
  onPreviewImage?: (url: string, caption?: string) => void;
}

/** Flatten Strapi v5 / v4 component payloads into LpjSectionBlock[]. */
export function normalizeLpjSections(raw: unknown): LpjSectionBlock[] {
  if (!raw) return [];
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { data?: unknown }).data)
      ? ((raw as { data: unknown[] }).data as unknown[])
      : [];

  const blocks: LpjSectionBlock[] = [];
  list.forEach((item, index) => {
    const node = item as { id?: string | number; attributes?: Record<string, unknown> } & Record<
      string,
      unknown
    >;
    const attrs: Record<string, unknown> = node.attributes || node;
    const judul = String(attrs.judul ?? attrs.title ?? '').trim();
    const isi = String(attrs.isi ?? attrs.deskripsi ?? attrs.content ?? '').trim();
    if (!judul && !isi) return;
    const orderRaw = attrs.order;
    const order =
      typeof orderRaw === 'number'
        ? orderRaw
        : orderRaw != null && orderRaw !== ''
          ? Number(orderRaw)
          : index;
    blocks.push({
      id: node.id ?? index,
      judul: judul || `Bagian ${index + 1}`,
      isi,
      order: Number.isFinite(order) ? order : index,
    });
  });
  return blocks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function pickLpjFields(lpj: MubesLpjData | Record<string, unknown>): MubesLpjData {
  const src = (lpj as { attributes?: Record<string, unknown> }).attributes
    ? ((lpj as { attributes: Record<string, unknown> }).attributes as MubesLpjData)
    : (lpj as MubesLpjData);
  return {
    ...src,
    sections: normalizeLpjSections(src.sections),
    nota_kwitansi:
      (src.nota_kwitansi as { data?: unknown[] })?.data || src.nota_kwitansi || [],
  };
}

export default function MubesLpjSection({ lpj, role, onPreviewImage }: MubesLpjSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const data = useMemo(() => pickLpjFields(lpj), [lpj]);
  const sections = data.sections || [];
  const hasSections = sections.length > 0;

  const formatCurrency = (val: number | string | undefined | null) => {
    if (val === undefined || val === null || val === '') return null;
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (!Number.isFinite(num)) return null;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'disahkan':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            LPJ Disahkan
          </span>
        );
      case 'ditinjau':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            Sedang Ditinjau
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            Draft Sidang
          </span>
        );
    }
  };

  const realisasiLabel = formatCurrency(data.realisasi_anggaran);
  const hasLegacyBody =
    !hasSections &&
    Boolean(
      data.evaluasi_internal ||
        (Array.isArray(data.kendala_solusi) && data.kendala_solusi.length > 0) ||
        realisasiLabel ||
        data.sumber_dana
    );

  return (
    <div className="w-full mt-6 border border-blue-200 bg-blue-50/40 rounded-2xl p-6 transition-all duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-blue-200/60">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600" />
          </span>
          <div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
              Dokumen Sidang Pertanggungjawaban (MUBES)
              {getStatusBadge(data.status_pengesahan)}
            </h4>
            <p className="text-xs text-slate-500">
              Akses Terbuka:{' '}
              <span className="font-semibold text-slate-700 uppercase">{role || 'Operator'}</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors shrink-0"
        >
          {isOpen ? 'Sembunyikan Data' : 'Tampilkan Data'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 flex flex-col gap-6">
          {/* Dynamic document body: Tujuan / Teknis / Capaian / Evaluasi … */}
          {hasSections && (
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-blue-100 shadow-xs flex flex-col gap-6">
              {sections.map((section, idx) => (
                <div
                  key={section.id ?? idx}
                  className={idx > 0 ? 'pt-5 border-t border-slate-100' : undefined}
                >
                  <h5 className="text-base font-serif font-bold text-slate-900 tracking-tight mb-2">
                    {section.judul}
                  </h5>
                  <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                    {section.isi}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Optional anggaran strip (only if filled in CMS) */}
          {(realisasiLabel || data.sumber_dana) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {realisasiLabel && (
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Realisasi Anggaran
                  </span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{realisasiLabel}</p>
                </div>
              )}
              {data.sumber_dana && (
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Sumber Pendanaan
                  </span>
                  <p className="text-base font-semibold text-slate-800 mt-1">{data.sumber_dana}</p>
                </div>
              )}
            </div>
          )}

          {/* Legacy fallback when sections empty */}
          {hasLegacyBody && (
            <>
              {data.evaluasi_internal && (
                <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-xs">
                  <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Evaluasi Internal Kepanitiaan
                  </h5>
                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {data.evaluasi_internal}
                  </div>
                </div>
              )}

              {Array.isArray(data.kendala_solusi) && data.kendala_solusi.length > 0 && (
                <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-xs">
                  <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Matriks Kendala & Rekomendasi Solusi
                  </h5>
                  <div className="flex flex-col gap-3">
                    {data.kendala_solusi.map((ks: { kendala?: string; solusi?: string }, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
                      >
                        <p className="font-semibold text-rose-700">
                          Kendala:{' '}
                          <span className="font-normal text-slate-800">{ks.kendala}</span>
                        </p>
                        <p className="font-semibold text-emerald-700 mt-1">
                          Solusi: <span className="font-normal text-slate-800">{ks.solusi}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!hasSections && !hasLegacyBody && (
            <p className="text-sm text-slate-500 italic">
              Belum ada bagian LPJ. Di Strapi Admin → MUBES LPJ, tambah entri di field{' '}
              <strong>sections</strong> (judul + isi), mis. Tujuan, Teknis &amp; Waktu, Capaian,
              Evaluasi &amp; Solusi.
            </p>
          )}

          {Array.isArray(data.nota_kwitansi) && data.nota_kwitansi.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-xs">
              <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Lampiran Nota & Bukti Transaksi
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {data.nota_kwitansi.map((nota: unknown, idx: number) => {
                  const url = getStrapiMediaUrl(nota as never, '');
                  if (!url) return null;
                  return (
                    <div
                      key={idx}
                      onClick={() => onPreviewImage?.(url, `Bukti Transaksi #${idx + 1}`)}
                      className="cursor-pointer group relative aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-100 hover:border-blue-400 transition-colors"
                    >
                      <img
                        src={url}
                        alt={`Nota ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-medium">
                        Perbesar
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
