'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchStrapiAPI, formatSekbidList, SeksiBidang } from '@/lib/strapi';
import { useImageQuality } from '@/context/ImageQualityContext';

const SeksiBidangGrid = ({ initialSekbids, quality, compress }: { initialSekbids?: SeksiBidang[]; quality?: any; compress?: any }) => {
  const [sekbidList, setSekbidList] = useState<SeksiBidang[]>(initialSekbids || []);
  const [loading, setLoading] = useState(!initialSekbids || initialSekbids.length === 0);
  const { getOptimizedImageUrl } = useImageQuality();

  useEffect(() => {
    if (initialSekbids && initialSekbids.length > 0) return;

    async function loadSekbids() {
      try {
        const json: any = await fetchStrapiAPI('/api/sekbids?sort=nomor:asc&populate=*');
        const items = json?.data || [];
        if (items.length > 0) {
          setSekbidList(formatSekbidList(items));
        }
      } catch (err) {
        console.warn('Failed to load sekbids from Strapi:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSekbids();
  }, [initialSekbids]);

  if (loading) {
    return (
      <section className="w-full bg-white py-16 px-6 flex justify-center items-center">
        <div className="animate-pulse text-slate-400 text-sm font-medium">
          Memuat daftar Seksi Bidang...
        </div>
      </section>
    );
  }

  if (sekbidList.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white dark:bg-slate-900 py-16 px-6 md:px-12 lg:px-[120px] overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header Section */}
        <div className="w-full pb-6 border-b border-[#E5E7EB] dark:border-slate-800 flex items-end justify-between">
          <h2 className="text-[#101828] dark:text-slate-100 text-3xl md:text-4xl font-serif font-bold leading-tight">
            Seksi Bidang
          </h2>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 w-full">
          {sekbidList.map((sekbid) => (
            <div
              key={sekbid.id}
              className="flex flex-col rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
            >
              {/* Cover Image Header Section - Single Clean Frame */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                {sekbid.image ? (
                  <img
                    src={getOptimizedImageUrl(sekbid.image, quality, compress)}
                    alt={sekbid.number}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px]" />
                )}

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

                {/* Sekbid Label (Absolute Bottom Left) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1 z-20">
                  <h3 className="text-white text-2xl font-serif font-bold leading-tight drop-shadow-sm">
                    {sekbid.number}
                  </h3>
                  <p className="text-white/80 text-sm font-sans font-normal leading-tight">
                    {sekbid.name}
                  </p>
                </div>
              </div>

              {/* Description & Showcase Info Section */}
              <div className="p-6 flex flex-col justify-between flex-grow gap-6">
                {/* Main description text */}
                <p className="text-[#4A5565] dark:text-slate-300 text-sm font-sans font-normal leading-relaxed">
                  {sekbid.description}
                </p>

                {/* Program Highlight Container */}
                <div className="flex flex-col gap-4 border-t border-gray-100 dark:border-slate-700/60 pt-4">
                  {/* Category badge */}
                  <span className="text-[#99A1AF] dark:text-slate-400 text-[10px] font-sans font-bold uppercase tracking-wider">
                    {sekbid.highlightType}
                  </span>

                  {/* Program Content */}
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-[#101828] dark:text-slate-100 text-sm font-sans font-bold leading-snug">
                      {sekbid.highlightTitle}
                    </h4>
                    <p className="text-[#6A7282] dark:text-slate-300 text-xs font-sans font-normal leading-relaxed">
                      {sekbid.highlightDesc}
                    </p>
                  </div>
                </div>

                {/* Footer "Lihat Detail" link */}
                <div className="flex justify-end pt-2 border-t border-gray-50 dark:border-slate-700/40">
                  <Link
                    href={sekbid.link}
                    className="inline-flex items-center gap-1 text-[#7A9EAD] dark:text-sky-300 hover:text-[#5F8291] dark:hover:text-sky-200 font-sans font-bold text-xs leading-none transition-colors duration-200"
                  >
                    <span>Lihat Detail</span>
                    <svg
                      className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeksiBidangGrid;
