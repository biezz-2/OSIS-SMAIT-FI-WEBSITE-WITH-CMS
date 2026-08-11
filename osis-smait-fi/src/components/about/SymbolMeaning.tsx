'use client';

import React, { useEffect, useState } from 'react';
import { fetchHalamanFromStrapi, fetchMediaAssetByKey, getStrapiMediaUrl } from '@/lib/strapi';
import { useImageQuality } from '@/context/ImageQualityContext';

interface SymbolItem {
  variant?: number;
  title: string;
  description: string;
}

interface SymbolCardProps {
  index: number;
  title: string;
  description: string;
}

const DEFAULT_SYMBOLS: SymbolItem[] = [
  {
    variant: 1,
    title: 'Lingkaran',
    description: 'Melambangkan regenerasi yang terus berlanjut dan tidak pernah terputus.',
  },
  {
    variant: 2,
    title: 'Warna Hitam',
    description: 'Simbol keberanian dan rasa percaya diri yang selalu dimiliki oleh pengurus.',
  },
  {
    variant: 3,
    title: 'Empat Titik',
    description: 'Melambangkan struktur inti OSIS yang terdiri dari empat anggota utama.',
  },
  {
    variant: 4,
    title: "Al-Qur'an",
    description: 'Menjadi landasan dari setiap program kerja sesuai nilai-nilai Islam.',
  },
  {
    variant: 5,
    title: 'Garis Terputus',
    description: 'Meskipun terdiri dari ikhwan dan akhwat, tetap menjaga batasan sesuai syariat.',
  },
  {
    variant: 6,
    title: 'Garis Emas',
    description: 'Setiap generasi selalu berprestasi dan membawa pencapaian membanggakan.',
  },
  {
    variant: 7,
    title: 'Logo FI',
    description: 'Menunjukkan naungan Sekolah Islam Terpadu Fithrah Insani.',
  },
];

const SymbolCard: React.FC<SymbolCardProps> = ({ index, title, description }) => {
  const formattedIndex = String(index).padStart(2, '0');

  return (
    <div className="w-full min-h-[105px] p-5 sm:p-6 bg-white dark:bg-slate-800/90 hover:bg-slate-50/80 dark:hover:bg-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] rounded-2xl border border-slate-100 dark:border-slate-700/60 hover:border-emerald-200/60 flex items-start gap-4 transition-all duration-300 group transform hover:-translate-y-0.5">
      {/* Elegant Index Number Badge (No icons/emojis used) */}
      <div className="w-8 h-8 bg-slate-100/80 dark:bg-slate-700 group-hover:bg-emerald-100/60 dark:group-hover:bg-emerald-900/40 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 text-slate-500 dark:text-slate-300 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 text-xs font-bold font-mono tracking-tight">
        {formattedIndex}
      </div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <h3 className="text-[#101828] dark:text-slate-100 text-sm font-semibold font-sans leading-snug group-hover:text-emerald-950 dark:group-hover:text-emerald-300 transition-colors">
          {title}
        </h3>
        <p className="text-[#6A7282] dark:text-slate-300 text-xs font-normal font-sans leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const SymbolMeaning: React.FC<{ initialData?: any }> = ({ initialData }) => {
  const initialAttrs = initialData ? (initialData.attributes || initialData) : null;
  const initialSymbols = (initialAttrs?.metadata_json?.symbols && Array.isArray(initialAttrs.metadata_json.symbols) && initialAttrs.metadata_json.symbols.length > 0)
    ? initialAttrs.metadata_json.symbols
    : DEFAULT_SYMBOLS;
  const initialBanner = initialAttrs?.banner_image ? getStrapiMediaUrl(initialAttrs.banner_image, '') : '';

  const [symbols, setSymbols] = useState<SymbolItem[]>(initialSymbols);
  const [bannerImg, setBannerImg] = useState<string>(initialBanner);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [quality, setQuality] = useState<number | undefined>(() => {
    return initialAttrs?.compression_quality ?? undefined;
  });
  const [compress, setCompress] = useState<boolean | undefined>(() => {
    return initialAttrs?.enable_compression !== false;
  });
  const { getOptimizedImageUrl } = useImageQuality();

  useEffect(() => {
    async function loadAboutPageData() {
      if (!initialData) {
        setLoading(true);
        const pageData = await fetchHalamanFromStrapi('about');
        if (pageData) {
          const attrs = pageData.attributes || pageData;
          const img = getStrapiMediaUrl(attrs.banner_image, '');
          if (img) {
            setBannerImg(img);
          } else {
            const logoAsset = await fetchMediaAssetByKey('logo', '');
            if (logoAsset?.src) setBannerImg(logoAsset.src);
          }

          if (attrs.metadata_json && attrs.metadata_json.symbols && Array.isArray(attrs.metadata_json.symbols) && attrs.metadata_json.symbols.length > 0) {
            setSymbols(attrs.metadata_json.symbols);
          }

          if (attrs.compression_quality !== undefined) {
            setQuality(attrs.compression_quality);
          }
          if (attrs.enable_compression !== undefined) {
            setCompress(attrs.enable_compression);
          }
        } else {
          const logoAsset = await fetchMediaAssetByKey('logo', '');
          if (logoAsset?.src) setBannerImg(logoAsset.src);
        }
        setLoading(false);
      } else {
        if (!initialBanner) {
          fetchMediaAssetByKey('logo', '').then((logoAsset) => {
            if (logoAsset?.src) setBannerImg(logoAsset.src);
          });
        }
      }
    }
    loadAboutPageData();
  }, [initialData, initialBanner]);

  if (loading) {
    return (
      <section className="w-full bg-white py-16 px-6 flex justify-center items-center">
        <div className="animate-pulse text-slate-400 text-sm font-medium">
          Memuat makna simbol...
        </div>
      </section>
    );
  }

  const displaySymbols = (symbols && symbols.length > 0) ? symbols : DEFAULT_SYMBOLS;

  return (
    <section className="w-full bg-white dark:bg-slate-900 py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16">
        
        {/* Left Column: Elegant Logo Display (Green lines removed) */}
        <div className="w-full lg:w-auto flex justify-center items-center py-4 lg:py-6 shrink-0">
          <div className="relative flex items-center justify-center p-2">
            {/* Subtle ambient backdrop glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-amber-500/10 rounded-3xl filter blur-2xl transform scale-95" />
            <div className="absolute -inset-2 bg-slate-50/70 dark:bg-slate-800/70 rounded-[32px] border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm -z-10" />

            {/* Center OSIS Logo Container */}
            <div className="relative z-10 w-[260px] sm:w-[310px] h-[280px] sm:h-[330px] bg-white dark:bg-slate-800 rounded-2xl p-6 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 group transition-all duration-500 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)]">
              <img 
                src={getOptimizedImageUrl(bannerImg || '/images/logo-fiedufest.png', quality, compress)} 
                alt="Logo OSIS SMAIT Fithrah Insani" 
                className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-[1.03] transition-all duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/304x320?text=Logo+OSIS';
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Title, Subtitle, and 2-Column Cards Grid */}
        <div className="w-full lg:flex-1 flex flex-col justify-start items-start gap-8">
          <div className="w-full flex flex-col justify-start items-start gap-4">
            
            {/* Title */}
            <div className="w-full flex items-center justify-start gap-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-[#AACDDC] to-emerald-500 rounded-full shrink-0" />
              <h2 className="text-[#101828] dark:text-slate-100 text-2xl sm:text-3xl font-bold font-playfair leading-tight tracking-tight">
                Makna Simbol OSIS
              </h2>
            </div>

            {/* Subtitle */}
            <div className="w-full max-w-2xl">
              <p className="text-[#4A5565] dark:text-slate-300 text-sm sm:text-base font-normal font-sans leading-relaxed">
                Mengenal lebih dekat pengurus OSIS SMAIT Fithrah Insani periode 2024-2025 melalui makna simbol yang kami bawa.
              </p>
            </div>

            {/* 2-Column Grid for Symbol Cards with Numeric Badges */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {displaySymbols.map((symbol, idx) => (
                <SymbolCard 
                  key={idx} 
                  index={idx + 1}
                  title={symbol.title}
                  description={symbol.description}
                />
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default SymbolMeaning;

