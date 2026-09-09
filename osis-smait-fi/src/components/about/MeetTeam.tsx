'use client';

import React, { useEffect, useState } from 'react';
import { fetchBPHAnggotaFromStrapi, getStrapiMediaUrl } from '@/lib/strapi';
import Image from 'next/image';
import { useImageQuality } from '@/context/ImageQualityContext';

interface TeamMember {
  role: string;
  name: string;
  image: string;
  description: string;
  imageAlt?: string;
}

interface MeetTeamProps {
  title?: string;
  subtitle?: string;
  members?: TeamMember[];
  quality?: any;
  compress?: any;
}

export function formatBPHMembers(strapiMembers: any[]): TeamMember[] {
  if (!strapiMembers || !Array.isArray(strapiMembers)) return [];
  return strapiMembers.map((item: any) => {
    const attrs = item.attributes || item;
    const imgUrl = getStrapiMediaUrl(attrs.foto, '', 'medium');
    return {
      role: attrs.jabatan || 'PENGURUS OSIS',
      name: attrs.nama_lengkap || '',
      image: imgUrl,
      description: attrs.deskripsi || '',
      imageAlt: `${attrs.nama_lengkap} - ${attrs.jabatan}`
    };
  });
}

const MeetTeam: React.FC<MeetTeamProps> = ({
  title = "Meet The\nBhaskara\nTeam",
  subtitle = "Para pemimpin muda yang berdedikasi, kreatif,\ndan siap membawa perubahan positif untuk\nSMAIT Fithrah Insani.",
  members: initialMembers,
  quality,
  compress
}) => {
  const [teamList, setTeamList] = useState<TeamMember[]>(initialMembers || []);
  const [loading, setLoading] = useState(!initialMembers || initialMembers.length === 0);
  const { getOptimizedImageUrl } = useImageQuality();

  useEffect(() => {
    async function loadTeam() {
      const strapiMembers = await fetchBPHAnggotaFromStrapi();
      if (strapiMembers && Array.isArray(strapiMembers) && strapiMembers.length > 0) {
        setTeamList(formatBPHMembers(strapiMembers));
      }
      setLoading(false);
    }

    if (!initialMembers || initialMembers.length === 0) {
      loadTeam();
    }
  }, [initialMembers]);

  if (loading) {
    return (
      <section className="w-full bg-white py-16 md:py-24 flex justify-center items-center">
        <div className="animate-pulse text-slate-400 text-sm font-medium">Memuat data pengurus...</div>
      </section>
    );
  }

  if (teamList.length === 0) {
    return null;
  }

  // Define static structure for layout (assuming we have exactly 3 members for BPH if more it will just render)
  // Or we can find by index. Let's just use what we have in the list.

  return (
    <section className="w-full relative py-24 md:py-32 transition-colors">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(126deg,rgba(170,205,220,0.20)_0%,#F7F7F7_50%,#F7F7F7_100%)] dark:bg-[linear-gradient(126deg,rgba(15,23,42,0.9)_0%,#0b0f17_50%,#0b0f17_100%)]" />
      
      <div className="max-w-[1440px] mx-auto w-full relative z-10 flex flex-col lg:flex-row min-h-[900px]">
        {/* Left Section - Text Content */}
        <div className="w-full lg:w-[45%] pl-6 md:pl-12 lg:pl-24 pt-12 lg:pt-32 pb-12 flex flex-col gap-12">
          {/* Title & Subtitle */}
          <div className="flex flex-col gap-8">
            <h2 className="text-[#1A1A1A] dark:text-slate-100 text-5xl md:text-6xl lg:text-[72px] font-bold font-inter leading-tight whitespace-pre-line">
              Meet The<br/>
              <span className="text-[#AACDDC] dark:text-sky-300">Bhaskara</span><br/>
              Team
            </h2>
            <p className="text-[#4A5565] dark:text-slate-300 text-base md:text-lg font-normal leading-relaxed font-inter whitespace-pre-line">
              {subtitle}
            </p>
          </div>

          {/* Structure List */}
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-[#99A1AF] rounded-full" />
              <div className="text-[#1E2939] dark:text-slate-200 text-base font-medium font-inter leading-normal">Ketua OSIS</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-[#99A1AF] rounded-full" />
              <div className="text-[#1E2939] dark:text-slate-200 text-base font-medium font-inter leading-normal">Pengurus Inti</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-[#99A1AF] rounded-full" />
              <div className="text-[#1E2939] dark:text-slate-200 text-base font-medium font-inter leading-normal">Kepala Departemen</div>
            </div>

            <div className="flex flex-col gap-4 pt-4 mt-2">
              <div className="text-[#99A1AF] dark:text-slate-400 text-[10px] font-bold font-inter uppercase leading-[15px] tracking-widest">
                SEKSI BIDANG
              </div>
              <div className="flex flex-col gap-3">
                {[
                  "Sekbid 1: Keagamaan & Kerohanian",
                  "Sekbid 2: Nasionalisme & Patriotisme",
                  "Sekbid 3: Wawasan & Pendidikan",
                  "Sekbid 4: Bahasa & Sastra",
                  "Sekbid 5: Bakat & Kreativitas",
                  "Sekbid 6: Kebersihan & Kesehatan",
                  "Sekbid 7: Kewirausahaan & Dana",
                  "Sekbid 8: Komunikasi & Informasi"
                ].map((sekbid, idx) => (
                  <div key={idx} className="text-[#4A5565] dark:text-slate-300 text-sm font-normal font-inter leading-tight">
                    {sekbid}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Cards (Glassmorphism bg) */}
        <div className="w-full lg:w-[55%] relative lg:border-l border-[#E5E7EB] dark:border-slate-800 bg-[rgba(247,247,247,0.50)] dark:bg-slate-900/60 backdrop-blur-sm min-h-[900px] flex flex-col items-center">
            
            {/* Top Area - Ketua OSIS (Index 0 if matches or just hardcode visually) */}
            {teamList.length > 0 && (
              <div className="w-full flex justify-center py-24 lg:py-32 border-b border-[#E5E7EB] dark:border-slate-800">
                <div className="relative w-full max-w-[384px] mx-4">
                  {/* Decorative Rotated Box */}
                  <div className="absolute inset-0 bg-[rgba(170,205,220,0.20)] dark:bg-sky-900/30 rounded-[40px] rotate-3 transform origin-top-left translate-x-4 translate-y-4" />
                  
                  {/* Main Card */}
                  <div className="relative w-full bg-white dark:bg-slate-800 rounded-[32px] p-4 shadow-[0px_20px_40px_0px_rgba(0,0,0,0.08)] ring-1 ring-[#F3F4F6] dark:ring-slate-700 flex flex-col gap-6">
                    {/* Image Container */}
                    <div className="relative w-full aspect-[4/5] bg-[#F3F4F6] rounded-[24px] overflow-hidden">
                      {teamList[0].image && (
                         <img 
                            src={getOptimizedImageUrl(teamList[0].image, quality, compress)} 
                            alt={teamList[0].imageAlt || teamList[0].name}
                            className="w-full h-full object-cover"
                         />
                      )}
                    </div>
                    {/* Decorative Dot */}
                    <div className="absolute top-8 right-8 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 bg-[#101828] rounded-full" />
                    </div>
                    
                    {/* Details */}
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="bg-[rgba(170,205,220,0.20)] px-4 py-1.5 rounded-full">
                        <span className="text-[#7A9EAD] text-[10px] font-bold font-inter uppercase tracking-widest leading-[15px]">
                          {teamList[0].role}
                        </span>
                      </div>
                      <h3 className="text-[#101828] dark:text-slate-100 text-xl font-bold font-inter leading-relaxed">
                        {teamList[0].name}
                      </h3>
                      <p className="text-[#6A7282] dark:text-slate-300 text-xs font-normal font-inter leading-relaxed max-w-[280px]">
                         {teamList[0].description || "Pemimpin organisasi dengan visi dan dedikasi yang tinggi."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Area - Pengurus Inti */}
            {teamList.length > 1 && (
              <div className="w-full bg-[#F7F7F7] dark:bg-slate-900 px-6 lg:px-20 py-16 lg:py-20 flex flex-col items-center gap-12">
                <h3 className="text-[#101828] dark:text-slate-100 text-2xl font-bold font-inter uppercase tracking-[1.2px] text-center">
                  Pengurus Inti OSIS
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[744px]">
                  {teamList.slice(1).map((member, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col bg-white dark:bg-slate-800 rounded-[24px] overflow-hidden shadow-[0px_4px_20px_0px_rgba(0,0,0,0.03)] ring-1 ring-[#F3F4F6] dark:ring-slate-700"
                    >
                      {/* Top Half - Image */}
                      <div className="w-full h-[192px] bg-[#F3F4F6] relative">
                        {member.image && (
                          <img 
                            src={getOptimizedImageUrl(member.image, quality, compress)} 
                            alt={member.imageAlt || member.name}
                            className="w-full h-full object-cover object-top"
                          />
                        )}
                        {/* Icon Badge Overlay */}
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
                      
                      {/* Bottom Half - Text */}
                      <div className="p-6 pt-8 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[#101828] text-sm font-bold font-inter leading-tight mb-1">
                            {member.name}
                          </h4>
                          <div className="text-[#AACDDC] text-[10px] font-bold font-inter leading-[15px] mb-2">
                            {member.role}
                          </div>
                          <p className="text-[#6A7282] text-[10px] font-normal font-inter leading-[16.25px] line-clamp-4">
                            {member.description || "Bertanggung jawab atas jalannya organisasi dan program kerja."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

        </div>
      </div>
    </section>
  );
};

export default MeetTeam;
