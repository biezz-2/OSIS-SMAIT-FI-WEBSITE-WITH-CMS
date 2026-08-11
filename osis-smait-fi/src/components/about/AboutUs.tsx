'use client';

import React, { useEffect, useState } from 'react';
import { fetchHalamanFromStrapi, fetchMediaAssetByKey, getStrapiMediaUrl } from '@/lib/strapi';
import { useImageQuality } from '@/context/ImageQualityContext';

interface AboutUsProps {
  title?: string;
  initialData?: any;
}

const AboutUs: React.FC<AboutUsProps> = ({ title = "Agora Acta", initialData }) => {
  const initialAttrs = initialData ? (initialData.attributes || initialData) : null;
  const initialMediaList = initialAttrs?.gambar_list?.data || initialAttrs?.gambar_list;
  const initialImg0 = Array.isArray(initialMediaList) && initialMediaList[0] ? getStrapiMediaUrl(initialMediaList[0], '') : (initialAttrs?.banner_image ? getStrapiMediaUrl(initialAttrs.banner_image, '') : '');
  const initialImg1 = Array.isArray(initialMediaList) && initialMediaList[1] ? getStrapiMediaUrl(initialMediaList[1], '') : '';

  const [collabImg, setCollabImg] = useState(initialImg0);
  const [leadershipImg, setLeadershipImg] = useState(initialImg1);
  const [displayTitle, setDisplayTitle] = useState(initialAttrs?.judul_hero || title);
  const [descriptionText, setDescriptionText] = useState<string>(initialAttrs?.deskripsi || '');
  const [quality, setQuality] = useState<number | undefined>(() => {
    return initialAttrs?.compression_quality ?? undefined;
  });
  const [compress, setCompress] = useState<boolean | undefined>(() => {
    return initialAttrs?.enable_compression !== false;
  });
  const { getOptimizedImageUrl } = useImageQuality();

  useEffect(() => {
    if (initialData) return;

    async function loadMedia() {
      const halamanAbout: any = await fetchHalamanFromStrapi('about');
      if (halamanAbout) {
        const attrs = halamanAbout.attributes || halamanAbout;
        if (attrs.judul_hero) setDisplayTitle(attrs.judul_hero);
        if (attrs.deskripsi) setDescriptionText(attrs.deskripsi);
        if (attrs.compression_quality !== undefined) {
          setQuality(attrs.compression_quality);
        }
        if (attrs.enable_compression !== undefined) {
          setCompress(attrs.enable_compression);
        }
        
        const mediaList = attrs.gambar_list?.data || attrs.gambar_list;
        if (Array.isArray(mediaList) && mediaList.length > 0) {
          const img0 = getStrapiMediaUrl(mediaList[0], '');
          if (img0) setCollabImg(img0);
          if (mediaList[1]) {
            const img1 = getStrapiMediaUrl(mediaList[1], '');
            if (img1) setLeadershipImg(img1);
          }
        } else if (attrs.banner_image) {
          const banner = getStrapiMediaUrl(attrs.banner_image, '');
          if (banner) setCollabImg(banner);
        }
      }

      const collab = await fetchMediaAssetByKey('about-collaboration', '');
      if (collab?.src && !collabImg) setCollabImg(collab.src);

      const leadership = await fetchMediaAssetByKey('about-leadership', '');
      if (leadership?.src && !leadershipImg) setLeadershipImg(leadership.src);
    }
    loadMedia();
  }, [initialData]);

  return (
    <section id="about" className="w-full bg-white dark:bg-slate-900 py-16 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Column: Text Content */}
        <div className="flex-1 w-full flex flex-col justify-center items-start gap-8 max-w-2xl">
          <div className="flex flex-col gap-4 w-full">
            <h2 className="text-[#101828] dark:text-slate-100 text-4xl md:text-5xl font-extrabold tracking-tight font-sans leading-tight">
              {displayTitle}
            </h2>
            <div className="w-20 h-1 bg-[#FA982E] rounded-full animate-pulse" />
          </div>
          
          <div className="text-[#4A5565] dark:text-slate-300 text-base md:text-lg font-normal leading-[1.625] font-sans flex flex-col gap-6">
            {descriptionText && <p>{descriptionText}</p>}
          </div>
        </div>

        {/* Right Column: Images Layout */}
        <div className="flex-1 w-full flex justify-center lg:justify-end items-center gap-6 md:gap-8 py-4">
          {collabImg && (
            <div className="w-1/2 max-w-[280px] sm:max-w-[334px] aspect-[334/689] overflow-hidden rounded-[30px] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group relative bg-[#185FA5]">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src={getOptimizedImageUrl(collabImg, quality, compress)} 
                alt="Kolaborasi OSIS Agora Acta" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          )}

          {leadershipImg && (
            <div className="w-1/2 max-w-[280px] sm:max-w-[334px] aspect-[334/689] overflow-hidden rounded-[30px] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 mt-12 lg:mt-16 group relative bg-[#185FA5]">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src={getOptimizedImageUrl(leadershipImg, quality, compress)} 
                alt="Kepemimpinan OSIS Agora Acta" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
