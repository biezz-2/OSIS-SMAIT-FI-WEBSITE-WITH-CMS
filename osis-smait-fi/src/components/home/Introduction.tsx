'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { fetchHalamanFromStrapi, fetchMediaAssetsByCategory, fetchMediaAssetByKey, getStrapiMediaUrl } from '@/lib/strapi';

interface ImageItem {
  src: string;
  alt: string;
}

const defaultFallbackImages = [
  '/media/about/osis_about_collaboration.jpg',
  '/images/hover-1.JPG',
  '/media/about/osis_about_leadership.jpg',
  '/images/hover-2.JPG',
  '/media/about/osis_about_collaboration.jpg',
  '/images/hover-1.JPG',
  '/media/about/osis_about_leadership.jpg',
];

const Introduction = ({ initialData }: { initialData?: any }) => {
  const initialAttrs = initialData ? (initialData.attributes || initialData) : null;
  const initialMediaList = initialAttrs?.gambar_list?.data || initialAttrs?.gambar_list;
  const initialExtracted = (Array.isArray(initialMediaList) && initialMediaList.length > 0)
    ? initialMediaList.map((item: any, idx: number) => ({
      src: getStrapiMediaUrl(item, ''),
      alt: item.attributes?.alternativeText || item.name || `Foto Kegiatan ${idx + 1}`,
    })).filter((i: ImageItem) => i.src)
    : [];

  const [bgImage, setBgImage] = useState<string>(() => {
    return initialAttrs?.background_image ? getStrapiMediaUrl(initialAttrs.background_image, '') : '';
  });
  const [overlayImg, setOverlayImg] = useState<string>(() => {
    return initialAttrs?.overlay_image ? getStrapiMediaUrl(initialAttrs.overlay_image, '') : '';
  });
  const [images, setImages] = useState<ImageItem[]>(initialExtracted);
  const [loading, setLoading] = useState(!initialData);

  // Helper: baca field eksplisit Strapi, fallback ke metadata_json untuk backward compat
  const resolveField = (attrs: any, explicitKey: string, jsonKey: string, fallback: string) =>
    attrs?.[explicitKey] || attrs?.metadata_json?.[jsonKey] || attrs?.metadata_json?.[explicitKey] || fallback;

  const [content, setContent] = useState({
    title: initialAttrs?.judul_hero || 'Dari Gagasan Menuju Aksi,\ndari Partisipasi Menuju Kontribusi',
    description: initialAttrs?.deskripsi || initialAttrs?.sub_judul || '',
    overlayText: resolveField(initialAttrs, 'overlay_text', 'gallery_overlay_text', 'Bergerak\nBersama,\nMenciptakan Jejak\nPositif'),
  });

  const [customStyle, setCustomStyle] = useState({
    backgroundColor: resolveField(initialAttrs, 'bg_color', 'bg_color', '#185FA5'),
    backgroundImage: `radial-gradient(${resolveField(initialAttrs, 'dot_color', 'dot_color', 'rgba(0, 0, 0, 0.25)')} ${resolveField(initialAttrs, 'dot_size', 'dot_size', '2.5px')}, transparent ${resolveField(initialAttrs, 'dot_size', 'dot_size', '2.5px')})`,
    backgroundSize: resolveField(initialAttrs, 'dot_gap', 'dot_gap', '24px 24px'),
  });

  // Drag-to-scroll refs & state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  useEffect(() => {
    // Skip client-side fetch only if initialData has the necessary visual/content fields populated
    if (initialData && (initialAttrs?.gambar_list || initialAttrs?.background_image || initialAttrs?.judul_hero)) return;

    async function loadData() {
      setLoading(true);

      // Helper: baca field eksplisit Strapi, fallback ke metadata_json
      const resolveAttr = (attrs: any, explicitKey: string, jsonKey: string, fallback: string) =>
        attrs?.[explicitKey] || attrs?.metadata_json?.[jsonKey] || attrs?.metadata_json?.[explicitKey] || fallback;

      const halaman: any = await fetchHalamanFromStrapi('home');

      // Gunakan variabel lokal untuk tracking, bukan state (hindari stale closure)
      let localImages: ImageItem[] = [];

      if (halaman) {
        const attrs = halaman.attributes || halaman;

        setContent({
          title: attrs.judul_hero || 'Dari Gagasan Menuju Aksi,\ndari Partisipasi Menuju Kontribusi',
          description: attrs.deskripsi || attrs.sub_judul || '',
          overlayText: resolveAttr(attrs, 'overlay_text', 'gallery_overlay_text', 'Bergerak\nBersama,\nMenciptakan Jejak\nPositif'),
        });

        // Baca field eksplisit styling (dengan fallback ke metadata_json)
        const bgCol = resolveAttr(attrs, 'bg_color', 'bg_color', '#185FA5');
        const dotCol = resolveAttr(attrs, 'dot_color', 'dot_color', 'rgba(0, 0, 0, 0.25)');
        const dotSize = resolveAttr(attrs, 'dot_size', 'dot_size', '2.5px');
        const dotGap = resolveAttr(attrs, 'dot_gap', 'dot_gap', '24px 24px');
        setCustomStyle({
          backgroundColor: bgCol,
          backgroundImage: `radial-gradient(${dotCol} ${dotSize}, transparent ${dotSize})`,
          backgroundSize: dotGap,
        });

        // Hanya gunakan background_image khusus, tidak fallback ke banner_image Hero
        const customBg = attrs.background_image ? getStrapiMediaUrl(attrs.background_image, '') : '';
        if (customBg) setBgImage(customBg);

        const customOverlay = attrs.overlay_image ? getStrapiMediaUrl(attrs.overlay_image, '') : '';
        if (customOverlay) {
          setOverlayImg(customOverlay);
        } else {
          // Fallback check ke Media Asset dengan key 'home-overlay-image'
          const asset = await fetchMediaAssetByKey('home-overlay-image', '');
          if (asset?.src) setOverlayImg(asset.src);
        }

        // Ambil gambar gallery dari gambar_list
        const mediaList = attrs.gambar_list?.data || attrs.gambar_list;
        if (Array.isArray(mediaList) && mediaList.length > 0) {
          const extracted = mediaList.map((item: any, idx: number) => ({
            src: getStrapiMediaUrl(item, ''),
            alt: item.attributes?.alternativeText || item.name || `Foto Kegiatan ${idx + 1}`,
          })).filter((i: ImageItem) => i.src);

          if (extracted.length > 0) {
            localImages = extracted;
            setImages(extracted);
          }
        }
      }

      // FIX: gunakan localImages (bukan state `images` yang stale)
      // agar pengecekan tidak membaca nilai state lama
      if (localImages.length === 0) {
        const categoryAssets = await fetchMediaAssetsByCategory('hero');
        if (categoryAssets.length > 0) {
          setImages(categoryAssets.map(a => ({ src: a.src, alt: a.title })));
        }
      }

      setLoading(false);
    }

    loadData();
  }, [initialData]);

  // Center the scroll on initial mount for optimal aesthetic presentation
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Scroll to show the central card in view
      const centerScroll = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollLeft = centerScroll;
    }
  }, [loading, images]);

  // Mouse Drag Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.35; // scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Touch Event Handlers for Mobile Swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.35;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const getSlotImage = (index: number) => {
    if (images && images.length > 0) {
      return images[index % images.length].src;
    }
    return defaultFallbackImages[index % defaultFallbackImages.length];
  };

  const getSlotAlt = (index: number) => {
    if (images && images.length > 0) {
      return images[index % images.length].alt;
    }
    return `Foto Kegiatan OSIS ${index + 1}`;
  };

  if (loading) {
    return (
      <section className="relative w-full bg-[#185FA5] py-20 px-4 md:px-8 overflow-hidden text-white flex justify-center items-center">
        <div className="animate-pulse text-blue-200 text-sm font-medium font-poppins">
          Memuat informasi...
        </div>
      </section>
    );
  }

  const titleText = content.title || 'Dari Gagasan Menuju Aksi,\ndari Partisipasi Menuju Kontribusi';

  return (
    <section
      className="relative w-full py-16 md:py-24 overflow-hidden text-[#FCFBFA] select-none"
      style={customStyle}
    >
      {/* Optional Strapi Background Banner */}
      {bgImage && (
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
      )}

      {/* Header Container */}
      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center flex flex-col items-center gap-6 mb-12 md:mb-16">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold font-poppins text-[#FCFBFA] leading-tight md:leading-[65px] tracking-tight max-w-4xl whitespace-pre-line"
        >
          {titleText}
        </h2>

        <div className="max-w-4xl text-base sm:text-lg md:text-[20px] font-poppins leading-relaxed md:leading-[30px] text-[#FCFBFA]/90">
          {content.description ? (
            <p>{content.description}</p>
          ) : (
            <p>
              <span className="font-extrabold text-[#FCFBFA]">Agora Acta </span>
              <span className="font-normal text-[#FCFBFA]/90">
                bukan sekadar organisasi, melainkan ruang bersama tempat ide bertumbuh, kolaborasi terjadi, dan setiap kegiatan dihadirkan dengan tujuan yang nyata dan berdampak bagi seluruh warga sekolah.
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Draggable Gallery Slider */}
      <div className="w-full relative z-10">
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          className={`w-full overflow-x-auto no-scrollbar scrollbar-none py-6 px-8 md:px-16 flex items-center gap-6 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          style={{ touchAction: 'pan-x' }}
        >
          <div className="flex items-center gap-4 sm:gap-6 min-w-max mx-auto py-2">

            {/* Track 1: Leftmost Single Tall Card */}
            <div className="w-[260px] sm:w-[320px] md:w-[360px] h-[420px] sm:h-[500px] md:h-[680px] shrink-0 rounded-2xl overflow-hidden shadow-xl bg-slate-900/40 relative group">
              <Image
                src={getSlotImage(0)}
                alt={getSlotAlt(0)}
                fill
                sizes="360px"
                draggable={false}
                className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              />
            </div>

            {/* Track 2: Left Stacked Column (Short top, Tall bottom) */}
            <div className="w-[240px] sm:w-[300px] md:w-[340px] h-[420px] sm:h-[500px] md:h-[680px] shrink-0 flex flex-col gap-4 sm:gap-6">
              {/* Top Short Card */}
              <div className="w-full h-[170px] sm:h-[210px] md:h-[280px] rounded-2xl overflow-hidden shadow-xl bg-slate-900/40 relative group">
                <Image
                  src={getSlotImage(1)}
                  alt={getSlotAlt(1)}
                  fill
                  sizes="340px"
                  draggable={false}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
              </div>
              {/* Bottom Tall Card */}
              <div className="w-full h-[234px] sm:h-[266px] md:h-[376px] rounded-2xl overflow-hidden shadow-xl bg-slate-900/40 relative group">
                <Image
                  src={getSlotImage(2)}
                  alt={getSlotAlt(2)}
                  fill
                  sizes="340px"
                  draggable={false}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
              </div>
            </div>

            {/* Track 3 (Center): Central Hero Card with Text Overlay */}
            <div className="w-[280px] sm:w-[360px] md:w-[420px] h-[420px] sm:h-[500px] md:h-[680px] shrink-0 rounded-2xl overflow-hidden shadow-2xl bg-slate-900/60 relative group">
              <Image
                src={overlayImg || getSlotImage(3)}
                alt={getSlotAlt(3)}
                fill
                sizes="420px"
                draggable={false}
                className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

              {/* Overlay Text */}
              <div className="absolute bottom-6 sm:bottom-10 left-5 sm:left-8 right-5 sm:right-8 pointer-events-none flex flex-col justify-end">
                <h3
                  className="text-xl sm:text-3xl md:text-[40px] font-semibold font-poppins text-[#FCFBFA] leading-snug md:leading-[60px] tracking-tight drop-shadow-md whitespace-pre-line"
                >
                  {content.overlayText}
                </h3>
              </div>
            </div>

            {/* Track 4: Right Stacked Column (Tall top, Short bottom) */}
            <div className="w-[240px] sm:w-[300px] md:w-[340px] h-[420px] sm:h-[500px] md:h-[680px] shrink-0 flex flex-col gap-4 sm:gap-6">
              {/* Top Tall Card */}
              <div className="w-full h-[234px] sm:h-[266px] md:h-[376px] rounded-2xl overflow-hidden shadow-xl bg-slate-900/40 relative group">
                <Image
                  src={getSlotImage(4)}
                  alt={getSlotAlt(4)}
                  fill
                  sizes="340px"
                  draggable={false}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
              </div>
              {/* Bottom Short Card */}
              <div className="w-full h-[170px] sm:h-[210px] md:h-[280px] rounded-2xl overflow-hidden shadow-xl bg-slate-900/40 relative group">
                <Image
                  src={getSlotImage(5)}
                  alt={getSlotAlt(5)}
                  fill
                  sizes="340px"
                  draggable={false}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
              </div>
            </div>

            {/* Track 5: Rightmost Single Tall Card */}
            <div className="w-[260px] sm:w-[320px] md:w-[360px] h-[420px] sm:h-[500px] md:h-[680px] shrink-0 rounded-2xl overflow-hidden shadow-xl bg-slate-900/40 relative group">
              <Image
                src={getSlotImage(6)}
                alt={getSlotAlt(6)}
                fill
                sizes="360px"
                draggable={false}
                className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
