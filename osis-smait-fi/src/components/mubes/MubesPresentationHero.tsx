'use client';

import React from 'react';
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/lib/strapi';
import { Sparkles, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface MubesPresentationHeroProps {
  initialData?: any;
}

export default function MubesPresentationHero({ initialData }: MubesPresentationHeroProps) {
  const attrs = initialData?.attributes || initialData || {};
  const metadata = attrs.metadata_json || {};

  const title = attrs.judul_hero || 'Musyawarah Besar XXI OSIS SMAIT Fithrah Insani';
  const subtitle = attrs.sub_judul || 'Dari Gagasan Menuju Aksi, dari Partisipasi Menuju Kontribusi';
  const description = attrs.deskripsi || 'Portal resmi pertanggungjawaban kepengurusan OSIS SMAIT Fithrah Insani, evaluasi LPJ sekbid, dan pengesahan ketetapan sidang MUBES.';

  // Resolve background image
  const bgImg = getStrapiMediaUrl(
    attrs.background_image || attrs.banner_image || metadata.banner_url,
    '/images/mubes/bg-medieval.png'
  );

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[480px] lg:min-h-[560px] flex items-center border-b border-amber-500/20">
      {/* Background Graphic with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImg}
          alt="Mubes Background"
          fill
          priority
          className="object-cover object-center brightness-50 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,178,112,0.15),transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20 flex flex-col items-start gap-6">
        {/* Badge Eyebrow */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PORTAL RESMI PERSIDANGAN & EVALUASI LPJ MUBES XXI</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-slate-100 leading-tight tracking-tight max-w-4xl">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl font-medium text-amber-200/90 font-serif italic max-w-3xl">
          &ldquo;{subtitle}&rdquo;
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
          {description}
        </p>

        {/* Action / Information Chips */}
        <div className="pt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 backdrop-blur-md">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Mode Presentasi Terbuka Sidang</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Transparansi Anggaran & Realisasi</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 backdrop-blur-md">
            <ShieldAlert className="w-4 h-4 text-sky-400" />
            <span>Lampiran Nota & Bukti LPJ</span>
          </div>
        </div>
      </div>
    </section>
  );
}
