'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MubesSekbidGroup, MubesProgramKerja } from '@/lib/mubes-proker';
import { getStrapiMediaUrl } from '@/lib/strapi';
import MubesProkerPresentation from '@/components/mubes/MubesProkerPresentation';
import {
  AlertCircle,
  CheckCircle2,
  Maximize2,
  ExternalLink,
  Layers,
  Users,
} from 'lucide-react';

interface MubesPresentationViewerProps {
  initialGroups: MubesSekbidGroup[];
  role?: string | null;
}

export default function MubesPresentationViewer({
  initialGroups,
  role = null,
}: MubesPresentationViewerProps) {
  const [selectedSekbid, setSelectedSekbid] = useState<number>(1);
  const [activeModalProker, setActiveModalProker] = useState<MubesProgramKerja | null>(null);

  const currentGroup = initialGroups.find((g) => g.nomor === selectedSekbid) || initialGroups[0];
  const prokers = currentGroup?.prokerList || [];

  return (
    <section className="w-full bg-slate-50 dark:bg-slate-900/50 py-12 px-6 sm:px-8 lg:px-12 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Navigasi Filter Sekbid 1 - 8 */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-slate-100 flex items-center gap-3">
                <Layers className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                <span>Pilih Seksi Bidang (Sekbid 1 - 8)</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Pilih seksi bidang untuk menampilkan presentasi program kerja dan dokumen LPJ terkait.
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 self-start sm:self-auto">
              Mode Sidang Aktif
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {initialGroups.map((group) => {
              const isSelected = group.nomor === selectedSekbid;
              return (
                <button
                  key={group.nomor}
                  type="button"
                  onClick={() => setSelectedSekbid(group.nomor)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[11px]">
                    {group.nomor}
                  </span>
                  <span>{group.judul}</span>
                  <span className="text-[11px] opacity-75">({group.prokerList.length})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
              Seksi Bidang {currentGroup.nomor}
            </div>
            <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100 mt-1">
              {currentGroup.judul}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              {currentGroup.deskripsi}
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700">
            Total {prokers.length} program kerja terlapor untuk sidang.
          </div>
        </div>

        {prokers.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-700">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300">
              Belum ada program kerja untuk Sekbid {currentGroup.nomor}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Data dapat dilengkapi melalui panel Strapi CMS bagian 🌐 [VISITOR] Program Kerja.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prokers.map((proker) => {
              const bannerMedia = proker.banner_image || (proker.dokumentasi && proker.dokumentasi[0]);
              const bannerUrl = getStrapiMediaUrl(bannerMedia, '/images/mubes/bg-medieval.png');
              const hasLpj = Boolean(proker.lpj);
              const fullHref = proker.slug
                ? `/portal-mubes/proker/${encodeURIComponent(proker.slug)}`
                : null;

              return (
                <div
                  key={proker.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                      <Image
                        src={bannerUrl}
                        alt={proker.judul}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase px-2.5 py-1 rounded-md bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-sm">
                          {proker.kategori}
                        </span>
                        {hasLpj ? (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/90 text-white flex items-center gap-1 shadow">
                            <CheckCircle2 className="w-3 h-3" />
                            LPJ Tersedia
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/90 text-white shadow">
                            LPJ Pending
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-white font-serif font-bold text-lg leading-tight line-clamp-2 drop-shadow-sm">
                          {proker.judul}
                        </h4>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col gap-3">
                      {proker.tujuan && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {proker.tujuan}
                        </p>
                      )}

                      {proker.penanggung_jawab && proker.penanggung_jawab.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Users className="w-3.5 h-3.5 text-amber-500" />
                          <span className="truncate">
                            PJ: {proker.penanggung_jawab.map((p) => p.nama_lengkap).join(', ')}
                          </span>
                        </div>
                      )}

                      <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            Anggaran
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {proker.lpj?.realisasi_anggaran
                              ? `Rp ${Number(proker.lpj.realisasi_anggaran).toLocaleString('id-ID')}`
                              : 'Tercatat di LPJ'}
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            Pengesahan
                          </span>
                          <span className="font-bold capitalize text-amber-600 dark:text-amber-400">
                            {proker.lpj?.status_pengesahan || 'Siap Diuji'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overlay PPT + halaman penuh data sidang MUBES */}
                  <div className="p-5 pt-0 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalProker(proker)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-amber-600 dark:bg-slate-700 dark:hover:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Buka Presentasi Sidang (PPT)</span>
                    </button>
                    {fullHref ? (
                      <Link
                        href={fullHref}
                        className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 hover:border-amber-500 dark:hover:border-amber-500 text-slate-800 dark:text-slate-100 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Buka Tampilan Penuh Sidang</span>
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {activeModalProker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <MubesProkerPresentation
            proker={activeModalProker}
            variant="modal"
            role={role}
            onClose={() => setActiveModalProker(null)}
          />
        </div>
      )}
    </section>
  );
}
