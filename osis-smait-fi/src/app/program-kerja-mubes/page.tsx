import React from 'react';
import { Metadata } from 'next';
import nextDynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProgramKerja from '@/components/program-kerja/ProgramKerja';
import MubesSessionBanner from '@/components/mubes/MubesSessionBanner';
import { fetchHalamanFromStrapi, fetchAllSekbidsFromStrapi, formatSekbidList } from '@/lib/strapi';
import { getMubesAccess } from '@/lib/mubes-access';

const SeksiBidangGrid = nextDynamic(() => import('@/components/program-kerja/SeksiBidangGrid'));
const Footer = nextDynamic(() => import('@/components/Footer'));

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchHalamanFromStrapi('program-kerja');
  const attrs = page?.attributes || page || {};

  return {
    title: `Program Kerja (Sidang MUBES) | OSIS SMAIT Fithrah Insani`,
    description: attrs.deskripsi || 'Halaman khusus program kerja Musyawarah Besar (MUBES) OSIS SMAIT Fithrah Insani.',
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default async function ProgramKerjaMubesPage() {
  const access = await getMubesAccess();

  // Hanya user login & approved yang boleh melihat halaman proker MUBES
  if (!access.allowed) {
    redirect('/portal-mubes');
  }

  const [programKerjaData, rawSekbids] = await Promise.all([
    fetchHalamanFromStrapi('program-kerja'),
    fetchAllSekbidsFromStrapi(),
  ]);

  const sekbidList = formatSekbidList(rawSekbids);
  const attrs = programKerjaData?.attributes || programKerjaData;
  const quality = attrs?.compression_quality;
  const compress = attrs?.enable_compression;

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      {/* Floating session banner for verified MUBES participant */}
      <MubesSessionBanner />

      {/* Hero & Sekbid Grid persis sama layout & data dengan halaman program kerja publik */}
      <ProgramKerja initialData={programKerjaData} />
      <SeksiBidangGrid initialSekbids={sekbidList} quality={quality} compress={compress} />

      <Footer />
    </main>
  );
}
