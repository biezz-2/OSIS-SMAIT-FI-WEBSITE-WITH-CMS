"use client";

import React, { useState, useEffect } from 'react';
import { fetchStrapiAPI, fetchAllSekbidsFromStrapi, getStrapiMediaUrl } from '@/lib/strapi';
import { useImageQuality } from '@/context/ImageQualityContext';
import Link from 'next/link';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';

interface Member {
  name: string;
  role: string;
  description: string;
  image: string;
}

interface CategorySection {
  id: string;
  name: string;
  shortName: string;
  members: Member[];
}

interface AnggotaListProps {
  initialHalamanData?: any;
  initialMembers?: any[];
  initialSekbids?: any[];
}

const divisionMeta: Record<string, { name: string; shortName: string }> = {
  'BPH': { name: 'Pengurus Inti OSIS', shortName: 'Pengurus Inti' },
  'Sekbid_1': { name: 'Sekbid 1: Keagamaan & Kerohanian', shortName: 'Sekbid 1' },
  'Sekbid_2': { name: 'Sekbid 2: Nasionalisme & Patriotisme', shortName: 'Sekbid 2' },
  'Sekbid_3': { name: 'Sekbid 3: Wawasan & Pendidikan', shortName: 'Sekbid 3' },
  'Sekbid_4': { name: 'Sekbid 4: Bahasa & Sastra', shortName: 'Sekbid 4' },
  'Sekbid_5': { name: 'Sekbid 5: Bakat & Kreativitas', shortName: 'Sekbid 5' },
  'Sekbid_6': { name: 'Sekbid 6: Kebersihan & Kesehatan', shortName: 'Sekbid 6' },
  'Sekbid_7': { name: 'Sekbid 7: Kewirausahaan & Dana', shortName: 'Sekbid 7' },
  'Sekbid_8': { name: 'Sekbid 8: Komunikasi & Informasi', shortName: 'Sekbid 8' },
};

const sekbidDescriptions: Record<string, string> = {
  'sekbid-1': 'Mengkoordinir kegiatan keagamaan di sekolah untuk meningkatkan iman & taqwa.',
  'sekbid-2': 'Menumbuhkan rasa cinta tanah air dan semangat bela negara.',
  'sekbid-3': 'Mendorong wawasan intelektual dan budaya belajar yang tinggi.',
  'sekbid-4': 'Mengembangkan kemampuan literasi, bahasa, dan apresiasi sastra.',
  'sekbid-5': 'Mewadahi bakat dan kreativitas siswa dalam berbagai bidang seni.',
  'sekbid-6': 'Memastikan lingkungan sekolah bersih, sehat, dan nyaman.',
  'sekbid-7': 'Mengelola dana kegiatan dan menumbuhkan jiwa wirausaha.',
  'sekbid-8': 'Mengelola komunikasi, media, dan informasi OSIS secara profesional.',
};

const AnggotaList: React.FC<AnggotaListProps> = ({
  initialHalamanData,
  initialMembers,
  initialSekbids,
}) => {
  const [categories, setCategories] = useState<CategorySection[]>([]);
  const [sekbidImages, setSekbidImages] = useState<Record<string, string>>({});
  const [sekbidDescs, setSekbidDescs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(!initialMembers);
  const { getOptimizedImageUrl } = useImageQuality();

  const attrsHalaman = initialHalamanData?.attributes || initialHalamanData;
  const heroTitle = attrsHalaman?.judul_hero || "Meet The\nAgora Acta\nTeam";
  const heroSubtitle = attrsHalaman?.sub_judul || "Para pemimpin muda yang berdedikasi, kreatif,\ndan siap membawa perubahan positif untuk\nSMAIT Fithrah Insani.";

  useEffect(() => {
    async function loadMembersFromStrapi() {
      try {
        let rawItems: any[] = [];
        if (initialMembers) {
          rawItems = initialMembers;
        } else {
          const res: any = await fetchStrapiAPI('/api/anggota-oses?filters[status_aktif][$eq]=aktif&pagination[limit]=200&sort[0]=urutan:asc&sort[1]=id:asc&populate=*');
          rawItems = res?.data || [];
        }

        const categoryMap: Record<string, Member[]> = {};

        rawItems.forEach((item: any) => {
          const attrs = item.attributes || item;
          const divKey = attrs.divisi || 'BPH';
          const imgUrl = getStrapiMediaUrl(attrs.foto, '');

          const member: Member = {
            name: attrs.nama_lengkap || '',
            role: attrs.jabatan || 'Pengurus OSIS',
            description: attrs.deskripsi || `${attrs.jabatan} OSIS SMAIT Fithrah Insani.`,
            image: imgUrl,
          };

          if (!categoryMap[divKey]) {
            categoryMap[divKey] = [];
          }
          categoryMap[divKey].push(member);
        });

        const formattedSections: CategorySection[] = Object.keys(divisionMeta)
          .filter(divKey => categoryMap[divKey] && categoryMap[divKey].length > 0)
          .map(divKey => ({
            id: divKey.toLowerCase().replace('_', '-'),
            name: divisionMeta[divKey].name,
            shortName: divisionMeta[divKey].shortName,
            members: categoryMap[divKey],
          }));

        setCategories(formattedSections);
      } catch (err) {
        console.warn('Failed to load Anggota OSIS list from Strapi:', err);
      } finally {
        setLoading(false);
      }
    }

    async function loadSekbidsFromStrapi() {
      try {
        let rawSekbids: any[] = [];
        if (initialSekbids && initialSekbids.length > 0) {
          rawSekbids = initialSekbids;
        } else {
          rawSekbids = await fetchAllSekbidsFromStrapi();
        }

        const imageMap: Record<string, string> = {};
        const descMap: Record<string, string> = {};
        rawSekbids.forEach((item: any) => {
          const attrs = item.attributes || item;
          const nomor = attrs.nomor || item.id;
          const bannerUrl = getStrapiMediaUrl(attrs.banner || attrs.gambar, '');
          if (bannerUrl) {
            imageMap[`sekbid-${nomor}`] = bannerUrl;
            imageMap[`${nomor}`] = bannerUrl;
          }
          const desc = attrs.deskripsi || attrs.visi || '';
          if (desc) {
            descMap[`sekbid-${nomor}`] = desc.replace(/[#*_~`>\[\]]/g, '').trim();
          }
        });
        setSekbidImages(imageMap);
        setSekbidDescs(descMap);
      } catch (err) {
        console.warn('Failed to load Sekbids from Strapi:', err);
      }
    }

    loadMembersFromStrapi();
    loadSekbidsFromStrapi();
  }, [initialMembers, initialSekbids]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navbarOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navbarOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="w-full min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="animate-pulse text-[#99A1AF] text-base font-medium font-[Inter,sans-serif]">
          Memuat daftar Anggota OSIS…
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="w-full min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-[#6A7282] text-base font-medium font-[Inter,sans-serif]">
          Belum ada data Anggota OSIS. Silakan tambahkan melalui Strapi Admin.
        </div>
      </section>
    );
  }

  const bphSection = categories.find(c => c.id === 'bph');
  const ketuaMember = bphSection?.members[0] ?? null;
  const pengurusIntiMembers = bphSection?.members.slice(1) ?? [];
  const sekbidSections = categories.filter(c => c.id.startsWith('sekbid-'));

  return (
    <section
      className="w-full font-[Inter,sans-serif] relative overflow-hidden bg-[#F7F7F7] dark:bg-[#0b0f17]"
    >
      {/* ─── MOBILE HERO HEADER (visible only on mobile) ──────────── */}
      <div className="lg:hidden w-full px-6 pt-10 pb-6 bg-[linear-gradient(126deg,rgba(170,204,219,0.20)_0%,#F7F7F7_50%,#F7F7F7_100%)] dark:bg-[linear-gradient(126deg,rgba(170,204,219,0.05)_0%,#0b0f17_50%,#0b0f17_100%)]">
        <h1 className="text-[36px] sm:text-[44px] font-bold leading-[1.1] text-[#1A1A1A] dark:text-white mb-4 whitespace-pre-line">
          {heroTitle}
        </h1>
        <p className="text-[15px] leading-[24px] text-[#4A5565] dark:text-gray-300 whitespace-pre-line max-w-[400px]">
          {heroSubtitle}
        </p>
      </div>

      {/* ─── MOBILE SECTION NAV (horizontal scrollable) ──────────── */}
      <div className="lg:hidden w-full overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30">
        <div className="flex items-center gap-2 px-4 py-3 min-w-max">
          <button onClick={() => scrollToSection('ketua-osis')} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-[#2E90FA] text-white">
            Ketua OSIS
          </button>
          <button onClick={() => scrollToSection('bph')} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-[#AACDDC]/20 text-[#1E2939] dark:bg-[#AACDDC]/10 dark:text-[#AACDDC] hover:bg-[#AACDDC]/30 dark:hover:bg-[#AACDDC]/20 transition-colors">
            Pengurus Inti
          </button>
          {Array.from({ length: 8 }).map((_, idx) => {
            const num = idx + 1;
            const sectionId = `sekbid-${num}`;
            return (
              <button key={sectionId} onClick={() => scrollToSection(sectionId)} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-[#4A5565] dark:bg-slate-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                Sekbid {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      <div className="w-full relative lg:min-h-[860px]">
        {/* Gradient background overlay */}
        <div
          className="absolute inset-0 pointer-events-none -z-10 bg-[linear-gradient(126deg,rgba(170,204,219,0.20)_0%,#F7F7F7_50%,#F7F7F7_100%)] dark:bg-[linear-gradient(126deg,rgba(170,204,219,0.05)_0%,#0b0f17_50%,#0b0f17_100%)]"
        />

        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row relative lg:min-h-[860px]">

          {/* ── LEFT SIDEBAR ─────────────────────────────────────────── */}
          <div className="hidden lg:flex flex-col justify-start pt-32 px-[98px] w-[596px] shrink-0">
            <div className="sticky top-28 flex flex-col">
              {/* Big headline */}
              <div className="mb-6 text-[72px] font-bold leading-[1] text-[#1A1A1A] dark:text-white whitespace-pre-line">
                {heroTitle}
              </div>

              {/* Sub-description */}
              <p className="text-[18px] leading-[29.25px] text-[#4A5565] dark:text-gray-300 mb-10 max-w-[433px] whitespace-pre-line">
                {heroSubtitle}
              </p>

              {/* Navigation links */}
              <div className="flex flex-col gap-4">
                {/* Ketua OSIS */}
                <button
                  onClick={() => scrollToSection('ketua-osis')}
                  className="flex items-center gap-3 text-left group"
                >
                  <div className="w-[6px] h-[6px] rounded-full bg-[#99A1AF] shrink-0" />
                  <span className="text-[16px] font-medium text-[#1E2939] dark:text-gray-200 group-hover:text-[#AACDDC] transition-colors leading-[24px]">Ketua OSIS</span>
                </button>

                {/* Pengurus Inti */}
                <button
                  onClick={() => scrollToSection('bph')}
                  className="flex items-center gap-3 text-left group"
                >
                  <div className="w-[6px] h-[6px] rounded-full bg-[#99A1AF] shrink-0" />
                  <span className="text-[16px] font-medium text-[#1E2939] dark:text-gray-200 group-hover:text-[#AACDDC] transition-colors leading-[24px]">Pengurus Inti</span>
                </button>

                {/* SEKSI BIDANG sub-group */}
                <div className="flex flex-col gap-4 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-[1px] text-[#99A1AF] leading-[15px]">
                    SEKSI BIDANG
                  </span>
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 8 }).map((_, idx) => {
                      const num = idx + 1;
                      const divKey = `Sekbid_${num}`;
                      const sectionId = `sekbid-${num}`;
                      const name = divisionMeta[divKey]?.name || `Sekbid ${num}`;
                      return (
                        <button
                          key={sectionId}
                          onClick={() => scrollToSection(sectionId)}
                          className="text-[14px] text-[#4A5565] dark:text-gray-400 text-left hover:text-[#1E2939] dark:hover:text-white transition-colors leading-[20px]"
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
          <div
            className="flex-1 flex flex-col relative min-h-full bg-[rgba(247,246,246,0.50)] dark:bg-[rgba(11,15,23,0.50)] border-l border-[#E5E7EB] dark:border-slate-800 backdrop-blur-[4px]"
          >
            {/* ── TOP: Featured Ketua OSIS Card ── */}
            <div
              id="ketua-osis"
              className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-[80px] relative scroll-mt-24 border-b border-[#E5E7EB] dark:border-slate-800"
            >
              {ketuaMember && (
                <>
                  {/* Decorative rotated box — hidden on mobile */}
                  <div
                    className="absolute pointer-events-none hidden lg:block bg-[#AACDDC]/20 dark:bg-[#AACDDC]/10"
                    style={{
                      width: '384px',
                      height: '383.5px',
                      borderRadius: '40px',
                      transform: 'rotate(3deg)',
                      top: 'calc(50% - 191.75px + 20px)',
                      left: 'calc(50% - 192px + 20px)',
                      zIndex: 0,
                    }}
                  />

                  {/* Featured member card */}
                  <div
                    className="relative flex flex-col gap-4 sm:gap-6 w-full max-w-[384px] bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 shadow-[0px_20px_40px_rgba(0,0,0,0.08)] dark:shadow-[0px_20px_40px_rgba(0,0,0,0.4)] rounded-[24px] p-3 z-10"
                  >
                    {/* Photo */}
                    <div
                      className="w-full overflow-hidden relative aspect-[4/5] bg-[#F3F4F6] dark:bg-slate-800 rounded-[24px] max-h-[437.5px]"
                    >
                      {ketuaMember.image ? (
                        <img
                          src={getOptimizedImageUrl(ketuaMember.image)}
                          alt={ketuaMember.name}
                          className="w-full h-full object-cover"
                          style={{ filter: 'saturate(1)' }}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#F3F4F6]" />
                      )}
                    </div>

                    {/* Top-right dot indicator */}
                    <div
                      className="absolute top-7 right-7 flex items-center justify-center w-8 h-8 bg-white dark:bg-slate-900 rounded-full shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.10)] dark:shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.30)]"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#101828] dark:bg-white" />
                    </div>

                    {/* Info area */}
                    <div className="flex flex-col items-center text-center pb-2 px-2 relative">
                      {/* Badge */}
                      <span
                        className="inline-block mb-3 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[1px] text-[#7A9EAD] bg-[#AACDDC]/20 dark:bg-[#AACDDC]/10 rounded-full"
                      >
                        KETUA OSIS
                      </span>

                      <h3 className="text-[20px] font-bold text-[#101828] dark:text-white leading-[28px] mb-1">
                        {ketuaMember.name}
                      </h3>
                      <p className="text-[12px] text-[#6A7282] dark:text-gray-300 leading-[16px] max-w-[280px]">
                        {ketuaMember.description}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ── BOTTOM: Pengurus Inti OSIS ── */}
            {pengurusIntiMembers.length > 0 && (
              <div
                id="bph"
                className="flex flex-col gap-8 sm:gap-12 scroll-mt-24 bg-[#F7F7F7] dark:bg-[#0b0f17]"
                style={{ padding: 'clamp(24px, 5vw, 80px)' }}
              >
                <div className="text-center">
                  <h2
                    className="text-[24px] font-bold uppercase tracking-[1.2px] text-[#101828] dark:text-white"
                  >
                    Pengurus Inti OSIS
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[744px] mx-auto">
                  {pengurusIntiMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col overflow-hidden bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.2)] rounded-[24px]"
                    >
                      {/* Photo */}
                      <div
                        className="w-full relative h-[192px] bg-[#F3F4F6] dark:bg-slate-800"
                      >
                        {member.image && (
                          <img
                            src={getOptimizedImageUrl(member.image)}
                            alt={member.name}
                            className="w-full h-full object-cover object-top"
                          />
                        )}
                        {/* Icon badge overlay */}
                        <div
                          className="absolute flex items-center justify-center"
                          style={{
                            width: '40px',
                            height: '40px',
                            background: idx % 3 === 0 ? '#7A9EAD' : idx % 3 === 1 ? '#1C2331' : '#AACDDC',
                            borderRadius: '12px',
                            top: '172px',
                            right: '16px',
                            boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.10)',
                            zIndex: 2,
                          }}
                        >
                          {/* SVG Icon */}
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            {idx % 3 === 0 ? (
                              <rect x="1.33" y="2" width="13.33" height="12" rx="1" stroke="white" strokeWidth="1.33" />
                            ) : idx % 3 === 1 ? (
                              <>
                                <rect x="1.33" y="1.33" width="10.67" height="10.67" rx="1" stroke="white" strokeWidth="1.33" />
                                <rect x="8.28" y="8.28" width="6.11" height="6.11" rx="0.5" stroke="white" strokeWidth="1.33" />
                              </>
                            ) : (
                              <rect x="2" y="3" width="12" height="10" rx="1" stroke="white" strokeWidth="1.33" />
                            )}
                          </svg>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col pt-8 pb-6 px-6">
                        <h4 className="text-[14px] font-bold text-[#101828] dark:text-white leading-[20px] mb-1">
                          {member.name}
                        </h4>
                        <span className="text-[10px] font-bold text-[#AACDDC] leading-[15px] mb-2 block">
                          {member.role}
                        </span>
                        <p className="text-[10px] font-normal text-[#6A7282] dark:text-gray-300 leading-[16.25px] line-clamp-4">
                          {member.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── ANGGOTA SEKSI BIDANG SECTION ────────────────────────────── */}
      <div
        className="w-full py-20 px-6 bg-[#F7F7F7] dark:bg-[#0b0f17] border-t border-[#E5E7EB] dark:border-slate-800"
      >
        <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
          {/* Section Header */}
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-[30px] font-bold text-[#101828] dark:text-white leading-[36px]">
              Anggota Seksi Bidang
            </h2>
            <p
              className="text-[14px] text-[#6A7282] dark:text-gray-300 leading-[20px]"
              style={{ maxWidth: '672px' }}
            >
              Para anggota yang bertanggung jawab dalam berbagai bidang kegiatan spesifik.
            </p>
          </div>

          {/* Sekbid Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {sekbidSections.map(section => {
              const sekbidNum = section.id.split('-')[1] || '1';
              const titleMatch = section.name.match(/Sekbid \d+: (.+)/i);
              const sekbidTitle = titleMatch ? titleMatch[1] : section.name;
              const desc = sekbidDescs[section.id] || sekbidDescriptions[section.id] || `Mengkoordinir kegiatan ${sekbidTitle.toLowerCase()} di sekolah.`;

              return (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 flex flex-col relative hover:z-20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-shadow duration-300 bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.2)] rounded-[24px]"
                >
                  {/* Image area */}
                  <div
                    className="relative overflow-hidden h-[270px] bg-[#F3F4F6] dark:bg-slate-800 rounded-t-[23px]"
                  >
                    {(() => {
                      const sekbidImg = sekbidImages[section.id] || sekbidImages[sekbidNum] || section.members[0]?.image;
                      return sekbidImg ? (
                        <img
                          src={getOptimizedImageUrl(sekbidImg)}
                          alt={sekbidTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#F3F4F6]" />
                      );
                    })()}

                    {/* Badge label */}
                    <div
                      className="absolute left-0 bottom-[27px] flex items-center bg-[#AACDDC] px-4 py-1.5"
                    >
                      <span className="text-[10px] font-bold text-white tracking-[1px] uppercase">
                        {section.shortName}
                      </span>
                    </div>
                  </div>

                  {/* Info area */}
                  <div
                    className="flex flex-col justify-between h-[179px] p-6"
                  >
                    <div>
                      <h3 className="text-[18px] font-bold text-[#101828] dark:text-white leading-[28px] mb-2">
                        {sekbidTitle}
                      </h3>
                      <p className="text-[12px] text-[#6A7282] dark:text-gray-300 leading-[19.5px] line-clamp-2">
                        {desc}
                      </p>
                    </div>

                    {/* Footer: avatars + view team */}
                    <div className="flex items-center justify-between w-full">
                      {/* Avatar stack */}
                      <div className="flex items-center" style={{ marginLeft: '0px' }}>
                        <AnimatedTooltip
                          sizeClass="h-8 w-8"
                          items={section.members.map((m, i) => ({
                            id: i,
                            name: m.name,
                            designation: m.role,
                            image: m.image ? getOptimizedImageUrl(m.image) : null,
                          }))}
                        />
                      </div>

                      {/* View Team link */}
                      <Link
                        href={`/sekbid/${sekbidNum}`}
                        className="text-[10px] font-bold tracking-[1px] uppercase transition-colors hover:text-[#7A9EAD]"
                        style={{ color: '#AACDDC' }}
                      >
                        View Team
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnggotaList;
