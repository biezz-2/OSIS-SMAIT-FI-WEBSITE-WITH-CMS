'use client';

import React from 'react';
import Image from 'next/image';

interface MubesHeroProps {
  className?: string;
}

export default function MubesHero({ className = '' }: MubesHeroProps) {
  return (
    <div className={`flex flex-col items-center lg:items-start text-center lg:text-left z-10 w-full max-w-2xl xl:max-w-3xl ${className}`}>
      {/* Eyebrow Header */}
      <div className="flex items-center gap-[16px] mb-4 md:mb-6">
        <div className="relative w-[40px] h-[8px] shrink-0">
          <Image
            src="/images/mubes/eyebrow-left.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <span className="font-['Cinzel',serif] text-[12px] md:text-[13px] font-normal tracking-[4px] text-[#d1ba94] uppercase whitespace-nowrap">
          AGORA ACTA • MUSYAWARAH BESAR
        </span>
        <div className="relative w-[40px] h-[8px] shrink-0">
          <Image
            src="/images/mubes/eyebrow-right.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Main Title Cormorant Garamond */}
      <h1 className="font-['Cormorant_Garamond',serif] font-bold text-[32px] sm:text-[44px] md:text-[54px] lg:text-[64px] text-[#faf0db] leading-[1.15] lg:leading-[84px] tracking-tight">
        Dari Gagasan Menuju Aksi, dari Partisipasi Menuju Kontribusi
      </h1>

      {/* Medieval Gold Ornament Divider */}
      <div className="my-5 md:my-6 relative w-[280px] sm:w-[320px] md:w-[340px] h-[20px] shrink-0 mx-auto lg:mx-0">
        <Image
          src="/images/mubes/ornament-divider.svg"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Description */}
      <p className="font-['Cormorant_Garamond',serif] font-medium text-lg sm:text-xl md:text-[22px] text-[#d9cfbd] leading-relaxed md:leading-[32px] max-w-[710px]">
        Halaman yang berisi pertanggungjawaban kepengurusan OSIS SMAIT Fithrah Insani, evaluasi program kerja sekbid, dan dokumen lainnya.
      </p>

      {/* Feature Blocks Row */}
      <div className="mt-8 md:mt-10 flex items-center justify-center lg:justify-start gap-[28px]">
        {/* Item 1 */}
        <div className="flex flex-col items-center text-center gap-[10px] shrink-0">
          <div className="relative size-[28px] shrink-0">
            <Image
              src="/images/mubes/feature-program.svg"
              alt="Program Kreatif"
              fill
              className="object-contain"
            />
          </div>
          <div className="font-['Cinzel',serif] font-normal text-[13px] text-[#e5d9c2] tracking-[1px] leading-[18px]">
            <p className="mb-0">PROGRAM</p>
            <p>KREATIF</p>
          </div>
        </div>

        <div className="h-[46px] w-px bg-[rgba(217,181,115,0.25)] shrink-0" />

        {/* Item 2 */}
        <div className="flex flex-col items-center text-center gap-[10px] shrink-0">
          <div className="relative size-[28px] shrink-0">
            <Image
              src="/images/mubes/feature-sosial.svg"
              alt="Kegiatan Sosial"
              fill
              className="object-contain"
            />
          </div>
          <div className="font-['Cinzel',serif] font-normal text-[13px] text-[#e5d9c2] tracking-[1px] leading-[18px]">
            <p className="mb-0">KEGIATAN</p>
            <p>SOSIAL</p>
          </div>
        </div>

        <div className="h-[46px] w-px bg-[rgba(217,181,115,0.25)] shrink-0" />

        {/* Item 3 */}
        <div className="flex flex-col items-center text-center gap-[10px] shrink-0">
          <div className="relative size-[28px] shrink-0">
            <Image
              src="/images/mubes/feature-kolaborasi.svg"
              alt="Kolaborasi"
              fill
              className="object-contain"
            />
          </div>
          <div className="font-['Cinzel',serif] font-normal text-[13px] text-[#e5d9c2] tracking-[1px] leading-[18px]">
            <p className="mt-[9px]">KOLABORASI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
