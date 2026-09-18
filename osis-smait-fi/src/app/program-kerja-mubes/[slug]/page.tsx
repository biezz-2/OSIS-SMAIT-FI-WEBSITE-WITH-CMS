import React from 'react';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getMubesAccess } from '@/lib/mubes-access';
import { fetchProgramKerjaFromStrapi } from '@/lib/strapi';
import MubesProkerFigmaView from '@/components/mubes/MubesProkerFigmaView';
import MubesSessionBanner from '@/components/mubes/MubesSessionBanner';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `LPJ Program Kerja [MUBES]: ${slug} | OSIS SMAIT Fithrah Insani`,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default async function ProgramKerjaMubesDetailPage({ params }: PageProps) {
  const access = await getMubesAccess();

  // Proteksi mutlak: Hanya peserta sidang MUBES yang diizinkan mengakses detail proker MUBES
  if (!access.allowed) {
    redirect('/portal-mubes');
  }

  const { slug } = await params;
  if (!slug) notFound();

  // 1. Ambil data proker dari Strapi
  const prokerData = await fetchProgramKerjaFromStrapi(slug);
  if (!prokerData) {
    notFound();
  }

  // 2. Ambil data LPJ dari Strapi via internal query (elevated token)
  const strapiBaseUrl = process.env.STRAPI_INTERNAL_URL || 'http://127.0.0.1:1337';
  const elevatedToken = process.env.STRAPI_ELEVATED_TOKEN;

  let lpjData: any = null;
  if (elevatedToken) {
    try {
      const filterQuery = `filters[$or][0][program_kerja][slug][$eq]=${encodeURIComponent(slug)}&filters[$or][1][program_kerja][slug][$eq]=${encodeURIComponent(slug.toLowerCase())}`;
      const res = await fetch(`${strapiBaseUrl}/api/mubes-lpjs?${filterQuery}&populate=*`, {
        headers: { Authorization: `Bearer ${elevatedToken}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const payload = await res.json();
        lpjData = payload?.data?.[0] || null;
      }
    } catch (err) {
      console.error('[MUBES Detail Page] Error fetching LPJ data:', err);
    }
  }

  return (
    <main className="min-h-screen bg-[#FBFCFD] dark:bg-slate-950 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-900">
      <Navbar />
      <MubesSessionBanner />
      <MubesProkerFigmaView
        proker={prokerData}
        lpj={lpjData}
        role={access.role}
        status={access.status}
      />
      <Footer />
    </main>
  );
}
