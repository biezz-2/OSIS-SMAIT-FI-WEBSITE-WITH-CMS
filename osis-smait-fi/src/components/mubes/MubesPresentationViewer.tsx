'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MubesSekbidGroup, MubesProgramKerja } from '@/lib/mubes-proker';
import { getStrapiMediaUrl } from '@/lib/strapi';
import {
  FileText,
  DollarSign,
  ClipboardCheck,
  AlertCircle,
  Paperclip,
  CheckCircle2,
  Maximize2,
  X,
  ChevronRight,
  Layers,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';

interface MubesPresentationViewerProps {
  initialGroups: MubesSekbidGroup[];
}

export default function MubesPresentationViewer({ initialGroups }: MubesPresentationViewerProps) {
  const [selectedSekbid, setSelectedSekbid] = useState<number>(1);
  const [activeModalProker, setActiveModalProker] = useState<MubesProgramKerja | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'teknis' | 'lpj' | 'evaluasi'>('overview');

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

          {/* Tab Button Carousel / Grid */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {initialGroups.map((group) => {
              const isSelected = group.nomor === selectedSekbid;
              return (
                <button
                  key={group.nomor}
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

        {/* Sekbid Active Info Box */}
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

        {/* Grid Program Kerja (Tampilan Visitor dengan Ekstensi MUBES) */}
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

              return (
                <div
                  key={proker.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Image */}
                    <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                      <Image
                        src={bannerUrl}
                        alt={proker.judul}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Badge Kategori & Status LPJ */}
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

                      {/* Title Overlay on Image Bottom */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-white font-serif font-bold text-lg leading-tight line-clamp-2 drop-shadow-sm">
                          {proker.judul}
                        </h4>
                      </div>
                    </div>

                    {/* Proker Meta Body */}
                    <div className="p-5 flex flex-col gap-3">
                      {proker.tujuan && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {proker.tujuan}
                        </p>
                      )}

                      {/* Penanggung Jawab */}
                      {proker.penanggung_jawab && proker.penanggung_jawab.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Users className="w-3.5 h-3.5 text-amber-500" />
                          <span className="truncate">
                            PJ: {proker.penanggung_jawab.map(p => p.nama_lengkap).join(', ')}
                          </span>
                        </div>
                      )}

                      {/* Rangkuman Data Mubes (Tambahan Sidang) */}
                      <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Anggaran</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {proker.lpj?.realisasi_anggaran
                              ? `Rp ${Number(proker.lpj.realisasi_anggaran).toLocaleString('id-ID')}`
                              : 'Tercatat di LPJ'}
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pengesahan</span>
                          <span className="font-bold capitalize text-amber-600 dark:text-amber-400">
                            {proker.lpj?.status_pengesahan || 'Siap Diuji'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Buka Mode Presentasi / PPT Sidang */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => {
                        setActiveModalProker(proker);
                        setActiveTab('overview');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-amber-600 dark:bg-slate-700 dark:hover:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Buka Presentasi Sidang (PPT)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Presentasi Proker / Slide PPT Sidang */}
      {activeModalProker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/30">
                  {activeModalProker.sekbid_nomor}
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold block">
                    SEKBID {activeModalProker.sekbid_nomor} • {activeModalProker.sekbid_judul}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-100">
                    {activeModalProker.judul}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveModalProker(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs Mode Sidang */}
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'overview'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Ikhtisar & Visual (Visitor)</span>
              </button>
              <button
                onClick={() => setActiveTab('teknis')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'teknis'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>2. Teknis Pelaksanaan Lengkap</span>
              </button>
              <button
                onClick={() => setActiveTab('lpj')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'lpj'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>3. Realisasi Anggaran & Nota LPJ</span>
              </button>
              <button
                onClick={() => setActiveTab('evaluasi')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'evaluasi'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>4. Evaluasi & Solusi Sidang</span>
              </button>
            </div>

            {/* Modal Body Content per Tab */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
              {/* Tab 1: Overview & Dokumentasi */}
              {activeTab === 'overview' && (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-400 font-semibold block uppercase">Kategori Program</span>
                      <span className="text-base font-bold capitalize mt-1 block">{activeModalProker.kategori}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-400 font-semibold block uppercase">Lokasi Pelaksanaan</span>
                      <span className="text-base font-bold mt-1 block">{activeModalProker.lokasi || 'SMAIT FI'}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-400 font-semibold block uppercase">Penanggung Jawab</span>
                      <span className="text-base font-bold mt-1 block truncate">
                        {activeModalProker.penanggung_jawab?.map(p => p.nama_lengkap).join(', ') || 'Pengurus Sekbid'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                      Tujuan Program Kerja
                    </h4>
                    <p className="text-sm sm:text-base leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      {activeModalProker.tujuan || 'Mendukung visi misi kepengurusan OSIS SMAIT Fithrah Insani.'}
                    </p>
                  </div>

                  {/* Galeri Dokumentasi Kegiatan */}
                  {activeModalProker.dokumentasi && activeModalProker.dokumentasi.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
                        Dokumentasi Pelaksanaan ({activeModalProker.dokumentasi.length} Foto)
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {activeModalProker.dokumentasi.map((doc: any, i: number) => {
                          const docUrl = getStrapiMediaUrl(doc, '');
                          return (
                            <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700">
                              <Image src={docUrl} alt={`Dokumentasi ${i + 1}`} fill className="object-cover" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Teknis Pelaksanaan Lengkap */}
              {activeTab === 'teknis' && (
                <div className="flex flex-col gap-6">
                  <div className="border-l-4 border-amber-500 pl-4 py-1">
                    <h4 className="text-lg font-bold">Standard Operating Procedure & Teknis Lapangan</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Rincian tahapan pra-acara, pelaksanaan hari-H, alur koordinasi, dan pasca-kegiatan.
                    </p>
                  </div>

                  <div className="prose dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 leading-relaxed text-sm whitespace-pre-line">
                    {activeModalProker.teknis_pelaksanaan || (
                      <div className="text-slate-400 italic">
                        Belum ada dokumen teknis rinci yang diunggah untuk program kerja ini. Pelaksanaan mengacu pada TOR Seksi Bidang.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Realisasi Anggaran & Nota LPJ */}
              {activeTab === 'lpj' && (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-5 rounded-2xl">
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase block">
                        Realisasi Anggaran Terpakai
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-2 block">
                        {activeModalProker.lpj?.realisasi_anggaran
                          ? `Rp ${Number(activeModalProker.lpj.realisasi_anggaran).toLocaleString('id-ID')}`
                          : 'Rp 0 / Swadaya'}
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase block">
                        Sumber Pendanaan
                      </span>
                      <span className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-2 block">
                        {activeModalProker.lpj?.sumber_dana || 'Kas OSIS / Sekolah'}
                      </span>
                    </div>
                  </div>

                  {/* Status Pengesahan Sidang */}
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold block uppercase">
                        Status Ketetapan Sidang
                      </span>
                      <span className="text-sm font-bold text-amber-950 dark:text-amber-100 capitalize">
                        {activeModalProker.lpj?.status_pengesahan || 'Menunggu Pengesahan Presidium'}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">
                      Dokumen Sah
                    </span>
                  </div>

                  {/* Lampiran Nota & Kwitansi */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-amber-500" />
                      <span>Lampiran Berkas Nota & Bukti Keuangan</span>
                    </h4>
                    {activeModalProker.lpj?.nota_kwitansi && activeModalProker.lpj.nota_kwitansi.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {activeModalProker.lpj.nota_kwitansi.map((item: any, idx: number) => {
                          const notaUrl = getStrapiMediaUrl(item, '');
                          return (
                            <a
                              key={idx}
                              href={notaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition flex items-center gap-3 text-xs"
                            >
                              <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                              <span className="truncate font-medium">Nota_{idx + 1}.pdf</span>
                            </a>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                        Tidak ada berkas nota/kwitansi tambahan. Semua rekapan telah tertera dalam buku besar bendahara.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Evaluasi & Kendala Solusi */}
              {activeTab === 'evaluasi' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                      Evaluasi Internal Sekbid
                    </h4>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm leading-relaxed whitespace-pre-line">
                      {activeModalProker.lpj?.evaluasi_internal ||
                        activeModalProker.evaluasi_deskripsi ||
                        'Program berjalan sesuai dengan target indikator keberhasilan yang telah ditetapkan.'}
                    </div>
                  </div>

                  {activeModalProker.lpj?.kendala_solusi && (
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
                        Kendala Lapangan & Rekomendasi Solusi
                      </h4>
                      <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-sm leading-relaxed">
                        {typeof activeModalProker.lpj.kendala_solusi === 'string'
                          ? activeModalProker.lpj.kendala_solusi
                          : JSON.stringify(activeModalProker.lpj.kendala_solusi, null, 2)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Gunakan tombol tab di atas untuk menavigasi bagian presentasi sidang.</span>
              <button
                onClick={() => setActiveModalProker(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-semibold hover:bg-slate-800 transition"
              >
                Tutup Layar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
