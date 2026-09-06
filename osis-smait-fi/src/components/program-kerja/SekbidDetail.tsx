'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchSekbidFromStrapi, getStrapiMediaUrl } from '@/lib/strapi';
import { useImageQuality } from '@/context/ImageQualityContext';

export interface ProgramItem {
  slug: string;
  category?: 'rutinan' | 'insidental';
  title: string;
  desc: string;
  bgColor: string;
  iconColor: string;
  icon?: React.ReactNode;
}

const defaultIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ProgramCard = ({ item, sekbidNumber }: { item: ProgramItem; sekbidNumber: number | string }) => {
  const targetUrl = item.category
    ? `/sekbid/sekbid-${sekbidNumber}/${item.category}/${item.slug}`
    : `/sekbid/sekbid-${sekbidNumber}/${item.slug}`;

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full hover:shadow-md transition-all duration-200">
      <div>
        <div className={`w-12 h-12 ${item.bgColor || 'bg-blue-50'} ${item.iconColor || 'text-blue-600'} rounded-2xl flex items-center justify-center mb-6`}>
          {item.icon || defaultIcon}
        </div>
        <h3 className="text-[#101828] text-lg font-bold mb-3">{item.title}</h3>
        <p className="text-[#6A7282] text-sm leading-relaxed mb-6 font-normal">{item.desc}</p>
      </div>

      <Link
        href={targetUrl}
        className="flex items-center gap-1.5 text-[#D32F2F] font-bold text-sm hover:gap-2 transition-all duration-200 w-fit"
      >
        <span>Lihat detail</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};

interface SekbidData {
  title: string;
  subtitle: string;
  bannerImg?: string;
  rutinan: ProgramItem[];
  insidental: ProgramItem[];
}

export function formatSekbidData(strapiSekbid: any, numKey: number | string): SekbidData | null {
  if (!strapiSekbid) return null;
  const attrs = strapiSekbid.attributes || strapiSekbid;
  const bannerUrl = getStrapiMediaUrl(attrs.banner, '');

  const prokerList = attrs.program_kerjas?.data || attrs.program_kerjas || [];
  const rutinan: ProgramItem[] = [];
  const insidental: ProgramItem[] = [];

  prokerList.forEach((pkItem: any) => {
    const pk = pkItem.attributes || pkItem;
    const item: ProgramItem = {
      slug: pk.slug,
      category: pk.kategori === 'insidental' ? 'insidental' : 'rutinan',
      title: pk.judul,
      desc: pk.tujuan || pk.deskripsi || '',
      bgColor: pk.bg_color || 'bg-[#AACDDC]/10',
      iconColor: pk.icon_color || 'text-[#D32F2F]',
    };
    if (pk.kategori === 'insidental') {
      insidental.push(item);
    } else {
      rutinan.push(item);
    }
  });

  return {
    title: attrs.judul || `Seksi Bidang ${numKey}`,
    subtitle: attrs.visi || attrs.deskripsi || '',
    bannerImg: bannerUrl,
    rutinan,
    insidental,
  };
}

export default function SekbidDetail({ number, initialData }: { number: number | string; initialData?: any }) {
  const numKey = typeof number === 'number' ? number : parseInt(String(number).replace(/\D/g, ''), 10) || 1;
  const [data, setData] = useState<SekbidData | null>(() => {
    return initialData ? formatSekbidData(initialData, numKey) : null;
  });
  const [quality, setQuality] = useState<number | undefined>(() => {
    const attrs = initialData?.attributes || initialData;
    return attrs?.compression_quality ?? undefined;
  });
  const [compress, setCompress] = useState<boolean | undefined>(() => {
    const attrs = initialData?.attributes || initialData;
    return attrs?.enable_compression !== false;
  });
  const [loading, setLoading] = useState(!initialData);
  const { getOptimizedImageUrl } = useImageQuality();

  useEffect(() => {
    if (initialData) {
      setData(formatSekbidData(initialData, numKey));
      setLoading(false);
      return;
    }

    async function loadSekbidFromStrapi() {
      setLoading(true);
      const strapiSekbid = await fetchSekbidFromStrapi(numKey);
      if (strapiSekbid) {
        setData(formatSekbidData(strapiSekbid, numKey));
        const attrs = strapiSekbid.attributes || strapiSekbid;
        if (attrs.compression_quality !== undefined) {
          setQuality(attrs.compression_quality);
        }
        if (attrs.enable_compression !== undefined) {
          setCompress(attrs.enable_compression);
        }
      }
      setLoading(false);
    }

    loadSekbidFromStrapi();
  }, [numKey, initialData]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F7F7] flex flex-col font-sans justify-center items-center">
        <Navbar />
        <div className="py-24 animate-pulse text-slate-400 text-base font-medium">
          Memuat data Seksi Bidang {numKey}...
        </div>
        <Footer />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#F7F7F7] flex flex-col font-sans justify-center items-center">
        <Navbar />
        <div className="py-24 text-slate-500 text-base font-medium">
          Seksi Bidang {numKey} tidak ditemukan di Strapi.
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F7F7] flex flex-col font-sans">
      <Navbar />

      {/* Hero Header Section */}
      <section className="w-full flex flex-col md:flex-row bg-[#AACDDC] min-h-[500px]">
        {/* Left Banner Text */}
        <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center gap-6">
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold font-serif leading-tight">
            Sekbid {numKey}
          </h1>
          <div className="flex flex-col gap-1">
            <h2 className="text-[#36ADF6] text-xl font-bold">{data.title}</h2>
            <p className="text-[#36ADF6]/80 text-sm font-medium">{data.subtitle}</p>
          </div>
          <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-lg">
            Mewujudkan visi dan misi melalui aksi nyata. Bersinergi membangun SMAIT Fithrah Insani yang lebih gemilang.
          </p>
        </div>

        {/* Right Hero Image Section - Single Clean Frame */}
        <div className="w-full md:w-1/2 bg-[#1E293B] relative min-h-[350px] md:min-h-full flex items-center justify-center overflow-hidden">
          {data.bannerImg ? (
            <img
              src={getOptimizedImageUrl(data.bannerImg, quality, compress)}
              alt={`Banner Sekbid ${numKey}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#0F172A] flex items-center justify-center">
              <span className="text-white/20 text-8xl font-serif font-bold select-none">
                SEKBID {numKey}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 flex flex-col gap-16">
        {/* Section Title */}
        <div className="flex flex-col items-center text-center gap-2">
          <h2 className="text-[#101828] text-3xl md:text-4xl font-bold">
            Program Kerja Sekbid {numKey}
          </h2>
          <p className="text-[#6A7282] text-sm md:text-base max-w-xl">
            Berbagai inisiatif dan kegiatan yang dirancang untuk membangun karakter siswa.
          </p>
        </div>

        {/* Program Rutinan / Main Programs */}
        {data.rutinan && data.rutinan.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <div className="bg-[#D32F2F]/10 text-[#D32F2F] font-bold text-base px-5 py-2.5 rounded-2xl flex items-center gap-3">
                <svg className="w-5 h-5 text-[#D32F2F]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{numKey === 8 ? 'Program Kerja Media & Komunikasi' : 'Program Rutinan'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.rutinan.map((item, index) => (
                <ProgramCard key={index} item={item} sekbidNumber={numKey} />
              ))}
            </div>
          </div>
        )}

        {/* Program Insidental */}
        {data.insidental && data.insidental.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <div className="bg-[#D32F2F]/10 text-[#D32F2F] font-bold text-base px-5 py-2.5 rounded-2xl flex items-center gap-3">
                <svg className="w-5 h-5 text-[#D32F2F]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Program Insidental</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.insidental.map((item, index) => (
                <ProgramCard key={index} item={item} sekbidNumber={numKey} />
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
