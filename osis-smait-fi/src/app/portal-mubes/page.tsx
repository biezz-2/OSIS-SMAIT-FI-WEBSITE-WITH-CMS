import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MubesPresentationHero from '@/components/mubes/MubesPresentationHero';
import MubesPresentationViewer from '@/components/mubes/MubesPresentationViewer';
import MubesPortalView from '@/components/mubes/MubesPortalView';
import { fetchHalamanFromStrapi } from '@/lib/strapi';
import { fetchMubesProkerData } from '@/lib/mubes-proker';
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
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function PortalMubesPage({
  searchParams,
}: {
  searchParams?: Promise<{ mode?: string }>;
}) {
  const access = await getMubesAccess();
  const params = (await searchParams) || {};
  const initialMode = params.mode === 'signup' ? 'signup' : 'login';

  // Belum login Clerk → form auth. Sudah login → portal (LPJ hanya jika approved).
  if (!access.userId) {
    return <MubesPortalView initialMode={initialMode} />;
  }

  const [mubesConfig, prokerGroups] = await Promise.all([
    fetchHalamanFromStrapi('portal-mubes'),
    fetchMubesProkerData({ includeLpj: access.allowed }),
  ]);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-between selection:bg-amber-500/45 selection:text-slate-900 dark:selection:bg-amber-400/50 dark:selection:text-amber-50">
      {/* Navbar: sesi Clerk aktif. LPJ tetap gated via includeLpj=access.allowed */}
      <Navbar />

      <MubesPresentationHero initialData={mubesConfig} />
      <MubesPresentationViewer initialGroups={prokerGroups} role={access.role} />
      <Footer />
    </main>
  );
}
