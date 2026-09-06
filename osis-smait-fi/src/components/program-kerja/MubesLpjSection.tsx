'use client';

import React, { useState } from 'react';
import { getStrapiMediaUrl } from '@/lib/strapi';

interface MubesLpjData {
  realisasi_anggaran?: number | string;
  sumber_dana?: string;
  evaluasi_internal?: string;
  kendala_solusi?: Array<{ kendala: string; solusi: string }> | any;
  nota_kwitansi?: any[];
  status_pengesahan?: 'draft' | 'ditinjau' | 'disahkan';
}

interface MubesLpjSectionProps {
  lpj: MubesLpjData;
  role: string | null;
  onPreviewImage?: (url: string, caption?: string) => void;
}

export default function MubesLpjSection({ lpj, role, onPreviewImage }: MubesLpjSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const formatCurrency = (val: number | string | undefined) => {
    if (val === undefined || val === null || val === '') return 'Rp 0';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'disahkan':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">LPJ Disahkan</span>;
      case 'ditinjau':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200">Sedang Ditinjau</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200">Draft Sidang</span>;
    }
  };

  return (
    <div className="w-full mt-6 border border-blue-200 bg-blue-50/40 rounded-2xl p-6 transition-all duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-blue-200/60">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
          </span>
          <div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Dokumen Sidang Pertanggungjawaban (MUBES)
              {getStatusBadge(lpj.status_pengesahan)}
            </h4>
            <p className="text-xs text-slate-500">
              Akses Terbuka: <span className="font-semibold text-slate-700 uppercase">{role || 'Operator'}</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
        >
          {isOpen ? 'Sembunyikan Data' : 'Tampilkan Data'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 flex flex-col gap-6">
          {/* Anggaran & Realisasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Realisasi Anggaran</span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {formatCurrency(lpj.realisasi_anggaran)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Sumber Pendanaan</span>
              <p className="text-base font-semibold text-slate-800 mt-1">
                {lpj.sumber_dana || 'Kas Internal OSIS & Sekolah'}
              </p>
            </div>
          </div>

          {/* Evaluasi Internal */}
          {lpj.evaluasi_internal && (
            <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-xs">
              <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Evaluasi Internal Kepanitiaan
              </h5>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {lpj.evaluasi_internal}
              </div>
            </div>
          )}

          {/* Kendala & Solusi */}
          {Array.isArray(lpj.kendala_solusi) && lpj.kendala_solusi.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-xs">
              <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Matriks Kendala & Rekomendasi Solusi
              </h5>
              <div className="flex flex-col gap-3">
                {lpj.kendala_solusi.map((ks: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                    <p className="font-semibold text-rose-700">Kendala: <span className="font-normal text-slate-800">{ks.kendala}</span></p>
                    <p className="font-semibold text-emerald-700 mt-1">Solusi: <span className="font-normal text-slate-800">{ks.solusi}</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nota & Kuitansi */}
          {Array.isArray(lpj.nota_kwitansi) && lpj.nota_kwitansi.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-xs">
              <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Lampiran Nota & Bukti Transaksi
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {lpj.nota_kwitansi.map((nota: any, idx: number) => {
                  const url = getStrapiMediaUrl(nota, '');
                  if (!url) return null;
                  return (
                    <div
                      key={idx}
                      onClick={() => onPreviewImage && onPreviewImage(url, `Bukti Transaksi #${idx + 1}`)}
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
