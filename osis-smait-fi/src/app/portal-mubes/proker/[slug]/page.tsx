import React from 'react';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MubesProkerPresentation from '@/components/mubes/MubesProkerPresentation';
import { getMubesAccess } from '@/lib/mubes-access';
import { fetchMubesProkerData, MubesProgramKerja } from '@/lib/mubes-proker';

export const dynamic = 'force-dynamic';

function findProkerBySlug(
  groups: Awaited<ReturnType<typeof fetchMubesProkerData>>,
  slug: string
): MubesProgramKerja | null {
  const needle = slug.trim().toLowerCase();
  for (const g of groups) {
    const hit = g.prokerList.find((p) => p.slug?.toLowerCase() === needle);
    if (hit) return hit;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Presentasi Sidang — ${slug} | Portal MUBES`,
    robots: { index: false, follow: false },
  };
}

export default async function PortalMubesProkerFullPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const access = await getMubesAccess();
  const { slug } = await params;

  if (!access.userId) {
    redirect('/portal-mubes');
  }

  const groups = await fetchMubesProkerData({ includeLpj: access.allowed });
  const proker = findProkerBySlug(groups, slug);

  if (!proker) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col selection:bg-amber-500/45 selection:text-slate-900 dark:selection:bg-amber-400/50 dark:selection:text-amber-50">
      <Navbar />

      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-8 py-4 sm:py-6 flex flex-col gap-4">
        <Link
          href="/portal-mubes"
          className="inline-flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 hover:underline font-medium self-start"
        >
          ← Portal MUBES
        </Link>

        <MubesProkerPresentation proker={proker} variant="full" role={access.role} />
      </div>

      <Footer />
    </main>
  );
}
