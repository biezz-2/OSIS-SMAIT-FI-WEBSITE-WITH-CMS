'use client';

import React, { useEffect, useState } from 'react';
import { fetchHalamanFromStrapi, getStrapiMediaUrl } from '@/lib/strapi';
import { useImageQuality } from '@/context/ImageQualityContext';

const ProgramKerja = ({ initialData }: { initialData?: any }) => {
  const initialAttrs = initialData ? (initialData.attributes || initialData) : null;
  const initialBanner = initialAttrs?.banner_image ? getStrapiMediaUrl(initialAttrs.banner_image, '') : '';

  const [bannerUrl, setBannerUrl] = useState<string>(initialBanner);
  const [title, setTitle] = useState<string>(initialAttrs?.judul_hero || '');
  const [subTitle, setSubTitle] = useState<string>(initialAttrs?.sub_judul || '');
  const [description, setDescription] = useState<string>(initialAttrs?.deskripsi || '');
  const [quality, setQuality] = useState<number | undefined>(() => {
    return initialAttrs?.compression_quality ?? undefined;
  });
  const [compress, setCompress] = useState<boolean | undefined>(() => {
    return initialAttrs?.enable_compression !== false;
  });
  const [loading, setLoading] = useState<boolean>(!initialData);
  const { getOptimizedImageUrl } = useImageQuality();

  useEffect(() => {
    if (initialData) return;

    async function loadData() {
      setLoading(true);
      const data: any = await fetchHalamanFromStrapi('program-kerja');
      if (data) {
        const attrs = data.attributes || data;
        if (attrs.judul_hero) setTitle(attrs.judul_hero);
        if (attrs.sub_judul) setSubTitle(attrs.sub_judul);
        if (attrs.deskripsi) setDescription(attrs.deskripsi);
        if (attrs.banner_image) {
          const img = getStrapiMediaUrl(attrs.banner_image, '');
          if (img) setBannerUrl(img);
        }
        if (attrs.compression_quality !== undefined) {
          setQuality(attrs.compression_quality);
        }
        if (attrs.enable_compression !== undefined) {
          setCompress(attrs.enable_compression);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [initialData]);

  if (loading) {
    return (
      <div className="w-full min-h-[300px] bg-[#185FA5] flex items-center justify-center p-12">
        <div className="animate-pulse text-blue-100 text-sm font-medium">
          Memuat program kerja...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden flex flex-col justify-start items-start">
      <div className="w-full min-h-[600px] lg:h-[807px] relative bg-white overflow-hidden flex flex-col lg:flex-row">

        {/* Left Content Side */}
        <div className="w-full lg:w-[50%] min-h-[400px] lg:h-full bg-[#185FA5] p-8 md:p-16 lg:p-24 flex flex-col justify-center gap-8 z-10">
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-extrabold font-poppins leading-tight whitespace-pre-line">
            {title}
          </h1>

          <div className="flex flex-col gap-3">
            <h2 className="text-[#FA982E] text-xl md:text-2xl font-bold font-poppins">
              {subTitle}
            </h2>
            <p className="text-blue-100 text-base md:text-lg font-roboto leading-relaxed max-w-lg whitespace-pre-line">
              {description}
            </p>
          </div>
        </div>

        {/* Right Image Side - Single Clean Frame */}
        <div className="w-full lg:w-[50%] min-h-[350px] lg:h-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
          {bannerUrl ? (
            <img
              className="w-full h-full object-cover"
              src={getOptimizedImageUrl(bannerUrl, quality, compress)}
              alt="Program Kerja Banner"
            />
          ) : (
            <div className="text-slate-500 text-sm font-sans">Tidak ada banner</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#185FA5]/80 via-transparent to-transparent pointer-events-none z-20" />
        </div>

      </div>
    </div>
  );
};

export default ProgramKerja;
