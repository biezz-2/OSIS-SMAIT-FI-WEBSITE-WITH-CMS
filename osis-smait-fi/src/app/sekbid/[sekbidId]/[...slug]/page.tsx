import React from 'react';
import { Metadata } from 'next';
import ProgramKerjaDetailPage from '@/components/program-kerja/ProgramKerjaDetailPage';
import MubesProkerFigmaView from '@/components/mubes/MubesProkerFigmaView';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchProgramKerjaFromStrapi } from '@/lib/strapi';
import { getMubesAccess } from '@/lib/mubes-access';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sekbidId: string; slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const programSlug = slug && slug.length > 0 ? slug[slug.length - 1] : '';
  const data = programSlug ? await fetchProgramKerjaFromStrapi(programSlug) : null;
  if (!data) return {};

  const attrs = data.attributes || data;
  const judul = attrs.judul || 'Program Kerja Sekbid';
  const deskripsi = attrs.deskripsi || attrs.tujuan || 'Detail Program Kerja Sekbid OSIS SMAIT Fithrah Insani.';

  return {
    title: judul,
    description: deskripsi,
    openGraph: {
      title: `${judul} | OSIS SMAIT Fithrah Insani`,
      description: deskripsi,
      type: 'article',
    },
  };
}

export default async function CatchAllProgramPage({
  params,
}: {
  params: Promise<{ sekbidId: string; slug: string[] }>;
}) {
  const { slug } = await params;
  const programSlug = slug && slug.length > 0 ? slug[slug.length - 1] : '';
  const initialData = programSlug ? await fetchProgramKerjaFromStrapi(programSlug) : null;

  // Cek hak akses sidang MUBES
  const access = await getMubesAccess();

  // Jika pengguna memiliki hak akses sidang MUBES yang sah, transformasikan tampilan
  // secara dinamis menyerupai desain Figma (Hero MUBES + Section Dokumen LPJ + Dokumentasi)
  if (access.allowed && initialData) {
    const strapiBaseUrl = process.env.STRAPI_INTERNAL_URL || 'http://127.0.0.1:1337';
    const elevatedToken = process.env.STRAPI_ELEVATED_TOKEN;

    let lpjData: any = null;
    if (elevatedToken) {
      try {
        const filterQuery = `filters[$or][0][program_kerja][slug][$eq]=${encodeURIComponent(programSlug)}&filters[$or][1][program_kerja][slug][$eq]=${encodeURIComponent(programSlug.toLowerCase())}`;
        const res = await fetch(`${strapiBaseUrl}/api/mubes-lpjs?${filterQuery}&populate=*`, {
          headers: { Authorization: `Bearer ${elevatedToken}` },
          cache: 'no-store',
        });
        if (res.ok) {
          const payload = await res.json();
          lpjData = payload?.data?.[0] || null;
        }
      } catch (err) {
        console.error('[MUBES In-place Transform] Error fetching LPJ data:', err);
      }
    }

    return (
      <main className="min-h-screen bg-[#FBFCFD] dark:bg-slate-950 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-900">
        <Navbar />
        <MubesProkerFigmaView
          proker={initialData}
          lpj={lpjData}
          role={access.role}
          status={access.status}
        />
        <Footer />
      </main>
    );
  }

  // Tampilan Publik Default (Jika bukan peserta MUBES atau belum login)
  return <ProgramKerjaDetailPage slug={programSlug} initialData={initialData} />;
}
