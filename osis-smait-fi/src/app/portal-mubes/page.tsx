import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MubesPresentationHero from '@/components/mubes/MubesPresentationHero';
import MubesPresentationViewer from '@/components/mubes/MubesPresentationViewer';
import MubesPortalView from '@/components/mubes/MubesPortalView';
import { fetchHalamanFromStrapi } from '@/lib/strapi';
import { fetchMubesProkerData, fetchMubesSidangData } from '@/lib/mubes-proker';
import { getMubesAccess } from '@/lib/mubes-access';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const mubesPage = await fetchHalamanFromStrapi('portal-mubes');
  const attrs = mubesPage?.attributes || mubesPage || {};

  const title = attrs.seo_title || attrs.judul_hero || 'Portal Musyawarah Besar XXI | OSIS SMAIT Fithrah Insani';
  const description = attrs.seo_description || attrs.deskripsi || 'Portal resmi pertanggungjawaban kepengurusan OSIS SMAIT Fithrah Insani, evaluasi LPJ sekbid, dan pengesahan ketetapan sidang MUBES.';

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'none',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

interface PortalMubesPageProps {
  searchParams: Promise<{ mode?: string }>;
}

export default async function PortalMubesPage({ searchParams }: PortalMubesPageProps) {
  const [access, resolvedParams] = await Promise.all([
    getMubesAccess(),
    searchParams,
  ]);
  const initialMode = resolvedParams?.mode === 'signup' ? 'signup' : 'login';

  // Proteksi akses Sidang MUBES: Jika pengguna belum login atau belum disetujui,
  // tampilkan portal autentikasi (MubesPortalView) tanpa membocorkan data LPJ
  if (!access.allowed) {
    return <MubesPortalView initialMode={initialMode} />;
  }

  const [mubesConfig, prokerGroups, sidangData] = await Promise.all([
    fetchHalamanFromStrapi('portal-mubes'),
    fetchMubesProkerData(),
    fetchMubesSidangData(),
  ]);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Global Navbar OSIS (Sama seperti tampilan visitor) */}
      <Navbar />

      {/* 2. Hero Section Sidang Dinamis dari Strapi (Manageable: BG, Teks, Judul) */}
      <MubesPresentationHero initialData={mubesConfig} />

      {/* 3. Area Presentasi Sidang & Ekstensi LPJ Per Program Kerja */}
      <MubesPresentationViewer initialGroups={prokerGroups} sidangData={sidangData} />

      {/* 4. Global Footer OSIS */}
      <Footer />
    </main>
  );
}
