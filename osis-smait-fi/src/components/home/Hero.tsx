'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchHalamanFromStrapi, getStrapiMediaUrl } from '@/lib/strapi';

const Hero = ({ initialData }: { initialData?: any }) => {
  const initialAttrs = initialData ? (initialData.attributes || initialData) : null;

  const [bannerUrl, setBannerUrl] = useState<string>(() => {
    return initialAttrs?.banner_image ? getStrapiMediaUrl(initialAttrs.banner_image, '') : '';
  });
  const [heroTitle, setHeroTitle] = useState<string>(() => {
    return initialAttrs?.judul_hero || '';
  });
  const [heroSubtitle, setHeroSubtitle] = useState<string>(() => {
    return initialAttrs?.sub_judul || '';
  });

  useEffect(() => {
    // If initialData already contains the required hero details, skip fetching
    if (initialAttrs?.judul_hero || initialAttrs?.banner_image) return;

    async function loadHeroData() {
      const halamanData: any = await fetchHalamanFromStrapi('home');
      if (halamanData) {
        const attrs = halamanData.attributes || halamanData;
        if (attrs.judul_hero) setHeroTitle(attrs.judul_hero);
        if (attrs.sub_judul) setHeroSubtitle(attrs.sub_judul);
        if (attrs.banner_image) {
          const resolved = getStrapiMediaUrl(attrs.banner_image, '');
          if (resolved) setBannerUrl(resolved);
        }
      }
    }
    loadHeroData();
  }, [initialData]);

  return (
    <div className="relative w-full h-[60vh] sm:h-[75vh] md:h-[80vh] min-h-[420px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-950">
      {bannerUrl && (
        <Image
          src={bannerUrl}
          alt="Hero Background"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADwAQCdASoQAAgABUB8JQBOgB4jvyx7SgAA/TyAmPDiYXfjBJe/+SeXGd6p5mIezpD5pMuSDvAAAA=="
          className="absolute inset-0 object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-4 text-center">
        {heroTitle && (
          <h1 className="text-white text-3xl sm:text-5xl md:text-7xl lg:text-[96px] font-semibold leading-tight font-poppins break-words max-w-4xl">
            <span className="text-[#F9F9F9]">{heroTitle}</span>
          </h1>
        )}

        {heroSubtitle && (
          <p className="text-white text-sm sm:text-lg md:text-xl font-light leading-relaxed font-roboto max-w-2xl break-words whitespace-pre-line">
            {heroSubtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default Hero;
