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
  try {
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
  } catch {
    return {
      title: 'Portal Musyawarah Besar XXI | OSIS SMAIT Fithrah Insani',
      description: 'Portal resmi sidang Musyawarah Besar OSIS SMAIT Fithrah Insani.',
    };
  }
}

interface PortalMubesPageProps {
  searchParams: Promise<{ mode?: string }>;
}

export default async function PortalMubesPage({ searchParams }: PortalMubesPageProps) {
  let access;
  let resolvedParams;
  try {
    [access, resolvedParams] = await Promise.all([
      getMubesAccess(),
      searchParams,
    ]);
  } catch (err: any) {
    console.error('[PortalMubesPage] Access resolution error:', err?.message);
    access = {
      allowed: false,
      userId: null,
      email: null,
      fullName: null,
      role: null,
      status: null,
    };
    resolvedParams = {};
  }

  const initialMode = resolvedParams?.mode === 'signup' ? 'signup' : 'login';

  // Proteksi akses Sidang MUBES:
  // Jika belum allowed (belum login ATAU sudah login tapi status masih pending/ditolak),
  // tampilkan MubesPortalView dengan menyertakan accessState agar merender status card
  if (!access.allowed) {
    return <MubesPortalView initialMode={initialMode} accessState={access} />;
  }

  const [mubesConfig, prokerGroups, sidangData] = await Promise.all([
    fetchHalamanFromStrapi('portal-mubes'),
    fetchMubesProkerData(),
    fetchMubesSidangData(),
  ]);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Global Navbar OSIS */}
      <Navbar />

      {/* 2. Hero Section Sidang Dinamis dari Strapi */}
      <MubesPresentationHero initialData={mubesConfig} />

      {/* 3. Area Presentasi Sidang & Ekstensi LPJ Per Program Kerja */}
      <MubesPresentationViewer initialGroups={prokerGroups} sidangData={sidangData} />

      {/* 4. Global Footer OSIS */}
      <Footer />
    </main>
  );
}
